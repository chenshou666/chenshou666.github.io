/* ============================================================================
 * 08-c-checker.js — C 语言代码检查器：词法/语法分析、结构检查、运行结果比对、通关判定与胜利动画
 * 加载顺序 8/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
function tokenizeChallengeC(source){
 const tokens=[],ops=['<<=','>>=','...','->','++','--','&&','||','==','!=','<=','>=','+=','-=','*=','/=','%=','&=','|=','^=','<<','>>'];let i=0;
 while(i<source.length){const c=source[i];if(/\s/.test(c)){i++;continue}
  if(c==='\\'&&(source[i+1]==='\n'||source[i+1]==='\r')){i+=2;if(source[i]==='\n')i++;continue}
  if(c==='/'&&source[i+1]==='/'){i+=2;while(i<source.length&&source[i]!=='\n')i++;continue}
  if(c==='/'&&source[i+1]==='*'){const e=source.indexOf('*/',i+2);if(e<0)return{error:'注释没有用 */ 结束。',tokens:[]};i=e+2;continue}
  if(c==='"'||c==="'"){const q=c,s=i++;let done=false;while(i<source.length){if(source[i]==='\\'){i+=2;continue}if(source[i]===q){i++;done=true;break}if(source[i]==='\n'||source[i]==='\r')return{error:'字符串或字符常量中有未结束的换行。',tokens:[]};i++}if(!done)return{error:'字符串或字符常量缺少结束引号。',tokens:[]};tokens.push({type:q==='"'?'string':'char',v:source.slice(s+1,i-1),at:s});continue}
  const id=source.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);if(id){tokens.push({type:'id',v:id[0],at:i});i+=id[0].length;continue}
  const num=source.slice(i).match(/^(?:0[xX][0-9a-fA-F]+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?:[uU]|[lL]{1,2}|[uU][lL]{1,2}|[lL]{1,2}[uU]|[fF])?/);if(num){tokens.push({type:'num',v:num[0].toLowerCase(),at:i});i+=num[0].length;continue}
  const op=ops.find(x=>source.slice(i,i+x.length)===x);if(op){tokens.push({type:'p',v:op,at:i});i+=op.length;continue}
  if('{}()[];,:.?~!%^&*+-=/<>|#'.includes(c)){tokens.push({type:'p',v:c,at:i});i++;continue}
  return{error:'发现无法识别的字符：'+c,tokens:[]}
 }
 return{error:null,tokens}
}
function cMask(source){let out='',i=0;while(i<source.length){const c=source[i],n=source[i+1];if(c==='/'&&n==='/'){while(i<source.length&&source[i]!=='\n'&&source[i]!=='\r'){out+=' ';i++}continue}if(c==='/'&&n==='*'){out+='  ';i+=2;while(i<source.length&&!(source[i]==='*'&&source[i+1]==='/')){out+=source[i]==='\n'||source[i]==='\r'?source[i]:' ';i++}if(i<source.length){out+='  ';i+=2}continue}if(c==='"'||c==="'"){const q=c;out+=' ';i++;while(i<source.length){if(source[i]==='\\'){out+=' ';i++;if(i<source.length){out+=source[i]==='\n'||source[i]==='\r'?source[i]:' ';i++}continue}if(source[i]===q){out+=' ';i++;break}out+=source[i]==='\n'||source[i]==='\r'?source[i]:' ';i++}continue}out+=c;i++}return out}
function vals(ts){return ts.map(t=>t.v)}
function seq(ts,pat){const a=vals(ts);for(let i=0;i<=a.length-pat.length;i++){let ok=true;for(let j=0;j<pat.length;j++)if(a[i+j]!==pat[j]){ok=false;break}if(ok)return true}return false}
function indexSeq(ts,pat){const a=vals(ts);for(let i=0;i<=a.length-pat.length;i++){let ok=true;for(let j=0;j<pat.length;j++)if(a[i+j]!==pat[j]){ok=false;break}if(ok)return i}return-1}
function closeGroup(ts,s){const open=ts[s]&&ts[s].v,match={'(':')','{':'}','[':']'},end=match[open];if(!end)return-1;let d=0;for(let i=s;i<ts.length;i++){if(ts[i].type==="string"||ts[i].type==="char")continue;if(ts[i].v===open)d++;else if(ts[i].v===end&&--d===0)return i}return-1}
function splitTop(ts,sep){const r=[];let s=0,d=0;for(let i=0;i<ts.length;i++){const v=ts[i].v;if(v==='('||v==='['||v==='{')d++;else if(v===')'||v===']'||v==='}')d--;else if(v===sep&&d===0){r.push(ts.slice(s,i));s=i+1}}r.push(ts.slice(s));return r}
function calls(ts,name){const r=[];for(let i=0;i<ts.length-1;i++)if(ts[i].v===name&&ts[i+1].v==='('){const e=closeGroup(ts,i+1);if(e>0)r.push({args:splitTop(ts.slice(i+2,e),','),at:i,end:e})}return r}
function func(ts,name,ret){for(let i=0;i<ts.length-2;i++){if(ts[i].v!==ret||ts[i+1].v!==name||ts[i+2].v!=='(')continue;const p=closeGroup(ts,i+2);if(p<0||!ts[p+1]||ts[p+1].v!=='{')continue;const e=closeGroup(ts,p+1);if(e>=0)return{params:splitTop(ts.slice(i+3,p),','),body:ts.slice(p+2,e),at:i,bodyAt:p+1,end:e+1}}return null}
function takeStatement(ts,s){if(!ts[s])return-1;if(ts[s].v==='{'){const e=closeGroup(ts,s);return e<0?-1:e+1}let d=0;for(let i=s;i<ts.length;i++){const v=ts[i].v;if(v==='('||v==='['||v==='{')d++;else if(v===')'||v===']'||v==='}'){d--;if(d<0)return-1}else if(v===';'&&d===0)return i+1}return-1}
function ifs(ts){const r=[];for(let i=0;i<ts.length-2;i++){if(ts[i].v!=='if'||ts[i+1].v!=='(')continue;const p=closeGroup(ts,i+1);if(p<0||!ts[p+1])continue;let end,thenSlice,other=null;if(ts[p+1].v==='{'){const e=closeGroup(ts,p+1);if(e<0)continue;end=e+1;thenSlice=ts.slice(p+2,e)}else{end=takeStatement(ts,p+1);if(end<0)continue;thenSlice=ts.slice(p+1,end)}if(ts[end]&&ts[end].v==='else'){if(ts[end+1]&&ts[end+1].v==='{'){const x=closeGroup(ts,end+1);if(x>0){other=ts.slice(end+2,x);end=x+1}}else{const x=takeStatement(ts,end+1);if(x>0){other=ts.slice(end+1,x);end=x}}}r.push({cond:ts.slice(i+2,p),then:thenSlice,elseBody:other,at:i,end})}return r}
function fors(ts){const r=[];for(let i=0;i<ts.length-2;i++){if(ts[i].v!=='for'||ts[i+1].v!=='(')continue;const p=closeGroup(ts,i+1);if(p<0||!ts[p+1])continue;let end,body;if(ts[p+1].v==='{'){const e=closeGroup(ts,p+1);if(e<0)continue;end=e+1;body=ts.slice(p+2,e)}else{end=takeStatement(ts,p+1);if(end<0)continue;body=ts.slice(p+1,end)}r.push({parts:splitTop(ts.slice(i+2,p),';'),body,at:i,end})}return r}
function ret(ts,v){return seq(ts,['return',v,';'])}
function fmt(ts,format,pred){return calls(ts,'printf').some(c=>c.args[0]&&c.args[0][0]&&c.args[0][0].type==='string'&&c.args[0][0].v.includes(format)&&pred(c.args.slice(1)))}
function positiveIntVariable(ts,name){for(let i=0;i<ts.length-3;i++)if((ts[i].v==='int'||ts[i].v==='size_t'||ts[i].v==='unsigned')&&ts[i+1].v===name&&ts[i+2].v==='='&&ts[i+3].type==='num'){const n=Number(ts[i+3].v.replace(/[uUlL]/g,''));if(Number.isFinite(n)&&n>0)return true}return false}
/* ---------- 轻量 C 语法解析器：分号、括号、控制流、声明、函数定义都要符合真实 C 语法 ---------- */
const CS_TYPES=["void","char","short","int","long","float","double","signed","unsigned","_Bool","_Complex","_Imaginary","struct","enum","union","typedef","extern","static","auto","register","const","volatile","restrict","inline","_Atomic","_Static_assert","_Alignas","size_t","FILE"];
const CS_BIN={"=":2,"+=":2,"-=":2,"*=":2,"/=":2,"%=":2,"<<=":2,">>=":2,"&=":2,"|=":2,"^=":2,"||":4,"&&":5,"|":6,"^":7,"&":8,"==":9,"!=":9,"<":10,">":10,"<=":10,">=":10,"<<":11,">>":11,"+":12,"-":12,"*":13,"/":13,"%":13};
function closeGroupRange(ts,s,end){const open=ts[s]?ts[s].v:null,close={'(':')','[':']','{':'}'}[open];if(!close)return-1;let d=0;for(let i=s;i<end;i++){if(ts[i].type==="string"||ts[i].type==="char")continue;const v=ts[i].v;if(v===open)d++;else if(v===close){d--;if(d===0)return i}}return-1}
function csLine(source,at){let n=1;for(let k=0;k<at;k++)if(source[k]==="\n")n++;return n}
function csErr(source,at,msg){return msg+"（第 "+csLine(source,at)+" 行）"}
function collectTypeNames(ts){const names=new Set();for(let i=0;i<ts.length-1;i++){if(ts[i].v==="typedef"){let d=0;for(let j=i+1;j<ts.length;j++){const v=ts[j].v;if(v==="("||v==="["||v==="{")d++;else if(v===")"||v==="]"||v==="}")d--;else if(v===";"&&d===0){if(ts[j-1]&&ts[j-1].type==="id")names.add(ts[j-1].v);break}}}if(ts[i].v==="struct"||ts[i].v==="enum"||ts[i].v==="union"){const n=ts[i+1];if(n&&n.type==="id"&&CS_TYPES.indexOf(n.v)<0)names.add(n.v)}}return names}
function csTypeStart(v,names){return !!v&&(CS_TYPES.indexOf(v)>=0||names.has(v))}
function csPrimary(ts,i,end,names){if(i>=end)return{ok:false,error:"表达式意外结束"};const t=ts[i];
 if(t.type==="id"&&(t.v==="struct"||t.v==="enum"||t.v==="union")&&ts[i+1]&&ts[i+1].type==="id")return{ok:true,next:i+2};
 if(t.type==="id"&&!CS_TYPES.includes(t.v)&&names.has(t.v)&&ts[i+1]&&(ts[i+1].v===","||ts[i+1].v===")"))return{ok:true,next:i+1};
 if(t.type==="id"||t.type==="num"||t.type==="string"||t.type==="char")return{ok:true,next:i+1};if(t.type==="p"&&t.v==="("){const r=csExpr(ts,i+1,end,names,true);if(!r.ok)return r;if(r.next>=end||ts[r.next].v!==")")return{ok:false,error:"括号没有闭合"};return{ok:true,next:r.next+1}}
 if(csTypeStart(t.v,names)&&t.type==="id"){let k=i+1;if(t.v==="struct"||t.v==="enum"||t.v==="union"){if(ts[k]&&ts[k].type==="id")k++}else{while(k<end&&(ts[k].v==="*"||ts[k].v==="const"||ts[k].v==="volatile"))k++}return{ok:true,next:k}}
 return{ok:false,error:"无法识别的表达式: "+t.v}}
function csPostfix(ts,i,end,names){let r=csPrimary(ts,i,end,names);if(!r.ok)return r;for(;;){if(r.next>=end)return r;const t=ts[r.next];if(t.type==="p"&&t.v==="("){const e=closeGroupRange(ts,r.next,end);if(e<0)return{ok:false,error:"函数调用的括号没有闭合"};const args=splitTop(ts.slice(r.next+1,e),",");for(let k=0;k<args.length;k++){const a=args[k];if(!a.length)continue;const rr=csExpr(a,0,a.length,names,false);if(!rr.ok||rr.next!==a.length)return{ok:false,error:"函数调用参数有误: "+rr.error}}r={ok:true,next:e+1}}else if(t.type==="p"&&t.v==="["){const e=closeGroupRange(ts,r.next,end);if(e<0)return{ok:false,error:"下标没有闭合"};const inner=ts.slice(r.next+1,e);if(inner.length){const rr=csExpr(inner,0,inner.length,names,false);if(!rr.ok||rr.next!==inner.length)return{ok:false,error:"下标表达式有误: "+rr.error}}r={ok:true,next:e+1}}else if(t.type==="p"&&(t.v==="."||t.v==="->")){if(r.next+1>=end||ts[r.next+1].type!=="id")return{ok:false,error:t.v+" 后需要成员名"};r={ok:true,next:r.next+2}}else if(t.v==="++"||t.v==="--"){r={ok:true,next:r.next+1}}else return r}}
function csUnary(ts,i,end,names){if(i>=end)return{ok:false,error:"表达式意外结束"};const t=ts[i];if(t.type==="p"&&(t.v==="++"||t.v==="--"||t.v==="+"||t.v==="-"||t.v==="!"||t.v==="~"||t.v==="*"||t.v==="&"))return csUnary(ts,i+1,end,names);if(t.v==="sizeof"){const n=ts[i+1];if(n&&n.v==="("&&csTypeStart(ts[i+2]?ts[i+2].v:"",names)){const e=closeGroupRange(ts,i+1,end);if(e<0)return{ok:false,error:"sizeof 的括号没有闭合"};return{ok:true,next:e+1}}return csUnary(ts,i+1,end,names)}if(t.v==="("&&csTypeStart(ts[i+1]?ts[i+1].v:"",names)){let k=i+1,state=0;while(k<end){const v=ts[k].v;if(state===1&&v==="{")break;if(state===1&&ts[k].type==="id"){state=2;k++;continue}if(csTypeStart(v,names)){state=(v==="struct"||v==="enum"||v==="union")?1:0;k++;continue}break}while(k<end&&ts[k].v==="*")k++;if(k>i+1&&k<end&&ts[k].v===")")return csUnary(ts,k+1,end,names)}return csPostfix(ts,i,end,names)}
function csBin(ts,i,end,names,minPrec){let r=csUnary(ts,i,end,names);if(!r.ok)return r;for(;;){if(r.next>=end)return r;const t=ts[r.next];const prec=t.type==="p"?CS_BIN[t.v]:undefined;if(prec===undefined||prec<minPrec)return r;const rr=csBin(ts,r.next+1,end,names,prec===2?prec:prec+1);if(!rr.ok)return rr;r={ok:true,next:rr.next}}}
function csCond(ts,i,end,names){let r=csBin(ts,i,end,names,0);if(!r.ok)return r;if(r.next<end&&ts[r.next].type==="p"&&ts[r.next].v==="?"){const a=csExpr(ts,r.next+1,end,names,false);if(!a.ok)return a;if(a.next>=end||ts[a.next].type!=="p"||ts[a.next].v!==":")return{ok:false,error:"三目运算符 ? 缺少 :"};const b=csCond(ts,a.next+1,end,names);if(!b.ok)return b;return{ok:true,next:b.next}}return r}
function csExpr(ts,i,end,names,allowComma){let r=csCond(ts,i,end,names);if(!r.ok)return r;if(allowComma){while(r.next<end&&ts[r.next].v===","){const rr=csCond(ts,r.next+1,end,names);if(!rr.ok)return rr;r={ok:true,next:rr.next}}}return r}
function csDeclarator(ts,i,end,names,source){let j=i,name=null;if(ts[j]&&ts[j].v==="("){let k=j+1;while(k<end&&ts[k].v==="*")k++;if(k<end&&ts[k].type==="id"){name=ts[k].v;const c=closeGroupRange(ts,j,end);if(c<0)return{ok:false,error:csErr(source,ts[j].at,"声明中的括号没有闭合")};j=c+1}else return{ok:false,error:csErr(source,ts[j].at,"声明格式无法识别")}}else{while(j<end&&(ts[j].v==="*"||ts[j].v==="const"||ts[j].v==="volatile"||ts[j].v==="restrict"))j++;if(j<end&&ts[j].type==="id"&&!csTypeStart(ts[j].v,new Set())){name=ts[j].v;j++}else return{ok:false,error:csErr(source,ts[i].at,"声明缺少名字")}}
for(;;){if(j>=end)break;if(ts[j].v==="["){const c=closeGroupRange(ts,j,end);if(c<0)return{ok:false,error:csErr(source,ts[j].at,"数组下标没有闭合")};j=c+1;continue}if(ts[j].v==="("){const c=closeGroupRange(ts,j,end);if(c<0)return{ok:false,error:csErr(source,ts[j].at,"参数列表没有闭合")};j=c+1;continue}break}
if(ts[j]&&ts[j].v==="="){if(ts[j+1]&&ts[j+1].v==="{"){const c=closeGroupRange(ts,j+1,end);if(c<0)return{ok:false,error:csErr(source,ts[j+1].at,"初始化列表没有闭合")};j=c+1}else{const r=csExpr(ts,j+1,end,names,false);if(!r.ok)return{ok:false,error:csErr(source,ts[j+1]?ts[j+1].at:ts[j].at,r.error)};j=r.next}}return{ok:true,next:j,name}}
function csDeclarationCore(ts,i,end,names,source){let j=i,sawBody=false,state=0;while(j<end){const v=ts[j].v;if(state===1&&v==="{"){const c=closeGroupRange(ts,j,end);if(c<0)return{ok:false,error:csErr(source,ts[j].at,"类型定义的花括号没有闭合")};j=c+1;sawBody=true;state=0;continue}if(state===1&&ts[j].type==="id"){j++;state=2;continue}if(state===2&&v==="{"){const c=closeGroupRange(ts,j,end);if(c<0)return{ok:false,error:csErr(source,ts[j].at,"类型定义的花括号没有闭合")};j=c+1;sawBody=true;state=0;continue}if(csTypeStart(v,names)){const nx=ts[j+1];if(ts[j].type==="id"&&nx&&(nx.v===";"||nx.v===","||nx.v==="="||nx.v==="["||nx.v===")"))break;state=(v==="struct"||v==="enum"||v==="union")?1:0;j++;continue}break}
if(j===i&&!sawBody)return{ok:false,error:csErr(source,ts[i].at,"无法识别的声明")};
if(ts[i].v==="_Static_assert"){const c=closeGroupRange(ts,j,end);if(c<0)return{ok:false,error:csErr(source,ts[j].at,"_Static_assert 括号没有闭合")};if(c+1>=end||ts[c+1].v!==";")return{ok:false,error:csErr(source,ts[j].at,"_Static_assert 后缺少分号")};return{ok:true,next:c+1,name:null}}
if(sawBody&&ts[j]&&ts[j].v===";")return{ok:true,next:j,name:null};
let declCount=0,firstName=null;
for(;;){const r=csDeclarator(ts,j,end,names,source);if(!r.ok)return r;if(firstName===null)firstName=r.name;j=r.next;declCount++;if(j>=end)return{ok:true,next:j,name:firstName};if(ts[j].v===","){j++;continue}if(ts[j].v===";")break;break}
return{ok:true,next:j,name:firstName}}
function csDeclaration(ts,i,end,names,source){const r=csDeclarationCore(ts,i,end,names,source);if(!r.ok)return r;if(r.next<end&&ts[r.next].v===";")return{ok:true,next:r.next+1};return{ok:false,error:csErr(source,r.next<end?ts[r.next].at:ts[i].at,"声明语句后缺少分号 ;")}}
function csStatement(ts,i,end,names,source){if(i>=end)return{ok:true,next:i};const t=ts[i],v=t.v;
if(v==="#"){let le=source.indexOf("\n",t.at);while(le>0&&source[le-1]==="\\"){le=source.indexOf("\n",le+1)}if(le<0)le=source.length;let j=i+1;while(j<end&&ts[j].at<le)j++;return{ok:true,next:j}}
if(v===";")return{ok:true,next:i+1};
if(v==="{"){const e=closeGroupRange(ts,i,end);if(e<0)return{ok:false,error:csErr(source,t.at,"花括号没有闭合")};const c=csCompound(ts,i+1,e,names,source);if(!c.ok)return c;return{ok:true,next:e+1}}
if(v==="if"||v==="while"){if(!ts[i+1]||ts[i+1].v!=="(")return{ok:false,error:csErr(source,t.at,v+" 后需要条件括号")};const p=closeGroupRange(ts,i+1,end);if(p<0)return{ok:false,error:csErr(source,t.at,v+" 的条件括号没有闭合")};if(p>i+2){const r=csExpr(ts,i+2,p,names,false);if(!r.ok)return{ok:false,error:csErr(source,t.at,v+" 条件表达式有误: "+r.error)};if(r.next!==p)return{ok:false,error:csErr(source,ts[r.next]?ts[r.next].at:t.at,v+" 条件表达式后缺少 )")}}const s=csStatement(ts,p+1,end,names,source);if(!s.ok)return s;let next=s.next;if(v==="if"&&next<end&&ts[next].v==="else"){const s2=csStatement(ts,next+1,end,names,source);if(!s2.ok)return s2;next=s2.next}return{ok:true,next}}
if(v==="for"){if(!ts[i+1]||ts[i+1].v!=="(")return{ok:false,error:csErr(source,t.at,"for 后需要括号")};const p=closeGroupRange(ts,i+1,end);if(p<0)return{ok:false,error:csErr(source,t.at,"for 的括号没有闭合")};let parts;if(p===i+2){parts=[[],[],[]]}else{parts=splitTop(ts.slice(i+2,p),";");if(parts.length!==3)return{ok:false,error:csErr(source,t.at,"for 需要两个分号分隔三个部分")}}for(let k=0;k<3;k++){const seg=parts[k];if(!seg.length)continue;if(k===0&&csTypeStart(seg[0].v,names)){const r=csDeclarationCore(seg,0,seg.length,names,source);if(!r.ok)return{ok:false,error:csErr(source,seg[0].at,"for 第一部分声明有误: "+r.error)};if(r.next!==seg.length)return{ok:false,error:csErr(source,seg[0].at,"for 第一部分声明后缺少分号")}}else{const r=csExpr(seg,0,seg.length,names,true);if(!r.ok)return{ok:false,error:csErr(source,seg[0].at,"for 表达式有误: "+r.error)};if(r.next!==seg.length)return{ok:false,error:csErr(source,seg[0].at,"for 表达式缺少分号")}}}const s=csStatement(ts,p+1,end,names,source);if(!s.ok)return s;return{ok:true,next:s.next}}
if(v==="do"){const s=csStatement(ts,i+1,end,names,source);if(!s.ok)return s;if(s.next>=end||ts[s.next].v!=="while")return{ok:false,error:csErr(source,t.at,"do 后缺少 while")};if(!ts[s.next+1]||ts[s.next+1].v!=="(")return{ok:false,error:csErr(source,t.at,"do-while 缺少条件括号")};const p=closeGroupRange(ts,s.next+1,end);if(p<0)return{ok:false,error:csErr(source,t.at,"do-while 条件括号没有闭合")};if(p+1>=end||ts[p+1].v!==";")return{ok:false,error:csErr(source,p+1<end?ts[p+1].at:t.at,"do-while 后缺少分号")};return{ok:true,next:p+2}}
if(v==="switch"){if(!ts[i+1]||ts[i+1].v!=="(")return{ok:false,error:csErr(source,t.at,"switch 后需要括号")};const p=closeGroupRange(ts,i+1,end);if(p<0)return{ok:false,error:csErr(source,t.at,"switch 括号没有闭合")};const s=csStatement(ts,p+1,end,names,source);if(!s.ok)return s;return{ok:true,next:s.next}}
if(v==="return"){if(ts[i+1]&&ts[i+1].v!==";"){const r=csExpr(ts,i+1,end,names,false);if(!r.ok)return{ok:false,error:csErr(source,t.at,"return 表达式有误: "+r.error)};if(r.next>=end||ts[r.next].v!==";")return{ok:false,error:csErr(source,ts[r.next]?ts[r.next].at:t.at,"return 后缺少分号 ;")};return{ok:true,next:r.next+1}}if(!ts[i+1]||ts[i+1].v!==";")return{ok:false,error:csErr(source,t.at,"return 后缺少分号 ;")};return{ok:true,next:i+2}}
if(v==="break"||v==="continue"){if(!ts[i+1]||ts[i+1].v!==";")return{ok:false,error:csErr(source,t.at,v+" 后缺少分号 ;")};return{ok:true,next:i+2}}
if(v==="goto"){if(!ts[i+1]||ts[i+1].type!=="id"||!ts[i+2]||ts[i+2].v!==";")return{ok:false,error:csErr(source,t.at,"goto 后需要 标签名;")};return{ok:true,next:i+3}}
if(v==="case"){const r=csExpr(ts,i+1,end,names,false);if(!r.ok)return{ok:false,error:csErr(source,t.at,"case 表达式有误: "+r.error)};if(r.next>=end||ts[r.next].v!==":")return{ok:false,error:csErr(source,t.at,"case 后需要冒号")};return{ok:true,next:r.next+1}}
if(v==="default"){if(!ts[i+1]||ts[i+1].v!==":")return{ok:false,error:csErr(source,t.at,"default 后需要冒号")};return{ok:true,next:i+2}}
if(t.type==="id"&&ts[i+1]&&ts[i+1].v===":")return{ok:true,next:i+2};
if(csTypeStart(v,names)&&(v==="struct"||v==="enum"||v==="union"||v==="typedef"||v==="_Static_assert"||(ts[i+1]&&(ts[i+1].type==="id"||ts[i+1].v==="*"||ts[i+1].v==="(")))){const r=csDeclaration(ts,i,end,names,source);if(!r.ok)return r;return{ok:true,next:r.next}}
const r=csExpr(ts,i,end,names,true);if(!r.ok)return{ok:false,error:csErr(source,t.at,r.error)};if(r.next>=end)return{ok:false,error:csErr(source,t.at,"语句缺少分号 ;")};if(ts[r.next].v!==";")return{ok:false,error:csErr(source,ts[r.next].at,"语句缺少分号 ;（在 '"+ts[r.next].v+"' 前）")};return{ok:true,next:r.next+1}}
function csCompound(ts,start,endExclusive,names,source){let i=start;while(i<endExclusive){const r=csStatement(ts,i,endExclusive,names,source);if(!r.ok)return r;i=r.next}return{ok:true,next:endExclusive}}
function csTopItem(ts,i,end,names,source,fns){const t=ts[i];if(t.v==="#"){let le=source.indexOf("\n",t.at);while(le>0&&source[le-1]==="\\"){le=source.indexOf("\n",le+1)}if(le<0)le=source.length;let j=i+1;while(j<end&&ts[j].at<le)j++;return{ok:true,next:j}}if(!csTypeStart(t.v,names)&&t.type!=="id")return{ok:false,error:csErr(source,t.at,"无法识别的顶层内容: "+t.v)};const core=csDeclarationCore(ts,i,end,names,source);if(!core.ok)return core;const j=core.next;if(j>=end)return{ok:false,error:csErr(source,t.at,"顶层声明缺少分号 ;")};if(ts[j].v===";")return{ok:true,next:j+1};if(ts[j].v==="{"){const name=core.name;if(name){if(fns.has(name))return{ok:false,error:csErr(source,t.at,"函数 "+name+" 被重复定义")};fns.add(name)}const e=closeGroupRange(ts,j,end);if(e<0)return{ok:false,error:csErr(source,ts[j].at,"函数体的花括号没有闭合")};const c=csCompound(ts,j+1,e,names,source);if(!c.ok)return c;return{ok:true,next:e+1}}return{ok:false,error:csErr(source,ts[j].at,"顶层声明后缺少分号 ;")}}
function parseProgram(ts,source){const names=collectTypeNames(ts);const fns=new Set();const end=ts.length;let i=0;while(i<end){const r=csTopItem(ts,i,end,names,source,fns);if(!r.ok)return r;i=r.next}return{ok:true}}
function cIdent(clean,name){return new RegExp('(^|[^A-Za-z0-9_])'+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^A-Za-z0-9_]|$)').test(clean)}
function cHasType(clean,kind,name){return new RegExp('\\b'+kind+'\\s+'+name+'\\b').test(clean)}
function runCheckSpec(ts,source,spec){
 const bad=m=>({ok:false,message:'检查未通过：'+(m||(spec&&spec.message)||'还没有达到本关的要求，再对照示例改一改。')});
 const yes=m=>({ok:true,message:'结构检查通过：'+(m||(spec&&spec.ok)||'本关的代码要求都已满足。')});
 if(!spec)return yes('本关没有额外的结构要求，请在本机编译运行确认结果正确。');
 const clean=cMask(source);
 const main=func(ts,'main','int');
 const body=main?main.body:[];
 if(spec.include)for(const h of (Array.isArray(spec.include)?spec.include:[spec.include])){
  const esc2=h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(!new RegExp('^[ \\t]*#[ \\t]*include[ \\t]*<[ \\t]*'+esc2+'[ \\t]*>','m').test(clean))return bad('需要 #include <'+h+'>。');
 }
 if(spec.noInclude)for(const h of spec.noInclude){
  const esc2=h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(new RegExp('^[ \\t]*#[ \\t]*include[ \\t]*<[ \\t]*'+esc2+'[ \\t]*>','m').test(clean))return bad('本关不要使用 <'+h+'>。');
 }
 if(spec.main!==false&&!main)return bad('需要一个完整的 int main(void) { … }。');
 if(spec.return0&&!seq(body,['return','0',';']))return bad('main 结束前需要 return 0; 。');
 if(spec.seq)for(const p of spec.seq)if(!seq(body,p))return bad('还缺少这段写法：'+p.join(' ')+' 。');
 if(spec.seqAny){const hit=spec.seqAny.some(function(p){return seq(body,p)});if(!hit)return bad('需要用到其中一种写法：'+spec.seqAny.map(function(p){return p.join(' ')}).join('　或　')+' 。')}
 if(spec.calls)for(const c of spec.calls){
  const name=Array.isArray(c)?c[0]:c,needle=Array.isArray(c)?c[1]:null;
  const list=calls(spec.callsAnywhere?ts:body,name);
  if(!list.length)return bad('需要'+(spec.callsAnywhere?'在代码里':'在 main 里')+'调用 '+name+'()。');
  if(needle&&!list.some(function(x){return x.args[0]&&x.args[0].some(function(t){return String(t.v).indexOf(needle)>=0})}))return bad(name+'() 的用法还不对，本关要用到 '+needle+' 。');
 }
 if(spec.callCounts)for(const cc of spec.callCounts){
  const n=calls(ts,cc[0]).length;
  if(cc[1]&&n<cc[1])return bad(cc[0]+'() 至少要调用 '+cc[1]+' 次。');
  if(cc[2]&&n>cc[2])return bad(cc[0]+'() 不要超过 '+cc[2]+' 次。');
 }
 if(spec.forbid)for(const f of spec.forbid)if(cIdent(clean,f))return bad('本关请不要使用 '+f+' 。');
 const req=spec.require||{};
 if(req.if&&!ifs(ts).length)return bad('需要用到 if 判断。');
 if(req.switch&&!cIdent(clean,'switch'))return bad('需要用到 switch 。');
 if(req.for&&!cIdent(clean,'for'))return bad('需要用到 for 循环。');
 if(req.while&&!cIdent(clean,'while'))return bad('需要用到 while 循环。');
 if(req.doWhile&&!cIdent(clean,'do'))return bad('需要用到 do…while 循环。');
 if(req.loop&&!['for','while','do'].some(function(k){return cIdent(clean,k)}))return bad('需要用到循环。');
 if(req.array&&!/\w+\s*\[[^\]]*\]/.test(clean))return bad('需要用到数组（形如 int a[5];）。');
 if(req.pointer&&!/\w+\s*\*+\s*\w+/.test(clean))return bad('需要用到指针变量（形如 int *p;）。');
 if(req.malloc&&!cIdent(clean,'malloc')&&!cIdent(clean,'calloc')&&!cIdent(clean,'realloc'))return bad('需要用 malloc/calloc 申请动态内存。');
 if(req.free&&!cIdent(clean,'free'))return bad('申请了内存，就要用 free 释放。');
 if(req.struct&&!cHasType(clean,'struct',req.struct))return bad('需要定义 struct '+req.struct+' 。');
 if(req.enum&&!cHasType(clean,'enum',req.enum))return bad('需要定义 enum '+req.enum+' 。');
 if(req.union&&!cIdent(clean,'union'))return bad('需要用到 union 。');
 if(req.typedef&&!cIdent(clean,'typedef'))return bad('需要用到 typedef 。');
 if(req.file&&!cIdent(clean,'fopen'))return bad('需要用 fopen 打开文件。');
 if(req.recursion){
  const fnNames=(req.recursion===true)?null:req.recursion;
  const self=(fnNames||[]).some(function(fn){return new RegExp('\\b'+fn+'\\s*\\([^;]*\\)\\s*\\{').test(clean)&&new RegExp('\\b'+fn+'\\s*\\(').test(clean)});
  if(fnNames&&!self)return bad('需要用递归实现（函数内部调用自己）。');
  if(!fnNames&&!/(\w+)\s*\([^;{]*\)\s*\{[^}]*\b\1\s*\(/.test(clean))return bad('需要用递归实现（函数内部调用自己）。');
 }
 if(req.funcs)for(const fn of req.funcs){
  const re2=new RegExp('\\b[a-zA-Z_][A-Za-z0-9_ \\t\\*]*\\b'+fn+'\\s*\\([^;{]*\\)\\s*\\{');
  if(!re2.test(clean))return bad('需要自己定义一个 '+fn+'() 函数（不是只写声明）。');
 }
 if(spec.minStatements){
  const n=(clean.match(/;/g)||[]).length;
  if(n<spec.minStatements)return bad('代码还不够完整，本关至少需要 '+spec.minStatements+' 条语句。');
 }
 return yes();
}
function challengeResult(ts,source,level){
 const spec=(level&&level.check)||null;
 return runCheckSpec(ts,source,spec);
}
function validateChallenge(level,source){if(!source.trim())return{ok:false,message:'请先按本关要求写代码，再检查。'};const p=tokenizeChallengeC(source);if(p.error)return{ok:false,message:'代码还不能检查：'+p.error};const ts=p.tokens,stack=[],pairs={'(':')','{':'}','[':']'};for(const t of ts){if(t.type==="string"||t.type==="char")continue;const v=t.v;if(pairs[v])stack.push({v,at:t.at});else if(v===')'||v==='}'||v===']'){const prev=stack.pop();if(!prev||pairs[prev.v]!==v)return{ok:false,message:'检查未通过：括号或花括号没有按顺序配对。'}}}if(stack.length)return{ok:false,message:'检查未通过：还有未闭合的括号或花括号。'};const st=parseProgram(ts,source);if(!st.ok)return{ok:false,message:'结构检查未通过：'+st.error+'。请用语法完整、可以编译的 C 代码完成本关。'};return challengeResult(ts,source,level)}
function checkCode(){
 const ta=document.getElementById("codeAnswer");if(!ta)return;
 window.codeDraft=ta.value;saveEditorValue(ta);
 const result=validateChallenge(activeLevel,ta.value);
 codePassed=result.ok;window.codeFeedback=result.message;
 maybeComplete();
}
function playVictoryAnimation(level){
 const existing=document.querySelector(".victory-overlay");if(existing)existing.remove();
 const pieces=[[-145,-112,-35,0,"#6f91ee"],[-116,-150,48,35,"#ffd36b"],[-82,-128,125,70,"#59c99c"],[-42,-166,-20,15,"#a888f3"],[-4,-142,76,85,"#83b9ff"],[38,-161,-58,45,"#ffd36b"],[79,-129,38,110,"#59c99c"],[121,-151,148,25,"#7794f0"],[150,-94,-76,70,"#b58af4"],[-157,34,52,100,"#59c99c"],[-113,87,-42,40,"#ffd36b"],[-73,121,98,130,"#7794f0"],[-28,148,-95,55,"#80b9ff"],[26,132,44,120,"#59c99c"],[72,104,-30,20,"#ffd36b"],[118,70,115,95,"#a888f3"],[157,22,-55,60,"#83b9ff"]];
 const confetti=pieces.map(function(p){return '<i style="--piece-x:'+p[0]+'px;--piece-y:'+p[1]+'px;--piece-rotation:'+p[2]+'deg;--piece-delay:'+p[3]+'ms;--piece-color:'+p[4]+'"></i>'}).join("");
 const overlay=document.createElement("div");overlay.className="victory-overlay";
 overlay.innerHTML='<div class="victory-confetti" aria-hidden="true">'+confetti+'</div><section class="victory-card" role="status" aria-live="polite"><div class="victory-medal" aria-hidden="true">✓</div><div class="victory-kicker">LEVEL CLEARED · '+String(level.id).padStart(2,"0")+'</div><h2 class="victory-title">'+esc(level.title)+'</h2><p class="victory-copy">本关通关成功，继续保持这个节奏。</p><span class="victory-reward">✦ 学习点 +30</span><div class="victory-actions"><button type="button" class="btn btn-primary btn-small victory-next" data-action="next-level">下一关&nbsp; →</button><button type="button" class="victory-dismiss">留在本关</button></div></section>';
 document.body.appendChild(overlay);
 let closed=false;let timer=window.setTimeout(close,2200);
 function close(){if(closed)return;closed=true;window.clearTimeout(timer);overlay.classList.add("is-leaving");window.setTimeout(function(){overlay.remove()},430)}
 overlay.querySelector(".victory-dismiss").addEventListener("click",close);
  var __vn=overlay.querySelector(".victory-next");if(__vn)__vn.addEventListener("click",function(){close()});
}
function normOut(t){return String(t||"").replace(/\r\n?/g,"\n").split("\n").map(function(x){return x.replace(/\s+/g," ").trim()}).join("\n").replace(/^\n+/,"").replace(/\n+$/,"")}
function compareOutput(expected,got){
 const e=normOut(expected),g=normOut(got);
 if(!g)return {ok:false,message:"还没有填入运行结果。"};
 if(e===g)return {ok:true,message:"运行结果与预期完全一致。"};
 const el=e.split("\n"),gl=g.split("\n"),n=Math.max(el.length,gl.length);
 for(let i=0;i<n;i++){if((el[i]||"")!==(gl[i]||""))return {ok:false,message:"第 "+(i+1)+" 行不一致：预期「"+(el[i]===undefined?"（没有这一行）":el[i])+"」，你的是「"+(gl[i]===undefined?"（没有这一行）":gl[i])+"」。"}}
 return {ok:false,message:"和预期还有差别，再对比一下。"};
}
function cQuizOk(l){
 if(l.questions&&l.questions.length){return questionsRatioOk(l,ensureTaskState(l))}
 return quizPassed;
}
function cOutputOk(l){
 if(!l.expectedOutput)return true;
 const got=data.runOutputs&&data.runOutputs[l.id];
 return !!got&&compareOutput(l.expectedOutput,got).ok;
}
function cReady(l){return cQuizOk(l)&&codePassed&&cOutputOk(l)}
function maybeComplete(){
 const l=activeLevel;if(!l)return;
 if(isDone(l)){render();return}
 if(cReady(l)){
  data.completed[l.id]={at:Date.now()};data.xp+=30;save();playVictoryAnimation(l);
  if(completedCount()===levels.length){setTimeout(function(){activeLevel=null;page="summary";render()},950)}else{render()}
  return;
 }
 render();
 const miss=[];
 if(!cQuizOk(l))miss.push(l.questions&&l.questions.length?"知识快问还没达标":"知识快问还没答对");
 if(!codePassed)miss.push("代码结构检查还没通过");
 if(!cOutputOk(l))miss.push("运行结果还没比对一致");
 if(miss.length)toast("还差：" + miss.join("、") + "。");
}
function checkRunOutput(){
 const l=activeLevel;if(!l||!l.expectedOutput)return;
 const ta=document.getElementById("runOutput");if(!ta)return;
 data.runOutputs=data.runOutputs||{};data.runOutputs[l.id]=ta.value;save();
 const cmp=compareOutput(l.expectedOutput,ta.value);
 if(cmp.ok&&cReady(l)){maybeComplete();return}
 render();
 if(!cmp.ok)toast("再对一下：" + cmp.message);
 else if(!codePassed)toast("运行结果对了，但代码结构检查还没通过，先点「检查代码」。");
 else toast("运行结果对了，知识快问还没达标。");
}
function checkCode(){
 const ta=document.getElementById("codeAnswer");if(!ta)return;
 window.codeDraft=ta.value;saveEditorValue(ta);
 const result=validateChallenge(activeLevel,ta.value);
 codePassed=result.ok;window.codeFeedback=result.message;
 if(codePassed&&activeLevel.expectedOutput&&!cOutputOk(activeLevel)){
  window.codeFeedback=result.message+" 别忘了把本机运行结果粘贴到下方「运行结果比对」里。";
 }
 maybeComplete();
}
