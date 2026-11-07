#!/usr/bin/env node
/**
 * HT Lab static-site verification harness (dependency-free, Node >= 20).
 * ============================================================================
 * Boots the site with Node's http server, drives Microsoft Edge / Chromium
 * headless over the DevTools Protocol, walks a deterministic interaction
 * matrix, snapshots behaviour (text, DOM skeleton, layout boxes, computed
 * styles, counts) plus a screenshot per state, and writes report.json +
 * report.md. In compare mode it diffs a run against a previous label.
 *
 * It needs NO npm packages: global fetch + WebSocket from Node 20+ and a
 * locally installed Edge/Chrome. Screenshots are for human review only and
 * are NEVER pixel-diffed (the particle canvas / FPS counter are animated).
 *
 * Usage:
 *   node tools/verify-site.mjs --root <siteDir> --label <name> [--port 8123] [--out .verify]
 *   node tools/verify-site.mjs --root <siteDir> --label after --compare baseline [--out .verify]
 *
 * Options:
 *   --root <dir>       Site root to serve (required), e.g. . or ..\htlab-site
 *   --label <name>     Report/screenshot folder name under --out (default: run)
 *   --port <n>         First port to try for the local server (default: 8123)
 *   --out <dir>        Output root for reports (default: .verify)
 *   --compare <label>  Diff this run against <out>/<label>/report.json
 *   --browser <path>   Browser executable override (else BROWSER_PATH / EDGE_PATH / auto)
 *   --timeout <ms>     Global watchdog (default: 170000)
 *   --verbose          Print progress lines while running
 *   --help             Show this help
 *
 * Exit codes: 0 clean/pass, 1 verification failures/differences, 2 harness error.
 * ============================================================================
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const SCHEMA = 'htlab-verify/v1';
const HARNESS_VERSION = '1.0.0';
const DEFAULT_PORT = 8123;
const DEFAULT_OUT = '.verify';
const DEFAULT_LABEL = 'run';
const DEFAULT_TIMEOUT_MS = 170000;
const MAX_REPORT_TEXT = 40000;

const TAB = String.fromCharCode(9);
const NL = String.fromCharCode(10);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nowIso = () => new Date().toISOString();
const truncate = (s, n) => {
  const t = s == null ? '' : String(s);
  return t.length > n ? t.slice(0, n) + '...[' + (t.length - n) + ' chars]' : t;
};
const bytesKb = (b) => Math.round((b / 1024) * 10) / 10;

function printHelp() {
  const lines = [
    'HT Lab static-site verification harness',
    '',
    'Usage:',
    '  node tools/verify-site.mjs --root <siteDir> --label <name> [--port 8123] [--out .verify]',
    '  node tools/verify-site.mjs --root <siteDir> --label after --compare baseline [--out .verify]',
    '',
    'Options:',
    '  --root <dir>       Site root to serve (required)',
    '  --label <name>     Report + screenshot folder under --out (default: run)',
    '  --port <n>         First local server port to try (default: 8123)',
    '  --out <dir>        Output root for reports (default: .verify)',
    '  --compare <label>  Diff this run against <out>/<label>/report.json',
    '  --browser <path>   Edge/Chrome executable override',
    '  --timeout <ms>     Global watchdog (default: 170000)',
    '  --verbose          Print progress lines',
    '  --help             Show this help',
    ''
  ];
  process.stdout.write(lines.join(NL) + NL);
}

function parseArgs(argv) {
  const args = { port: DEFAULT_PORT, out: DEFAULT_OUT, label: DEFAULT_LABEL, timeout: DEFAULT_TIMEOUT_MS };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const take = () => {
      if (i + 1 >= argv.length) throw new Error('missing value for ' + key);
      return argv[++i];
    };
    if (key === '--root') args.root = take();
    else if (key === '--label') args.label = take();
    else if (key === '--port') args.port = Number(take());
    else if (key === '--out') args.out = take();
    else if (key === '--compare') args.compare = take();
    else if (key === '--browser') args.browser = take();
    else if (key === '--timeout') args.timeout = Number(take());
    else if (key === '--verbose' || key === '-v') args.verbose = true;
    else if (key === '--help' || key === '-h') args.help = true;
    else throw new Error('unknown argument: ' + key);
  }
  if (!Number.isFinite(args.port) || args.port <= 0) throw new Error('invalid --port');
  if (!Number.isFinite(args.timeout) || args.timeout < 10000) throw new Error('invalid --timeout');
  return args;
}

// ---------------------------------------------------------------------------
// Static file server
// ---------------------------------------------------------------------------
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function createStaticServer(rootDir) {
  const root = path.resolve(rootDir);
  return http.createServer((req, res) => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' });
        res.end('Method Not Allowed');
        return;
      }
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(requestUrl.pathname);
      const requestedPath = pathname;
      if (pathname.endsWith('/')) pathname += 'index.html';
      const filePath = path.join(root, pathname);
      const rel = path.relative(root, filePath);
      if (rel.startsWith('..') || path.isAbsolute(rel)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }
      let data;
      try {
        data = fs.readFileSync(filePath);
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end('Not found: ' + requestedPath);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': 'no-store'
      });
      if (req.method === 'HEAD') res.end();
      else res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal server error');
    }
  });
}

function listenServer(server, firstPort) {
  return new Promise((resolve, reject) => {
    let attempt = 0;
    const tryPort = (port) => {
      const onError = (err) => {
        server.removeListener('listening', onListening);
        if (err && err.code === 'EADDRINUSE' && attempt < 20) {
          attempt += 1;
          tryPort(port + 1);
          return;
        }
        reject(err);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        resolve(server.address().port);
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port, '127.0.0.1');
    };
    tryPort(firstPort);
  });
}

// ---------------------------------------------------------------------------
// Browser discovery / launch / cleanup
// ---------------------------------------------------------------------------
function whichSync(name) {
  const dirs = String(process.env.PATH || '').split(path.delimiter).filter(Boolean);
  const exts = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];
  for (const dir of dirs) {
    for (const ext of exts) {
      const candidate = path.join(dir, name + ext);
      try {
        if (fs.statSync(candidate).isFile()) return candidate;
      } catch (err) {}
    }
  }
  return null;
}

function findBrowser() {
  const candidates = [];
  for (const envName of ['BROWSER_PATH', 'EDGE_PATH', 'CHROME_PATH', 'CHROMIUM_PATH']) {
    if (process.env[envName]) candidates.push(process.env[envName]);
  }
  const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const localAppData = process.env['LOCALAPPDATA'] || '';
  candidates.push(
    path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(programFilesX86, 'Microsoft', 'Edge Beta', 'Application', 'msedge.exe'),
    path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/microsoft-edge',
    '/usr/bin/microsoft-edge-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  );
  if (localAppData) {
    candidates.push(
      path.join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe')
    );
  }
  for (const candidate of candidates) {
    try {
      if (candidate && fs.statSync(candidate).isFile()) return candidate;
    } catch (err) {}
  }
  for (const name of ['msedge', 'microsoft-edge', 'google-chrome', 'chromium', 'chrome']) {
    const found = whichSync(name);
    if (found) return found;
  }
  return null;
}

async function launchBrowser(browserPath) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'htlab-verify-profile-'));
  const args = [
    '--headless=new',
    '--remote-debugging-port=0',
    '--user-data-dir=' + profileDir,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-sync',
    '--mute-audio',
    '--window-size=1440,900',
    '--force-device-scale-factor=1',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    'about:blank'
  ];
  const child = spawn(browserPath, args, { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  let stderrTail = '';
  if (child.stderr) {
    child.stderr.on('data', (chunk) => {
      stderrTail = (stderrTail + String(chunk)).slice(-8000);
    });
  }
  let exited = false;
  let exitInfo = null;
  child.once('exit', (code, signal) => {
    exited = true;
    exitInfo = { code, signal };
  });
  const devToolsFile = path.join(profileDir, 'DevToolsActivePort');
  const deadline = Date.now() + 25000;
  let port = 0;
  while (Date.now() < deadline) {
    if (exited) break;
    try {
      const raw = fs.readFileSync(devToolsFile, 'utf8').split(/\r?\n/);
      if (raw[0] && Number(raw[0]) > 0) {
        port = Number(raw[0]);
        break;
      }
    } catch (err) {}
    await sleep(100);
  }
  if (!port) {
    killProcessTree(child);
    removeDirQuiet(profileDir);
    throw new Error('browser did not expose DevTools port' + (stderrTail ? ': ' + truncate(stderrTail, 600) : '') + (exitInfo ? ' (exited ' + exitInfo.code + ')' : ''));
  }
  let wsUrl = null;
  try {
    const version = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json();
    wsUrl = version.webSocketDebuggerUrl;
    return { child, profileDir, port, wsUrl, browser: version.Browser || '', userAgent: version['User-Agent'] || '', stderrTail };
  } catch (err) {
    killProcessTree(child);
    removeDirQuiet(profileDir);
    throw new Error('cannot query browser DevTools endpoint: ' + err.message);
  }
}

function killProcessTree(child) {
  if (!child || child.exitCode !== null) return;
  try {
    if (process.platform === 'win32') {
      execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true, timeout: 10000 });
    } else {
      child.kill('SIGKILL');
    }
  } catch (err) {
    try {
      child.kill('SIGKILL');
    } catch (err2) {}
  }
}

function removeDirQuiet(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 6, retryDelay: 150 });
  } catch (err) {}
}

// ---------------------------------------------------------------------------
// Minimal CDP client (browser websocket + flattened sessions)
// ---------------------------------------------------------------------------
class CdpConnection {
  constructor(ws) {
    this.ws = ws;
    this.seq = 0;
    this.pending = new Map();
    this.listeners = new Set();
    this.closed = false;
    ws.addEventListener('message', (event) => this.onMessage(event.data));
    ws.addEventListener('close', () => {
      this.closed = true;
      for (const pending of this.pending.values()) pending.reject(new Error('CDP connection closed'));
      this.pending.clear();
    });
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error('cannot connect to ' + url)), { once: true });
    });
    return new CdpConnection(ws);
  }

  send(method, params, sessionId) {
    const id = ++this.seq;
    const message = { id, method, params: params || {} };
    if (sessionId) message.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try {
        this.ws.send(JSON.stringify(message));
      } catch (err) {
        this.pending.delete(id);
        reject(err);
      }
    });
  }

  onMessage(data) {
    let message;
    try {
      message = JSON.parse(typeof data === 'string' ? data : String(data));
    } catch (err) {
      return;
    }
    if (message.id && this.pending.has(message.id)) {
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.method + ' failed: ' + JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    if (message.method) {
      for (const listener of this.listeners) {
        try {
          listener(message);
        } catch (err) {}
      }
    }
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  close() {
    try {
      this.ws.close();
    } catch (err) {}
  }
}

// ---------------------------------------------------------------------------
// Page-side functions (stringified and evaluated in the browser)
// ---------------------------------------------------------------------------
// Returns true when the page finished booting: no splash overlay, UI chooser visible.
function readyInPage() {
  if (document.readyState !== 'complete') return false;
  const splash = document.getElementById('splash-screen');
  if (splash) return false;
  const chooser = document.getElementById('uiChooserModal');
  if (!chooser || chooser.classList.contains('is-hidden')) return false;
  return true;
}

// True when no finite CSS animation/transition important for layout is running.
function settleInPage() {
  const EXCLUDE = '#htFpsMonitor,#cosmos-stage,#cosmosHud,#uiChooserModal,.final-logo,.splash-screen';
  const animations = document.getAnimations();
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    if (animation.playState !== 'running') continue;
    const effect = animation.effect;
    if (effect && effect.pseudoElement) continue;
    const target = effect && effect.target;
    if (!target || !target.closest) continue;
    if (target.closest(EXCLUDE)) continue;
    if (target.classList && target.classList.contains('final-logo')) continue;
    return false;
  }
  return true;
}

// Locates an element, scrolls it into view and finds a visible click point.
function clickTargetInPage(selector) {
  const element = document.querySelector(selector);
  if (!element) return { found: false, clickable: false, reason: 'not-found' };
  try {
    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
  } catch (err) {
    element.scrollIntoView();
  }
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    const style = getComputedStyle(element);
    const chain = [];
    let node = element;
    while (node && node.nodeType === 1 && chain.length < 6) {
      chain.push(node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + '.' + String(node.className).split(/\s+/).slice(0, 3).join('.'));
      node = node.parentElement;
    }
    return {
      found: true,
      clickable: false,
      reason: 'zero-size',
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      debug: {
        html: element.outerHTML.slice(0, 200),
        display: style.display,
        visibility: style.visibility,
        chain: chain.join(' < '),
        scrollY: window.scrollY,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        uiMode: document.body.dataset.uiMode || '',
        matches: document.querySelectorAll(selector).length
      }
    };
  }
  const fractions = [
    [0.5, 0.5], [0.5, 0.35], [0.5, 0.65], [0.3, 0.5], [0.7, 0.5],
    [0.5, 0.2], [0.5, 0.8], [0.2, 0.3], [0.8, 0.7]
  ];
  for (const fraction of fractions) {
    const x = rect.left + rect.width * fraction[0];
    const y = rect.top + rect.height * fraction[1];
    if (x < 1 || y < 1 || x > window.innerWidth - 2 || y > window.innerHeight - 2) continue;
    const hit = document.elementFromPoint(x, y);
    if (hit && (hit === element || element.contains(hit) || hit.contains(element))) {
      return {
        found: true,
        clickable: true,
        reason: 'ok',
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        hit: hit.tagName.toLowerCase() + (hit.id ? '#' + hit.id : ''),
        rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
      };
    }
  }
  const center = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return {
    found: true,
    clickable: false,
    reason: 'obscured',
    hit: center ? center.tagName.toLowerCase() + (center.id ? '#' + center.id : '') : 'none',
    rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
  };
}

// Collects the deterministic behavioural snapshot. Helpers are self-contained.
function snapshotInPage(cfg) {
  const volatileClasses = {};
  (cfg.volatileClasses || []).forEach(function (name) { volatileClasses[name] = true; });
  const boxSkip = {};
  (cfg.boxSkip || []).forEach(function (name) { boxSkip[name] = true; });

  function round1(value) { return Math.round(value * 10) / 10; }

  function normText(value) {
    let text = value == null ? '' : String(value);
    text = text.replace(/\u00a0/g, ' ');
    text = text.replace(/剩余\s*\d+:\d+/g, '剩余 <timer>');
    text = text.replace(/时间到\s*\d+:\d+/g, '时间到 <timer>');
    text = text.replace(/\b\d+(?:\.\d+)?\s*FPS\b/g, '<fps>');
    text = text.replace(/\b\d+(?:\.\d+)?\s*ms\b/g, '<ms>');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  }

  function filteredClasses(element) {
    const kept = [];
    const list = element.classList;
    for (let i = 0; i < list.length; i++) {
      if (!volatileClasses[list[i]]) kept.push(list[i]);
    }
    kept.sort();
    return kept;
  }

  function skeleton(root, maxNodes) {
    const out = [];
    function walk(element, depth) {
      if (!element || element.nodeType !== 1) return;
      if (out.length >= maxNodes) {
        if (out[out.length - 1] !== '...') out.push('...');
        return;
      }
      const tag = element.tagName.toLowerCase();
      const id = element.id ? '#' + element.id : '';
      const classes = filteredClasses(element);
      const cls = classes.length ? '.' + classes.join('.') : '';
      out.push(depth + ':' + tag + id + cls);
      if (tag === 'svg' || tag === 'canvas' || tag === 'audio' || tag === 'video' || tag === 'input' || tag === 'textarea' || tag === 'pre' || tag === 'script' || tag === 'style' || tag === 'select' || tag === 'option') return;
      const children = element.children;
      for (let i = 0; i < children.length; i++) walk(children[i], depth + 1);
    }
    walk(root, 0);
    return out;
  }

  function copyDataset(dataset) {
    const out = {};
    if (!dataset) return out;
    Object.keys(dataset).forEach(function (key) {
      if (typeof dataset[key] === 'string') out[key] = dataset[key];
    });
    return out;
  }

  function boxOf(element) {
    const rect = element.getBoundingClientRect();
    const cs = getComputedStyle(element);
    const visible = cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.01 && rect.width > 0 && rect.height > 0;
    return { x: round1(rect.x), y: round1(rect.y), w: round1(rect.width), h: round1(rect.height), visible: visible };
  }

  function kebabCase(prop) {
    return prop.replace(/[A-Z]/g, function (letter) { return '-' + letter.toLowerCase(); });
  }

  function styleOf(element) {
    const cs = getComputedStyle(element);
    const out = {};
    (cfg.styleProps || []).forEach(function (prop) {
      out[prop] = normText(cs.getPropertyValue(kebabCase(prop)));
    });
    return out;
  }

  function elementAt(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return null;
    const classes = filteredClasses(hit);
    return hit.tagName.toLowerCase() + (hit.id ? '#' + hit.id : '') + (classes.length ? '.' + classes.join('.') : '');
  }

  // Normalise scrolling so layout boxes are captured from the top of the page.
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch (err) {
    window.scrollTo(0, 0);
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  void document.documentElement.offsetHeight;

  const out = {};
  out.url = location.href;
  out.title = document.title;
  out.readyState = document.readyState;
  out.viewport = {
    w: window.innerWidth,
    h: window.innerHeight,
    dpr: window.devicePixelRatio,
    scrollW: document.documentElement.scrollWidth,
    scrollH: document.documentElement.scrollHeight
  };
  out.scroll = { x: window.scrollX, y: window.scrollY };
  const bodyClasses = filteredClasses(document.body);
  out.bodyClass = bodyClasses.join(' ');
  out.dataset = { body: copyDataset(document.body.dataset), html: copyDataset(document.documentElement.dataset) };
  out.ui = {
    mode: document.body.dataset.uiMode || '',
    cosmosView: document.body.dataset.cosmosView || '',
    sky: document.documentElement.dataset.sky || '',
    theme: document.body.dataset.theme || ''
  };
  const topTitle = document.getElementById('topTitle');
  out.topTitle = topTitle ? normText(topTitle.textContent) : '';
  const activeNav = document.querySelector('.nav-btn.active');
  out.activeNav = activeNav ? normText(activeNav.textContent) : '';

  out.text = {};
  Object.keys(cfg.containers || {}).forEach(function (name) {
    const element = document.querySelector(cfg.containers[name]);
    out.text[name] = element ? normText(element.innerText) : null;
  });

  out.structure = {};
  (cfg.structureRoots || []).forEach(function (selector) {
    const element = document.querySelector(selector);
    out.structure[selector] = element ? skeleton(element, cfg.maxStructureNodes || 700) : null;
  });

  out.layout = {};
  (cfg.boxSelectors || []).forEach(function (selector) {
    if (boxSkip[selector]) { out.layout[selector] = { skipped: true }; return; }
    const elements = Array.from(document.querySelectorAll(selector));
    const items = [];
    for (let i = 0; i < elements.length && items.length < (cfg.boxLimit || 3); i++) items.push(boxOf(elements[i]));
    out.layout[selector] = { count: elements.length, items: items };
  });

  out.styles = {};
  (cfg.styleSelectors || []).forEach(function (selector) {
    const element = document.querySelector(selector);
    out.styles[selector] = element ? styleOf(element) : null;
  });

  out.counts = {};
  Object.keys(cfg.countSelectors || {}).forEach(function (name) {
    out.counts[name] = document.querySelectorAll(cfg.countSelectors[name]).length;
  });

  out.flags = {
    splash: !!document.getElementById('splash-screen'),
    chooserHidden: !!(document.getElementById('uiChooserModal') && document.getElementById('uiChooserModal').classList.contains('is-hidden')),
    resetHidden: document.getElementById('resetModal') ? document.getElementById('resetModal').hidden : null,
    apOpen: !!(document.getElementById('apSheet') && document.getElementById('apSheet').classList.contains('open')),
    apFab: !!document.getElementById('apFab'),
    cosmosInspect: !!(document.getElementById('cosmosInspectModal') && Number(getComputedStyle(document.getElementById('cosmosInspectModal')).opacity) > 0.01)
  };

  out.elementAtCenter = elementAt(window.innerWidth / 2, window.innerHeight / 2);

  out.info = {
    styleSheets: document.styleSheets.length,
    stylesheetLinks: document.querySelectorAll('link[rel="stylesheet"]').length,
    inlineStyles: document.querySelectorAll('style').length,
    externalScripts: document.querySelectorAll('script[src]').length,
    inlineScripts: document.querySelectorAll('script:not([src])').length
  };
  return out;
}

// ---------------------------------------------------------------------------
// Page session wrapper
// ---------------------------------------------------------------------------
class PageSession {
  constructor(cdp, sessionId, state) {
    this.cdp = cdp;
    this.sessionId = sessionId;
    this.state = state;
    this.verbose = state.verbose;
  }

  send(method, params) {
    return this.cdp.send(method, params, this.sessionId);
  }

  async enableDomains() {
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Network.enable');
    await this.send('Log.enable');
  }

  async eval(expression, options) {
    const opts = options || {};
    const result = await this.send('Runtime.evaluate', {
      expression: String(expression),
      returnByValue: true,
      awaitPromise: true,
      userGesture: !!opts.userGesture,
      includeCommandLineAPI: false
    });
    if (result && result.exceptionDetails) {
      const details = result.exceptionDetails;
      const description = (details.exception && details.exception.description) || details.text || 'unknown error';
      throw new Error('page evaluation failed: ' + truncate(description, 500));
    }
    return result && result.result ? result.result.value : undefined;
  }

  async safeEval(expression, fallback) {
    try {
      return await this.eval(expression);
    } catch (err) {
      return fallback;
    }
  }

  async waitFor(expression, label, timeoutMs) {
    const timeout = timeoutMs || 15000;
    const started = Date.now();
    for (;;) {
      let value = false;
      try {
        value = await this.eval(expression);
      } catch (err) {
        value = false;
      }
      if (value) return Date.now() - started;
      if (Date.now() - started > timeout) throw new Error('timeout after ' + timeout + 'ms waiting for ' + (label || truncate(expression, 100)));
      await sleep(100);
    }
  }

  async waitReady(timeoutMs) {
    await this.waitFor('(' + readyInPage.toString() + ')()', 'app ready (splash gone, UI chooser visible)', timeoutMs || 30000);
    await this.waitFor('(' + settleInPage.toString() + ')()', 'CSS animations settled', 12000);
  }

  async settle(timeoutMs) {
    try {
      await this.waitFor('(' + settleInPage.toString() + ')()', 'CSS animations settled', timeoutMs || 6000);
    } catch (err) {
      this.state.warnings.push({ phase: this.state.phase, text: 'animations did not settle: ' + err.message });
    }
    await sleep(120);
  }

  async navigate(url) {
    const result = await this.send('Page.navigate', { url });
    if (result && result.errorText) throw new Error('navigation failed for ' + url + ': ' + result.errorText);
  }

  async reload() {
    const result = await this.send('Page.reload', { ignoreCache: false });
    if (result && result.errorText) throw new Error('reload failed: ' + result.errorText);
  }

  async click(selector, options) {
    const opts = options || {};
    const target = await this.eval('(' + clickTargetInPage.toString() + ')(' + JSON.stringify(selector) + ')');
    if (!target || !target.found) throw new Error('element not found: ' + selector);
    if (!target.clickable) {
      if (opts.allowJsFallback) {
        const clicked = await this.eval('(function(){var el=document.querySelector(' + JSON.stringify(selector) + ');if(!el)return false;el.click();return true;})()');
        if (!clicked) throw new Error('element not found: ' + selector);
        this.state.warnings.push({ phase: this.state.phase, text: 'used JS fallback click for ' + selector + ' reason=' + target.reason + ' hit=' + (target.hit || '?') });
        await sleep(opts.settleMs || 300);
        return 'js-fallback';
      }
      throw new Error('element not clickable: ' + selector + ' (reason=' + target.reason + ', hit=' + (target.hit || '?') + ', debug=' + JSON.stringify(target.debug || null) + ')');
    }

    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: target.x, y: target.y, button: 'left', clickCount: 1 });
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: target.x, y: target.y, button: 'left', clickCount: 1 });
    await sleep(opts.settleMs || 300);
    return 'mouse';
  }

  async snapshot(options) {
    if (this.verbose) process.stdout.write('  snapshot...' + NL);
    const cfg = this.state.snapshotConfig;
    const raw = await this.eval('(' + snapshotInPage.toString() + ')(' + JSON.stringify(cfg) + ')');
    raw.url = normalizeUrl(this.state, raw.url);
    if (raw.viewport) raw.viewport.scrollW = raw.viewport.scrollW;
    return raw;
  }

  async screenshot(filePath) {
    const result = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    if (!result || !result.data) throw new Error('screenshot failed');
    const buffer = Buffer.from(result.data, 'base64');
    fs.writeFileSync(filePath, buffer);
    const stat = fs.statSync(filePath);
    if (stat.size < 500) throw new Error('screenshot suspiciously small: ' + stat.size + ' bytes');
    return stat.size;
  }

  async setViewport(width, height, mobile) {
    await this.send('Emulation.setDeviceMetricsOverride', { width: width, height: height, deviceScaleFactor: 1, mobile: !!mobile });
  }

  async clearViewport() {
    await this.send('Emulation.clearDeviceMetricsOverride');
  }
}

// ---------------------------------------------------------------------------
// URL / issue normalisation helpers
// ---------------------------------------------------------------------------
function normalizeUrl(state, url) {
  if (!url) return '';
  let value = String(url);
  if (state.origin) value = value.split(state.origin).join('<ORIGIN>');
  if (state.rootFileUrl) value = value.split(state.rootFileUrl).join('<ROOT>');
  return value;
}

function basenameOf(url) {
  const clean = String(url || '').split('?')[0].split('#')[0];
  const parts = clean.split('/');
  return parts[parts.length - 1] || clean;
}

function describeRemoteObject(argument) {
  if (!argument || typeof argument !== 'object') return String(argument);
  if (Object.prototype.hasOwnProperty.call(argument, 'value')) {
    const value = argument.value;
    if (typeof value === 'string') return value;
    if (value === null || typeof value === 'number' || typeof value === 'boolean' || value === undefined) return String(value);
    try {
      const json = JSON.stringify(value);
      return json === undefined ? String(value) : json;
    } catch (err) {
      return String(value);
    }
  }
  if (argument.unserializableValue !== undefined) return String(argument.unserializableValue);
  if (argument.description !== undefined) return String(argument.description);
  return argument.type || '?';
}

function stackSummary(stackTrace) {
  if (!stackTrace || !stackTrace.callFrames || !stackTrace.callFrames.length) return '';
  const frame = stackTrace.callFrames[0];
  return (frame.functionName || '<anonymous>') + ' @ ' + basenameOf(frame.url) + ':' + (frame.lineNumber + 1) + ':' + (frame.columnNumber + 1);
}

// Issues that are known to exist in the pristine baseline. Keep this empty
// unless a genuine pre-existing problem is proven; entries here are reported
// but do not fail the run. Each entry: { match: <substring of issue key>, reason: '...' }
const KNOWN_ISSUES = [];

function knownIssueFor(key) {
  for (const entry of KNOWN_ISSUES) {
    if (String(key).indexOf(entry.match) >= 0) return entry;
  }
  return null;
}

function issueKey(kind, details) {
  if (kind === 'console') return 'console:' + (details.level || 'log') + ':' + truncate(normalizeIssueText(details.text), 300);
  if (kind === 'exception') return 'exception:' + truncate(normalizeIssueText(details.text), 300);
  if (kind === 'request') return 'request:' + basenameOf(details.url) + ':' + (details.errorText || '');
  if (kind === 'http') return 'http:' + basenameOf(details.url) + ':' + details.status;
  if (kind === 'log') return 'log:' + (details.level || '') + ':' + truncate(normalizeIssueText(details.text), 300);
  return kind + ':' + JSON.stringify(details).slice(0, 200);
}

function normalizeIssueText(text) {
  return String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Matrix helpers
// ---------------------------------------------------------------------------
function makeChecks() {
  const obj = {};
  const add = (name, ok, detail, critical) => {
    obj[name] = {
      ok: !!ok,
      detail: detail === undefined || detail === null ? '' : truncate(String(detail), 400),
      critical: critical !== false
    };
    return !!ok;
  };
  return { add, obj };
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
}

// ---------------------------------------------------------------------------
// The deterministic interaction matrix
// ---------------------------------------------------------------------------
async function runMatrix(page, state) {
  const origin = state.origin;
  const log = (line) => {
    if (state.verbose) process.stdout.write(line + NL);
  };
  const states = state.states;
  const interactions = state.interactions;
  const hardFailures = state.hardFailures;

  const setPhase = (phase) => {
    state.phase = phase;
  };

  const act = async (name, fn) => {
    setPhase(name);
    log('[act] ' + name);
    const started = Date.now();
    try {
      const detail = await fn();
      interactions.push({ name, ok: true, detail: detail === undefined || detail === null ? '' : truncate(String(detail), 500), ms: Date.now() - started });
      return true;
    } catch (err) {
      const message = (err && err.message) || String(err);
      interactions.push({ name, ok: false, error: truncate(message, 800), ms: Date.now() - started });
      hardFailures.push('interaction failed: ' + name + ' -> ' + truncate(message, 400));
      return false;
    }
  };

  const capture = async (name, checks) => {
    setPhase(name);
    log('[state] ' + name);
    const started = Date.now();
    await page.settle();
    const snapshot = await page.snapshot();
    snapshot.phase = name;
    snapshot.checks = checks || {};
    for (const checkName of Object.keys(snapshot.checks)) {
      const check = snapshot.checks[checkName];
      if (!check.ok) {
        if (check.critical) hardFailures.push('check failed @ ' + name + ': ' + checkName + (check.detail ? ' (' + check.detail + ')' : ''));
        else state.warnings.push({ phase: name, text: 'advisory check failed: ' + checkName + (check.detail ? ' (' + check.detail + ')' : '') });
      }
    }
    const shotName = name + '.png';
    const shotPath = path.join(state.shotsDir, shotName);
    const bytes = await page.screenshot(shotPath);
    snapshot.screenshot = path.join(state.label, 'screenshots', shotName).split(path.sep).join('/');
    snapshot.screenshotBytes = bytes;
    snapshot.captureMs = Date.now() - started;
    states[name] = snapshot;
    return snapshot;
  };

  const q = (selector) => 'document.querySelector(' + JSON.stringify(selector) + ')';
  const countOf = (selector) => page.safeEval('document.querySelectorAll(' + JSON.stringify(selector) + ').length', -1);
  const textOf = (selector) => page.safeEval('(function(){var el=' + q(selector) + ';return el?el.textContent:null;})()', null);
  const uiMode = () => page.safeEval('document.body.dataset.uiMode || ""', '');
  const storedCourse = () => page.safeEval('(function(){try{return localStorage.getItem("cquest.course.v1") || "";}catch(e){return "ERR";}})()', 'ERR');
  const viewText = () => page.safeEval('(function(){var el=document.getElementById("view");return el?el.innerText:"";})()', '');
  const activePageName = () => page.safeEval('(function(){var el=document.querySelector(".nav-btn.active");return el?el.dataset.page:"";})()', '');

  // -----------------------------------------------------------------------
  // Desktop load, splash + UI chooser portal, choose glass UI
  // -----------------------------------------------------------------------
  await act('load-desktop-http', async () => {
    await page.navigate(origin + '/index.html');
    await page.waitReady(30000);
    return 'loaded ' + origin + '/index.html';
  });
  let checks = makeChecks();
  checks.add('splashRemoved', (await page.safeEval('!document.getElementById("splash-screen")', false)) === true);
  checks.add('chooserVisible', (await page.safeEval('(function(){var m=document.getElementById("uiChooserModal");if(!m)return false;var cs=getComputedStyle(m);return !m.classList.contains("is-hidden") && cs.visibility !== "hidden" && Number(cs.opacity) > 0.5;})()', false)) === true);
  checks.add('defaultUiModeCosmos', (await uiMode()) === 'cosmos', 'uiMode=' + (await uiMode()));
  checks.add('chooserCards', (await countOf('#uiChooserModal .ui-mode-card')) === 2, 'count=' + (await countOf('#uiChooserModal .ui-mode-card')));
  checks.add('cosmosCanvasPresent', (await page.safeEval('!!document.getElementById("stardust-canvas") && !!document.getElementById("stardust-fg-canvas")', false)) === true);
  await capture('01-portal-chooser', checks.obj);

  await act('choose-glass-ui', async () => {
    await page.click('[data-choose-ui="glass"]');
    await page.waitFor('document.getElementById("uiChooserModal").classList.contains("is-hidden")', 'chooser modal closed', 8000);
    await page.waitFor('document.body.dataset.uiMode === "glass"', 'glass ui mode', 8000);
    return 'uiMode=glass';
  });
  checks = makeChecks();
  checks.add('uiModeGlass', (await uiMode()) === 'glass', 'uiMode=' + (await uiMode()));
  checks.add('sidebarVisible', (await page.safeEval('(function(){var el=document.querySelector(".sidebar");if(!el)return false;var r=el.getBoundingClientRect();return r.width > 100 && r.height > 100;})()', false)) === true);
  checks.add('courseCards', (await countOf('.course-card')) === 2, 'count=' + (await countOf('.course-card')));
  checks.add('activeNavCourses', (await activePageName()) === 'courses', 'active=' + (await activePageName()));
  checks.add('viewHasText', (await viewText()).length > 50, 'chars=' + (await viewText()).length);
  await capture('02-glass-courses', checks.obj);

  // -----------------------------------------------------------------------
  // Sidebar pages
  // -----------------------------------------------------------------------
  const sidebarPages = [
    ['practice', '03-page-practice', '.lesson-title-row', 1],
    ['summary', '04-page-summary', '.summary-hero', 1],
    ['project', '05-page-project', '.proj-card', 7],
    ['about', '06-page-about', '.panel', 10]
  ];
  for (const entry of sidebarPages) {
    const pageName = entry[0];
    const stateName = entry[1];
    const marker = entry[2];
    const minMarker = entry[3];
    await act('sidebar-' + pageName, async () => {
      await page.click('[data-page="' + pageName + '"]');
      await page.waitFor('(function(){var el=document.querySelector(".nav-btn.active");return !!el && el.dataset.page === ' + JSON.stringify(pageName) + ';})()', 'active nav ' + pageName, 8000);
      return 'page=' + pageName;
    });
    checks = makeChecks();
    checks.add('activeNav', (await activePageName()) === pageName, 'active=' + (await activePageName()));
    checks.add('viewHasText', (await viewText()).length > 40, 'chars=' + (await viewText()).length);
    checks.add('markerPresent', (await countOf(marker)) >= minMarker, marker + ' count=' + (await countOf(marker)));
    await capture(stateName, checks.obj);
  }

  await act('sidebar-courses-return', async () => {
    await page.click('[data-page="courses"]');
    await page.waitFor('(function(){var el=document.querySelector(".nav-btn.active");return !!el && el.dataset.page === "courses";})()', 'active nav courses', 8000);
    return 'page=courses';
  });
  checks = makeChecks();
  checks.add('courseCards', (await countOf('.course-card')) === 2, 'count=' + (await countOf('.course-card')));
  checks.add('activeNav', (await activePageName()) === 'courses', 'active=' + (await activePageName()));
  await capture('07-courses-after-nav', checks.obj);

  // -----------------------------------------------------------------------
  // Course switching: C -> CET4 -> C
  // -----------------------------------------------------------------------
  await act('switch-course-cet4', async () => {
    await page.click('[data-action="switch-course"][data-course="cet4"]');
    await page.waitFor('!!document.querySelector(".course-route") && document.querySelectorAll(".level-card[data-level]").length > 0', 'CET4 course map', 10000);
    return 'course=cet4';
  });
  checks = makeChecks();
  checks.add('storedCourseCet4', (await storedCourse()) === 'cet4', 'stored=' + (await storedCourse()));
  checks.add('courseRoutePresent', (await countOf('.course-route')) === 1, 'count=' + (await countOf('.course-route')));
  checks.add('tracksPresent', (await countOf('.track')) > 0, 'tracks=' + (await countOf('.track')));
  checks.add('levelsPresent', (await countOf('.level-card[data-level]')) > 0, 'levels=' + (await countOf('.level-card[data-level]')));
  checks.add('mapTitleIsCet4', String(await textOf('.page-header h1')).indexOf('英语') >= 0, 'h1=' + (await textOf('.page-header h1')));
  await capture('08-cet4-map', checks.obj);

  await act('switch-course-back-to-c', async () => {
    await page.click('[data-page="courses"]');
    await page.waitFor('(function(){var el=document.querySelector(".nav-btn.active");return !!el && el.dataset.page === "courses";})()', 'courses page', 8000);
    await page.click('[data-action="switch-course"][data-course="c"]');
    await page.waitFor('!!document.querySelector(".course-route") && document.querySelectorAll(".level-card[data-level]").length > 0', 'C course map', 10000);
    return 'course=c';
  });
  checks = makeChecks();
  checks.add('storedCourseC', (await storedCourse()) === 'c', 'stored=' + (await storedCourse()));
  checks.add('mapTitleIsC', String(await textOf('.page-header h1')).indexOf('C 语言') >= 0, 'h1=' + (await textOf('.page-header h1')));
  checks.add('levelsPresent', (await countOf('.level-card[data-level]')) > 0, 'levels=' + (await countOf('.level-card[data-level]')));
  await capture('09-c-map-back', checks.obj);

  // -----------------------------------------------------------------------
  // Open the first C level from the map
  // -----------------------------------------------------------------------
  const firstCLevelTitle = String(await textOf('.course-route .track .level-card h3')).replace(/\s+/g, ' ').trim();
  await act('open-first-c-level', async () => {
    await page.click('.level-card[data-level]');
    await page.waitFor('!!document.getElementById("codeAnswer") && !!document.querySelector(".lesson-layout")', 'C lesson rendered', 10000);
    return 'opened level 1';
  });
  checks = makeChecks();
  const cLessonH1 = String(await textOf('.page-header h1')).replace(/\s+/g, ' ').trim();
  checks.add('titleMatchesCard', cLessonH1 === firstCLevelTitle, 'card=' + firstCLevelTitle + ' h1=' + cLessonH1);
  checks.add('codeEditorPresent', (await countOf('#codeAnswer')) === 1);
  checks.add('ideFramePresent', (await countOf('.ide-frame')) >= 1, 'count=' + (await countOf('.ide-frame')));
  checks.add('quizPresent', (await countOf('.quiz-item')) > 0, 'quizItems=' + (await countOf('.quiz-item')));
  checks.add('lessonLayoutPresent', (await countOf('.lesson-layout')) === 1, 'count=' + (await countOf('.lesson-layout')));
  checks.add('noAudioRows', (await countOf('.audio-row')) === 0, 'audioRows=' + (await countOf('.audio-row')));
  checks.add('expectedOutputPresent', (await countOf('.codebox')) >= 1, 'codeboxes=' + (await countOf('.codebox')));
  await capture('10-c-lesson-first', checks.obj);

  await act('back-to-c-map', async () => {
    await page.click('[data-action="back"]');
    await page.waitFor('!!document.querySelector(".course-route")', 'C map after back', 8000);
    return 'page=map';
  });

  // -----------------------------------------------------------------------
  // Open the first CET4 level (quiz-type level, no audio rows expected)
  // -----------------------------------------------------------------------
  const firstCet4LevelTitle = await (async () => {
    await page.click('[data-page="courses"]');
    await page.waitFor('(function(){var el=document.querySelector(".nav-btn.active");return !!el && el.dataset.page === "courses";})()', 'courses page', 8000);
    await page.click('[data-action="switch-course"][data-course="cet4"]');
    await page.waitFor('!!document.querySelector(".course-route") && document.querySelectorAll(".level-card[data-level]").length > 0', 'CET4 map', 10000);
    return String(await textOf('.course-route .track .level-card h3')).replace(/\s+/g, ' ').trim();
  })();
  await act('open-first-cet4-level', async () => {
    await page.click('.level-card[data-level]');
    await page.waitFor('!!document.querySelector(".lesson-layout") && !!document.querySelector(".quiz-item")', 'CET4 lesson rendered', 10000);
    return 'opened first CET4 level';
  });
  checks = makeChecks();
  const cet4H1 = String(await textOf('.page-header h1')).replace(/\s+/g, ' ').trim();
  checks.add('titleMatchesCard', cet4H1 === firstCet4LevelTitle, 'card=' + firstCet4LevelTitle + ' h1=' + cet4H1);
  checks.add('lessonLayoutPresent', (await countOf('.lesson-layout')) === 1, 'count=' + (await countOf('.lesson-layout')));
  checks.add('quizPresent', (await countOf('.quiz-item')) > 0, 'quizItems=' + (await countOf('.quiz-item')));
  checks.add('audioRowCount', (await countOf('.audio-row')) >= 0, 'audioRows=' + (await countOf('.audio-row')), false);
  checks.add('noCodeEditorOnQuizLevel', (await countOf('#codeAnswer')) === 0, 'editor=' + (await countOf('#codeAnswer')));
  await capture('11-cet4-first-lesson', checks.obj);

  // -----------------------------------------------------------------------
  // Unlock and open the first CET4 listening level to exercise audio rows
  // -----------------------------------------------------------------------
  let audioLessonReady = false;
  let audioTargetId = '';
  await act('back-to-cet4-map', async () => {
    await page.click('[data-action="back"]');
    await page.waitFor('!!document.querySelector(".course-route")', 'CET4 map after back', 8000);
    return 'page=map';
  });
  await act('seed-audio-lesson-progress', async () => {
    const tracks = await page.eval('(function(){var tracks=Array.from(document.querySelectorAll("#course-route .track"));return tracks.map(function(track){var levels=Array.from(track.querySelectorAll(".level-card[data-level]"));return {title:(track.querySelector(".track-title")||{}).textContent||"",ids:levels.map(function(card){return Number(card.dataset.level);})};});})()');
    if (!tracks || tracks.length < 2 || !tracks[1].ids.length) throw new Error('cannot locate second CET4 module');
    const previousIds = tracks[0].ids.slice();
    audioTargetId = tracks[1].ids[0];
    if (!previousIds.length) throw new Error('first CET4 module has no levels to seed');
    const payload = { completed: {}, xp: 0, attempts: 0, correct: 0, started: 0, drafts: {}, quizRewards: {} };
    for (const id of previousIds) payload.completed[id] = { at: 0 };
    const seeded = await page.eval('(function(encoded){try{localStorage.setItem("cquest.cet4.v1", encoded);localStorage.setItem("cquest.course.v1", "cet4");localStorage.setItem("htlab.uimode.v1", "glass");return true;}catch(err){return false;}})(' + JSON.stringify(JSON.stringify(payload)) + ')');
    if (!seeded) throw new Error('could not seed localStorage progress');
    return 'target=' + audioTargetId + ' prev=' + previousIds.join(',');
  });

  await act('reload-with-seeded-progress', async () => {
    await page.send('Page.reload', { ignoreCache: false });
    await page.waitReady(30000);
    await page.click('[data-choose-ui="glass"]');
    await page.waitFor('document.getElementById("uiChooserModal").classList.contains("is-hidden")', 'chooser closed after reload', 8000);
    return 'reloaded';
  });
  await act('open-cet4-audio-lesson', async () => {
    await page.click('[data-action="switch-course"][data-course="cet4"]');
    await page.waitFor('!!document.querySelector(".course-route")', 'CET4 map after reload', 10000);
    await page.click('.level-card[data-level="' + audioTargetId + '"]');
    await page.waitFor('document.querySelectorAll(".audio-row").length > 0', 'audio rows rendered', 12000);
    audioLessonReady = true;
    return 'opened listening level ' + audioTargetId;
  });
  checks = makeChecks();
  checks.add('audioRowsPresent', (await countOf('.audio-row')) > 0, 'audioRows=' + (await countOf('.audio-row')));
  checks.add('audioElementsPresent', (await countOf('.audio-row audio')) === (await countOf('.audio-row')), 'audios=' + (await countOf('.audio-row audio')));
  checks.add('audioSourcesSet', (await page.safeEval('(function(){var list=Array.from(document.querySelectorAll(".audio-row audio"));return list.length>0 && list.every(function(a){return !!(a.getAttribute("src")||"").trim();});})()', false)) === true);
  checks.add('lessonLayoutPresent', (await countOf('.lesson-layout')) === 1, 'count=' + (await countOf('.lesson-layout')));
  checks.add('viewHasText', (await viewText()).length > 40, 'chars=' + (await viewText()).length);
  checks.add('audioLessonOpened', audioLessonReady);
  await capture('12-cet4-audio-lesson', checks.obj);

  // -----------------------------------------------------------------------
  // UI mode switch: glass -> cosmos -> glass
  // -----------------------------------------------------------------------
  await act('navigate-courses-for-cosmos', async () => {
    await page.click('[data-page="courses"]');
    await page.waitFor('(function(){var el=document.querySelector(".nav-btn.active");return !!el && el.dataset.page === "courses";})()', 'courses page', 8000);
    return 'page=courses';
  });
  await act('switch-to-cosmos', async () => {
    await page.waitFor('!!document.getElementById("topUiSwitchBtn")', 'topbar UI switch button', 8000);
    await page.click('#topUiSwitchBtn');
    await page.waitFor('document.body.dataset.uiMode === "cosmos"', 'cosmos mode', 8000);
    await page.waitFor('(function(){var c=document.querySelectorAll("#orbit-cards-layer .orbit-card");if(c.length < 2)return false;var canvas=document.getElementById("stardust-canvas");return !!canvas && canvas.width > 100 && canvas.height > 100;})()', 'cosmos canvas + orbit cards', 10000);
    return 'cosmos mode active';
  });
  checks = makeChecks();
  checks.add('uiModeCosmos', (await uiMode()) === 'cosmos', 'uiMode=' + (await uiMode()));
  checks.add('cosmosViewUniverse', (await page.safeEval('document.body.dataset.cosmosView || ""', '')) === 'universe', 'view=' + (await page.safeEval('document.body.dataset.cosmosView || ""', '')));
  checks.add('canvasSized', (await page.safeEval('(function(){var c=document.getElementById("stardust-canvas");if(!c)return false;var r=c.getBoundingClientRect();return c.width > 100 && c.height > 100 && r.width > 100 && r.height > 100;})()', false)) === true);
  checks.add('fgCanvasSized', (await page.safeEval('(function(){var c=document.getElementById("stardust-fg-canvas");if(!c)return false;var r=c.getBoundingClientRect();return c.width > 100 && r.width > 100;})()', false)) === true);
  checks.add('orbitCards', (await countOf('#orbit-cards-layer .orbit-card')) >= 2, 'count=' + (await countOf('#orbit-cards-layer .orbit-card')));
  checks.add('cosmosHudText', (await textOf('#cosmosHud .cosmos-title')).length > 0, 'title=' + (await textOf('#cosmosHud .cosmos-title')));
  checks.add('canvasOnTop', (await page.safeEval('(function(){var hit=document.elementFromPoint(innerWidth/2, innerHeight/2);return !!hit && hit.tagName === "CANVAS";})()', false)) === true);
  await capture('13-cosmos-mode', checks.obj, { boxSkip: ['.orbit-card'] });

  await act('switch-back-to-glass', async () => {
    await page.click('#cosmosToGlassBtn');
    await page.waitFor('document.body.dataset.uiMode === "glass"', 'glass mode', 8000);
    await page.waitFor('(function(){var el=document.getElementById("view");return !!el && el.innerText.length > 20;})()', 'glass view rendered', 8000);
    return 'glass mode restored';
  });
  checks = makeChecks();
  checks.add('uiModeGlass', (await uiMode()) === 'glass', 'uiMode=' + (await uiMode()));
  checks.add('sidebarVisible', (await page.safeEval('(function(){var el=document.querySelector(".sidebar");if(!el)return false;var r=el.getBoundingClientRect();return r.width > 100 && r.height > 100;})()', false)) === true);
  checks.add('viewHasText', (await viewText()).length > 40, 'chars=' + (await viewText()).length);
  await capture('14-glass-restored', checks.obj);

  // -----------------------------------------------------------------------
  // Appearance panel open / close
  // -----------------------------------------------------------------------
  await act('open-appearance-panel', async () => {
    await page.waitFor('!!document.getElementById("apFab")', 'appearance FAB', 8000);
    await page.click('#apFab');
    await page.waitFor('(function(){var el=document.getElementById("apSheet");return !!el && el.classList.contains("open");})()', 'appearance sheet open', 8000);
    return 'appearance open';
  });
  checks = makeChecks();
  checks.add('apSheetOpen', (await page.safeEval('(function(){var el=document.getElementById("apSheet");return !!el && el.classList.contains("open");})()', false)) === true);
  checks.add('apSkyChips', (await countOf('.ap-chip')) >= 4, 'chips=' + (await countOf('.ap-chip')));
  checks.add('apRanges', (await countOf('.ap-range')) >= 5, 'ranges=' + (await countOf('.ap-range')));
  checks.add('apFabVisible', (await page.safeEval('(function(){var el=document.getElementById("apFab");if(!el)return false;var r=el.getBoundingClientRect();return r.width > 10 && r.height > 10;})()', false)) === true);
  await capture('15-appearance-open', checks.obj);

  await act('close-appearance-panel', async () => {
    await page.click('#apClose');
    await page.waitFor('(function(){var el=document.getElementById("apSheet");return !!el && !el.classList.contains("open");})()', 'appearance sheet closed', 8000);
    return 'appearance closed';
  });
  checks = makeChecks();
  checks.add('apSheetClosed', (await page.safeEval('(function(){var el=document.getElementById("apSheet");return !!el && !el.classList.contains("open");})()', false)) === true);
  await capture('15b-appearance-closed', checks.obj);

  // -----------------------------------------------------------------------
  // Reset dialog open / cancel
  // -----------------------------------------------------------------------
  await act('open-reset-dialog', async () => {
    await page.click('[data-action="reset-progress"]');
    await page.waitFor('(function(){var el=document.getElementById("resetModal");return !!el && !el.hidden;})()', 'reset modal open', 8000);
    return 'reset modal open';
  });
  checks = makeChecks();
  checks.add('resetModalVisible', (await page.safeEval('(function(){var el=document.getElementById("resetModal");if(!el)return false;var r=el.getBoundingClientRect();return !el.hidden && r.width > 0 && r.height > 0;})()', false)) === true);
  checks.add('resetFormPresent', (await countOf('#resetModalContent .reset-form')) === 1, 'forms=' + (await countOf('#resetModalContent .reset-form')));
  checks.add('resetDialogText', (await textOf('#resetModalContent')).length > 20, 'chars=' + (await textOf('#resetModalContent')).length);
  await capture('16-reset-dialog', checks.obj);

  await act('cancel-reset-dialog', async () => {
    await page.click('[data-action="reset-cancel"]');
    await page.waitFor('(function(){var el=document.getElementById("resetModal");return !!el && el.hidden;})()', 'reset modal closed', 8000);
    return 'reset modal cancelled';
  });
  checks = makeChecks();
  checks.add('resetModalClosed', (await page.safeEval('(function(){var el=document.getElementById("resetModal");return !!el && el.hidden;})()', false)) === true);
  await capture('16b-reset-cancelled', checks.obj);

  // -----------------------------------------------------------------------
  // Mobile viewport 390x844
  // -----------------------------------------------------------------------
  await act('switch-mobile-viewport', async () => {
    await page.setViewport(390, 844, true);
    await page.reload();
    await page.waitReady(30000);
    await page.click('[data-choose-ui="glass"]');
    await page.waitFor('document.getElementById("uiChooserModal").classList.contains("is-hidden")', 'chooser closed (mobile)', 8000);
    return 'viewport 390x844';
  });
  checks = makeChecks();
  const mobileMetrics = await page.eval('(function(){var sb=document.querySelector(".sidebar").getBoundingClientRect();var tb=document.querySelector(".topbar").getBoundingClientRect();var cards=Array.from(document.querySelectorAll(".course-card"));var cardBoxes=cards.map(function(card){var r=card.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};});var inside=cardBoxes.every(function(b){return b.x >= -1 && b.x + b.w <= window.innerWidth + 1;});return {iw:window.innerWidth,ih:window.innerHeight,scrollW:document.documentElement.scrollWidth,bodyScrollW:document.body.scrollWidth,sidebar:{x:Math.round(sb.x),y:Math.round(sb.y),w:Math.round(sb.width),h:Math.round(sb.height)},topbar:{x:Math.round(tb.x),y:Math.round(tb.y),w:Math.round(tb.width),h:Math.round(tb.height)},navButtons:document.querySelectorAll(".nav-btn").length,courseCards:cards.length,cardsInsideViewport:inside,cards:cardBoxes};})()');
  checks.add('viewportWidth', mobileMetrics.iw === 390, 'innerWidth=' + mobileMetrics.iw);
  checks.add('viewportHeight', mobileMetrics.ih === 844, 'innerHeight=' + mobileMetrics.ih);
  checks.add('noHorizontalOverflow', mobileMetrics.scrollW <= mobileMetrics.iw + 1 && mobileMetrics.bodyScrollW <= mobileMetrics.iw + 1, 'scrollW=' + mobileMetrics.scrollW + '/' + mobileMetrics.bodyScrollW);
  checks.add('navButtons', mobileMetrics.navButtons === 5, 'count=' + mobileMetrics.navButtons);
  checks.add('courseCards', mobileMetrics.courseCards === 2, 'count=' + mobileMetrics.courseCards);
  checks.add('sidebarDocked', mobileMetrics.sidebar.w > 0 && mobileMetrics.sidebar.h > 0, safeJson(mobileMetrics.sidebar));
  checks.add('topbarVisible', mobileMetrics.topbar.w > 0 && mobileMetrics.topbar.h > 0, safeJson(mobileMetrics.topbar));
  checks.add('cardsInsideViewport', mobileMetrics.cardsInsideViewport === true, safeJson(mobileMetrics.cards));
  checks.add('uiModeGlass', (await uiMode()) === 'glass', 'uiMode=' + (await uiMode()));
  await capture('17-mobile-courses', checks.obj);

  // -----------------------------------------------------------------------
  // file:// protocol load
  // -----------------------------------------------------------------------
  const fileIndexUrl = state.fileIndexUrl;
  await act('load-file-protocol', async () => {
    await page.clearViewport();
    await page.navigate(fileIndexUrl);
    await page.waitReady(30000);
    await page.click('[data-choose-ui="glass"]');
    await page.waitFor('document.getElementById("uiChooserModal").classList.contains("is-hidden")', 'chooser closed (file)', 8000);
    await page.waitFor('document.querySelectorAll(".course-card").length === 2', 'file course cards', 8000);
    return 'loaded ' + normalizeUrl(state, fileIndexUrl);
  });
  checks = makeChecks();
  checks.add('titleHtLab', (await page.safeEval('document.title', '')) === 'HT Lab', 'title=' + (await page.safeEval('document.title', '')));
  checks.add('courseCards', (await countOf('.course-card')) === 2, 'count=' + (await countOf('.course-card')));
  checks.add('cssApplied', (await page.safeEval('(function(){var app=document.querySelector(".app");var card=document.querySelector(".course-card");if(!app||!card)return false;var appStyle=getComputedStyle(app);var cardStyle=getComputedStyle(card);return appStyle.display === "grid" && cardStyle.padding === "26px" && document.styleSheets.length >= 1;})()', false)) === true, 'app display + card padding + stylesheets');
  checks.add('bodyFontLoaded', (await page.safeEval('(function(){return getComputedStyle(document.body).fontFamily.indexOf("Inter") >= 0;})()', false)) === true);
  checks.add('sidebarVisible', (await page.safeEval('(function(){var el=document.querySelector(".sidebar");if(!el)return false;var r=el.getBoundingClientRect();return r.width > 100 && r.height > 100;})()', false)) === true);
  checks.add('viewHasText', (await viewText()).length > 50, 'chars=' + (await viewText()).length);
  checks.add('uiModeGlass', (await uiMode()) === 'glass', 'uiMode=' + (await uiMode()));
  await capture('18-file-protocol', checks.obj);
}

// ---------------------------------------------------------------------------
// Issue classification
// ---------------------------------------------------------------------------
function buildIssues(state) {
  const consoleIssues = [];
  const warnings = state.warnings.slice();
  for (const entry of state.console) {
    const level = entry.level;
    if (level === 'error') {
      consoleIssues.push({
        kind: 'console-error',
        phase: entry.phase,
        key: issueKey('console', entry),
        level: entry.level,
        text: truncate(entry.text, 1000),
        stack: entry.stack || ''
      });
    } else if (level === 'warning' || level === 'warn') {
      warnings.push({ phase: entry.phase, text: 'console warning: ' + truncate(entry.text, 500) });
    }
  }
  const exceptionIssues = state.exceptions.map((entry) => ({
    kind: 'exception',
    phase: entry.phase,
    key: issueKey('exception', entry),
    text: truncate(entry.text, 1500),
    stack: entry.stack || ''
  }));
  const httpIssues = state.httpErrors.map((entry) => ({
    kind: 'http-error',
    phase: entry.phase,
    key: issueKey('http', entry),
    url: truncate(entry.url, 500),
    status: entry.status,
    resourceType: entry.resourceType || ''
  }));
  const requestIssues = [];
  for (const entry of state.requestFailures) {
    if (entry.canceled || /ERR_ABORTED/.test(entry.errorText || '')) {
      warnings.push({ phase: entry.phase, text: 'request aborted (ignored): ' + truncate(entry.url, 300) + ' ' + entry.errorText });
      continue;
    }
    requestIssues.push({
      kind: 'request-failed',
      phase: entry.phase,
      key: issueKey('request', entry),
      url: truncate(entry.url, 500),
      errorText: entry.errorText || '',
      resourceType: entry.resourceType || ''
    });
  }
  const logIssues = [];
  for (const entry of state.logEntries) {
    const level = (entry.level || '').toLowerCase();
    if (level === 'error') {
      logIssues.push({ kind: 'browser-log', phase: entry.phase, key: issueKey('log', entry), level: entry.level, text: truncate(entry.text, 1000) });
    } else if (level === 'warning') {
      warnings.push({ phase: entry.phase, text: 'browser log warning: ' + truncate(entry.text, 500) });
    }
  }
  const allIssues = [].concat(consoleIssues, exceptionIssues, httpIssues, requestIssues, logIssues);
  const known = [];
  const hard = [];
  for (const issue of allIssues) {
    const knownEntry = knownIssueFor(issue.key);
    if (knownEntry) {
      issue.knownReason = knownEntry.reason;
      known.push(issue);
    } else {
      hard.push(issue);
    }
  }
  return {
    consoleErrors: consoleIssues,
    exceptions: exceptionIssues,
    httpErrors: httpIssues,
    failedRequests: requestIssues,
    logErrors: logIssues,
    warnings: warnings,
    known: known,
    hard: hard,
    all: allIssues
  };
}

// ---------------------------------------------------------------------------
// Report writing
// ---------------------------------------------------------------------------
function writeReport(state, issues, verdict) {
  const report = {
    schema: SCHEMA,
    harnessVersion: HARNESS_VERSION,
    label: state.label,
    generatedAt: state.generatedAt,
    runtimeMs: Date.now() - state.startedAt,
    root: state.root,
    origin: state.origin,
    argv: state.argv,
    node: process.version,
    platform: process.platform,
    browser: state.browserInfo,
    viewport: { w: 1440, h: 900 },
    stateOrder: Object.keys(state.states),
    states: state.states,
    interactions: state.interactions,
    issues: {
      counts: {
        consoleErrors: issues.consoleErrors.length,
        exceptions: issues.exceptions.length,
        failedRequests: issues.failedRequests.length,
        httpErrors: issues.httpErrors.length,
        logErrors: issues.logErrors.length,
        warnings: issues.warnings.length,
        known: issues.known.length
      },
      consoleErrors: issues.consoleErrors,
      exceptions: issues.exceptions,
      failedRequests: issues.failedRequests,
      httpErrors: issues.httpErrors,
      logErrors: issues.logErrors,
      warnings: issues.warnings,
      known: issues.known
    },
    requests: {
      total: state.requests.length,
      byType: state.requests.reduce((acc, request) => {
        acc[request.type || 'Other'] = (acc[request.type || 'Other'] || 0) + 1;
        return acc;
      }, {})
    },
    hardFailures: state.hardFailures,
    verdict: verdict
  };
  const reportPath = path.join(state.outDir, state.label, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  const markdown = renderReportMarkdown(report);
  const markdownPath = path.join(state.outDir, state.label, 'report.md');
  fs.writeFileSync(markdownPath, markdown);
  return { report, reportPath, markdownPath };
}

function renderReportMarkdown(report) {
  const lines = [];
  const push = (line) => lines.push(line == null ? '' : line);
  const stateNames = report.stateOrder;
  const failedStates = stateNames.filter((name) => {
    const checks = report.states[name].checks || {};
    return Object.keys(checks).some((key) => !checks[key].ok && checks[key].critical);
  });
  const failedInteractions = report.interactions.filter((interaction) => !interaction.ok);
  push('# HT Lab verification report (label: ' + report.label + ')');
  push('');
  push('- Generated: ' + report.generatedAt);
  push('- Site root: ' + report.root);
  push('- Served at: ' + report.origin);
  push('- Browser: ' + (report.browser.browser || '?') + ' (' + (report.browser.userAgent || '') + ')');
  push('- Runtime: ' + Math.round(report.runtimeMs / 1000) + ' s');
  push('- Harness: ' + report.schema + ' v' + report.harnessVersion + ' on node ' + report.node);
  push('');
  push('## Verdict: ' + report.verdict.toUpperCase());
  push('');
  if (report.verdict === 'clean') push('No console errors, no failed requests, all interactions and layout/content checks passed.');
  else if (report.verdict === 'known-issues') push('Only known baseline issues were found; no new failures. See known issues below.');
  else push('Hard failures were detected - see "Hard failures" and the issue tables below.');
  push('');
  push('## Issues');
  push('');
  const counts = report.issues.counts;
  push('| Issue type | Count |');
  push('| --- | --- |');
  push('| Console errors | ' + counts.consoleErrors + ' |');
  push('| Uncaught exceptions | ' + counts.exceptions + ' |');
  push('| Failed resource requests | ' + counts.failedRequests + ' |');
  push('| HTTP >= 400 responses | ' + counts.httpErrors + ' |');
  push('| Browser log errors | ' + counts.logErrors + ' |');
  push('| Known baseline issues | ' + counts.known + ' |');
  push('| Warnings (non-fatal) | ' + counts.warnings + ' |');
  push('');
  const issueTables = [
    ['Console errors', report.issues.consoleErrors],
    ['Uncaught exceptions', report.issues.exceptions],
    ['Failed requests', report.issues.failedRequests],
    ['HTTP errors', report.issues.httpErrors],
    ['Browser log errors', report.issues.logErrors]
  ];
  for (const table of issueTables) {
    if (!table[1].length) continue;
    push('### ' + table[0]);
    push('');
    push('| Phase | Detail |');
    push('| --- | --- |');
    for (const issue of table[1]) {
      const detail = issue.text || issue.url || '';
      push('| ' + issue.phase + ' | ' + String(detail).replace(/\|/g, '\\|').slice(0, 300) + ' |');
    }
    push('');
  }
  if (report.issues.known.length) {
    push('### Known baseline issues (pre-existing, not treated as regressions)');
    push('');
    push('| Phase | Detail | Reason |');
    push('| --- | --- | --- |');
    for (const issue of report.issues.known) {
      push('| ' + issue.phase + ' | ' + String(issue.text || issue.url || '').replace(/\|/g, '\\|').slice(0, 200) + ' | ' + (issue.knownReason || '') + ' |');
    }
    push('');
  }
  if (report.hardFailures.length) {
    push('## Hard failures');
    push('');
    for (const failure of report.hardFailures) push('- ' + failure);
    push('');
  }
  if (failedInteractions.length) {
    push('## Failed interactions');
    push('');
    push('| Interaction | Error |');
    push('| --- | --- |');
    for (const interaction of failedInteractions) push('| ' + interaction.name + ' | ' + String(interaction.error || '').replace(/\|/g, '\\|').slice(0, 300) + ' |');
    push('');
  }
  push('## States');
  push('');
  push('| # | State | UI mode | Page title (h1 / view) | Checks | Screenshot |');
  push('| --- | --- | --- | --- | --- | --- |');
  stateNames.forEach((name, index) => {
    const snapshot = report.states[name];
    const checks = snapshot.checks || {};
    const total = Object.keys(checks).length;
    const failed = Object.keys(checks).filter((key) => !checks[key].ok);
    const firstTitle = snapshot.text && snapshot.text.view ? snapshot.text.view.slice(0, 60) : '';
    push('| ' + (index + 1) + ' | ' + name + ' | ' + (snapshot.ui ? snapshot.ui.mode : '') + ' | ' + String(firstTitle).replace(/\|/g, '\\|') + ' | ' + (total - failed.length) + '/' + total + (failed.length ? ' (' + failed.join(', ') + ')' : '') + ' | ' + snapshot.screenshot + ' |');
  });
  push('');
  push('## Interactions');
  push('');
  push('| Step | Result | Detail |');
  push('| --- | --- | --- |');
  for (const interaction of report.interactions) {
    push('| ' + interaction.name + ' | ' + (interaction.ok ? 'ok' : 'FAILED') + ' | ' + String(interaction.detail || interaction.error || '').replace(/\|/g, '\\|').slice(0, 200) + ' |');
  }
  push('');
  if (report.issues.warnings.length) {
    push('## Warnings');
    push('');
    for (const warning of report.issues.warnings.slice(0, 25)) push('- [' + warning.phase + '] ' + warning.text);
    if (report.issues.warnings.length > 25) push('- ...and ' + (report.issues.warnings.length - 25) + ' more');
    push('');
  }
  push('## Notes');
  push('');
  push('- Screenshots are stored next to this report under screenshots/ and are for human review only: the particle canvas, FPS monitor and entry animations are volatile and are never pixel-diffed.');
  push('- Compare against a previous run with: node tools/verify-site.mjs --root <siteDir> --label after --compare baseline');
  push('- Behaviour compared: normalised text, DOM skeleton (volatile animation classes filtered), layout boxes (tolerance 2px), computed styles, element/level counts, issue lists.');
  push('');
  return lines.join(NL);
}

// ---------------------------------------------------------------------------
// Compare mode
// ---------------------------------------------------------------------------
function loadPreviousReport(outDir, label) {
  const reportPath = path.join(outDir, label, 'report.json');
  if (!fs.existsSync(reportPath)) throw new Error('baseline report not found: ' + reportPath);
  const raw = fs.readFileSync(reportPath, 'utf8');
  return { report: JSON.parse(raw), path: reportPath };
}

const LAYOUT_TOLERANCE_PX = 2;

function firstDifference(baseText, currentText) {
  const base = String(baseText == null ? '' : baseText);
  const current = String(currentText == null ? '' : currentText);
  let index = 0;
  const max = Math.min(base.length, current.length);
  while (index < max && base[index] === current[index]) index += 1;
  const from = Math.max(0, index - 80);
  return {
    index,
    base: truncate(base.slice(from, index + 120), 260),
    current: truncate(current.slice(from, index + 120), 260)
  };
}

function compareSnapshots(baselineSnap, currentSnap, stateName, diffs) {
  const add = (kind, field, base, current) => diffs.push({ state: stateName, kind, field, base: truncate(base, 400), current: truncate(current, 400) });
  const simpleFields = ['title', 'topTitle', 'activeNav', 'bodyClass', 'elementAtCenter'];
  for (const field of simpleFields) {
    if (baselineSnap[field] !== currentSnap[field]) add('meta', field, safeJson(baselineSnap[field]), safeJson(currentSnap[field]));
  }
  if (safeJson(baselineSnap.viewport) !== safeJson(currentSnap.viewport)) add('meta', 'viewport', safeJson(baselineSnap.viewport), safeJson(currentSnap.viewport));
  if (safeJson(baselineSnap.ui) !== safeJson(currentSnap.ui)) add('meta', 'ui', safeJson(baselineSnap.ui), safeJson(currentSnap.ui));
  if (safeJson(baselineSnap.dataset) !== safeJson(currentSnap.dataset)) add('meta', 'dataset', safeJson(baselineSnap.dataset), safeJson(currentSnap.dataset));
  if (safeJson(baselineSnap.flags) !== safeJson(currentSnap.flags)) add('meta', 'flags', safeJson(baselineSnap.flags), safeJson(currentSnap.flags));
  if (safeJson(baselineSnap.scroll) !== safeJson(currentSnap.scroll)) add('meta', 'scroll', safeJson(baselineSnap.scroll), safeJson(currentSnap.scroll));

  const textKeys = Object.keys(baselineSnap.text || {});
  for (const key of textKeys) {
    const baseValue = (baselineSnap.text || {})[key];
    const currentValue = (currentSnap.text || {})[key];
    if (baseValue !== currentValue) {
      const difference = firstDifference(baseValue, currentValue);
      diffs.push({ state: stateName, kind: 'text', field: 'text.' + key, at: difference.index, base: difference.base, current: difference.current });
    }
  }

  const structureKeys = Object.keys(baselineSnap.structure || {});
  for (const key of structureKeys) {
    const baseTree = (baselineSnap.structure || {})[key] || [];
    const currentTree = (currentSnap.structure || {})[key] || [];
    if (baseTree.length !== currentTree.length) {
      add('structure', 'structure' + key + '.length', baseTree.length, currentTree.length);
    }
    const max = Math.min(baseTree.length, currentTree.length);
    let reported = 0;
    for (let i = 0; i < max && reported < 3; i++) {
      if (baseTree[i] !== currentTree[i]) {
        diffs.push({ state: stateName, kind: 'structure', field: 'structure' + key + '[' + i + ']', base: truncate(baseTree[i], 300), current: truncate(currentTree[i], 300) });
        reported += 1;
      }
    }
  }

  const layoutSelectors = Object.keys(baselineSnap.layout || {});
  for (const selector of layoutSelectors) {
    const baseLayout = (baselineSnap.layout || {})[selector];
    const currentLayout = (currentSnap.layout || {})[selector];
    if (!currentLayout) { add('layout', 'layout ' + selector, 'present', 'missing'); continue; }
    if (baseLayout.skipped || currentLayout.skipped) {
      if (!!baseLayout.skipped !== !!currentLayout.skipped) add('layout', 'layout ' + selector + '.skipped', safeJson(baseLayout.skipped), safeJson(currentLayout.skipped));
      continue;
    }
    if (baseLayout.count !== currentLayout.count) add('layout', 'layout ' + selector + '.count', baseLayout.count, currentLayout.count);
    const baseItems = baseLayout.items || [];
    const currentItems = currentLayout.items || [];
    const maxItems = Math.min(baseItems.length, currentItems.length);
    for (let i = 0; i < maxItems; i++) {
      const a = baseItems[i];
      const b = currentItems[i];
      const boxDifference = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.w - b.w), Math.abs(a.h - b.h));
      if (boxDifference > LAYOUT_TOLERANCE_PX) {
        diffs.push({ state: stateName, kind: 'layout', field: 'layout ' + selector + '[' + i + '] box', base: safeJson(a), current: safeJson(b), delta: Math.round(boxDifference * 10) / 10 });
      }
      if (!!a.visible !== !!b.visible) diffs.push({ state: stateName, kind: 'layout', field: 'layout ' + selector + '[' + i + '].visible', base: String(a.visible), current: String(b.visible) });
    }
  }

  const styleSelectors = Object.keys(baselineSnap.styles || {});
  for (const selector of styleSelectors) {
    const baseStyle = (baselineSnap.styles || {})[selector];
    const currentStyle = (currentSnap.styles || {})[selector];
    if ((baseStyle === null) !== (currentStyle === null)) {
      add('style', 'styles ' + selector + '.present', baseStyle === null ? 'null' : 'object', currentStyle === null ? 'null' : 'object');
      continue;
    }
    if (!baseStyle || !currentStyle) continue;
    const props = Object.keys(baseStyle);
    for (const prop of props) {
      if (baseStyle[prop] !== currentStyle[prop]) {
        diffs.push({ state: stateName, kind: 'style', field: 'styles ' + selector + ' { ' + prop + ' }', base: truncate(baseStyle[prop], 300), current: truncate(currentStyle[prop], 300) });
        if (diffs.length > 400) return;
      }
    }
  }

  const baseCounts = baselineSnap.counts || {};
  const currentCounts = currentSnap.counts || {};
  const countKeys = Array.from(new Set(Object.keys(baseCounts).concat(Object.keys(currentCounts))));
  for (const key of countKeys) {
    if (baseCounts[key] !== currentCounts[key]) add('count', 'counts.' + key, baseCounts[key], currentCounts[key]);
  }
}

function compareReports(baselineReport, currentReport) {
  const diffs = [];
  const baselineStates = baselineReport.states || {};
  const currentStates = currentReport.states || {};
  for (const stateName of Object.keys(baselineStates)) {
    if (!currentStates[stateName]) {
      diffs.push({ state: stateName, kind: 'state', field: 'missing state', base: 'present', current: 'missing' });
      continue;
    }
    compareSnapshots(baselineStates[stateName], currentStates[stateName], stateName, diffs);
    if (diffs.length > 400) break;
  }
  for (const stateName of Object.keys(currentStates)) {
    if (!baselineStates[stateName]) diffs.push({ state: stateName, kind: 'state', field: 'new state', base: 'missing', current: 'present' });
  }

  const baselineIssueKeys = new Set();
  const baselineKnown = [];
  const issueGroups = ['consoleErrors', 'exceptions', 'failedRequests', 'httpErrors', 'logErrors'];
  for (const group of issueGroups) {
    for (const issue of ((baselineReport.issues || {})[group] || [])) {
      baselineIssueKeys.add(issue.key);
      baselineKnown.push({ group, phase: issue.phase, key: issue.key, detail: issue.text || issue.url || '', status: issue.status });
    }
  }
  const newIssues = [];
  for (const group of issueGroups) {
    for (const issue of ((currentReport.issues || {})[group] || [])) {
      if (!baselineIssueKeys.has(issue.key) && !knownIssueFor(issue.key)) {
        newIssues.push({ group, phase: issue.phase, key: issue.key, detail: issue.text || issue.url || '', status: issue.status });
      }
    }
  }
  const currentKnown = ((currentReport.issues || {}).known || []).map((issue) => ({ phase: issue.phase, key: issue.key, detail: issue.text || issue.url || '' }));
  const pass = diffs.length === 0 && newIssues.length === 0 && (currentReport.hardFailures || []).length === 0;
  return {
    baselineLabel: baselineReport.label,
    currentLabel: currentReport.label,
    pass,
    statesCompared: Object.keys(baselineStates).length,
    diffCount: diffs.length,
    diffs: diffs,
    newIssues: newIssues,
    baselineKnownIssues: baselineKnown,
    currentKnownIssues: currentKnown,
    currentHardFailures: currentReport.hardFailures || []
  };
}

function renderCompareMarkdown(result) {
  const lines = [];
  const push = (line) => lines.push(line == null ? '' : line);
  push('# HT Lab comparison: ' + result.currentLabel + ' vs baseline ' + result.baselineLabel);
  push('');
  push('- States compared: ' + result.statesCompared);
  push('- Behavioural differences: ' + result.diffCount);
  push('- New issues (not in baseline): ' + result.newIssues.length);
  push('- Baseline-known issues: ' + result.baselineKnownIssues.length);
  push('');
  push('## Verdict: ' + (result.pass ? 'PASS' : 'FAIL'));
  push('');
  if (result.currentHardFailures.length) {
    push('### Current-run hard failures');
    push('');
    for (const failure of result.currentHardFailures) push('- ' + failure);
    push('');
  }
  if (result.newIssues.length) {
    push('### New issues');
    push('');
    push('| Group | Phase | Detail |');
    push('| --- | --- | --- |');
    for (const issue of result.newIssues) push('| ' + issue.group + ' | ' + issue.phase + ' | ' + String(issue.detail).replace(/\|/g, '\\|').slice(0, 300) + ' |');
    push('');
  }
  if (result.baselineKnownIssues.length) {
    push('### Baseline-known issues (informational)');
    push('');
    for (const issue of result.baselineKnownIssues) push('- [' + issue.group + ' @ ' + issue.phase + '] ' + String(issue.detail).slice(0, 300));
    push('');
  }
  if (result.diffs.length) {
    push('### Differences');
    push('');
    push('| State | Kind | Field | Baseline | Current |');
    push('| --- | --- | --- | --- | --- |');
    for (const diff of result.diffs.slice(0, 300)) {
      push('| ' + diff.state + ' | ' + diff.kind + ' | ' + String(diff.field).replace(/\|/g, '\\|').slice(0, 200) + ' | ' + String(diff.base).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 220) + ' | ' + String(diff.current).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 220) + ' |');
    }
    if (result.diffs.length > 300) push('| ... | ... | ... | (' + (result.diffs.length - 300) + ' more diffs in compare.json) | |');
    push('');
  }
  return lines.join(NL);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return 0;
  }
  if (!args.root) {
    printHelp();
    throw new Error('--root <siteDir> is required');
  }
  const root = path.resolve(args.root);
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    throw new Error('no index.html found under --root ' + root);
  }
  const outDir = path.resolve(args.out);
  const label = args.label;
  const labelDir = path.join(outDir, label);
  const shotsDir = path.join(labelDir, 'screenshots');
  fs.mkdirSync(shotsDir, { recursive: true });

  const state = {
    label,
    root,
    origin: '',
    outDir,
    shotsDir,
    labelDir,
    phase: 'boot',
    startedAt: Date.now(),
    generatedAt: nowIso(),
    argv: process.argv.slice(2),
    verbose: !!args.verbose,
    states: {},
    interactions: [],
    hardFailures: [],
    warnings: [],
    console: [],
    exceptions: [],
    httpErrors: [],
    requestFailures: [],
    logEntries: [],
    requests: [],
    requestIndex: new Map(),
    browserInfo: {},
    origin_: '',
    rootFileUrl: '',
    fileIndexUrl: '',
    snapshotConfig: {
      volatileClasses: ['drop-in', 'slide-across', 'view-enter', 'title-enter', 'is-leaving', 'is-behind', 'is-front', 'tilting', 'interface-reveal'],
      boxSkip: [],
      maxStructureNodes: 700,
      boxLimit: 3,
      containers: {
        view: '#view',
        sidebar: '.sidebar',
        topbar: '.topbar',
        chooser: '#uiChooserModal',
        apSheet: '#apSheet',
        resetModal: '#resetModalContent',
        cosmosHud: '#cosmosHud',
        orbitLayer: '#orbit-cards-layer'
      },
      structureRoots: ['#view', '.sidebar', '.topbar', '#uiChooserModal', '#apSheet', '#resetModalContent', '#orbit-cards-layer', '#cosmosHud'],
      boxSelectors: ['.app', '.sidebar', '.topbar', '.content', '.nav', '.side-bottom', '.page-header', '.page-header h1', '.course-cards', '.course-card', '.course-route', '.track', '.level-grid', '.level-card', '.lesson-layout', '.panel', '.audio-row', '.ide-frame', '.quiz-item', '.option-list', '.btn-primary', '.footer-note', '#apFab', '#apSheet', '#uiChooserModal', '.ui-chooser-box', '.ui-mode-card', '#cosmos-stage', '#cosmosHud', '#orbit-cards-layer', '.orbit-card', '#resetModal', '.reset-dialog', '.summary-hero', '.proj-card', '.proj-grid'],
      styleSelectors: ['.app', '.sidebar', '.brand-name', '.nav-btn.active', '.topbar', '.top-title', '.top-right', '.btn', '.btn-primary', '.content', '.page-header', '.page-header h1', '.subhead', '.panel', '.course-card', '.course-card-body', '.level-card', '.lesson-layout', '.lesson-copy', '.audio-row', '.quiz-item', '.option', '.ide-frame', '.footer-note', '.ui-chooser-box', '.ui-mode-card', '.orbit-card', '.ap-sheet', '.ap-fab', '#view'],
      styleProps: ['display', 'position', 'visibility', 'color', 'backgroundColor', 'backgroundImage', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'padding', 'margin', 'borderTopWidth', 'borderTopColor', 'borderRadius', 'boxShadow', 'backdropFilter', 'gridTemplateColumns', 'gap', 'justifyContent', 'alignItems', 'flexDirection'],
      countSelectors: {
        navBtn: '.nav-btn',
        courseCard: '.course-card',
        levelCard: '.level-card',
        track: '.track',
        panel: '.panel',
        quizItem: '.quiz-item',
        option: '.option',
        pick: '[data-pick]',
        audioRow: '.audio-row',
        audioEl: 'audio',
        orbitCard: '.orbit-card',
        chooserCard: '.ui-mode-card',
        apChip: '.ap-chip',
        apRange: '.ap-range',
        projCard: '.proj-card',
        summaryGrid: '.summary-grid',
        skillRow: '.skill-row',
        resetForm: '#resetModalContent .reset-form',
        ideFrame: '.ide-frame',
        codeEditor: '#codeAnswer',
        canvas: 'canvas',
        button: '.btn'
      }
    }
  };

  let server = null;
  let browser = null;
  let cdp = null;
  let watchdog = null;
  const cleanup = () => {
    if (watchdog) {
      clearTimeout(watchdog);
      watchdog = null;
    }
    try {
      if (cdp) cdp.close();
    } catch (err) {}
    if (browser) {
      killProcessTree(browser.child);
      removeDirQuiet(browser.profileDir);
    }
    try {
      if (server) server.close();
    } catch (err) {}
  };
  const emergencyCleanup = () => {
    try {
      if (browser) {
        killProcessTree(browser.child);
        removeDirQuiet(browser.profileDir);
      }
    } catch (err) {}
    try {
      if (server) server.close();
    } catch (err) {}
    try {
      if (cdp) cdp.close();
    } catch (err) {}
  };
  watchdog = setTimeout(() => {
    process.stderr.write('watchdog timeout after ' + args.timeout + 'ms - aborting' + NL);
    emergencyCleanup();
    process.exit(2);
  }, args.timeout);

  try {
    const browserPath = args.browser || findBrowser();
    if (!browserPath) throw new Error('no Chromium-based browser found; pass --browser <path> or set BROWSER_PATH');
    const candidateServer = createStaticServer(root);
    const port = await listenServer(candidateServer, args.port);
    server = candidateServer;
    state.origin = 'http://127.0.0.1:' + port;
    state.rootFileUrl = pathToFileURL(root).href;
    state.fileIndexUrl = pathToFileURL(path.join(root, 'index.html')).href;

    browser = await launchBrowser(browserPath);
    state.browserInfo = { path: browserPath, browser: browser.browser, userAgent: browser.userAgent };
    cdp = await CdpConnection.connect(browser.wsUrl);

    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;

    cdp.on((message) => {
      if (!message || message.sessionId !== sessionId) return;
      const params = message.params || {};
      if (message.method === 'Runtime.consoleAPICalled') {
        const text = (params.args || []).map(describeRemoteObject).join(' ');
        state.console.push({ phase: state.phase, level: params.type || 'log', text: truncate(normalizeIssueText(text), 1500), stack: stackSummary(params.stackTrace) });
      } else if (message.method === 'Runtime.exceptionThrown') {
        const details = params.exceptionDetails || {};
        const exception = details.exception || {};
        const text = (exception.description || details.text || 'uncaught exception') + (details.url ? ' @ ' + basenameOf(details.url) + ':' + ((details.lineNumber || 0) + 1) : '');
        state.exceptions.push({ phase: state.phase, text: truncate(normalizeIssueText(text), 2000), stack: stackSummary(details.stackTrace) });
      } else if (message.method === 'Network.requestWillBeSent') {
        const request = params.request || {};
        const url = request.url || '';
        state.requestIndex.set(params.requestId, { url: url, type: params.type || '' });
        state.requests.push({ phase: state.phase, url: normalizeUrl(state, url), type: params.type || '' });
      } else if (message.method === 'Network.responseReceived') {
        const response = params.response || {};
        if (Number(response.status) >= 400) {
          state.httpErrors.push({ phase: state.phase, url: normalizeUrl(state, response.url || ''), status: response.status, resourceType: params.type || '' });
        }
      } else if (message.method === 'Network.loadingFailed') {
        const request = state.requestIndex.get(params.requestId) || { url: '', type: '' };
        state.requestFailures.push({ phase: state.phase, url: normalizeUrl(state, request.url), errorText: params.errorText || '', canceled: !!params.canceled, resourceType: params.type || request.type || '' });
      } else if (message.method === 'Log.entryAdded') {
        const entry = params.entry || {};
        state.logEntries.push({ phase: state.phase, level: entry.level || '', text: truncate(normalizeIssueText(entry.text || ''), 1500), url: normalizeUrl(state, entry.url || '') });
      }
    });

    const page = new PageSession(cdp, sessionId, state);
    await page.enableDomains();
    await runMatrix(page, state);

    state.generatedAt = nowIso();
    const issues = buildIssues(state);
    let verdict;
    if (state.hardFailures.length > 0 || issues.hard.length > 0) verdict = 'failed';
    else if (issues.known.length > 0) verdict = 'known-issues';
    else verdict = 'clean';
    const written = writeReport(state, issues, verdict);

    process.stdout.write(NL);
    process.stdout.write('=== HT Lab verification: ' + label + ' ===' + NL);
    process.stdout.write('root: ' + root + NL);
    process.stdout.write('browser: ' + (browser.browser || browserPath) + NL);
    process.stdout.write('states: ' + Object.keys(state.states).length + '   interactions: ' + state.interactions.filter((i) => i.ok).length + ' ok / ' + state.interactions.filter((i) => !i.ok).length + ' failed' + NL);
    process.stdout.write('console errors: ' + issues.consoleErrors.length + '   exceptions: ' + issues.exceptions.length + '   failed requests: ' + issues.failedRequests.length + '   http errors: ' + issues.httpErrors.length + '   log errors: ' + issues.logErrors.length + NL);
    process.stdout.write('known baseline issues: ' + issues.known.length + '   warnings: ' + issues.warnings.length + NL);
    if (state.hardFailures.length) {
      process.stdout.write('hard failures:' + NL);
      for (const failure of state.hardFailures.slice(0, 20)) process.stdout.write('  - ' + failure + NL);
    }
    for (const issue of issues.hard.slice(0, 10)) {
      process.stdout.write('  [' + issue.kind + ' @ ' + issue.phase + '] ' + truncate(issue.text || issue.url || issue.errorText || '', 300) + NL);
    }
    process.stdout.write('verdict: ' + verdict.toUpperCase() + NL);
    process.stdout.write('report: ' + written.markdownPath + NL);
    process.stdout.write('screenshots: ' + shotsDir + NL);

    let exitCode = verdict === 'failed' ? 1 : 0;
    if (args.compare) {
      const previous = loadPreviousReport(outDir, args.compare);
      const comparison = compareReports(previous.report, written.report);
      const compareJsonPath = path.join(labelDir, 'compare.json');
      fs.writeFileSync(compareJsonPath, JSON.stringify(comparison, null, 2));
      const compareMarkdownPath = path.join(labelDir, 'compare.md');
      fs.writeFileSync(compareMarkdownPath, renderCompareMarkdown(comparison));
      process.stdout.write(NL);
      process.stdout.write('=== compare: ' + label + ' vs ' + args.compare + ' ===' + NL);
      process.stdout.write('states compared: ' + comparison.statesCompared + '   differences: ' + comparison.diffCount + '   new issues: ' + comparison.newIssues.length + '   baseline-known issues: ' + comparison.baselineKnownIssues.length + NL);
      for (const diff of comparison.diffs.slice(0, 40)) {
        process.stdout.write('  DIFF [' + diff.kind + ' @ ' + diff.state + '] ' + diff.field + NL);
        if (diff.kind !== 'structure' && diff.kind !== 'state') {
          process.stdout.write('    baseline: ' + truncate(String(diff.base).replace(/\s+/g, ' '), 200) + NL);
          process.stdout.write('    current : ' + truncate(String(diff.current).replace(/\s+/g, ' '), 200) + NL);
        }
      }
      if (comparison.diffCount > 40) process.stdout.write('  ...and ' + (comparison.diffCount - 40) + ' more differences (see compare.md)' + NL);
      for (const issue of comparison.newIssues.slice(0, 20)) {
        process.stdout.write('  NEW ISSUE [' + issue.group + ' @ ' + issue.phase + '] ' + truncate(String(issue.detail).replace(/\s+/g, ' '), 300) + NL);
      }
      if (comparison.baselineKnownIssues.length) process.stdout.write('  baseline-known issues are listed in compare.md and do not fail the comparison' + NL);
      process.stdout.write('compare verdict: ' + (comparison.pass ? 'PASS' : 'FAIL') + NL);
      process.stdout.write('compare report: ' + compareMarkdownPath + NL);
      if (!comparison.pass) exitCode = 1;
    }
    return exitCode;
  } finally {
    cleanup();
  }
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err) => {
    process.stderr.write('HARNESS ERROR: ' + ((err && err.stack) || String(err)) + NL);
    process.exit(2);
  });
