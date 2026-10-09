// DroidScript adapter. All schedule content is bundled; the WebView has no app API.
function edcAndroidRuntime(){
 const base=app.GetPrivateFolder('DJsEDCColombia2026');
 const fm={documentsDirectory:()=>base,joinPath:(a,b)=>a+'/'+b,
 fileExists:p=>app.FileExists(p)||app.FolderExists(p),createDirectory:p=>app.MakeFolder(p),
 readString:p=>app.ReadFile(p,'UTF-8'),writeString:(p,s)=>app.WriteFile(p,s,'','UTF-8'),
 fileSize:p=>app.GetFileSize(p)/1000};
 class AndroidAlert{
  constructor(){this.actions=[];this.title='';this.message='';this.cancel=null;}
  addAction(s){this.actions.push(s);}addCancelAction(s){this.cancel=s;}
  presentAlert(){return this.presentSheet();}
  presentSheet(){return new Promise(resolve=>{
   const dlg=app.CreateDialog(this.title),lay=app.CreateLayout('Linear','Vertical');
   const scroll=app.CreateScroller(.88,.70),body=app.CreateLayout('Linear','Vertical');
   scroll.AddChild(body);lay.AddChild(scroll);dlg.AddLayout(lay);
   const txt=app.CreateText(this.message,.82,-1,'Multiline,Left');txt.SetTextSize(15);body.AddChild(txt);
   let done=false;const finish=n=>{if(done)return;done=true;dlg.Dismiss();resolve(n);};
   this.actions.forEach((label,i)=>{const b=app.CreateButton(label,.82,-1);b.SetOnTouch(()=>finish(i));body.AddChild(b);});
   if(this.cancel!==null){const b=app.CreateButton(this.cancel,.82,-1);b.SetOnTouch(()=>finish(-1));body.AddChild(b);}
   dlg.SetOnCancel(()=>finish(-1));dlg.Show();
  });}
 }
 class AndroidWebView{
  async loadHTML(html){
   this.lay=app.CreateLayout('Linear','Vertical,FillXY');
   const back=app.CreateButton('Menu / Menú',1,.065);this.lay.AddChild(back);
   this.web=app.CreateWebView(1,.935,'NoApp,NoLocate,NoCapture,NoLongTouch');this.lay.AddChild(this.web);
   back.SetOnTouch(()=>this.close());
   this.web.SetOnConsole(message=>{if(typeof message==='string'&&message.length<=180000&&typeof this.shouldAllowRequest==='function'&&message.startsWith('EDCMSG:'))this.shouldAllowRequest({url:'edcapp://message?data='+encodeURIComponent(message.slice(7))});});
   this.web.SetOnError(message=>app.ShowPopup('Could not load / No se pudo cargar: '+String(message)));
   this.html=html.replace("location.href='edcapp://message?data='+encodeURIComponent(JSON.stringify(cmd));","console.log('EDCMSG:'+JSON.stringify(cmd));");
  }
  present(){return new Promise(resolve=>{this.resolve=resolve;edcAndroidClose=()=>this.close();app.AddLayout(this.lay);this.web.LoadHtml(this.html,'file:///Sys/');});}
  close(){if(!this.resolve)return;const done=this.resolve;this.resolve=null;edcAndroidClose=null;this.web.Stop();app.DestroyLayout(this.lay);done();}
  async evaluateJavaScript(code){this.web.Execute(code);}
 }
 return [{local:()=>fm},AndroidAlert,AndroidWebView,
  {present:async files=>{app.SendFile(files[0],'DJs EDC Colombia 2026','','Share / Compartir');}},
  {open:()=>new Promise(resolve=>app.ChooseFile('Import JSON / Importar JSON','*/*',p=>resolve(p?[p]:[])))},
  {open:url=>{if(url.startsWith('https://open.spotify.com/search/')||url==='https://github.com/ridom997/edc-colombia-2026-dj-planner'||url==='https://www.instagram.com/pedroridz997/'||url==='https://colombia.edc.com/'||url==='https://www.instagram.com/edc_colombia/'||url==='https://www.instagram.com/paramopresenta/'||url==='https://www.instagram.com/insomniacevents/')app.OpenUrl(url);}},
  {complete:()=>app.Exit()}];
}
var edcAndroidClose=null,edcAndroidStarted=false;
function OnStart(){if(edcAndroidStarted)return;edcAndroidStarted=true;edcRun(...edcAndroidRuntime()).catch(e=>app.Alert(String(e),'DJs EDC Colombia 2026'));}
function OnBack(){if(edcAndroidClose)edcAndroidClose();}
