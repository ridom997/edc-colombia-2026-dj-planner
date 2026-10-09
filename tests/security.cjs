// Local checks only; Node built-ins, no npm dependencies or downloads.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'DJs_EDC_Colombia_2026.js'),'utf8');
const ctx=vm.createContext({app:{CreateWebView(){}},console});vm.runInContext(source.replace('await run();Script.complete();','return {C,DATA,read,write,planner,importPlan,parseImport};'),ctx);
let checks=0;const check=f=>{f();checks++;};
for(const s of ['', 'abc','Electrónica 🌈','a'.repeat(10000)])check(()=>assert.equal(ctx.edcSHA256(s),crypto.createHash('sha256').update(s).digest('hex')));
check(()=>assert.equal(ctx.edcCheckText(source).status,'ok'));check(()=>assert.equal(ctx.edcCheckText(source+' ').status,'changed'));
(async()=>{
 const files=new Map(),fm={documentsDirectory:()=>'/private',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),createDirectory:p=>files.set(p,''),readString:p=>files.get(p),writeString:(p,s)=>files.set(p,s),fileSize:p=>Buffer.byteLength(files.get(p)||'')/1000};let web,selected='/input.json',reads=0;
 class W{constructor(){web=this;}async loadHTML(){}async present(){}async evaluateJavaScript(){}}
 class A{addTextField(){this.hasInput=true;}textFieldValue(){return files.get(selected);}addAction(){}addCancelAction(){}async presentAlert(){return 0;}}
 let links=[];const api=await ctx.edcRun({local:()=>fm},A,W,{present:async()=>{}},{open:async()=>[selected]},{open:u=>links.push(u)},{});
 for(const [input,expected] of [[50,50],[160,160],[0,100],[200,100]])check(()=>assert.equal(api.C.settings({zoom:input}).zoom,expected));
 const atom=api.DATA.days[0].atoms[0],state={version:5,choices:{[atom.id]:[atom.ids[0]]}};
 for(const bad of [null,[],{}, {version:5,choices:[]},{version:5,choices:{oops:[]}},{version:5,choices:{[atom.id]:[atom.ids[0],atom.ids[0]]}},{version:5,choices:{[atom.id]:['<script>globalThis.pwned=1</script>']}},JSON.parse('{"version":5,"choices":{"__proto__":[]}}'),JSON.parse('{"version":5,"choices":{"constructor":[]}}')])check(()=>assert.throws(()=>api.C.validate(bad)));
 const long=Object.values(api.DATA.sets).find(s=>s.end>Math.floor(s.start/60)*60+60),hour=Math.floor(long.start/60)*60,next=hour+60;
 let mine=api.C.empty();for(const a of api.C.atoms.filter(a=>a.start>=hour&&a.start<next&&a.ids.includes(long.id)))mine=api.C.toggle(mine,[a.id],long.id);
 const prior=JSON.stringify(mine.choices),paused=api.C.pause(mine,long.id,next),expanded=api.C.expanded(paused);
 check(()=>assert.equal(JSON.stringify(paused.choices),prior));check(()=>assert.equal(api.C.carried(paused,long.id,next),false));check(()=>assert(api.C.atoms.filter(a=>a.start>=next&&a.start<next+60&&a.ids.includes(long.id)).every(a=>!(expanded.choices[a.id]||[]).includes(long.id))));
 check(()=>assert.equal(JSON.stringify(api.C.expanded(api.C.pause(paused,long.id,next,false)).choices),JSON.stringify(api.C.expanded(mine).choices)));
 for(const skips of [null,[],{bad:[]},{[atom.id]:['bad']},{[atom.id]:[atom.ids[0],atom.ids[0]]},{[atom.id]:[atom.ids[0]]}])check(()=>assert.throws(()=>api.C.validate({...state,skips})));
 api.write('mine',paused);check(()=>assert.equal(JSON.stringify(api.read('mine').state),JSON.stringify(paused)));check(()=>assert.equal(api.C.carried(api.read('mine').state,long.id,next),false));
 api.write('final',state);const before=JSON.stringify(api.read('final'));await api.planner();
 const send=msg=>web.shouldAllowRequest({url:'edcapp://message?data='+encodeURIComponent(JSON.stringify(msg))});
 check(()=>assert.equal(web.shouldAllowRequest({url:'https://evil.invalid'}),false));check(()=>assert.equal(web.shouldAllowRequest({url:'javascript:alert(1)'}),false));check(()=>assert.equal(web.shouldAllowRequest({}),false));
 send({type:'save',revision:1,profiles:{mine:state,final:api.C.empty()},settings:{}});check(()=>assert.equal(JSON.stringify(api.read('final')),before));
 for(const x of [null,[],{type:'shell',command:'anything'},{type:'spotify',set:'__proto__',index:0},{type:'credit',target:'https://evil.invalid'}])check(()=>assert.equal(send(x),false));check(()=>assert.equal(links.length,0));
 for(const [target,url] of [['paramo','https://www.instagram.com/paramopresenta/'],['insomniac','https://www.instagram.com/insomniacevents/'],['edcweb','https://colombia.edc.com/'],['edcinstagram','https://www.instagram.com/edc_colombia/']]){send({type:'credit',target});check(()=>assert.equal(links.pop(),url));}send({type:'credit',target:'instagram'});check(()=>assert.equal(links.pop(),'https://www.instagram.com/pedroridz997/'));send({type:'credit',target:'github'});check(()=>assert.deepEqual(links,['https://github.com/ridom997/edc-colombia-2026-dj-planner']));
 const packet={app:'edc-co-2026@'+api.DATA.scheduleVersion,v:1,kind:'personal',choices:state.choices};
 for(const value of ['', ' ', 'null','[]','{bad',JSON.stringify({...packet,choices:{bad:['x']}}),'x'.repeat(250001)])check(()=>assert.throws(()=>api.parseImport(value,'final')));check(()=>assert.equal(JSON.stringify(api.read('final')),before));
 files.set(selected,JSON.stringify(packet));await api.importPlan('final');check(()=>assert.equal(JSON.stringify(api.read('final').state),JSON.stringify(api.C.validate(state))));check(()=>assert.equal({}.pwned,undefined));
 const shipped=['core.js','ui.js','native.js','android.js','integrity.js'].map(n=>fs.readFileSync(path.join(root,'src',n),'utf8')).join('\n');for(const pattern of [/\beval\s*\(/,/new\s+Function\s*\(/,/\bfetch\s*\(/,/XMLHttpRequest/,/\.innerHTML\s*=/,/child_process/,/importModule\s*\(/])check(()=>assert(!pattern.test(shipped),String(pattern)));
 console.log('PASS '+checks+' security assertions. Not an antivirus scan or proof of complete security.');
})().catch(e=>{console.error(e);process.exitCode=1});
