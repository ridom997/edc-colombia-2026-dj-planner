from pathlib import Path
import json,hashlib,zipfile
root=Path(__file__).resolve().parent/'src';data=json.loads((root/'data.json').read_text());core=(root/'core.js').read_text();ui=(root/'ui.js').read_text()
html=(root/'ui.html').read_text().replace('__CORE__',core).replace('__UI__',ui)
payload={'data':data,'profiles':{'mine':{'version':5,'choices':{}},'other':None,'final':{'version':5,'choices':{}}},'settings':{},'preview':True}
(root/'preview.html').write_text(html.replace('__PAYLOAD__',json.dumps(payload,ensure_ascii=False).replace('<','\\u003c')))
body='const DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
body+='const HTML='+json.dumps(html,ensure_ascii=False)+';\n'+core+'\n'
body+=(root/'integrity.js').read_text()+'\n'
body+='async function edcRun(FileManager,Alert,WebView,ShareSheet,DocumentPicker,Safari,Script){\n'+(root/'native.js').read_text()+'\n}\n'
body+=(root/'android.js').read_text()+'\n'
body+="if(typeof app==='undefined'||typeof app.CreateWebView!=='function'){edcRun(FileManager,Alert,WebView,ShareSheet,DocumentPicker,Safari,Script).catch(e=>console.log(String(e)));}\n"
hashcode=hashlib.sha256(body.encode()).hexdigest()
en=(root/'tutorial-en.txt').read_text();es=(root/'tutorial-es.txt').read_text()
header='/*\n'+en+'\n────────────────────────\n\n'+es+'\nSHA-256 executable code / código ejecutable:\n'+hashcode+'\n*/\n'
header+='const TUTORIAL_EN='+json.dumps(en,ensure_ascii=False)+';\nconst TUTORIAL_ES='+json.dumps(es,ensure_ascii=False)+';\nconst CODE_HASH='+json.dumps(hashcode)+';\n'
script=header+'// BEGIN_APP_CODE\n'+body
(root/'DJs_EDC_Colombia_2026.js').write_text(script)
out=root.parent;out.mkdir(parents=True,exist_ok=True)
js=out/'DJs_EDC_Colombia_2026.js';js.write_text(script)
z=out/'DJs_EDC_Colombia_2026.zip'
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as archive:archive.write(js,js.name)
hashes={'executable':hashcode,'js':hashlib.sha256(js.read_bytes()).hexdigest(),'zip':hashlib.sha256(z.read_bytes()).hexdigest(),'js_bytes':js.stat().st_size,'zip_bytes':z.stat().st_size}
(root/'hashes.json').write_text(json.dumps(hashes,indent=2));print(json.dumps(hashes,indent=2))
