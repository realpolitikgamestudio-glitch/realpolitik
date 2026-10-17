/* ---------- Dosya 05 · Açık Dünya ----------
   Orta Doğu'nun 18 devletinden birini seçip duraklatılabilir gerçek zamanda yönetirsin: bütçe ve üretim, kara–hava–deniz
   birlikleri, füzeler, diplomasi, savaş ve barış. Sabit bir hikâye ya da bitiş yoktur; diğer devletleri yapay zekâ yönetir.
   Ana dosyanın 3B dünya haritası bu dosyada kullanılmaz: mod, od-harita.js'teki parsel resmini kendi tuvalinde çizer ve
   kendi arayüzünü ana oyunun üstüne açar. Veri: od-veri.js (ülkeler, birlikler, başlangıç kuvvetleri), od-harita.js (bölgeler).
   Zaman: bir adım bir oyun saatidir. Üretim süreleri saat, birlik hızları km/sa cinsindendir (od-veri.js). */
const OD={on:false,ready:false,S:null,U:{}};
/* ana oyunun durumuna köprü: modun içindeki S ve U adları kendi durumunu gösterir */
const ODMAIN={get:()=>S,ui:()=>U,reset:()=>{S=newGame();S.setup='modes'}};
(function(){
const M=ODMAP,V=ODV,RG=M.R,NR=RG.length,MW=M.W,MH=M.H;
const isL=r=>r>=0&&RG[r].t==='l',isS=r=>r>=0&&RG[r].t==='s';
const clamp=(v,a,b)=>v<a?a:v>b?b:v,rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const f1=v=>(Math.round(v*10)/10).toLocaleString('tr-TR'),f0=v=>Math.round(v).toLocaleString('tr-TR');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- harita verisinin hazırlanması ---------- */
/* şehir düzeltmesi: harita üreticisinde Gazimağusa noktası, sınırın güneyindeki "Gazimağusa (Güney)" parseline düşüyor.
   Bir şehir, adı "<şehir> (" ile başlayan bir parselde duruyor ve tam o adda başka bir parsel varsa oraya taşınır. */
for(const c of M.C){const r=RG[c[5]];if(r.n.startsWith(c[0]+' (')){const k=RG.findIndex(q=>q.t==='l'&&q.n===c[0]);if(k>=0){c[5]=k;c[1]=RG[k].x;c[2]=RG[k].y}}}
const cityFor=(name,c)=>{const all=M.C.filter(x=>x[0]===name);return all.find(x=>RG[x[5]].c===c)||all[0]||null};
const cityReg=(name,c)=>{const x=cityFor(name,c);return x?x[5]:-1};
const kmpp=y=>{const m=Math.log(Math.tan(Math.PI/4+M.LAT1*Math.PI/360))-y/M.K;return 6371/M.K*Math.cos(2*Math.atan(Math.exp(m))-Math.PI/2)};
const DK={};const dist=(a,b)=>{const k=a<b?a*1000+b:b*1000+a;let d=DK[k];if(d===undefined){const A=RG[a],B=RG[b];d=DK[k]=Math.hypot(A.x-B.x,A.y-B.y)*kmpp((A.y+B.y)/2)}return d};
const adjL=[],adjS=[];
for(let r=0;r<NR;r++){adjL[r]=[];adjS[r]=[];for(const [j] of RG[r].adj){if(RG[j].t==='l')adjL[r].push(j);else if(RG[j].t==='s')adjS[r].push(j)}}
const seaIdx=n=>RG.findIndex(r=>r.t==='s'&&r.n===n);
/* boğazlar: iki deniz arasındaki geçiş, şehrin bulunduğu parseli tutan ülkenin iznine bağlıdır */
const STRAIT={};
for(const b of V.BOGAZ){const a=seaIdx(b[0]),c=seaIdx(b[1]),cf=cityFor(b[2]),g=cf?cf[5]:-1;if(a<0||c<0)continue;
  if(!adjS[a].includes(c))adjS[a].push(c);if(!adjS[c].includes(a))adjS[c].push(a);STRAIT[a+'|'+c]=STRAIT[c+'|'+a]={g,n:b[3]}}
/* ekonomik ağırlık: her parsel 1 + şehirler + petrol; ülkenin GSYH'si başlangıçta kendi parsellerine bu ağırlıkla dağıtılır */
const CW=[0,6,3,1],RW=new Float32Array(NR),CITYIN=[];for(let r=0;r<NR;r++)CITYIN[r]=[];
for(const c of M.C){CITYIN[c[5]].push(c);RW[c[5]]+=CW[c[3]]||0}
for(let r=0;r<NR;r++)if(isL(r))RW[r]+=1+(RG[r].oil||0)*3+Math.min(2,RG[r].a/40000);
const ORIG={},TOTW={};for(const c of V.ORDER){ORIG[c]=[];TOTW[c]=0}
for(let r=0;r<NR;r++)if(isL(r)&&ORIG[RG[r].c]){ORIG[RG[r].c].push(r);TOTW[RG[r].c]+=RW[r]}
const GPW={};for(const c of V.ORDER)GPW[c]=V.C[c].gdp/TOTW[c];
const CAPR={};for(const c of V.ORDER)CAPR[c]=cityReg(V.CAP[c],c);
const ALLW=V.ORDER.reduce((s,c)=>s+TOTW[c],0);
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
/* oynanabilir ülkelerin renkleri: komşular birbirinden kolay ayrılsın diye veri dosyasındakinin yerine belirgin bir palet */
Object.entries({TUR:'#d7263d',IRN:'#11a38e',EGY:'#e8b730',SAU:'#3f9b3a',ISR:'#2f6fdf',IRQ:'#8a4fd0',SYR:'#a0522d',JOR:'#f07f1a',LBN:'#ff5fb0',PSE:'#7ad151',KWT:'#00c2e0',QAT:'#8d1b3d',BHR:'#ff8a65',ARE:'#c6d225',OMN:'#795548',YEM:'#4a5bd4',CYP:'#9bc8ff',KKTC:'#f4a3a3'}).forEach(([c,v])=>{if(V.C[c])V.C[c].col=v});
const COL={};for(const c of V.ORDER)COL[c]=hex(V.C[c].col);
/* isyancılar: hiçbir ülkeye bağlı olmayan, herkesle savaşta sayılan taraf (ayaklanmalarda ortaya çıkar) */
V.C.ISY={n:'İsyancılar',s:'İsyancılar',col:'#5d5d5d',pop:1,gdp:0,mil:0,ind:0,ad:0,stab:50,ws:50,gov:'—',mis:0,q:.7};COL.ISY=[93,93,93];
/* kıyı: denize komşu kara parselleri; limanı olan kıyı (şehirli kıyı parseli) gemi üretimi için gerekir */
const coastal=r=>adjS[r].length>0;
/* arazi sınıfı: varsa gerçek eğimden hesaplanmış olan (od-arazi.js, araclar/arazi-yap.py) */
if(typeof ODT!=='undefined')ODT.tr.forEach((t,r)=>{if(t&&RG[r])RG[r].tr=t});
const TERR=r=>V.T[RG[r].tr]||V.T.ova;

/* ---------- sabitler ---------- */
const DEF=[{n:'Kısıtlı',m:.7,st:.04,mp:.7,d:'Savunmaya ayrılan pay düşük, halk rahat.'},{n:'Olağan',m:1,st:0,mp:1,d:'Barış dönemi düzeni.'},
  {n:'Yüksek',m:1.6,st:-.05,mp:2,d:'Savunma bütçesi artar; istikrar yavaşça düşer.'},{n:'Savaş bütçesi',m:2.4,st:-.15,mp:3,d:'Bütün kamu harcaması orduya akar; istikrar hızla düşer.'}];
const SPD=[0,3,8,20];/* gerçek saniye başına oyun saati */
const MIS=['bekle','ust','des','bom'],MISN={bekle:'Üste bekle',ust:'Hava üstünlüğü',des:'Yakın destek',bom:'Bombardıman'};
const AYL=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const T0=Date.UTC(2026,0,1);
const dateOf=h=>{const d=new Date(T0+h*36e5);return `${d.getUTCDate()} ${AYL[d.getUTCMonth()]} ${d.getUTCFullYear()}`};
const hourOf=h=>String(h%24).padStart(2,'0')+':00';
const SHORT={SAU:'S. Arabistan',ARE:'BAE',CYP:'GKRY',KKTC:'KKTC'};
const NM=c=>V.C[c]?V.C[c].n:c,SN=c=>SHORT[c]||NM(c);
/* ülke adına ünlü uyumuyla ek: 'e' (yönelme), 'de' (bulunma), 'in' (ilgi). "…Emirlikleri", "…Yönetimi" gibi tamlamalar n kaynaştırmasıyla. */
function ek(c,k){const n=NM(c),l=n.toLocaleLowerCase('tr'),vs=l.match(/[aeıioöuü]/g)||['e'],v=vs[vs.length-1],back='aıou'.includes(v),
  endV='aeıioöuü'.includes(l[l.length-1]),poss=/(leri|imi|yeti)$/.test(l),hard='fstkçşhp'.includes(l[l.length-1]);
  if(k==='e')return n+"'"+(poss?'ne':endV?(back?'ya':'ye'):(back?'a':'e'));
  if(k==='de')return n+"'"+(poss?'nde':(hard?'t':'d')+(back?'a':'e'));
  return n+"'"+(poss||endV?'n':'')+{a:'ı',ı:'ı',o:'u',u:'u',e:'i',i:'i',ö:'ü',ü:'ü'}[v]+'n'}

/* ---------- durum ---------- */
let S=null;const U=OD.U;
const rk=(a,b)=>a<b?a+'|'+b:b+'|'+a;
const rel=(a,b)=>a===b?100:(S.rel[rk(a,b)]||0);
const addRel=(a,b,v)=>{if(a===b||!V.C[a]||!V.C[b])return;S.rel[rk(a,b)]=clamp(rel(a,b)+v,-100,100)};
const atWar=(a,b)=>a!==b&&!!a&&!!b&&(a==='ISY'||b==='ISY'||S.war.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a)));
const warOf=(a,b)=>S.war.find(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a));
const ally=(a,b)=>a===b||(!!a&&!!b&&S.allies.some(al=>al.m.includes(a)&&al.m.includes(b)));
const friend=(a,b)=>ally(a,b);
const enemiesOf=c=>V.ORDER.filter(x=>atWar(c,x));
const alive=c=>S.C[c]&&S.C[c].alive;
const truce=(a,b)=>(S.truce[rk(a,b)]||0)>S.h;
const canEnter=(o,r)=>isL(r)&&(S.ctl[r]===o||ally(o,S.ctl[r])||atWar(o,S.ctl[r])||access(o,S.ctl[r]));
const canStay=(o,r)=>isL(r)&&(S.ctl[r]===o||ally(o,S.ctl[r])||access(o,S.ctl[r]));
/* ---------- anlaşmalar ----------
   S.tr: {k,a,b,h}. Saldırmazlık paktı (nap), askerî geçiş izni (acc: b, a'nın birliklerine topraklarını açar), ticaret
   anlaşması (trd), savunma paktı (def). Savaş, iki taraf arasındaki bütün anlaşmaları bitirir. */
const TRN={nap:{n:'Saldırmazlık paktı',k:'Pakt',d:'İki taraf birbirine savaş açamaz. Bozan taraf istikrar ve itibar kaybeder.'},
  acc:{n:'Askerî geçiş izni',k:'Geçiş',d:'Birliklerin onun topraklarından geçebilir ve orada konaklayabilir.'},
  trd:{n:'Ticaret anlaşması',k:'Ticaret',d:'İki tarafın da bütçe geliri %4 artar (en çok üç anlaşma).'},
  def:{n:'Savunma paktı',k:'Savunma',d:'Biri saldırıya uğrarsa diğeri saldırgana savaş açar.'}};
const TR=()=>S.tr||(S.tr=[]);
const pair=(t,a,b)=>(t.a===a&&t.b===b)||(t.a===b&&t.b===a);
const hasTr=(a,b,k)=>!!S.tr&&S.tr.some(t=>t.k===k&&(k==='acc'?t.a===a&&t.b===b:pair(t,a,b)));
let ACC=null,ACCS=null,ACCV=-1;
const access=(o,c)=>{if(!S.tr||!S.tr.length||!o||!c)return false;if(ACCS!==S||ACCV!==(S.trv||0)){ACCS=S;ACCV=S.trv||0;ACC=new Set(S.tr.filter(t=>t.k==='acc').map(t=>t.a+'|'+t.b))}return ACC.has(o+'|'+c)};
function trAdd(k,a,b){if(hasTr(a,b,k))return;TR().push({k,a,b,h:S.h});S.trv=(S.trv||0)+1;addRel(a,b,5);if(mine(a)||mine(b))log(`${NM(a)} ile ${NM(b)} arasında ${TRN[k].n.toLocaleLowerCase('tr')} imzalandı.`,1)}
function trEnd(a,b,k){if(!S.tr)return;const n=S.tr.length;S.tr=S.tr.filter(t=>!(pair(t,a,b)&&(!k||t.k===k)));if(S.tr.length!==n){S.trv=(S.trv||0)+1;evict()}}
/* ---------- yapay zekâ kişilikleri ---------- */
const PERSN={saldırgan:'Saldırgan',temkinli:'Temkinli',fırsatçı:'Fırsatçı',sadık:'Sadık'};
const PERSD={saldırgan:'Zayıf komşusuna kolay savaş açar; anlaşmalara mesafelidir.',temkinli:'Savaştan kaçınır; saldırmazlık ve savunma paktlarına açıktır.',
  fırsatçı:'Başı dertte olan ülkelere saldırır; ticarete çok açıktır.',sadık:'Müttefiklerini yalnız bırakmaz; anlaşmalarını bozmaz.'};
const PERS0={TUR:'fırsatçı',IRN:'saldırgan',ISR:'saldırgan',SAU:'temkinli',EGY:'temkinli',SYR:'fırsatçı',IRQ:'fırsatçı',JOR:'sadık',LBN:'temkinli',PSE:'sadık',KWT:'temkinli',QAT:'fırsatçı',BHR:'sadık',ARE:'fırsatçı',OMN:'temkinli',YEM:'saldırgan',CYP:'sadık',KKTC:'sadık'};
const PERS=c=>PERS0[c]||'temkinli';
/* bir ülkenin sana karşı tutumu: kalemler ve toplam (anlaşma kabulünde kullanılır) */
function attitude(c){const me=S.me,L=[[Math.round(rel(c,me)),'mevcut ilişki']],P=PERS(c);
  const ce=V.ORDER.filter(x=>x!==c&&x!==me&&alive(x)&&(atWar(c,x)||rel(c,x)<-50)&&(atWar(me,x)||rel(me,x)<-50));if(ce.length)L.push([20,'ortak düşman: '+ce.map(SN).join(', ')]);
  let occ=0;for(let r=0;r<NR;r++)if(S.core[r]===c&&S.ctl[r]===me)occ++;
  if(occ)L.push([-25,`toprak anlaşmazlığı (${occ} bölgesini tutuyorsun)`]);else if(P==='saldırgan'&&neighbors(c).includes(me))L.push([-10,'sınır anlaşmazlığı']);
  if(cult(c)===cult(me))L.push([10,'ortak kültür']);
  const lp=landPower(me),lc=landPower(c);if(lp>lc*2){if(P==='temkinli')L.push([10,'güçlüne saygı']);else if(P==='saldırgan')L.push([-10,'tehdit algısı'])}
  const nt=(S.tr||[]).filter(t=>pair(t,c,me)).length;if(nt)L.push([8*nt,`${nt} anlaşma`]);
  if(V.ORDER.some(x=>x!==c&&ally(c,x)&&atWar(me,x)))L.push([-25,'müttefikiyle savaştasın']);
  const ag=(S.agg||{})[me]||0;if(ag)L.push([-Math.min(25,ag*6),'saldırgan dış politikan']);
  if(S.C[c]&&S.C[c].prep&&S.C[c].prep.t===me)L.push([-30,'sana karşı savaş hazırlığında']);
  if(S.pup[c]===me)L.push([15,'himayendeki kukla']);
  return L.filter(x=>x[0])}
const opinion=c=>attitude(c).reduce((s,x)=>s+x[0],0);
/* anlaşma kabulü: tutum, anlaşmanın gerektirdiği eşiği aşmalı; kişilik eşiği kaydırır */
function trWill(c,k){const P=PERS(c);let need={nap:5,acc:30,trd:-5,def:45}[k];
  if(P==='saldırgan'&&k!=='trd')need+=15;if(P==='temkinli'&&(k==='nap'||k==='def'))need-=10;if(P==='fırsatçı'&&k==='trd')need-=15;if(P==='sadık'&&k==='def')need-=10;
  if(k==='def'&&enemiesOf(S.me).length)need+=20;if(k==='trd'&&(S.tr||[]).filter(t=>t.k==='trd'&&(t.a===c||t.b===c)).length>=3)need+=40;return opinion(c)-need}
/* ---------- savaş gerekçesi ---------- */
const CBT={sinir:{n:'Sınır olayı',g:14,c:.05,d:'Sınırda çıkan bir çatışmayı kamuoyuna duyurursun.'},azin:{n:'Azınlığı koruma',g:24,c:.1,d:'Oradaki soydaşlarının haklarını savunduğunu ilan edersin.'},
  teror:{n:'Terörle mücadele',g:10,c:.08,d:'Ülkenin terör örgütlerine destek verdiğini ilan edersin (ilişki −20\'nin altındaysa).',req:c=>rel(S.me,c)<-20}};
function hasCB(a,b){const x=(S.cb||{})[a+'|'+b];return !!x&&x.done<=S.h&&x.until>S.h}
const LT=t=>V.U[t],AT=t=>V.A[t],ST=t=>V.S[t];

function newState(me){
  const s={story:'od',v:1,me,h:0,spd:1,own:[],ctl:[],dmg:{},C:{},rel:{},base:{},war:[],allies:V.ITT.map(a=>({n:a[0],m:a[1].slice()})),
    U:[],A:[],F:[],nid:1,log:[],truce:{},cool:{},over:null,won:0,ev:[]};
  for(let r=0;r<NR;r++){s.own[r]=s.ctl[r]=isL(r)?RG[r].c:null}
  for(const c of V.ORDER){const d=V.C[c];s.C[c]={tr:d.gdp*d.mil*.12,mp:d.pop*4,stab:d.stab,ws:d.ws,mis:d.mis,def:1,prod:[],alive:1,lost:0,kill:0,riot:0,law:'askeri',min:0}}
  migrate(s);
  for(const [a,b,v] of V.REL)if(V.C[a]&&V.C[b]){s.rel[rk(a,b)]=v;s.base[rk(a,b)]=v}
  S=s;
  for(const c in V.KARA)for(const [city,tp,n] of V.KARA[c]){const r=cityReg(city,c);if(r<0)continue;for(let i=0;i<n;i++)mkUnit(c,tp,r)}
  for(const c in V.HAVA)for(const [city,tp,n] of V.HAVA[c]){const r=cityReg(city,c);if(r<0)continue;for(let i=0;i<n;i++)mkWing(c,tp,r)}
  for(const c in V.DENIZ)for(const [sea,port,sh,name] of V.DENIZ[c]){const r=seaIdx(sea);if(r<0)continue;s.F.push({id:s.nid++,o:c,r,sh:Object.assign({},sh),dmg:0,name,path:[],prog:0,carry:[],land:null})}
  s.upk={};for(const c of V.ORDER){const raw=upkeepRaw(c);s.upk[c]=raw>0?Math.min(1,.55*budget(c)/raw):1}
  for(const c of V.ORDER)recalcFab(c);
  return s}
/* eski kayıtlara ve yeni oyuna sonradan eklenen alanlar */
function migrate(s){s.C.ISY=s.C.ISY||{tr:0,mp:0,stab:50,ws:50,mis:0,def:1,prod:[],alive:1,lost:0,kill:0,riot:0,law:'askeri'};
  if(!s.core)s.core=RG.map((r,i)=>r.t==='l'?r.c:null);s.res=s.res||[];s.cmp=s.cmp||[];s.rf=s.rf||{};s.ar=s.ar||[];s.pup=s.pup||{};if(!s.fb){s.fb=Array.from(FB0);s.fd=[];s.frp=[]}s.pupH=s.pupH||{};if(s.conf===undefined)s.conf=null;
  for(const c of V.ORDER){if(s.C[c]&&!s.C[c].law)s.C[c].law='askeri';if(s.C[c])initProd(s.C[c],c)}return s}
function mkUnit(o,tp,r){const u={id:S.nid++,o,tp,r,str:1,org:100,path:[],prog:0};S.U.push(u);return u}
function mkWing(o,tp,r){const w={id:S.nid++,o,tp,base:r,n:AT(tp).ucak,mis:'bekle',t:-1,mv:0};S.A.push(w);return w}

/* ---------- günlük ve bildirim ---------- */
function log(text,imp){S.log.unshift([S.h,text]);if(S.log.length>160)S.log.length=160;if(imp)toast(text)}
function toast(text,cls){const t=document.getElementById('odt');if(!t)return;
  /* aynı bildirim üst üste gelirse yeni satır açılmaz, sayaç artar */
  const f=t.firstChild;if(f&&f._tx===text&&!f.classList.contains('out')){f._n=(f._n||1)+1;f.innerHTML=text+` <b class="tn">×${f._n}</b>`;clearTimeout(f._to);f._to=setTimeout(()=>{f.classList.add('out');setTimeout(()=>f.remove(),450)},3400);return}
  const d=document.createElement('div');d.className='odtoast'+(cls?' '+cls:'');d.innerHTML=text;d._tx=text;t.prepend(d);
  while(t.children.length>2)t.lastChild.remove();d._to=setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),450)},3400);try{aSfx('toast')}catch(e){}}
/* ele geçirilen ve kaybedilen bölgeler birkaç saniye toplanıp tek satırda bildirilir */
const CN={g:[],l:[],t:0};
function capNote(k,r){CN[k].push(near(r));if(CN[k].length>40)CN[k].shift();if(!CN.t)CN.t=setTimeout(flushCN,2500)}
function flushCN(){CN.t=0;const f=(l,ic,col)=>l.length?`<span style="color:${col}">${ic}${l.length>1?' '+l.length+' bölge':''}</span> ${l.slice(0,2).join(', ')}${l.length>2?' +'+(l.length-2):''}`:'';
  const a=f(CN.g,'▲','#7fd1a8'),b=f(CN.l,'▼','#ff8a7a');CN.g=[];CN.l=[];if(a||b)toast([a,b].filter(Boolean).join(' &nbsp;·&nbsp; '),'cap')}
const rpick=a=>a[Math.floor(Math.random()*a.length)];
function popEv(e){S.ev.push(e);if(S.spd)U.wasSpd=S.spd;S.spd=0;dirty()}
const mine=o=>o===S.me;
const near=r=>RG[r].n;

/* ---------- ekonomi ---------- */
function gdpOf(c){let g=0;const I=S.inf||{};for(let r=0;r<NR;r++)if(S.ctl[r]===c)g+=RW[r]*GPW[RG[r].c]*(1-(S.dmg[r]||0))*rOut(r,c)*(1+.1*(I[r]||0));return g}
/* ---------- sanayi düzeyi: veri dosyasındaki değer + sanayi yatırımlarıyla kazanılan düzeyler ---------- */
const IND=c=>Math.min(5,V.C[c].ind+((S&&S.C&&S.C[c]&&S.C[c].ib)||0));
/* ---------- savaş masrafı: cephane, yakıt ve ikmal doğrudan hazineden düşer (çağrılardaki tutarların üçte ikisi) ---------- */
function wc(c,v){const C=S.C[c];if(!C)return;v*=2/3;C.tr-=v;C._wc=(C._wc||0)+v}
const rr=(a,b)=>a+Math.random()*(b-a);
/* ---------- petrol: petrollü bölgeler (● sayısı) tutan ülkeye günlük gelir getirir; fiyat olaylarla dalgalanır ---------- */
const OILB=.001;/* bir petrol puanının, fiyat çarpanı 1 iken günlük geliri (mlr $) */
function oilRev(c){let n=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c&&RG[r].oil)n+=RG[r].oil*(1-(S.dmg[r]||0));return n*OILB*(S.oil||1)}
const GULF=['IRN','SAU','ARE','KWT','QAT','BHR','OMN','IRQ'];let HZ=-2;
function oilDay(){if(HZ===-2)HZ=seaIdx('Hürmüz Boğazı');const p=S.oil||1,gw=S.war.some(w=>GULF.includes(w.a)||GULF.includes(w.b));
  const hz=HZ>=0&&(seaOf(HZ)==='~'||S.F.some(f=>f.r===HZ&&S.F.some(g=>g.r===HZ&&atWar(f.o,g.o))));
  const tgt=1+(gw?.35:0)+(hz?.4:0);let n=p+(tgt-p)*.03+rr(-.015,.015);
  if(Math.random()<1/120){const sh=rr(-.3,.35);n+=sh;log(`Petrol piyasasında ${sh>0?'sert yükseliş':'sert düşüş'}: varil ${f0(75*clamp(n,.5,2.2))} $.`,oilRev(S.me)>.003)}
  S.oil=clamp(n,.5,2.2)}
/* ---------- yatırımlar ---------- */
const infCost=r=>(1.2+RW[r]*GPW[RG[r].c]*.3*(((S.inf||{})[r]||0)+1))/3;/* altyapı: bölge başına en çok 3 düzey, her biri bölge üretimine +%10, 365 gün */
const indCost=c=>6+3*IND(c);/* sanayi: 2 yıl, düzey +1 */
const repCost=r=>.05+RW[r]*GPW[RG[r].c]*(S.dmg[r]||0)*.15;/* hızlı onarım */
/* deniz denetimi (S.sc): navalHour her iki saatte bir hesaplar; '~' çekişmeli */
const seaOf=s=>(S.sc||{})[s];
const seaHostile=(s,c)=>{const o=seaOf(s);return !!o&&o!=='~'&&atWar(o,c)};
/* abluka: düşmanın denetlediği her kıyı denizi %5 (en çok %25); düşman denizaltılarının ticaret akını ayrıca (en çok %12) */
function blockParts(c){const seas=new Set();for(let r=0;r<NR;r++)if(S.ctl[r]===c)for(const s of adjS[r])seas.add(s);
  let b=0,sub=0;for(const s of seas){const hos=seaHostile(s,c)||(S.F.some(f=>f.r===s&&!f.path.length&&atWar(f.o,c))&&!S.F.some(f=>f.r===s&&friend(f.o,c)));if(hos)b++;
    for(const f of S.F)if(f.r===s&&f.sh.dz&&atWar(f.o,c))sub+=f.sh.dz}
  return [Math.min(.25,b*.05),Math.min(.12,sub*.015)]}
function blockade(c){const [b,s]=blockParts(c);return b+s}
/* bir denize kıyısı olan kara bölgeleri */
const SEAL=[];function seaLands(s){if(!SEAL[s]){SEAL[s]=[];for(let r=0;r<NR;r++)if(adjS[r]&&adjS[r].includes(s))SEAL[s].push(r)}return SEAL[s]}
function budget(c){const C=S.C[c],d=V.C[c];return gdpOf(c)*mobOf(c).gdp*d.mil*DEF[C.def].m*(1-blockade(c))*(C.stab<20?.75:1)*((C.riot||0)>S.h?.8:1)/365*(1+.04*Math.min(3,(S.tr||[]).filter(t=>t.k==='trd'&&(t.a===c||t.b===c)).length))}
/* bakım: birlik maliyetinin yılda %6–10'u; ülkenin fiyat düzeyiyle çarpılır (S.upk: başlangıçta bakım bütçenin en çok %55'i olacak biçimde) */
function upkeepRaw(c){let u=0;for(const x of S.U)if(x.o===c)u+=LT(x.tp).mal*.08;for(const w of S.A)if(w.o===c)u+=AT(w.tp).mal*.1*w.n/AT(w.tp).ucak;
  for(const f of S.F)if(f.o===c)for(const k in f.sh)u+=ST(k).mal*.06*f.sh[k];return u/365}
function upkeep(c){return upkeepRaw(c)*((S.upk&&S.upk[c])||1)}
const lines=c=>Math.min(6,1+IND(c));
const tmul=c=>1.5-.15*IND(c);
function costOf(c,k,tp){const d=V.C[c],ind=IND(c);if(k==='h')return ind<2?.55:.4;if(k==='u')return LT(tp).mal;if(k==='a')return AT(tp).mal*(ind<2&&tp!=='ih'?1.3:1)*(tp==='ih'&&TK(c,'iha')?.8:1);if(k==='s')return ST(tp).mal*(ind<1?1.3:1);if(k==='m')return MISC;return 0}
/* balistik füze: 10'luk paket; etkisi eskisinin iki katı, fiyatı da iki katı */
const MISC=.8;
function timeOf(c,k,tp){const b=k==='h'?1080:k==='u'?LT(tp).sure:k==='a'?AT(tp).sure:k==='s'?ST(tp).sure:240;return Math.round(b*tmul(c))}
function canBuild(c,k,tp){const d=V.C[c];
  if(k==='s'){if(!homePort(c))return 'Gemi için kendi kıyın ve limanın olmalı.';if(tp==='uc'&&IND(c)<3)return 'Sanayi en az 3 olmalı.';if((tp==='dz'||tp==='fk')&&IND(c)<1)return 'Sanayi en az 1 olmalı.'}
  if(k==='m'&&IND(c)<3&&V.C[c].mis<=0)return 'Füze programın yok (sanayi en az 3 olmalı).';
  if(k==='h'){if(S.ctl[+tp]!==c)return 'Batarya yalnızca kendi bölgene kurulur.';if(((S.hs||{})[+tp]||0)+S.C[c].prod.filter(x=>x.k==='h'&&+x.tp===+tp).length>=3)return 'Bir bölgeye en çok üç batarya kurulur.'}
  if(k==='u'&&S.C[c].mp<LT(tp).ins)return 'İnsan gücü yetmiyor.';
  if(S.C[c].tr<costOf(c,k,tp))return 'Hazine yetmiyor.';
  return ''}
function queue(c,k,tp){const why=canBuild(c,k,tp);if(why)return why;const C=S.C[c],cost=costOf(c,k,tp);C.tr-=cost;if(k==='u')C.mp-=LT(tp).ins;
  C.prod.push({k,tp,left:timeOf(c,k,tp),tot:timeOf(c,k,tp),cost});return ''}
function homePort(c){/* kıyıdaki şehirli parsellerden başkente en yakın olanın ilk denizi */
  let best=-1,bd=1e9;const cap=capOf(c);
  for(let r=0;r<NR;r++)if(S.ctl[r]===c&&S.own[r]===c&&adjS[r].length&&CITYIN[r].length){const d=cap>=0?dist(r,cap):0;if(d<bd){bd=d;best=r}}
  if(best<0)return null;return {r:best,sea:adjS[best][0]}}
function capOf(c){const r=CAPR[c];if(r>=0&&S.ctl[r]===c)return r;let best=-1,bw=-1;for(let r=0;r<NR;r++)if(S.ctl[r]===c&&S.own[r]===c&&RW[r]>bw){bw=RW[r];best=r}return best}
function spawn(c,it){const cap=capOf(c);if(cap<0)return;
  if(it.k==='u'){const u=mkUnit(c,it.tp,cap);u.org=60;if(mine(c))log(`${LT(it.tp).n} hazır: ${near(cap)}.`,1)}
  else if(it.k==='a'){mkWing(c,it.tp,cap);if(mine(c))log(`${AT(it.tp).n} hazır: ${near(cap)} üssü.`,1)}
  else if(it.k==='s'){const hp=homePort(c);if(!hp){S.C[c].tr+=it.cost*.5;return}let f=S.F.find(f=>f.o===c&&f.r===hp.sea&&!f.path.length&&!f.carry.length);
    if(!f){f={id:S.nid++,o:c,r:hp.sea,sh:{},dmg:0,name:'Yeni görev grubu',path:[],prog:0,carry:[],land:null};S.F.push(f)}f.sh[it.tp]=(f.sh[it.tp]||0)+1;if(mine(c))log(`${ST(it.tp).n} denize indirildi: ${RG[hp.sea].n}.`,1)}
  else if(it.k==='m'){S.C[c].mis+=10;if(mine(c))log('10 balistik füze stoğa girdi.',1)}
  else if(it.k==='h'){const r=+it.tp;if(S.ctl[r]!==c){S.C[c].tr+=it.cost*.5;return}S.hs=S.hs||{};S.hs[r]=(S.hs[r]||0)+1;OD.mver++;if(mine(c))log(`${near(r)}: hava savunma bataryası göreve başladı.`,1)}}

/* ---------- ordu üretimi: fabrikalar, teçhizat, tümen kurma, eğitim, seferberlik ----------
   Askerî fabrikalar üç teçhizat türüne paylaştırılır ve her gün depoya üretir (günlük işletme gideri, sanayiye göre verim).
   Kara tümenleri insan gücü ve depodaki teçhizatla kurulur, eğitim kampında bekler, seçilen bölgede sahaya çıkar.
   Hızlandırılmış eğitim yarı sürede biter ama tümen deneyimsizdir (savaşta ×0,75). Yıpranan tümenler depodan beslenir.
   Seferberlik yasası insan gücü tavanını ve artışını belirler; ekonomiden ve istikrardan bedeli vardır.
   Hava, deniz ve füze üretimi para ile sıraya konur (eski düzen). */
/* teçhizat kıt: fabrika verimi eskisinin %60'ı, ithalat %50 pahalı ve her tür için 20 günde bir sevkiyat */
const EQ={pt:{n:'Piyade teçhizatı',k:'piyade teçhizatı',out:.6,imp:.018,lot:100},za:{n:'Zırhlı araç',k:'zırhlı araç',out:.2,imp:.075,lot:20},tk:{n:'Tank',k:'tank',out:.1,imp:.18,lot:10}};
const IMPCD=20;
const FOP=.003;/* fabrika başına günlük işletme gideri (mlr $) */
const NEED={pi:{pt:240},mk:{pt:160,za:120},zh:{pt:80,tk:120},ok:{pt:180},dp:{pt:200,za:20},mi:{pt:100}};
const TRAIN={pi:120,mk:120,zh:120,ok:120,dp:120,mi:120};/* eğitim süresi (gün); hızlandırılmış eğitim yarısı */
const MOB=[{n:'Gönüllü ordu',cap:.005,rg:.6,gdp:1,st:.02,d:'Yalnızca gönüllüler: insan gücü tavanı nüfusun %0,5\'i, yavaş artar. Ekonomi ve halk rahat.'},
  {n:'Sınırlı askerlik',cap:.01,rg:1,gdp:.99,st:0,d:'Kısa süreli zorunlu askerlik: tavan nüfusun %1\'i.'},
  {n:'Kısmi seferberlik',cap:.02,rg:2,gdp:.96,st:-.03,d:'Yedekler çağrılır: tavan %2, hızlı artış. Ekonomi %4 küçülür, istikrar yavaşça düşer.'},
  {n:'Genel seferberlik',cap:.04,rg:3.5,gdp:.9,st:-.09,ws:40,d:'Bütün askerlik çağındakiler: tavan %4, çok hızlı artış. Ekonomi %10 küçülür, istikrar hızla düşer. Savaş desteği en az %40 olmalı.'}];
const MOB0={ISR:2,SYR:2,CYP:1,SAU:0,OMN:0,BHR:0,LBN:0,PSE:0,QAT:0,ARE:1,KWT:1};
const fab0=c=>Math.max(1,Math.round(V.C[c].gdp/132*(.5+V.C[c].ind/5)));
const fabEff=c=>.6+.1*IND(c)+(TK(c,'oto')?.15:0);
const trainSlots=c=>Math.min(7,2+IND(c));
const mobOf=c=>MOB[S.C[c].mob==null?1:S.C[c].mob];
const mpCap=c=>V.C[c].pop*1000*mobOf(c).cap;
/* ---------- bölgelerdeki fabrikalar ----------
   Fabrikalar şehirli bölgelerdedir. Her ülkenin yuvası başlangıç fabrikasının ~1,5 katıdır (kıt) ve şehir büyüklüğüne göre
   bölgelere dağılır (sanayi büyük şehirlerde yoğun: büyük şehir 12, orta 3, küçük 0,5 ağırlık, başkent +4). Bölgeyi kim tutuyorsa fabrikaları onun üretimine katılır.
   İşgalde fabrikaların dörtte biri yıkılır, kalanı hasarlı geçer ve bölge başına 30 günde bir fabrika onarılır.
   Füze ve bombardıman da fabrikaları hasarlar. Yüksek direnç bölgedeki fabrikaların verimini düşürür. */
const SLOT=new Int8Array(NR),FB0=new Int8Array(NR);
(function(){for(const c of V.ORDER){const rs=ORIG[c].filter(r=>CITYIN[r].length);if(!rs.length)continue;const f=fab0(c),tot=Math.ceil(f*1.5)+1,
    w=rs.map(r=>CITYIN[r].reduce((s,x)=>s+([0,12,3,.5][x[3]]||0),0)+(r===CAPR[c]?4:0)),W=w.reduce((a,b)=>a+b,0);
  const share=(n,cap)=>{const raw=w.map(x=>x/W*n),out=raw.map(Math.floor);let left=n-out.reduce((a,b)=>a+b,0);
    const ord=raw.map((x,i)=>[x-Math.floor(x),i]).sort((a,b)=>b[0]-a[0]);for(const [,i] of ord){if(left<=0)break;if(!cap||out[i]<cap[i]){out[i]++;left--}}
    while(left>0){let k=-1;for(let i=0;i<out.length;i++)if((!cap||out[i]<cap[i])&&(k<0||w[i]>w[k]))k=i;if(k<0)break;out[k]++;left--}return out};
  const sl=share(tot),fb=share(f,sl);rs.forEach((r,i)=>{SLOT[r]=sl[i];FB0[r]=fb[i]})}})();
function recalcFab(c){const C=S.C[c];if(!C||!C.al)return;let n=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c)n+=Math.max(0,(S.fb[r]||0)-(S.fd[r]||0));C.fab=n;
  let sum=C.al.pt+C.al.za+C.al.tk;while(sum>n){const k=['pt','za','tk'].sort((a,b)=>C.al[b]-C.al[a])[0];C.al[k]--;sum--}
  if(!mine(c))while(sum<n){C.al.pt++;sum++}}
function initProd(C,c){if(C.al)return;const ind=V.C[c].ind,f=fab0(c);C.fab=f;C.fabB=[];C.train=[];C.mob=MOB0[c]!=null?MOB0[c]:1;C.dep=-1;
  const za=ind>=1?Math.round(f*(ind>=3?.25:.3)):0,tk=ind>=3?Math.round(f*.25):0;C.al={pt:f-za-tk,za,tk};C.eq={pt:200+40*f,za:15*ind,tk:8*ind}}
function freeFab(C){return C.fab-C.al.pt-C.al.za-C.al.tk}
const fabPending=r=>V.ORDER.reduce((s,c)=>s+((S.C[c]&&S.C[c].fabB)||[]).filter(b=>b.r===r).length,0);
const freeSlot=r=>SLOT[r]-(S.fb[r]||0)-fabPending(r);
function fabRepairDay(){for(let r=0;r<NR;r++){if(!S.fd[r])continue;S.frp[r]=(S.frp[r]||30)-1;if(S.frp[r]<=0){S.fd[r]--;S.frp[r]=30;OD.mver++}}}
function fabHit(r,n){const ok=(S.fb[r]||0)-(S.fd[r]||0);if(ok<=0||n<=0)return;S.fd[r]=(S.fd[r]||0)+Math.min(ok,n);if(!S.frp[r])S.frp[r]=30;recalcFab(S.ctl[r]);OD.mver++}
function fabCapture(r,prev,nc){const n=S.fb[r]||0;if(!n)return;const lost=Math.floor(n*.25);S.fb[r]=n-lost;S.fd[r]=S.fb[r];S.frp[r]=30;recalcFab(prev);recalcFab(nc);OD.mver++;
  if(mine(nc))log(`${near(r)}: ${n} fabrikanın ${lost} tanesi yıkıldı, ${S.fb[r]} tanesi hasarlı olarak elimize geçti.`);else if(mine(prev))log(`${near(r)} düştü: ${n} fabrika kaybedildi.`)}
function eqDay(c){const C=S.C[c];
  for(const b of C.fabB)b.left--;const done=C.fabB.filter(b=>b.left<=0);
  if(done.length){C.fabB=C.fabB.filter(b=>b.left>0);for(const b of done){let r=b.r;if(!(r>=0&&S.ctl[r]===c&&SLOT[r]-(S.fb[r]||0)>0)){r=-1;for(let i=0;i<NR;i++)if(S.ctl[i]===c&&SLOT[i]-(S.fb[i]||0)>0){r=i;break}}
      if(r<0){C.tr+=fabCost(c)*.5;continue}S.fb[r]=(S.fb[r]||0)+1;if(mine(c))log(`${near(r)} bölgesinde yeni askerî fabrika üretime başladı.`,1)}recalcFab(c);if(mine(c))C.al.pt+=Math.max(0,freeFab(C));OD.mver++}
  /* yapay zekâ barışta depo doluysa fabrikaları dinlendirir */
  if(!mine(c)&&!enemiesOf(c).length&&!C._need&&C.eq.pt>500+60*C.fab)return;
  /* yapay zekâ fabrikaları net bütçesinin %80'ini aşmayacak oranda çalıştırır */
  const act=C.al.pt+C.al.za+C.al.tk;if(!act)return;const sc=mine(c)?1:clamp((budget(c)-upkeep(c))*.8/Math.max(1e-6,act*FOP),0,1),cost=act*FOP*sc;
  if(C.tr<cost){if(mine(c)&&!C._fw){log('Hazine yetmiyor: askerî fabrikalar durdu.',1);C._fw=1}return}C._fw=0;C.tr-=cost;
  /* direnç: halkı sana bağlı olmayan bölgelerdeki fabrikalar daha az üretir */
  let tot=0,eff=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c){const n=Math.max(0,(S.fb[r]||0)-(S.fd[r]||0));if(!n)continue;tot+=n;eff+=n*(S.core[r]===c?1:1-(S.res[r]||0)/100*.7)}
  const k=fabEff(c)*sc*(tot?eff/tot:1)*difK(c);for(const e in EQ)C.eq[e]+=C.al[e]*EQ[e].out*k}
function canRecruit(c,tp){const C=S.C[c],n=NEED[tp];if(C.mp<LT(tp).ins)return 'İnsan gücü yetmiyor.';
  for(const e in n)if((C.eq[e]||0)<n[e])return `Depoda ${EQ[e].k} yetmiyor (${Math.floor(C.eq[e]||0)} / ${n[e]}).`;
  if(C.train.length>=trainSlots(c))return 'Eğitim kampları dolu.';return ''}
function recruit(c,tp,rush){const why=canRecruit(c,tp);if(why)return why;const C=S.C[c],n=NEED[tp];for(const e in n)C.eq[e]-=n[e];C.mp-=LT(tp).ins;
  const days=Math.ceil(TRAIN[tp]*(rush?.5:1)/difK(c)*(TK(c,'egt')?.75:1));C.train.push({tp,left:days,tot:days,rush:rush?1:0});return ''}
function trainDay(c){const C=S.C[c];for(const t of C.train)t.left--;const ready=C.train.filter(t=>t.left<=0);if(!ready.length)return;C.train=C.train.filter(t=>t.left>0);
  for(const t of ready){let r=C.dep;if(!(r>=0&&S.ctl[r]===c))r=capOf(c);if(r<0)continue;const u=mkUnit(c,t.tp,r);u.org=70;if(t.rush)u.xp=.75;
    if(mine(c))log(`${LT(t.tp).n} eğitimini tamamladı${t.rush?' (hızlandırılmış)':''}: ${near(r)}.`)}
  /* aynı gün biten eğitimler tek bildirimde */
  if(mine(c)){const n=ready.length,r=C.dep>=0&&S.ctl[C.dep]===c?C.dep:capOf(c);if(r>=0)toast(n>1?`${n} tümen eğitimini tamamladı: ${near(r)}.`:`${LT(ready[0].tp).n} eğitimini tamamladı: ${near(r)}.`)}}
function importEq(c,e){const C=S.C[c],E=EQ[e],cost=E.imp*E.lot*(IND(c)<2?1:1.15)/difK(c)*((S.C[c].debt||0)>0&&credit(c).n==='C'?1.3:1),cd=(S.cool['im'+c+e]||0)-S.h;if(cd>0)return `Tedarikçiler yeni sevkiyatı ${Math.ceil(cd/24)} gün sonra yapabilir.`;
  if(C.tr<cost)return 'Hazine yetmiyor.';C.tr-=cost;C.eq[e]+=E.lot;S.cool['im'+c+e]=S.h+24*IMPCD;return ''}
/* fabrika kurma maliyeti: 0,67 mlr $'dan başlar, her mevcut fabrika %10 ekler */
const fabCost=c=>2/3*(1+(S.C[c].fab||0)/10);
/* ---------- deneyim: muharebe saatleri deneyim kazandırır; 20'de tecrübeli (+%10), 60'ta seçkin (+%25). Hızlı eğitilmiş
   (deneyimsiz) tümen tecrübeli olunca cezasından kurtulur ---------- */
const xpM=u=>(u.ex>=20&&(u.xp||1)<1?1:(u.xp||1))*(u.ex>=60?1.25:u.ex>=20?1.1:1);
const xpTag=u=>u.ex>=60?'<span class="tag al">Seçkin</span>':u.ex>=20?'<span class="tag tr">Tecrübeli</span>':(u.xp||1)<1?'<span class="tag">Acemi</span>':'';
/* komutan zaferleri: ordusunun saldırdığı bir savunma çözülünce zafer sayılır; 8×yıldız zaferde bir yıldız terfi (+3 saldırı, +3 savunma) */
function cmWin(att){const seen=new Set();for(const u of att){if(!u.ar||seen.has(u.ar))continue;seen.add(u.ar);const a=S.ar.find(x=>x.id===u.ar);if(!a||!a.cm)continue;const g=a.cm;g.cx=(g.cx||0)+1;
  if(g.st<3&&g.cx>=8*g.st){g.st++;g.atk+=3;g.def+=3;const P=GN[cult(S.me)]||GN.ar;g.rk=P[2][g.st];a.g=g.rk+' '+g.nm;log(`<b>${a.g}</b> zaferleriyle terfi etti (${'★'.repeat(g.st)}).`,1)}}}
/* ---------- teknoloji ağacı: aynı anda bir araştırma; sanayi düzeyi ve ön koşul ister ---------- */
const TECH={piy:{n:'Piyade modernizasyonu',d:'Piyade, komando ve milis savunması +%12.',c:2.5,g:150,ind:0},
  loj:{n:'Askerî lojistik',d:'Birliklerin hızı +%10, düzen toparlanması +%25.',c:2.5,g:150,ind:0},
  egt:{n:'Eğitim reformu',d:'Tümen eğitimi %25 daha kısa.',c:2,g:120,ind:0},
  iha:{n:'SİHA sürüleri',d:'SİHA filolarının yakın desteği +%50, fiyatı −%20.',c:3,g:150,ind:1},
  den:{n:'Deniz sistemleri',d:'Gemilerin ateş gücü +%20.',c:3,g:180,ind:1},
  tank:{n:'Modern tank',d:'Zırhlı ve mekanize tümenlerin saldırısı +%15.',c:4,g:200,ind:2},
  oto:{n:'Fabrika otomasyonu',d:'Askerî fabrika verimi +%15.',c:4,g:240,ind:2},
  fsav:{n:'Füze savunma kalkanı',d:'Füze önleme +%20; hava savunma bataryaları %50 daha etkili.',c:4,g:200,ind:2},
  fuz:{n:'Uzun menzilli füze',d:'Füze menzili 3.500 km, isabet hasarı +%25.',c:4,g:220,ind:3,req:'fsav'},
  giz:{n:'Gizli uçak',d:'Uçak kayıpları −%40.',c:6,g:300,ind:4,req:'iha'}};
const TK=(c,k)=>!!(S&&S.C[c]&&S.C[c].tech&&S.C[c].tech[k]);
function canTech(c,k){const t=TECH[k],C=S.C[c];if(TK(c,k))return 'Araştırıldı.';if(C.rs)return 'Başka bir araştırma sürüyor.';if(IND(c)<t.ind)return `Sanayi en az ${t.ind} olmalı.`;if(t.req&&!TK(c,t.req))return `Önce: ${TECH[t.req].n}.`;if(C.tr<t.c)return 'Hazine yetmiyor.';return ''}
function startTech(c,k){const why=canTech(c,k);if(why)return why;const C=S.C[c],t=TECH[k];C.tr-=t.c;C.rs={k,left:t.g};return ''}
/* ---------- vekâlet savaşı: bir ülkedeki isyancılara para ve silah (günde 10 mn $) ---------- */
const prxOn=(a,b)=>!!(S.prx&&S.prx[a+'|'+b]);
/* ---------- borç ve kredi notu: hazine eksiye düşerse fark borca yazılır; faiz kredi notuna bağlıdır ---------- */
function credit(c){const C=S.C[c],x=(C.debt||0)/Math.max(.01,budget(c)*365);return x<.15?{n:'AAA',r:.03}:x<.35?{n:'A',r:.05}:x<.6?{n:'B',r:.09}:{n:'C',r:.15}}
function buildFab(c,r){const C=S.C[c],k=fabCost(c);if(!(r>=0&&S.ctl[r]===c))return 'Fabrika yalnızca kendi tuttuğun bir bölgeye kurulabilir.';if(freeSlot(r)<=0)return `${near(r)} bölgesinde boş fabrika yuvası yok.`;
  if(C.tr<k)return 'Hazine yetmiyor.';if(C.fabB.length>=2)return 'Aynı anda en fazla iki fabrika kurulabilir.';C.tr-=k;C.fabB.push({left:30,r});return ''}
/* yapay zekâ: barışta ve zenginse boş yuvası olan en büyük şehre fabrika kurar */
function aiFab(c){const C=S.C[c];if(enemiesOf(c).length||C.fabB.length||C.tr<budget(c)*90+fabCost(c))return;let best=-1,bw=-1;
  for(let r=0;r<NR;r++)if(S.ctl[r]===c&&freeSlot(r)>0){const w=SLOT[r];if(w>bw){bw=w;best=r}}if(best>=0)buildFab(c,best)}
/* tümen yıpranınca depodan beslenir: güç %0,4 başına şablonun %0,4'ü kadar teçhizat ve insan */
function reinforce(u){const C=S.C[u.o],n=NEED[u.tp]||{pt:100},a=.004,need=LT(u.tp).ins*a;if(C.mp<need)return;for(const e in n)if((C.eq[e]||0)<n[e]*a)return;
  for(const e in n)C.eq[e]-=n[e]*a;C.mp-=need;u.str=Math.min(1,u.str+a);if(u.ex)u.ex*=.997}
/* yapay zekâ: savaşta ya da ordusu başlangıçtakinden küçükse teçhizata göre tümen kurar; zengin ve sanayisi zayıfsa ithal eder */
/* ---------- yapay zekâ: ekonomi ve silahlanma ----------
   Tehdit: komşuların kara gücü, ilişkiye göre ağırlıklı (savaşta, gerekçe hazırlayan ya da sınıra yığınak yapan komşu en ağır).
   İstenen güç kişiliğe göre tehdidin 0,9–1,15 katıdır; altında kalan ülke barışta da tümen kurar (bakım bütçenin %75'ini aşmadıkça). */
function aiThreat(c){let th=0,who=null;for(const t of neighbors(c)){if(!alive(t)||ally(c,t)||t==='ISY')continue;const r=rel(c,t);let k=r<-50?1:r<-20?.7:r<10?.4:.15;
    if(atWar(c,t))k=1.3;if(hasCB(t,c)||((S.C[t]||{}).prep||{}).t===c)k=Math.max(k,1.2);if(hasTr(c,t,'nap'))k*=.5;const p=landPower(t)*k;if(p>th){th=p;who=t}}return {th,who}}
function aiRecruit(c){const C=S.C[c],ind=IND(c),wars=enemiesOf(c).length;
  if(!wars&&!C._need)return;if(!wars&&upkeep(c)>budget(c)*.75)return;
  /* teçhizat yetmiyorsa ithal et (sevkiyat aralığına uyarak) */
  const plan=ind>=3?['zh','mk','pi']:ind>=1?['mk','pi']:['pi','mi'];
  for(const e of ['pt','za','tk']){const need=plan.reduce((s,tp)=>Math.max(s,(NEED[tp][e]||0)),0);if(need&&C.eq[e]<need&&C.tr>budget(c)*25+EQ[e].imp*EQ[e].lot)importEq(c,e)}
  for(let g=0;g<3;g++){const opts=plan.filter(tp=>!canRecruit(c,tp));if(!opts.length)break;recruit(c,opts[0],wars&&Math.random()<.3)}}
/* bütçe ve seferberlik: tehdit varsa yükselt, barışta indir; yenilen ülke savaş bütçesine geçer */
function aiPolicy(c,wars){const C=S.C[c],losing=wars.some(e=>score(c,e)<-20);
  C.def=wars.length?((losing&&C.stab>50)?3:(C.stab>40?2:1)):(C._need&&C.stab>55?2:1);
  let mob=MOB0[c]!=null?MOB0[c]:1;if(wars.length)mob=Math.max(mob,losing&&C.ws>=40&&C.stab>35?3:C.stab>40?2:1);else if(C._need&&C.stab>50)mob=Math.max(mob,2);
  if(!(MOB[mob].ws&&C.ws<MOB[mob].ws))C.mob=mob;if(C.mp>mpCap(c))C.mp=mpCap(c)}
/* fabrikaları ihtiyaca göre dağıt: hedef stoktan en çok eksik olan teçhizata ağırlık */
function aiAlloc(c){const C=S.C[c],ind=IND(c),war=enemiesOf(c).length>0,T={pt:500+(war?250:0),za:ind>=1?200:0,tk:ind>=3?(war?240:140):0},w={};let W=0;
  for(const e in T){w[e]=T[e]?Math.max(.15,(T[e]-C.eq[e])/T[e]+.25):0;W+=w[e]}if(!W||!C.fab)return;
  const al={pt:0,za:0,tk:0};let s=0;for(const e in w){al[e]=Math.floor(C.fab*w[e]/W);s+=al[e]}const ks=Object.keys(w).filter(e=>w[e]>0).sort((a,b)=>w[b]-w[a]);let k=0;while(s<C.fab&&ks.length){al[ks[k%ks.length]]++;s++;k++}C.al=al}
/* biriken parayı harca: fabrika → hava/deniz/batarya/füze → (barışta) sanayi ve altyapı yatırımı → hızlı onarım */
function aiSpend(c){const C=S.C[c],b=budget(c),war=enemiesOf(c).length>0,ind=IND(c);let left=C.tr-(b*30+.5);if(left<=0)return;
  if(!C.fabB.length&&left>fabCost(c)){let best=-1,bw=-1;for(let r=0;r<NR;r++)if(S.ctl[r]===c&&freeSlot(r)>0&&SLOT[r]>bw){bw=SLOT[r];best=r}if(best>=0){const k=fabCost(c);if(!buildFab(c,best))left-=k}}
  if(C.prod.length<lines(c)&&left>1.5){const wings=S.A.filter(w=>w.o===c).length,units=S.U.filter(u=>u.o===c).length,ships=S.F.filter(f=>f.o===c).reduce((s,f)=>s+fleetSize(f),0);let k=null,tp=null;
    if(wings<Math.max(2,units/3))k='a',tp=ind>=2?rpick(['cr','cr','av','bb','ih']):rpick(['ih','cr']);
    else if(homePort(c)&&ships<units/2)k='s',tp=ind>=3?rpick(['fk','dz','kv','cg']):ind>=1?rpick(['fk','kv','dz']):rpick(['kv','hb']);
    else if(ind>=2&&(war||C._need)){const cap=capOf(c);if(cap>=0&&((S.hs||{})[cap]||0)<2)k='h',tp=cap}
    if(k){const cost=costOf(c,k,tp);if(!queue(c,k,tp))left-=cost}}
  if(ind>=3&&C.mis<20&&left>MISC&&(war||C._need)&&!queue(c,'m','m'))left-=MISC;
  if(!war&&left>b*60){if(!C.ibB&&ind<5&&left>indCost(c)){const k=indCost(c);C.tr-=k;C.ibB=S.h+24*730;left-=k}
    else{let br=-1,bv=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c&&S.own[r]===c&&((S.inf||{})[r]||0)<3&&!(S.infB||{})[r]){const v=RW[r]*GPW[RG[r].c];if(v>bv){bv=v;br=r}}
      if(br>=0&&left>infCost(br)){const k=infCost(br);C.tr-=k;S.infB=S.infB||{};S.infB[br]=S.h+24*365;left-=k}}}
  if(left>.5)for(const k in S.dmg){const r=+k;if(S.ctl[r]===c&&!(S.rep&&S.rep[r])&&S.dmg[r]>.3&&left>repCost(r)){left-=repCost(r);C.tr-=repCost(r);S.rep=S.rep||{};S.rep[r]=1;break}}}
/* ---------- yapay zekâ: savaş hazırlığı ----------
   Savaş kararı veren ülke önce gerekçe hazırlar ve birliklerinin çoğunu hedef sınırına yığar (18–35 gün); oyuncu bunu görür.
   İlişki düzelirse ya da başka bir savaşa girerse hazırlık iptal olur. */
function aiPrep(c,t){const C=S.C[c],end=S.h+24*Math.round(rr(18,35));C.prep={t,end};S.cb=S.cb||{};S.cb[c+'|'+t]={k:'sinir',done:end,until:end+24*60,ai:1};
  if(mine(t)||neighbors(S.me).includes(c))log(`<b>${NM(c)}</b>, ${ek(t,'e')} karşı savaş gerekçesi hazırlıyor ve sınıra birlik yığıyor.`,mine(t)||ally(S.me,t))}
function aiStage(c,t){const border=[];for(let r=0;r<NR;r++)if(S.ctl[r]===c&&adjL[r].some(j=>S.ctl[j]===t))border.push(r);if(!border.length)return;
  const {d,pv}=dijk(c,border,false),bs=new Set(border),units=S.U.filter(u=>u.o===c&&!u.emb&&!u.path.length&&!bs.has(u.r)&&!isS(u.r));
  for(const u of units.slice(0,Math.ceil(units.length*.65))){if(d[u.r]>=1e12)continue;const p=[];for(let x=pv[u.r],g=0;x>=0&&g<60;x=pv[x],g++)p.push(x);if(p.length&&p.every(x=>canStay(c,x)))u.path=p}}
/* ---------- yapay zekâ: hava harekâtı ----------
   Menzil dışındaki filolar cepheye yakın (ama sınıra bitişik olmayan) şehirli bir üsse intikal eder. Avcılar ve her ülkenin ilk çok
   rollü filosu ana muharebe üzerinde hava üstünlüğü kurar; diğerleri kendi taarruzlarına yakın destek verir; bombardıman filoları
   düşmanın fabrikalı şehirlerini ve hava savunma bataryalarını vurur. */
function aiAir(c,wars,prepT){const foes=wars.length?wars:prepT?[prepT]:[];const ws=S.A.filter(w=>w.o===c);if(!ws.length)return;
  if(!foes.length){for(const w of ws){w.mis='bekle';w.t=-1}return}
  const front=frontRegions(c,foes);if(!front.length)return;const fr20=front.slice(0,24);
  const bases=[];for(let r=0;r<NR;r++)if(S.ctl[r]===c&&CITYIN[r].length&&!adjL[r].some(j=>foes.includes(S.ctl[j])))bases.push(r);
  const battles=(S.bat||[]).filter(b=>!b.sea&&(b.o===c||b.d===c)).sort((a,b)=>(b.A+b.D)-(a.A+a.D));
  let mainT=battles.length?battles[0].r:-1;if(mainT<0){let bn=-1;for(const r of front){const n=S.U.filter(u=>u.r===r&&foes.includes(u.o)).length;if(n>bn){bn=n;mainT=r}}}
  let ust=false;
  for(const w of ws){if(w.mv>0)continue;const d=AT(w.tp);if(!d.hv&&!d.yer)continue;const inR=r=>r>=0&&dist(w.base,r)<=d.men;
    if(!fr20.some(inR)){let b=-1,bd=1e12;for(const r of bases){let k=1e12;for(const f of fr20)k=Math.min(k,dist(r,f));if(k<d.men*.8&&k<bd){bd=k;b=r}}if(b>=0&&b!==w.base){w.mv=Math.ceil(dist(w.base,b)/600)+2;w.base=b;w.mis='bekle';w.t=-1}continue}
    if(!wars.length){w.mis='bekle';w.t=-1;continue}
    const anyT=inR(mainT)?mainT:front.find(inR);if(anyT==null){w.mis='bekle';w.t=-1;continue}
    if(d.hv>=1.2||!d.yer||(d.hv>=1&&!ust)){w.mis='ust';w.t=anyT;ust=true;continue}
    if(w.tp==='bb'&&Math.random()<.6){const H=S.hs||{};let bt=-1,bv=0;for(let r=0;r<NR;r++){if(!foes.includes(S.ctl[r])||!inR(r))continue;const v=(H[r]||0)*3+Math.max(0,(S.fb[r]||0)-(S.fd[r]||0));if(v>bv){bv=v;bt=r}}if(bt>=0){w.mis='bom';w.t=bt;continue}}
    const own=battles.filter(b=>inR(b.r)).sort((a,b)=>((b.o===c)-(a.o===c))||((b.A+b.D)-(a.A+a.D)))[0];w.mis='des';w.t=own?own.r:anyT}}
/* ---------- yapay zekâ: deniz harekâtı ----------
   Savaşta filolar düşman kıyısındaki denizlere çıkar (abluka, denizaltıyla ticaret akını), zayıf düşman filosuna saldırır, güçlüsünden
   limanına çekilir. Fırsat bulursa kıyıdaki birliklerini savunmasız bir düşman kıyısına çıkarır. Barışta filolar limana döner. */
function aiNavy(c){const wars=enemiesOf(c).filter(x=>x!=='ISY'),fs=S.F.filter(f=>f.o===c&&!f.carry.length&&!f.path.length&&!f.land);if(!fs.length)return;
  const pw=(r,en)=>S.F.filter(f=>f.r===r&&(en?atWar(c,f.o):friend(f.o,c))).reduce((s,f)=>s+fleetFire(f)+fleetSize(f),0),hp=homePort(c);
  if(!wars.length){for(const f of fs)if(hp&&f.r!==hp.sea&&Math.random()<.1){const p=path(c,f.r,hp.sea,1);if(p&&p.length)f.path=p}return}
  const coast=[];for(let s=0;s<NR;s++)if(isS(s)&&seaLands(s).some(r=>wars.includes(S.ctl[r])))coast.push(s);
  for(const f of fs){const my=fleetFire(f)+fleetSize(f);
    if(pw(f.r,1)>my*1.3&&hp&&hp.sea!==f.r){const p=path(c,f.r,hp.sea,1);if(p&&p.length){f.path=p;continue}}
    let best=null,bv=-1e9;for(const s of coast){const e=pw(s,1);if(e>my*1.1)continue;const p=s===f.r?[]:path(c,f.r,s,1);if(!p||p.length>8)continue;
      const v=(e>0?3:0)+(f.sh.dz?2:0)+seaLands(s).filter(r=>wars.includes(S.ctl[r])).reduce((a,r)=>a+RW[r],0)*.05-p.length*.5;if(v>bv){bv=v;best=p}}
    if(best&&best.length)f.path=best}
  aiLand(c,wars)}
function aiLand(c,wars){if(Math.random()>.15)return;const f=S.F.find(f=>f.o===c&&!f.path.length&&!f.carry.length&&fleetCap(f)>=2);if(!f)return;
  let src=-1,grp=null;for(const r of seaLands(f.r)){if(S.ctl[r]!==c)continue;const g=S.U.filter(u=>u.o===c&&u.r===r&&!u.emb&&!u.path.length&&u.org>60);if(g.length>=3){src=r;grp=g;break}}if(src<0)return;
  let t=-1,tv=-1e9,tp=null;for(let r=0;r<NR;r++){if(!isL(r)||!wars.includes(S.ctl[r])||!coastal(r))continue;const def=S.U.filter(u=>u.r===r&&atWar(c,u.o)).length;if(def>1)continue;
    const sea=adjS[r].find(s=>!seaHostile(s,c));if(sea==null)continue;const p=sea===f.r?[]:path(c,f.r,sea,1);if(!p||p.length>4)continue;const v=RW[r]-def*5-p.length;if(v>tv){tv=v;t=r;tp=p}}
  if(t<0)return;const go=grp.slice(0,Math.min(fleetCap(f),grp.length-1));for(const u of go){u.emb=f.id;u.r=f.r;u.path=[];u.prog=0;f.carry.push(u.id)}f.path=tp;f.prog=0;f.land=t;if(!tp.length)disembark(f);
  if(atWar(c,S.me)||mine(S.ctl[t]))log(`<b>${NM(c)}</b> ${near(t)} kıyısına çıkarma girişiminde bulunuyor.`,1)}
/* ---------- zorluk: yapay zekânın fabrika verimi, eğitim hızı ve ithalat fiyatı çarpanı ---------- */
const DIFN=['Kolay','Normal','Zor'],DIFKV=[.75,1,1.3];
const difK=c=>mine(c)||!S?1:DIFKV[S.dif==null?1:S.dif];

/* ---------- kuvvet hesapları ---------- */
const orgF=u=>.3+.7*u.org/100;
function atkP(u,r){const d=LT(u.tp),T=TERR(r);let p=d.sa*u.str*V.C[u.o].q*xpM(u)*orgF(u)*(T.sa*(1-d.sert)+T.zh*d.sert);if(d.dag&&RG[r].tr==='dag')p*=d.dag;if(isS(u.r))p*=d.amf?.8:.45;
  else if(u.r!==r&&crossRiver(u.r,r))p*=(cmOf(u)||{}).tr==='nehir'?.9:d.amf?.85:.75;/* nehir geçişi */const g=cmOf(u);if(g)p*=cmA(g,u,r);if(d.sert>=.5&&TK(u.o,'tank'))p*=1.15;return p}
function defP(u){const d=LT(u.tp);let p=d.sv*u.str*V.C[u.o].q*xpM(u)*orgF(u);if(S.own[u.r]===u.o)p*=1.2;if(d.dag&&RG[u.r].tr==='dag')p*=1.15;const g=cmOf(u);if(g)p*=cmD(g,u);if(d.sert<.3&&TK(u.o,'piy'))p*=1.12;return p}
function landPower(c){let p=0;for(const u of S.U)if(u.o===c)p+=(LT(u.tp).sa+LT(u.tp).sv)*.5*u.str*V.C[c].q;return p}
function bloc(c){return V.ORDER.filter(x=>alive(x)&&ally(c,x))}

/* ---------- yol bulma (ikili yığınla Dijkstra; ağırlık: yürüyüş süresi) ---------- */
function dijk(o,src,sea,to){const d=new Float64Array(NR).fill(1e12),pv=new Int32Array(NR).fill(-1),H=[];
  const push=(v,k)=>{H.push([k,v]);let i=H.length-1;while(i>0){const p=(i-1)>>1;if(H[p][0]<=H[i][0])break;const t=H[p];H[p]=H[i];H[i]=t;i=p}};
  const pop=()=>{const t=H[0],l=H.pop();if(H.length){H[0]=l;let i=0;for(;;){const a=2*i+1,b=a+1;let m=i;if(a<H.length&&H[a][0]<H[m][0])m=a;if(b<H.length&&H[b][0]<H[m][0])m=b;if(m===i)break;const x=H[m];H[m]=H[i];H[i]=x;i=m}}return t};
  for(const s of src){d[s]=0;push(s,0)}
  while(H.length){const [k,u]=pop();if(k>d[u])continue;if(u===to)break;
    for(const v of sea?adjS[u]:adjL[u]){
      if(sea){if(!isS(v))continue;const st=STRAIT[u+'|'+v];if(st&&st.g>=0&&atWar(o,S.ctl[st.g]))continue}
      else if(!canEnter(o,v))continue;
      const w=sea?dist(u,v):dist(u,v)/TERR(v).mv;if(k+w<d[v]){d[v]=k+w;pv[v]=u;push(v,d[v])}}}
  return {d,pv}}
function path(o,from,to,sea){if(from===to)return [];const {d,pv}=dijk(o,[from],sea,to);if(d[to]>=1e12)return null;const p=[];for(let x=to;x!==from;x=pv[x])p.unshift(x);return p}

/* ---------- savaş ve barış ---------- */
function declare(a,b,why,join){if(atWar(a,b)||a===b||!alive(a)||!alive(b))return;
  /* gerekçe, pakt ihlali ve anlaşmaların sonu */
  const cb=!join&&hasCB(a,b);if(cb&&S.cb)delete S.cb[a+'|'+b];const brokeNap=!join&&hasTr(a,b,'nap');trEnd(a,b);
  const unjust=!join&&!cb&&rel(a,b)>-30;S.war.push({a,b,h:S.h});OD.mver++;addRel(a,b,-40);
  if(unjust){S.C[a].stab-=6;S.C[a].ws-=8;S.agg=S.agg||{};S.agg[a]=(S.agg[a]||0)+1;for(const x of V.ORDER)if(x!==a&&x!==b&&alive(x))addRel(a,x,-4)}else S.C[a].ws+=4;S.C[b].ws+=10;
  if(brokeNap){S.C[a].stab-=10;for(const x of V.ORDER)if(x!==a&&alive(x))addRel(a,x,-8);log(`<b>${NM(a)}</b>, ${NM(b)} ile saldırmazlık paktını bozdu.`,mine(a)||mine(b))}
  if(cb&&(mine(a)||mine(b)))log(`${NM(a)} savaşı gerekçelendirdi: haklı savaş sayılıyor.`);
  log(`<b>${NM(a)}</b>, ${ek(b,'e')} savaş ilan etti.${why?' '+why:''}`,mine(a)||mine(b)||ally(S.me,a)||ally(S.me,b));
  if(mine(b))popEv({k:'war',a});
  /* savunma ittifakları: saldırıya uğrayanın müttefikleri saldırgana savaş açar */
  /* gerekçeli savaşta müttefiklerin yarısı (sadık olanlar hariç) savaşa girmez */
  for(const x of bloc(b))if(x!==b&&!ally(x,a)&&!atWar(x,a)&&(!cb||PERS(x)==='sadık'||Math.random()<.5))declare(x,a,`(${NM(b)} ile ittifak gereği)`,1);
  /* savunma paktları */
  for(const t of [...(S.tr||[])])if(t.k==='def'&&(t.a===b||t.b===b)){const x=t.a===b?t.b:t.a;if(x!==a&&alive(x)&&!ally(x,a)&&!atWar(x,a)&&(!cb||PERS(x)==='sadık'||Math.random()<.6))declare(x,a,`(${NM(b)} ile savunma paktı gereği)`,1)}
  /* saldırganın müttefikleri, hedefle araları kötüyse katılır (oyuncu kendi kararını verir) */
  for(const x of bloc(a))if(x!==a&&!mine(x)&&!ally(x,b)&&!atWar(x,b)&&(S.pup[x]===a||(rel(x,b)<-20&&(PERS(x)==='sadık'||Math.random()<.6))))declare(x,b,S.pup[x]===a?'(himaye gereği)':`(${NM(a)} yanında)`,1);
  dirty(1)}
function score(a,b){/* a'nın b'ye karşı savaş skoru (−100…+100) */
  let oa=0,ob=0;for(let r=0;r<NR;r++){if(S.own[r]===b&&S.ctl[r]===a)oa+=RW[r];if(S.own[r]===a&&S.ctl[r]===b)ob+=RW[r]}
  let s=100*oa/TOTW[b]-100*ob/TOTW[a];if(S.ctl[CAPR[b]]===a)s+=25;if(S.ctl[CAPR[a]]===b)s-=25;return clamp(s,-100,100)}
function makePeace(a,b,keep){/* keep: işgal edilen topraklar işgal edenin olur ('a' yalnızca a'nın işgalleri, 'both' iki taraf) */
  const w=warOf(a,b);if(!w)return;S.war=S.war.filter(x=>x!==w);OD.mver++;S.truce[rk(a,b)]=S.h+24*180;
  let n=0;for(let r=0;r<NR;r++){const o=S.own[r],c=S.ctl[r];
    if(o===b&&c===a){if(keep==='a'||keep==='both'){S.own[r]=a;n++}else S.ctl[r]=b}
    else if(o===a&&c===b){if(keep==='b'||keep==='both'){S.own[r]=b}else S.ctl[r]=a}}
  addRel(a,b,15);log(`<b>${NM(a)}</b> ile ${NM(b)} barış imzaladı${keep?' (işgal edilen topraklar el değiştirdi)':''}. 180 günlük ateşkes başladı.`,mine(a)||mine(b));
  evict();dirty(1)}
function evict(){/* barıştan sonra yabancı topraklarda kalan birlikler en yakın kendi bölgelerine çekilir */
  for(const u of S.U){if(u.emb||isS(u.r))continue;if(!canStay(u.o,u.r)&&!atWar(u.o,S.ctl[u.r])){const h=nearestOwn(u.o,u.r);if(h>=0){u.r=h;u.path=[];u.prog=0}}}
  for(const u of S.U)if(u.path.length&&!canEnter(u.o,u.path[0])){u.path=[];u.prog=0}
  for(const w of S.A)if(!canStay(w.o,w.base)){const h=capOf(w.o);if(h>=0)w.base=h;w.mis='bekle';w.t=-1}}
function nearestOwn(o,r){let best=-1,bd=1e12;for(let i=0;i<NR;i++)if(S.ctl[i]===o){const d=dist(r,i);if(d<bd){bd=d;best=i}}return best}
function capitulate(c){const C=S.C[c];if(!C.alive)return;
  /* oyuncu bu ülkeyle savaştaysa antlaşmayı o yapar (barış konferansı) */
  if(!mine(c)&&atWar(S.me,c)&&!S.conf){openConference(c);evict();dirty(1);return}
  if(S.pup[c]&&!mine(c)){const m=S.pup[c];delete S.pup[c];S.allies=S.allies.filter(al=>!(al.pup&&al.m.includes(c)));if(mine(m))log(`Kukla devletin ${NM(c)} düştü.`,1)}
  /* yapay zekâ kazananlar: en çok toprak tutan düşman kalanını alır */
  const occ={};for(let r=0;r<NR;r++)if(S.own[r]===c&&S.ctl[r]!==c)occ[S.ctl[r]]=(occ[S.ctl[r]]||0)+RW[r];
  const win=Object.keys(occ).sort((x,y)=>occ[y]-occ[x])[0];
  for(let r=0;r<NR;r++){if(S.own[r]===c){S.own[r]=S.ctl[r]===c?(win||c):S.ctl[r];S.ctl[r]=S.own[r]}if(S.ctl[r]===c&&win)S.ctl[r]=S.own[r]===c?win:S.own[r]}
  killState(c);
  log(`<b>${NM(c)} teslim oldu.</b> ${win?NM(win)+' ülkenin kalanını ilhak etti.':''}`,1);
  if(mine(c)){S.over='lost';popEv({k:'lost'})}else if(win&&mine(win))popEv({k:'cap',c});
  evict();dirty(1)}

/* ---------- saatlik adım ---------- */
function hour(){S.h++;
  /* üretim */
  for(const c of V.ORDER){const C=S.C[c];if(!C.alive||!C.prod.length)continue;const n=lines(c);for(let i=0;i<Math.min(n,C.prod.length);i++)C.prod[i].left--;
    for(let i=C.prod.length-1;i>=0;i--)if(C.prod[i].left<=0){const it=C.prod.splice(i,1)[0];spawn(c,it)}}
  /* hava görevleri */
  airHour();
  /* kara hareketi ve muharebe */
  const at=new Map();for(const u of S.U){if(u.emb)continue;let a=at.get(u.r);if(!a)at.set(u.r,a=[]);a.push(u)}
  const bat=new Map();S.bat=[];
  for(const u of S.U){if(u.emb||!u.path.length)continue;const n=u.path[0];
    if(!canEnter(u.o,n)){u.path=[];u.prog=0;continue}
    const there=at.get(n)||[],en=there.some(e=>atWar(u.o,e.o));
    if(en){let b=bat.get(n);if(!b)bat.set(n,b={r:n,att:[],def:new Set()});b.att.push(u);for(const e of there)if(atWar(u.o,e.o))b.def.add(e);continue}
    /* sefer hızı: od-veri.js'teki yol hızının %35'i (ikmal, mola, gece); nehir geçişi yavaşlatır */
    const T=TERR(n),km=isS(u.r)?25:dist(u.r,n)*(crossRiver(u.r,n)?1.3:1);u.prog+=LT(u.tp).hz*.35*T.mv*(.5+.5*u.org/100)/Math.max(1,km)*((cmOf(u)||{}).tr==='hiz'?1.15:1)*(U.it!=null?4:1)/* rehber kopyasında hızlı */*(TK(u.o,'loj')?1.1:1);
    if(u.prog>=1){const from=u.r;u.r=n;u.path.shift();u.prog=0;u.amph=0;
      at.get(from)&&at.set(from,at.get(from).filter(x=>x!==u));(at.get(n)||at.set(n,[]).get(n)).push(u);
      if(atWar(u.o,S.ctl[n]))occupy(n,u.o)}}
  for(const b of bat.values())battle(b,at);
  /* savaş masrafı: muharebedeki tümen saatte 0,15 mn $ (cephane, yakıt); düşman toprağındaki tümen ikmal için günde 0,8 mn $ */
  for(const b of bat.values()){for(const u of b.att)wc(u.o,.00015);for(const u of b.def)wc(u.o,.00015)}
  if(S.h%6===0)for(const u of S.U)if(!u.emb&&isL(u.r)&&!canStay(u.o,u.r))wc(u.o,.0002);
  /* toparlanma ve ikmal */
  if(S.h%2===0)for(const u of S.U){if(u.emb)continue;const inb=u.path.length&&bat.has(u.path[0]);if(inb)continue;
    const home=canStay(u.o,u.r),own=S.ctl[u.r]===u.o;u.org=Math.min(100,u.org+(home?(own?3:2):1)*((cmOf(u)||{}).tr==='loj'?1.5:1)*(TK(u.o,'loj')?1.25:1));
    if(home&&u.str<1&&S.C[u.o].eq)reinforce(u)}
  /* denizde kalmış birlikler (çıkarma başarısız) en yakın kıyıya çekilir */
  for(const u of S.U)if(!u.emb&&isS(u.r)&&!u.path.length){const h=nearestOwn(u.o,u.r);if(h>=0){u.r=h;u.org=10;u.str*=.85}}
  S.U=S.U.filter(u=>u.str>.04);
  navalHour();
  if(S.h%6===0){for(const c of V.ORDER)if(alive(c)&&!mine(c))aiMil(c);rebelAI()}
  if(S.h%12===6)for(const c of V.ORDER)if(alive(c)&&!mine(c))aiNavy(c);
  if(S.h%3===0){for(const a of S.ar)armyTick(a);airArmy();if(U.mm==='hava')airMarks()}
  if(S.h%24===0)day();
  dirty()}
function occupy(r,o){const prev=S.ctl[r],own=S.own[r];const nc=(own===o||ally(o,own))?own:o;if(nc===prev)return;S.ctl[r]=nc;markR(r);fabCapture(r,prev,nc);if(S.hs&&S.hs[r]){S.hs[r]=0;OD.mver++}S.dmg[r]=Math.min(.8,(S.dmg[r]||0)+.15);/* çatışma bölgeyi yıpratır */
  if(prev&&S.C[prev]){S.C[prev].stab-=RW[r]>4?2:.5;S.C[prev].ws-=1}if(S.C[o])S.C[o].ws+=.4;
  if(mine(o)||ally(S.me,o)){log(`${near(r)} ele geçirildi (${SN(prev)}).`);if(mine(o))capNote('g',r)}
  else if(mine(prev)||ally(S.me,prev)){log(`<b>${near(r)}</b> ${NM(o)} eline geçti.`);if(mine(prev))capNote('l',r);
    if(mine(prev)&&o==='ISY'&&(S.cool.isyU||0)<=S.h){S.cool.isyU=S.h+24*20;log(`⚠ İsyancılar ${near(r)} bölgesini ele geçirdi. Bir orduya <b>İsyancılar</b> cephesi atayıp taarruz başlatarak bastırabilirsin.`,1)}}}
function battle(b,at){const r=b.r,D=[...b.def];if(!D.length)return;
  let A=0,Dp=0;for(const u of b.att)A+=atkP(u,r);for(const u of D)Dp+=defP(u);
  /* hava desteği */
  const sa=b.att[0].o,sd=D[0].o;A+=airSupport(sa,r,sd);Dp+=airSupport(sd,r,sa);
  /* hava üstünlüğü: bölgede avcı (hava üstünlüğü görevi) gücü baskın olan taraf %15'e kadar güç kazanır */
  const ak=airSup(r,sa,sd);if(ak>0)A*=1+.15*ak;else if(ak<0)Dp*=1-.15*ak;
  S.bat.push({r,from:b.att.map(u=>u.r),A,D:Dp,o:sa,d:sd,as:ak});
  const ratio=clamp(A/(Dp+.01),.25,4),k=rnd(.75,1.25);
  for(const u of D)u.ex=(u.ex||0)+.4*Math.min(2,ratio)+.1;for(const u of b.att)u.ex=(u.ex||0)+.3*Math.min(2,1/ratio)+.25;
  for(const u of D){u.org-=3*ratio*k;u.str-=.0028*ratio*k/D.length*Math.max(1,D.length*.6)}
  for(const u of b.att){u.org-=2.6/ratio*k;u.str-=.0028/ratio*k/b.att.length*Math.max(1,b.att.length*.6)}
  const dead=D.filter(u=>u.str<=.04).length+b.att.filter(u=>u.str<=.04).length;
  for(const u of b.att)if(u.org<=8){u.path=[];u.prog=0}
  if(D.every(u=>u.org<=8)){cmWin(b.att);for(const u of b.att)u.ex=(u.ex||0)+3;/* savunma çözüldü: geri çekil ya da teslim ol */
    for(const u of D){const opts=adjL[r].filter(x=>canStay(u.o,x)&&!(at.get(x)||[]).some(e=>atWar(u.o,e.o)));
      if(opts.length){opts.sort((x,y)=>(at.get(y)||[]).filter(e=>e.o===u.o).length-(at.get(x)||[]).filter(e=>e.o===u.o).length);const to=opts[0];
        at.set(r,(at.get(r)||[]).filter(x=>x!==u));u.r=to;u.path=[];u.prog=0;u.str*=.95;(at.get(to)||at.set(to,[]).get(to)).push(u)}
      else{u.str=0;S.C[u.o].lost++;if(S.C[b.att[0].o])S.C[b.att[0].o].kill++;if(mine(u.o))log(`<b>${LT(u.tp).n}</b> ${near(r)} bölgesinde kuşatıldı ve teslim oldu.`,1)}}
    for(const u of b.att)u.prog=Math.max(u.prog,.6);
    if(mine(sa)||mine(sd))log(`${near(r)} muharebesi: ${SN(sd)} savunması çöktü.`,mine(sd))}
  for(const u of [...D,...b.att])if(u.str<=.04&&u.str>-1){S.C[u.o].lost++;u.str=-1;if(mine(u.o))log(`${LT(u.tp).n} ${near(r)} muharebesinde yok edildi.`,1)}}

/* hava: görev bölgesi hedef parsel ve komşularıdır; menzil, üsten hedefe uzaklıktır */
function inZone(w,r){return w.t>=0&&(w.t===r||RG[w.t].adj.some(([j])=>j===r))}
function inRange(w){return w.t>=0&&dist(w.base,w.t)<=AT(w.tp).men}
function airEff(w){const own=[],en=[];for(const x of S.A)if(x.t>=0&&x.mis!=='bekle'&&(x.t===w.t||inZone(x,w.t))){if(friend(x.o,w.o))own.push(x);else if(atWar(x.o,w.o))en.push(x)}
  const pw=a=>a.reduce((s,x)=>s+AT(x.tp).hv*x.n*V.C[x.o].q*(x.mis==='ust'?1:.5),0);const e=pw(en),o=pw(own);return e<=0?1:clamp(o/(o+e)*1.2,.15,1)}
function airSupport(side,r,vs){let s=0;for(const w of S.A)if(w.o===side||ally(w.o,side))if(w.mis==='des'&&inZone(w,r)&&inRange(w)&&atWar(w.o,vs))s+=AT(w.tp).yer*w.n/20*V.C[w.o].q*.8*(w._e||1)*(w.tp==='ih'&&TK(w.o,'iha')?1.5:1);return s}
function airSup(r,a,d){let A=0,D=0;for(const w of S.A){if(w.mis!=='ust'||w.mv>0||!inZone(w,r)||!inRange(w))continue;const v=AT(w.tp).hv*w.n*V.C[w.o].q;if(friend(w.o,a))A+=v;else if(friend(w.o,d))D+=v}return A+D>0?(A-D)/(A+D):0}
/* haritanın "Hava" görünümü için bölge başına [bizim, düşman] avcı gücü */
function airMap(){const P={};for(const w of S.A){if(w.mis!=='ust'||w.t<0||w.mv>0||!inRange(w))continue;const sd=friend(w.o,S.me)?0:atWar(w.o,S.me)?1:-1;if(sd<0)continue;const v=AT(w.tp).hv*w.n*V.C[w.o].q;
  for(const z of [w.t,...RG[w.t].adj.map(([j])=>j)]){const p=P[z]||(P[z]=[0,0]);p[sd]+=v}}return P}
/* hava savunma bataryaları: hedef bölgede tam, komşu bölgelerde yarım etki */
/* Hava görünümünde yalnızca hava üstünlüğü sınıfı değişen bölgeler yeniden boyanır */
function airMarks(){const AM=airMap(),old=U._am||{},nw={};for(const k in AM){const p=AM[k],v=(p[0]-p[1])/(p[0]+p[1]);nw[k]=v>.25?1:v<-.25?-1:0}for(const k of new Set([...Object.keys(old),...Object.keys(nw)]))if(old[k]!==nw[k])markR(+k);U._am=nw}
function hsAt(t,o){const H=S.hs||{};let n=0;if(H[t]&&atWar(o,S.ctl[t]))n+=H[t];for(const [j] of RG[t].adj)if(H[j]&&atWar(o,S.ctl[j]))n+=H[j]*.5;return n}
/* orduya bağlı hava filoları: ordunun muharebelerine, yoksa cephesindeki en kalabalık düşman bölgesine kendiliğinden görev alır */
function airArmy(){const ust=new Set();for(const w of S.A){if(!w.ar||!mine(w.o)||w.mv>0)continue;const a=S.ar.find(x=>x.id===w.ar);if(!a){w.ar=0;continue}const d=AT(w.tp);if(!d.hv&&!d.yer)continue;
  const rs=new Set();for(const id of a.u){const u=S.U.find(x=>x.id===id);if(u&&!u.emb){rs.add(u.r);if(u.path.length)rs.add(u.path[0])}}
  const inR=r=>dist(w.base,r)<=d.men;let best=-1,bv=0;
  for(const b of S.bat||[]){if(b.sea||!inR(b.r))continue;if(!rs.has(b.r)&&!(b.from||[]).some(x=>rs.has(x)))continue;const v=b.A+b.D;if(v>bv){bv=v;best=b.r}}
  if(best<0){let bn=0;for(const r of rs)for(const j of adjL[r]){if(!inR(j))continue;const n=S.U.filter(u=>u.r===j&&atWar(S.me,u.o)).length;if(n>bn){bn=n;best=j}}}
  if(best<0){if(w.mis!=='bekle'){w.mis='bekle';w.t=-1}continue}
  /* avcılar hep hava üstünlüğü; her ordunun ilk çok rollü filosu da üstünlüğe, kalanlar yakın desteğe */
  w.t=best;w.mis=d.hv>=1.2||!d.yer||(d.hv>=1&&!ust.has(a.id))?'ust':'des';if(w.mis==='ust')ust.add(a.id)}}
function airHour(){
  for(const w of S.A){w._e=1;if(w.mv>0){w.mv--;continue}if(w.mis==='bekle'||w.t<0||!inRange(w))continue;
    w._e=airEff(w);const tc=S.ctl[w.t],d=AT(w.tp);wc(w.o,.00017*w.n/20);/* görevdeki filonun yakıtı: tam filo günde ~4 mn $ */
    /* hava savunması ve önleme kayıpları */
    let loss=0;const hostile=isL(w.t)?atWar(w.o,tc):S.F.some(f=>f.r===w.t&&atWar(w.o,f.o));
    if(w.mis!=='ust'&&hostile&&isL(w.t))loss+=w.n*.0006*V.C[tc].ad;
    if(w._e<1)loss+=w.n*.004*(1-w._e)*(w.mis==='ust'?.8:1.4);
    if(isL(w.t)&&S.hs){const hz=hsAt(w.t,w.o);if(hz)loss+=w.n*.003*hz*(TK(S.ctl[w.t],'fsav')?1.5:1)*(w.mis==='ust'?.6:1)}
    if(isS(w.t)&&hostile)for(const f of S.F)if(f.r===w.t&&atWar(w.o,f.o))loss+=w.n*.0004*Object.entries(f.sh).reduce((s,[k,n])=>s+ST(k).hs*n,0)/6;
    w.n-=loss*(TK(w.o,'giz')?.6:1);
    if(w.mis==='bom'&&hostile){if(isL(w.t)){S.dmg[w.t]=Math.min(.8,(S.dmg[w.t]||0)+d.bom*w.n/20*V.C[w.o].q*.0012*w._e);if(S.h%12===0)markR(w.t);if(Math.random()<d.bom*w.n/20*.004*w._e)fabHit(w.t,1);if(S.hs&&S.hs[w.t]&&Math.random()<d.bom*w.n/20*.003*w._e){S.hs[w.t]--;OD.mver++}
        for(const u of S.U)if(u.r===w.t&&atWar(w.o,u.o)){u.org-=d.bom*w.n/20*.4*w._e;u.str-=d.bom*w.n/20*.0004*w._e}}
      else for(const f of S.F)if(f.r===w.t&&atWar(w.o,f.o))f.dmg+=(d.yer+d.bom)*w.n/20*.12*w._e}}
  const lost=S.A.filter(w=>w.n<1);for(const w of lost){S.C[w.o].lost++;if(mine(w.o))log(`${AT(w.tp).n} (${near(w.base)}) kayboldu.`,1)}
  if(lost.length)S.A=S.A.filter(w=>w.n>=1)}
function fleetCap(f){let c=0;for(const k in f.sh)c+=ST(k).tas*f.sh[k];return Math.floor(c+1e-6)}
function fleetFire(f){let a=0;for(const k in f.sh)a+=(ST(k).at+ST(k).dz*.5)*f.sh[k];return a*V.C[f.o].q*(TK(f.o,'den')?1.2:1)}
function fleetSize(f){let n=0;for(const k in f.sh)n+=f.sh[k];return n}
function navalHour(){
  for(const f of S.F){if(!f.path.length)continue;const n=f.path[0];const st=STRAIT[f.r+'|'+n];
    if(st&&st.g>=0&&atWar(f.o,S.ctl[st.g])){f.path=[];f.prog=0;if(mine(f.o))log(`${f.name}: ${st.n} düşman denetiminde, geçilemiyor.`,1);continue}
    wc(f.o,.00004*fleetSize(f));/* seyreden geminin yakıtı: gemi başına günde ~1 mn $ */f.prog+=28/Math.max(40,dist(f.r,n));if(f.prog>=1){f.r=n;f.path.shift();f.prog=0;if(!f.path.length&&f.land)disembark(f);else if(!f.path.length&&f.pick)pickUp(f)}}
  /* deniz muharebesi */
  const by=new Map();for(const f of S.F){let a=by.get(f.r);if(!a)by.set(f.r,a=[]);a.push(f)}
  for(const [r,fs] of by){if(fs.length<2)continue;for(const f of fs){const en=fs.filter(g=>atWar(f.o,g.o));if(!en.length)continue;
      const fire=fleetFire(f)*rnd(.7,1.3)*.025,tot=en.reduce((s,g)=>s+fleetSize(g),0);for(const g of en)g.dmg+=fire*fleetSize(g)/tot;S.bat.push({r,sea:1,o:f.o,d:en[0].o})}}
  for(const f of S.F){let guard=20;while(f.dmg>0&&guard--){const ks=Object.keys(f.sh).filter(k=>f.sh[k]>0);if(!ks.length)break;
      const wt=ks.map(k=>f.sh[k]*(ST(k).gizli?.4:1)),tw=wt.reduce((a,b)=>a+b,0);let x=Math.random()*tw,k=ks[0];for(let i=0;i<ks.length;i++){x-=wt[i];if(x<=0){k=ks[i];break}}
      if(f.dmg<ST(k).can)break;f.dmg-=ST(k).can;f.sh[k]--;if(!f.sh[k])delete f.sh[k];S.C[f.o].lost++;S.nl=S.nl||[];S.nl.unshift([S.h,f.r,f.o,ST(k).k]);if(S.nl.length>40)S.nl.length=40;if(mine(f.o))log(`${f.name}: bir ${ST(k).k.toLocaleLowerCase('tr')} battı (${RG[f.r].n}).`,1)}
    f.dmg=Math.max(0,f.dmg-.002)}
  const sunk=S.F.filter(f=>!fleetSize(f));for(const f of sunk){for(const id of f.carry){const u=S.U.find(x=>x.id===id);if(u)u.str=0}if(mine(f.o))log(`<b>${f.name}</b> yok edildi.`,1)}
  if(sunk.length){S.F=S.F.filter(f=>fleetSize(f));S.U=S.U.filter(u=>u.str>.04)}
  /* deniz denetimi: bir denizde en güçlü donanma, düşmanlarının toplamının 1,5 katından güçlüyse denizi denetler; değilse çekişmeli */
  if(S.h%2===0){const old=S.sc||{},sc={},by2=new Map();for(const f of S.F){if(f.path.length&&f.prog>0)continue;let m=by2.get(f.r);if(!m)by2.set(f.r,m={});m[f.o]=(m[f.o]||0)+fleetFire(f)+fleetSize(f)}
    for(const [r,m] of by2){const cs=Object.keys(m).sort((a,b)=>m[b]-m[a]),top=cs[0],en=cs.filter(c=>atWar(c,top)).reduce((s,c)=>s+m[c],0);sc[r]=en*1.5<m[top]?top:'~'}
    let ch=false;for(const k in sc)if(old[k]!==sc[k])ch=true;for(const k in old)if(!(k in sc))ch=true;S.sc=sc;if(ch&&U.mm==='den')S.mapDirty=1}}
/* uzaktan çağrılan filo kıyıya varınca bekleyen birlikleri alıp çıkarmaya götürür */
function pickUp(f){const k=f.pick;f.pick=null;const grp=S.U.filter(u=>k.ids.includes(u.id)&&u.r===k.src&&!u.emb&&!u.path.length);
  if(!grp.length){if(mine(f.o))log(`${f.name}: alınacak birlik kalmadı, çıkarma iptal edildi.`,1);return}U.amph=grp.map(u=>u.id);amphib(k.t)}
function disembark(f){const t=f.land;f.land=null;for(const id of f.carry){const u=S.U.find(x=>x.id===id);if(!u)continue;u.emb=0;u.r=f.r;u.path=[t];u.prog=0;u.amph=1}
  f.carry=[];if(mine(f.o))log(`${f.name} ${near(t)} kıyısına çıkarma yapıyor.`,1)}

/* ---------- günlük adım ---------- */
function day(){
  for(const c of V.ORDER){const C=S.C[c];if(!C.alive)continue;const d=V.C[c],D=DEF[C.def];
    C.tr+=budget(c)-upkeep(c)+oilRev(c);C.wcd=C._wc||0;C._wc=0;
    /* borç: eksi hazine borca yazılır, faiz kredi notuna göre; C notunda istikrar erir */
    if(C.tr<0){C.debt=(C.debt||0)-C.tr;C.tr=0}if(C.debt>0){const cr=credit(c);C.tr-=C.debt*cr.r/365;if(cr.n==='C')C.stab-=.15}
    /* araştırma */
    if(C.rs&&--C.rs.left<=0){C.tech=C.tech||{};C.tech[C.rs.k]=1;if(mine(c))log(`Araştırma tamamlandı: <b>${TECH[C.rs.k].n}</b>. ${TECH[C.rs.k].d}`,1);C.rs=null}
    /* yatırımların tamamlanması */
    if(C.ibB&&S.h>=C.ibB){C.ibB=0;C.ib=(C.ib||0)+1;if(mine(c))log(`Sanayi yatırımı tamamlandı: sanayi düzeyi ${IND(c)}/5. Fabrika verimi, üretim hatları ve eğitim kampları arttı.`,1)}
    const wars=enemiesOf(c).length;
    const L=mobOf(c);C.mp+=d.pop*.008*L.rg*(.5+C.ws/100);C.mp=Math.min(C.mp,mpCap(c));eqDay(c);trainDay(c);
    C.stab+=L.st+D.st*(wars&&C.ws>50?.4:1)-wars*(C.ws<40?.06:.03)+(wars?0:(d.stab-C.stab)*.01);
    C.ws+=wars?(-.04):(d.ws-C.ws)*.02;C.stab=clamp(C.stab,0,100);C.ws=clamp(C.ws,0,100);
    if(C.stab<15&&Math.random()<.04){C.riot=S.h+24*10;log(`${ek(c,'de')} yaygın gösteriler ve grevler.`,mine(c))}
    /* teslim olma: başkenti düşüp topraklarının %65'i işgal edilen ülke, savaşın o ana kadar sürdüğü kadar daha direnir
       (toplam süre iki katına çıkar), koşul sürerse sonra teslim olur */
    if(wars){let held=0;for(const r of ORIG[c])if(S.ctl[r]===c)held+=RW[r];
      if(S.ctl[CAPR[c]]!==c&&held/TOTW[c]<.35){
        if(!C.capAt){const st=Math.min(...S.war.filter(w=>w.a===c||w.b===c).map(w=>w.h));C.capAt=S.h+Math.max(24*3,S.h-st);
          if(mine(c)||enemiesOf(c).some(e=>mine(e)||ally(S.me,e)))log(`<b>${NM(c)}</b> başkentini ve topraklarının çoğunu kaybetti ama direnmeyi sürdürüyor; ${Math.ceil((C.capAt-S.h)/24)} gün içinde teslim olabilir.`,1)}
        else if(S.h>=C.capAt){C.capAt=0;capitulate(c)}}
      else C.capAt=0}else C.capAt=0}
  resDay();fabRepairDay();for(const c of V.ORDER)if(alive(c))recalcFab(c);
  /* kukla devletler bütçelerinin üçte birini haraç olarak öder */
  for(const c in S.pup){if(!alive(c)||!alive(S.pup[c])){delete S.pup[c];continue}const t=Math.max(0,budget(c)*.35);S.C[c].tr-=t;S.C[S.pup[c]].tr+=t}
  /* hava filoları üslerinde eksik uçaklarını yavaşça tamamlar */
  for(const w of S.A){const d=AT(w.tp),C=S.C[w.o];if(w.n<d.ucak&&canStay(w.o,w.base)){const k=Math.min(.5,d.ucak-w.n),c=d.mal/d.ucak*k;if(C.tr>c){C.tr-=c;w.n+=k}}}
  /* hasar kendiliğinden yavaş onarılır (en ağır hasar 180 günde); hızlı onarım ödenmişse üç kat hızlı (60 gün) */
  for(const k in S.dmg){const f=S.rep&&S.rep[k]?3:1;S.dmg[k]-=.8/180*f;markR(+k);if(S.dmg[k]<=0){delete S.dmg[k];if(S.rep)delete S.rep[k]}}
  for(const k in S.infB||{})if(S.h>=S.infB[k]){delete S.infB[k];S.inf=S.inf||{};S.inf[k]=(S.inf[k]||0)+1;if(mine(S.ctl[+k]))log(`${near(+k)}: altyapı yatırımı tamamlandı (düzey ${S.inf[k]}/3, bölge üretimi +%${S.inf[k]*10}).`,1)}
  oilDay();
  /* ilişkiler zamanla başlangıç değerine yaklaşır */
  for(const k in S.rel){const b=S.base[k]||0;S.rel[k]=clamp(S.rel[k]+(b-S.rel[k])*.004+rnd(-.12,.12),-100,100)}
  for(const c of V.ORDER)if(alive(c)&&!mine(c))aiDay(c);
  /* yapay zekâ kendi arasında anlaşma imzalar */
  if(Math.random()<.08){const c=rpick(V.ORDER.filter(x=>alive(x)&&!mine(x))),t=c&&rpick(V.ORDER.filter(x=>x!==c&&alive(x)&&!mine(x)&&!atWar(c,x)));
    if(t){const r_=rel(c,t),k=r_>60?'def':r_>25?'trd':r_>5?'nap':null;if(k&&!hasTr(c,t,k)&&!(k==='trd'&&(S.tr||[]).filter(z=>z.k==='trd'&&(z.a===c||z.b===c)).length>=3))trAdd(k,c,t)}}
  /* yapay zekâ oyuncuya anlaşma önerir */
  if(Math.random()<.012&&!S.ev.length){const c=rpick(V.ORDER.filter(x=>!mine(x)&&alive(x)&&!atWar(x,S.me)&&!S.pup[x]));if(c){const k=['trd','nap','def'].find(k=>!hasTr(c,S.me,k)&&trWill(c,k)>=15);if(k)popEv({k:'trq',c,kk:k})}}
  /* savaş gerekçeleri: hazırlanırken basına sızabilir; hazır olunca 180 gün geçerli */
  for(const k in S.cb||{}){const x=S.cb[k];if(x.until<=S.h){delete S.cb[k];continue}const [a,b]=k.split('|');
    if(x.done>S.h&&mine(a)&&Math.random()<.02){addRel(a,b,-10);for(const z of V.ORDER)if(z!==a&&z!==b&&alive(z))addRel(a,z,-2);log(`Uluslararası basın, ${ek(b,'e')} yönelik savaş gerekçesinin uydurma olduğunu yazdı; ilişkiler bozuldu.`,1)}
    if(x.done<=S.h&&!x.ok){x.ok=1;if(mine(a))log(`${NM(b)} için savaş gerekçesi hazır (${CBT[x.k].n}); 180 gün geçerli.`,1)}}
  if(S.h%(24*7)===0)weekly();
  /* vekâlet savaşı gideri */
  for(const k in S.prx||{}){const a=k.split('|')[0];if(S.C[a])S.C[a].tr-=.01}
  /* olay kartları: ortalama 50 günde bir */
  if(!S.ev.length&&S.h>24*20&&Math.random()<1/50)rollEvent();
  /* istatistik: 30 günde bir */
  if(S.h%(24*30)===0)histSnap();
  /* hedefler */
  if(S.h%(24*7)===0)goalCheck();
  /* hegemonya */
  if(!S.won&&!S.over){let w=0;for(let r=0;r<NR;r++)if(S.ctl[r]===S.me)w+=RW[r];if(w/ALLW>=.5){S.won=1;popEv({k:'won'})}}
  if(S.h%72===0)save()}
/* yapay zekâ savaşta ya da zenginken başkentine hava savunma bataryası kurar */
function aiAD(c){const C=S.C[c],d=V.C[c];if(d.ind<2||Math.random()>(enemiesOf(c).length?.04:.008))return;const cap=capOf(c);if(cap<0||C.tr<budget(c)*25+.5)return;queue(c,'h',cap)}
/* ---------- vekâlet savaşı (haftalık): istikrar düşer, isyancı birlik doğabilir; destek açığa çıkabilir ---------- */
function proxyWeek(){for(const k in S.prx||{}){const [a,b]=k.split('|');if(!alive(a)||!alive(b)||ally(a,b)){delete S.prx[k];continue}
    /* istikrar haftada 0,6 düşer; isyancılar yalnızca halkın direndiği ya da istikrarın 35'in altına indiği bölgelerde, aynı anda en çok 3 birlik */
    const B_=S.C[b];B_.stab-=.6;const rs=[];for(let r=0;r<NR;r++)if(S.ctl[r]===b&&r!==CAPR[b]&&((S.res[r]||0)>30||B_.stab<35))rs.push(r);
    const live=S.U.filter(u=>u.o==='ISY'&&u.px===k).length;
    if(rs.length&&live<3&&Math.random()<.15){const r=rpick(rs);S.res[r]=Math.min(100,(S.res[r]||0)+10);const u=mkUnit('ISY','mi',r);u.org=60;u.str=.5;u.reb=1;u.px=k;u.path=[r];if(mine(a)||mine(b))log(`${NM(b)}: ${near(r)} bölgesinde silahlı isyancılar ortaya çıktı.`,mine(b))}
    /* yakalanma: yapay zekâ desteği keser ve bir yıl o ülkeye yeniden destek vermez */
    if(Math.random()<.08){addRel(a,b,-25);if(!mine(b)){S.cb=S.cb||{};S.cb[b+'|'+a]={k:'teror',done:S.h,until:S.h+24*180}}log(`<b>${NM(a)}</b>, ${NM(b)} içindeki isyancılara destek verirken yakalandı${mine(a)?'':'; desteği kesti'}.`,mine(a)||mine(b));if(mine(b)){S.prxK=S.prxK||{};S.prxK[a]=1}
      if(!mine(a)){delete S.prx[k];S.cool['px'+k]=S.h+24*365}}}}
/* yapay zekâ: saldırgan ya da fırsatçı ülke, çok kötü olduğu ve savaşmadığı komşusunun isyancılarına destek verir */
function aiProxy(c){S.prx=S.prx||{};for(const k in S.prx){const [a,b]=k.split('|');if(a===c&&(rel(a,b)>-30||atWar(a,b)))delete S.prx[k]}
  const P=PERS(c);if((P!=='saldırgan'&&P!=='fırsatçı')||Math.random()>.004||Object.keys(S.prx).some(k=>k.startsWith(c+'|')))return;
  const t=neighbors(c).find(x=>alive(x)&&x!=='ISY'&&!atWar(c,x)&&!ally(c,x)&&rel(c,x)<-50&&(S.cool['px'+c+'|'+x]||0)<=S.h);if(t&&S.C[c].tr>1)S.prx[c+'|'+t]=S.h}
/* ---------- olay kartları ---------- */
const EVT=[
 {id:'deprem',t:'Büyük deprem',d:e=>`${near(e.r)} bölgesinde şiddetli bir deprem oldu; binalar ve yollar ağır hasar gördü. Halk devletten hızlı yardım bekliyor.`,
  ok:()=>true,pre:e=>{e.r=rpick(Array.from({length:NR},(_,i)=>i).filter(r=>S.ctl[r]===S.me&&CITYIN[r].length));if(e.r==null)return false;S.dmg[e.r]=Math.min(.8,(S.dmg[e.r]||0)+.3);markR(e.r);return true},
  o:[['Kapsamlı yardım (1 mlr $, istikrar +4)',()=>{S.C[S.me].tr-=1;S.C[S.me].stab+=4}],['Sınırlı yardım (0,2 mlr $, istikrar −3)',()=>{S.C[S.me].tr-=.2;S.C[S.me].stab-=3}]]},
 {id:'darbe',t:'Darbe girişimi',d:()=>'Bir grup subay başkentte yönetimi devirmeye kalkıştı. Darbe bastırıldı ama ordunun içindeki huzursuzluk sürüyor.',ok:()=>S.C[S.me].stab<50,
  o:[['Sert tasfiye (istikrar −4, savaş desteği +4, bir tümen zayıflar)',()=>{const C=S.C[S.me];C.stab-=4;C.ws+=4;const u=rpick(S.U.filter(x=>mine(x.o)));if(u)u.str=Math.max(.2,u.str-.3)}],['Generallerle uzlaş (0,5 mlr $ ek bütçe, istikrar +3)',()=>{const C=S.C[S.me];C.tr-=.5;C.stab+=3}]]},
 {id:'multeci',t:'Mülteci akını',d:e=>`${NM(e.c)} içindeki savaştan kaçan yüz binlerce insan sınırına dayandı.`,ok:e=>{e.c=rpick(neighbors(S.me).filter(x=>alive(x)&&enemiesOf(x).length&&!atWar(x,S.me)));return !!e.c},
  o:[['Kapıları aç (0,3 mlr $, ilişki +10, istikrar −2)',e=>{const C=S.C[S.me];C.tr-=.3;addRel(S.me,e.c,10);C.stab-=2}],['Sınırı kapat (istikrar +1, ilişki −8)',e=>{S.C[S.me].stab+=1;addRel(S.me,e.c,-8)}]]},
 {id:'yolsuzluk',t:'Yolsuzluk skandalı',d:()=>'Savunma ihalelerinde büyük bir yolsuzluk ortaya çıktı; basın ayakta.',ok:()=>true,
  o:[['Soruşturma başlat (istikrar −2, 0,3 mlr $ geri alınır)',()=>{const C=S.C[S.me];C.stab-=2;C.tr+=.3}],['Örtbas et (istikrar −5)',()=>{S.C[S.me].stab-=5}]]},
 {id:'atilim',t:'Mühendislerden atılım',d:()=>`Araştırma ekibin <b>${TECH[S.C[S.me].rs.k].n}</b> üzerinde beklenmedik bir ilerleme kaydetti.`,ok:()=>!!S.C[S.me].rs,
  o:[['Araştırmayı hızlandır (40 gün kısalır)',()=>{const C=S.C[S.me];if(C.rs)C.rs.left=Math.max(1,C.rs.left-40)}],['Patenti sat (+0,5 mlr $)',()=>{S.C[S.me].tr+=.5}]]},
 {id:'yatirim',t:'Yabancı yatırım teklifi',d:e=>`${NM(e.c)} kökenli bir fon ülkene büyük yatırım yapmak istiyor; karşılığında bazı ayrıcalıklar bekliyor.`,ok:e=>{e.c=rpick(V.ORDER.filter(x=>x!==S.me&&alive(x)&&rel(x,S.me)>20));return !!e.c},
  o:[['Kabul et (+1,5 mlr $, ilişki +5, istikrar −1)',e=>{const C=S.C[S.me];C.tr+=1.5;addRel(S.me,e.c,5);C.stab-=1}],['Reddet (istikrar +1)',()=>{S.C[S.me].stab+=1}]]},
 {id:'grev',t:'Fabrikalarda grev',d:()=>'Askerî fabrika işçileri düşük ücretler yüzünden greve gitti; üretim aksıyor.',ok:()=>S.C[S.me].fab>0,
  o:[['Zam ver (0,4 mlr $, istikrar +2)',()=>{const C=S.C[S.me];C.tr-=.4;C.stab+=2}],['Grevi yasakla (istikrar −5, savaş desteği −2)',()=>{const C=S.C[S.me];C.stab-=5;C.ws-=2}]]},
 {id:'teror',t:'Terör saldırısı',d:e=>`Başkentte kanlı bir saldırı oldu; izler ${NM(e.c)} destekli bir örgüte çıkıyor.`,ok:e=>{e.c=rpick(neighbors(S.me).filter(x=>alive(x)&&x!=='ISY'&&rel(x,S.me)<-30&&!atWar(x,S.me)));return !!e.c},
  o:[['Misilleme sözü ver (savaş desteği +8, savaş gerekçesi hazır, ilişki −10)',e=>{const C=S.C[S.me];C.ws+=8;addRel(S.me,e.c,-10);S.cb=S.cb||{};S.cb[S.me+'|'+e.c]={k:'teror',done:S.h,until:S.h+24*180,ok:1}}],['Soğukkanlı kal (istikrar −2)',()=>{S.C[S.me].stab-=2}]]},
 {id:'gosteri',t:'Halk gösterileri',d:()=>'Hayat pahalılığı ve savaş yorgunluğu yüzünden büyük şehirlerde gösteriler başladı.',ok:()=>S.C[S.me].stab<40,
  o:[['Reform sözü (istikrar +5, savunma bütçesi olağana iner)',()=>{const C=S.C[S.me];C.stab+=5;C.def=Math.min(C.def,1)}],['Sert müdahale (istikrar −3, savaş desteği −3)',()=>{const C=S.C[S.me];C.stab-=3;C.ws-=3}]]}];
/* aynı olay bir yıl içinde tekrar gelmez */
function rollEvent(){S.evc=S.evc||{};const pool=EVT.filter(E=>(S.evc[E.id]||0)<=S.h&&E.ok({}));if(!pool.length)return;const E=rpick(pool),e={k:'olay',id:E.id};if(!E.ok(e))return;if(E.pre&&!E.pre(e))return;S.evc[E.id]=S.h+24*365;popEv(e)}
/* ---------- istatistik ---------- */
function histSnap(){S.hist=S.hist||[];const d={};for(const c of V.ORDER)if(alive(c)){let rg=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c)rg++;d[c]=[+gdpOf(c).toFixed(1),S.U.filter(u=>u.o===c).length,rg,+(S.C[c].tr-(S.C[c].debt||0)).toFixed(2)]}
  S.hist.push({h:S.h,d});if(S.hist.length>120)S.hist.shift()}
/* ---------- hedefler ---------- */
/* hedefler: oyunun başında ülkeye göre seçilir; tamamlanınca ödül (hazine +1 mlr $, istikrar +3) */
function goalInit(){const me=S.me,u=S.U.filter(x=>x.o===me).length;let rg=0;for(let r=0;r<NR;r++)if(S.ctl[r]===me)rg++;
  const G=[{k:'ordu',t:`Ordunu ${Math.ceil(u*1.5)} tümene çıkar`,v:Math.ceil(u*1.5)},{k:'gdp',t:`Ekonomini (GSYH) ${f0(gdpOf(me)*1.25)} mlr $'a büyüt`,v:gdpOf(me)*1.25},
    {k:'toprak',t:`Topraklarını ${Math.ceil(rg*1.25)} bölgeye genişlet`,v:Math.ceil(rg*1.25)},{k:'sanayi',t:`Sanayi düzeyini ${Math.min(5,IND(me)+1)}'e çıkar`,v:Math.min(5,IND(me)+1)},
    {k:'ticaret',t:'Üç ülkeyle ticaret anlaşması imzala',v:3}];
  S.goals=G.map(g=>Object.assign(g,{done:0}))}
function goalVal(g){const me=S.me;switch(g.k){case 'ordu':return S.U.filter(x=>x.o===me).length;case 'gdp':return gdpOf(me);case 'toprak':{let n=0;for(let r=0;r<NR;r++)if(S.ctl[r]===me)n++;return n}
  case 'sanayi':return IND(me);case 'ticaret':return (S.tr||[]).filter(t=>t.k==='trd'&&(t.a===me||t.b===me)).length;
  case 'hurmuz':{if(HZ===-2)HZ=seaIdx('Hürmüz Boğazı');const o=seaOf(HZ);return o&&o!=='~'&&friend(o,me)?1:0}
  case 'isyan':return S.U.filter(u=>u.o==='ISY').length;case 'kibris':{const o=seaOf(seaIdx('Kıbrıs Havzası'));return o===me?1:0}}return 0}
const goalOk=g=>g.k==='isyan'?goalVal(g)<=g.v:goalVal(g)>=g.v;
function goalCheck(){if(!S.goals)return;for(const g of S.goals)if(!g.done&&goalOk(g)){g.done=S.h;const C=S.C[S.me];C.tr+=1;C.stab+=3;log(`🎯 Hedef tamamlandı: <b>${g.t}</b>. Ödül: hazine +1 mlr $, istikrar +3.`,1)}}
/* ---------- kayıt yuvaları (3) ---------- */
const slotKey=n=>SK(n>1?'od'+n:'od');
function loadSlot(n){try{const j=JSON.parse(localStorage.getItem(slotKey(n)));if(j&&j.story==='od'&&j.v===1&&j.C&&j.own){j.slot=n;return migrate(j)}}catch(e){}return null}
function slotInfo(n){try{const j=JSON.parse(localStorage.getItem(slotKey(n)));if(j&&j.C&&j.me)return {me:j.me,h:j.h,dif:j.dif,scn:j.scn}}catch(e){}return null}
function weekly(){
  proxyWeek();
  for(const c in S.pup){const m=S.pup[c];if(!mine(m)&&rel(m,c)<-30&&Math.random()<.05)freePuppet(c,'ilan etti');else if(mine(m)&&rel(m,c)<-30&&Math.random()<.05)freePuppet(c,'ilan etti: ilişkiler çok kötüleşmişti')}
  for(const w of [...S.war]){const a=w.a,b=w.b,s=score(a,b),age=(S.h-w.h)/24;if(!alive(a)||!alive(b))continue;
    if(mine(a)||mine(b)){const ai=mine(a)?b:a,sc=score(ai,S.me);
      if(sc>=40&&Math.random()<.5)popEv({k:'demand',c:ai});
      else if(sc<=-35&&Math.random()<.6)popEv({k:'offer',c:ai,keep:1});
      else if(age>60&&Math.abs(sc)<15&&Math.random()<.25)popEv({k:'offer',c:ai,keep:0});continue}
    if(s>=40)makePeace(a,b,'a');else if(s<=-40)makePeace(b,a,'a');else if(age>120&&Math.abs(s)<10&&Math.random()<.4)makePeace(a,b,null)}}

/* ---------- yapay zekâ ---------- */
function aiDay(c){const C=S.C[c],d=V.C[c],wars=enemiesOf(c);
  /* tehdit ve ihtiyaç */
  const th=aiThreat(c),P=PERS(c),lp=landPower(c)+bloc(c).filter(x=>x!==c).reduce((s,x)=>s+landPower(x),0)*.4;C._thr=th.th;
  /* tehdit altında, savaş hazırlığında ya da ordu bakımı bütçenin kişiliğe göre %45–60'ından azsa ordu büyür */
  /* barıştaki ekonomik büyüme başlangıç ordusunun 2,5 katında durur (tehdit ve savaş hazırlığı bu sınıra bağlı değil) */
  const nU=S.U.filter(u=>u.o===c).length;if(C.base0==null)C.base0=Math.max(4,nU);
  C._need=!!(lp<th.th*({saldırgan:1.15,temkinli:1,fırsatçı:.9,sadık:.9}[P])||(C.prep&&!wars.length)||(upkeep(c)<budget(c)*({saldırgan:.6,fırsatçı:.5,temkinli:.45,sadık:.45}[P])&&nU<C.base0*2.5));
  /* savaş hazırlığı */
  if(C.prep){const p=C.prep;if(!alive(p.t)||ally(c,p.t)||truce(c,p.t)||atWar(c,p.t)||rel(c,p.t)>-40||wars.length){if(S.cb)delete S.cb[c+'|'+p.t];C.prep=null}
    else if(S.h>=p.end){C.prep=null;declare(c,p.t,'')}
    else if(Math.round(S.h/24)%3===0)aiStage(c,p.t)}
  aiPolicy(c,wars);aiRecruit(c);aiSpend(c);aiAlloc(c);aiProxy(c);
  /* araştırma: zenginse ve boştaysa askerî bir teknolojiye başlar */
  if(!C.rs&&C.tr>budget(c)*40+3){const ks=Object.keys(TECH).filter(k=>!canTech(c,k));if(ks.length)startTech(c,rpick(ks))}
  /* hava harekâtı */
  const front=frontRegions(c,wars);aiAir(c,wars,C.prep?C.prep.t:null);
  /* füze */
  if(wars.length&&C.mis>0&&Math.random()<.35){const e=pick(wars),cap=CAPR[e];const tg=S.ctl[cap]===e?cap:front.find(r=>S.ctl[r]===e);if(tg>=0&&tg!==undefined)fire(c,tg)}
  /* savaş ilanı: yalnızca kara komşusuna, kötü ilişki ve açık güç üstünlüğüyle, ilk 45 günden sonra */
  if(S.h>24*45&&!wars.length&&!C.prep&&C.stab>40&&!S.pup[c]){
    for(const t of neighbors(c)){if(!alive(t)||ally(c,t)||truce(c,t)||rel(c,t)>-58||hasTr(c,t,'nap'))continue;
      const mine_=bloc(c).reduce((s,x)=>s+landPower(x),0),their=bloc(t).reduce((s,x)=>s+landPower(x),0);
      /* kişilik: saldırgan daha az üstünlükle ve daha sık, temkinli nadiren; fırsatçı başı dertte olana saldırır */
      const P=PERS(c),busy=enemiesOf(t).length>0,TH={saldırgan:1.3,temkinli:2,fırsatçı:busy?1.15:1.5,sadık:1.6}[P],PM={saldırgan:2,temkinli:.4,fırsatçı:busy?2.5:1,sadık:.7}[P];
      if(mine_>their*TH&&Math.random()<V.AGR[c]*.006*PM&&!C.prep){aiPrep(c,t);break}}}
  /* barış dönemi diplomasisi */
  if(Math.random()<.05){const fr=V.ORDER.filter(x=>x!==c&&alive(x)&&rel(c,x)>30&&!mine(x));if(fr.length)addRel(c,pick(fr),2)}}
function neighbors(c){const s=new Set();for(let r=0;r<NR;r++)if(S.ctl[r]===c)for(const j of adjL[r]){const o=S.ctl[j];if(o&&o!==c)s.add(o)}return [...s]}
function frontRegions(c,wars){const out=[];for(let r=0;r<NR;r++){const o=S.ctl[r];if(!o||!wars.includes(o))continue;if(adjL[r].some(j=>friend(S.ctl[j],c)))out.push(r)}return out}
function aiMil(c){let wars=enemiesOf(c);
  /* kendi topraklarındaki isyancılar da düşman sayılır */
  if(S.U.some(u=>u.o==='ISY'&&(S.ctl[u.r]===c||S.own[u.r]===c))||S.ctl.some((x,r)=>x==='ISY'&&S.own[r]===c))wars=wars.concat('ISY');if(!wars.length)return;
  const at=new Map();for(const u of S.U){if(u.emb)continue;let a=at.get(u.r);if(!a)at.set(u.r,a=[]);a.push(u)}
  const busy=u=>u.path.length>0;
  const idle=S.U.filter(u=>u.o===c&&!u.emb&&!busy(u)&&!isS(u.r)&&u.org>35);if(!idle.length)return;
  const hostileAt=r=>(at.get(r)||[]).filter(e=>atWar(c,e.o));
  const enemyPow=r=>hostileAt(r).reduce((s,u)=>s+defP(u),0);
  /* dinlenme: düzeni ve gücü tükenmiş cephe birliği, bölgede başka birlik varsa bir geri bölgeye çekilir */
  for(const u of S.U){if(u.o!==c||u.emb||u.path.length||isS(u.r)||u.org>20||u.str>.6)continue;if(!adjL[u.r].some(j=>hostileAt(j).length))continue;
    const back=adjL[u.r].find(j=>canStay(c,j)&&!adjL[j].some(k=>hostileAt(k).length));if(back!=null&&(at.get(u.r)||[]).filter(x=>x.o===c).length>1){u.path=[back];u.prog=0}}
  /* hedefler: komşu düşman parselleri */
  const F=frontRegions(c,wars).map(r=>{const e=enemyPow(r),cand=idle.filter(u=>adjL[u.r].includes(r)),my=cand.reduce((s,u)=>s+atkP(u,r),0);return {r,e,cand,my,v:RW[r]+(r===CAPR[S.ctl[r]]?10:0)}});
  /* ana eksen: 10 günde bir seçilen değerli ve zayıf savunulan düşman bölgesi; saldırılar ve takviyeler oraya yoğunlaşır */
  const CC=S.C[c];if(F.length&&(CC.ax==null||S.h>=CC.axT||!wars.includes(S.ctl[CC.ax]))){const b=[...F].sort((x,y)=>(y.v+5)/(y.e+.5)-(x.v+5)/(x.e+.5))[0];CC.ax=b.r;CC.axT=S.h+240}
  const axB=f=>CC.ax!=null&&(f.r===CC.ax||adjL[CC.ax].includes(f.r))?3:0;
  F.sort((a,b)=>(b.my/(b.e+.3)+b.v*.05+axB(b))-(a.my/(a.e+.3)+a.v*.05+axB(a)));
  const used=new Set();
  for(const f of F){const cand=f.cand.filter(u=>!used.has(u.id));if(!cand.length)continue;let p=0;const go=[];
    cand.sort((a,b)=>atkP(b,f.r)-atkP(a,f.r));
    for(const u of cand){/* tehdit altındaki parselde son birliği bırakma */
      const here=(at.get(u.r)||[]).filter(x=>x.o===c&&!used.has(x.id)&&!busy(x)).length,threat=adjL[u.r].some(j=>hostileAt(j).length);
      if(here<=1&&threat&&p>0)continue;go.push(u);p+=atkP(u,f.r);if(p>f.e*1.6+.4)break}
    if(p>f.e*1.25+.2||f.e===0)for(const u of go){u.path=[f.r];u.prog=0;used.add(u.id)}}
  /* geride kalanlar cepheye doğru */
  const myFront=[];for(let r=0;r<NR;r++)if(S.ctl[r]===c&&(adjL[r].some(j=>wars.includes(S.ctl[j]))||hostileAt(r).length))myFront.push(r);
  if(!myFront.length)return;
  /* en çok tehdit altındaki üç cephe parselinden geriye tek bir arama; her birlik oradan gelen yolu izler */
  const src=myFront.map(r=>({r,v:adjL[r].reduce((s,j)=>s+enemyPow(j),0)+.5-(at.get(r)||[]).filter(x=>x.o===c).length*1.2})).sort((a,b)=>b.v-a.v).slice(0,3).map(x=>x.r);
  if(CC.ax!=null)src.unshift(...myFront.filter(r=>adjL[r].includes(CC.ax)).slice(0,2));
  const {d,pv}=dijk(c,src,false);
  for(const u of idle){if(used.has(u.id)||myFront.includes(u.r)||d[u.r]>=1e12)continue;
    const here=(at.get(u.r)||[]).filter(x=>x.o===c).length;if(here<=1&&adjL[u.r].some(j=>hostileAt(j).length))continue;
    const p=[];for(let x=pv[u.r],g=0;x>=0&&g<60;x=pv[x],g++)p.push(x);if(p.length&&p.every(x=>canEnter(c,x)))u.path=p}}
function fire(c,r){const C=S.C[c];if(C.mis<=0||(S.cool['m'+c]||0)>S.h)return 'Füze rampaları yeniden dolduruluyor.';
  const tc=S.ctl[r];if(!atWar(c,tc))return 'Hedefle savaşta değilsin.';const cap=capOf(c);if(cap>=0&&dist(cap,r)>(TK(c,'fuz')?3500:2200))return `Hedef menzil dışında (${TK(c,'fuz')?'3.500':'2.200'} km).`;
  const n=Math.min(10,C.mis);C.mis-=n;S.cool['m'+c]=S.h+24;const pi=clamp(V.C[tc].ad*.13+((S.hs||{})[r]||0)*.08+(TK(tc,'fsav')?.2:0),0,.85);/* hava savunması ve bölgedeki bataryalar füzeleri önler */let hit=0;for(let i=0;i<n;i++)if(Math.random()>pi)hit++;
  /* isabet başına: bölgeye %6 hasar, birliklere güç −%1,2 ve düzen −4; her iki isabet bir fabrikayı vurur, bataryayı da düşürebilir */
  S.dmg[r]=Math.min(.8,(S.dmg[r]||0)+hit*.06*(TK(c,'fuz')?1.25:1));for(const u of S.U)if(u.r===r&&atWar(c,u.o)){u.str-=hit*.012;u.org-=hit*4}
  if(S.hs&&S.hs[r]&&hit>=4&&Math.random()<.5){S.hs[r]--;OD.mver++}
  S.C[tc].ws+=2;S.C[tc].stab-=hit*.15;addRel(c,tc,-3);markR(r);fabHit(r,Math.floor(hit/2));
  log(`${NM(c)} ${near(r)} hedefine ${n} füze attı: ${n-hit} tanesi önlendi, ${hit} isabet.`,mine(c)||mine(tc));return ''}

/* ---------- halk, direnç ve isyan ----------
   Her bölgenin bir çekirdeği (halkının kendini ait saydığı ülke, S.core) vardır. Bölgeyi çekirdeği dışında biri tutuyorsa
   direnç (S.res) ve uyum (S.cmp) işler: direnç kültürel uzaklığa, işgal politikasına, garnizona ve savaşın sürüp
   sürmediğine göre bir hedefe yaklaşır; uyum zamanla artar. Direnç bölgenin verimini düşürür, yüksekse ayaklanma çıkar.
   Uyum %80'i geçince bölge çekirdeğe katılabilir (entegrasyon). */
const CULT={TUR:'tr',KKTC:'tr',IRN:'fa',ISR:'he',CYP:'gr'};const cult=c=>CULT[c]||'ar';
function baseRes(core,h){if(!core||core===h)return 0;const a=cult(core),b=cult(h);if(a===b)return 14;if(a==='he'||b==='he')return 68;if(a==='gr'||b==='gr')return 58;
  if((core==='IRQ'&&h==='IRN')||(core==='IRN'&&h==='IRQ'))return 30;return 42}
const LAWS={sivil:{n:'Sivil yönetim',rm:.8,cg:.25,out:.5,gar:1,d:'Okullar, belediyeler ve mahkemeler yerel halkla çalışır. Direnç düşük kalır, uyum hızlı artar; bölgeden az kaynak alırsın.'},
  askeri:{n:'Askerî yönetim',rm:1,cg:.12,out:.65,gar:1.25,d:'Valiler komutanlardır. Dengeli; garnizon direnci daha iyi bastırır.'},
  sert:{n:'Sıkıyönetim',rm:1.5,cg:.03,out:.85,gar:2,d:'Sokağa çıkma yasakları ve el koymalar. En çok kaynağı alırsın, garnizon direnci güçlü bastırır; ama halk seni hiç benimsemez, garnizon çekilince isyan patlar, aynı kültürdeki ülkeler tepki gösterir.'},
  ozerk:{n:'Yerel özerklik',rm:.5,cg:.35,out:.3,gar:.8,d:'Yerel liderler kendi işlerini yönetir. Direnç çok düşük, uyum en hızlı; kaynakların çoğu bölgede kalır.'}};
const lawOf=c=>LAWS[(S.C[c]&&S.C[c].law)||'askeri']||LAWS.askeri;
function resOf(r){if(!isL(r))return -1;const h=S.ctl[r];if(!h||h==='ISY'||h===S.core[r])return -1;return S.res[r]||0}
/* bölgenin tutan ülkeye verimi (0–1) */
function rOut(r,c){const k=S.core[r];if(k===c)return 1;const L=lawOf(c),res=S.res[r]||0,cm=S.cmp[r]||0;
  let o=S.own[r]===c?L.out+(1-L.out)*cm/100*.8:L.out*.8;if(S.rf[r]&&S.rf[r].ozr)o*=.8;return o*(1-res/100*.7)}
function garrison(r,h){let n=0;for(const u of S.U)if(u.r===r&&!u.emb&&friend(u.o,h))n++;return n}
function resTarget(r,h){const k=S.core[r],L=lawOf(h),rf=S.rf[r]||{},gs=Math.min(.75,garrison(r,h)*.22*L.gar);
  return clamp(baseRes(k,h)*L.rm*(rf.ozr?.6:1)*(S.C[h].min?.85:1)*(1-gs)+(alive(k)&&atWar(k,h)?15:0)-(S.cmp[r]||0)*.4,0,100)}
function resDay(){for(let r=0;r<NR;r++){if(!isL(r))continue;const h=S.ctl[r],k=S.core[r];if(h==='ISY')continue;
    if(!h||h===k){S.res[r]=0;if((S.cmp[r]||0)<100)S.cmp[r]=Math.min(100,(S.cmp[r]||0)+1);continue}
    const L=lawOf(h),rf=S.rf[r]||{};S.res[r]=(S.res[r]||0)+(resTarget(r,h)-(S.res[r]||0))*.06;
    S.cmp[r]=clamp((S.cmp[r]||0)+L.cg*(1-S.res[r]/100)*(rf.ozr?1.5:1)-(S.res[r]>60?.1:0),0,100);
    if(L===LAWS.sert&&Math.random()<.15)for(const x of V.ORDER)if(x!==h&&alive(x)&&cult(x)===cult(k))addRel(h,x,-.1);
    if(S.res[r]>50&&Math.random()<(S.res[r]-50)/450)uprise(r,h,k)}}
function uprise(r,h,k){const o=alive(k)&&atWar(k,h)?k:'ISY',n=S.res[r]>80?2:1;for(let i=0;i<n;i++){const u=mkUnit(o,'mi',r);u.org=75;u.str=.75;u.reb=1;u.path=[r]}
  if(mine(h)||ally(S.me,h))log(`<b>${near(r)}</b> bölgesinde ayaklanma: ${o==='ISY'?'yerel isyancılar':NM(o)+' yanlısı direnişçiler'} silaha sarıldı.`,mine(h));
  else if(mine(o))log(`${near(r)} bölgesinde halk işgalciye karşı ayaklandı.`,1)}
function rebelAI(){for(const u of S.U){if(!u.reb||u.emb)continue;const r=u.r;
    if((S.res[r]||0)<25&&S.ctl[r]!==u.o)u.str-=.05;
    if(u.path.length)continue;
    if(S.ctl[r]!==u.o&&!friend(S.ctl[r],u.o)){if(u.org>40)u.path=[r];continue}
    const nb=adjL[r].filter(n=>S.ctl[n]&&atWar(u.o,S.ctl[n])&&(S.res[n]||0)>55&&!S.U.some(x=>x.r===n&&atWar(u.o,x.o)));
    if(nb.length&&Math.random()<.3)u.path=[pick(nb)]}}

/* ---------- ordular ----------
   Oyuncu birliklerini generallerin komutasında ordulara toplar. Orduya bir cephe (düşman ülke) atanınca birlikler sınır
   boyunca, düşmanın yoğun olduğu kesimlere ağırlık vererek dağılır. Taarruz başlatılınca ordu, hedef bölgeye yakın
   kesimlerden başlayarak yerel üstünlük kurduğu düşman bölgelerine saldırır; cephe ilerledikçe yeniden dağılır. */
const GEN={tr:['Org. Kemal Aksoy','Korg. Nedim Tarhan','Korg. Levent Şahin','Tümg. Ayla Demirci','Korg. Murat Ekinci','Tümg. Serdar Önal'],
  ar:['Liva Halid el-Amiri','Fariq Samir Haddad','Liva Nadia es-Seyyid','Fariq Yusuf Bereket','Liva Tarık Mansur','Fariq Rami Kassab'],
  fa:['Sartip Dariuş Kazımi','Sartip Babek Rahimi','Sartip Leyla Kerimi','Sartip Navid Ahmedi'],he:['Aluf Yoav Peretz','Aluf Noa Levin','Aluf Eitan Mizrahi','Aluf Dana Friedman'],
  gr:['Stratigos Nikos Pappas','Stratigos Eleni Georgiou','Stratigos Andreas Hristu']};
const ACOL=['#b8a6ef','#8fe0a0','#f0b46c','#7fd3e8','#f39ac0','#e8e07a'];
function mkArmy(list){const no=(S.ar.length?Math.max(...S.ar.map(a=>a.no||0)):0)+1;
  const a={id:S.nid++,no,n:no+'. Ordu',g:'',u:[],fr:null,t:-1,atk:0,c:ACOL[(no-1)%ACOL.length]};const p=gpool();setGen(a,p.splice(Math.floor(Math.random()*p.length),1)[0]);S.ar.push(a);for(const id of list)assign(id,a);return a}
/* komutanlar: her ordunun başında ülkenin kültürüne uygun adlı bir general bulunur. Yıldızı (1–3) rütbesini belirler;
   saldırı ve savunma yüzdeleri ordudaki bütün tümenlere eklenir; her komutanın bir de uzmanlığı vardır.
   Atanmamış adaylar S.gp havuzunda bekler; görevden alınan general havuza döner. */
const GN={tr:[['Kemal','Nedim','Levent','Ayla','Murat','Serdar','Hakan','Zeynep','Cengiz','Oğuz','Selim','Erdem','Hülya','Tuncay','Bülent','Kaan','Volkan','Aydın','Metin','Gökhan'],['Aksoy','Tarhan','Şahin','Demirci','Ekinci','Önal','Karaca','Yıldırım','Kurt','Arslan','Çelik','Özdemir','Kaya','Doğan','Bozkurt','Tekin','Uysal','Aydemir','Koç','Güler'],['','Tümg.','Korg.','Org.']],
  ar:[['Halid','Samir','Nadia','Yusuf','Tarık','Rami','Faruk','Ömer','Hasan','Ziyad','Mahir','Leyla','Kerim','Adnan','Bessam','Nebil','Salih','Fuad'],['el-Amiri','Haddad','es-Seyyid','Bereket','Mansur','Kassab','el-Hatib','Nasrallah','el-Masri','Abbas','el-Kubeysi','Sultan','Hamdan','el-Ali','el-Haşimi','Cabir'],['','Liva','Fariq','Fariq Evvel']],
  fa:[['Dariuş','Babek','Leyla','Navid','Kuruş','Ferhad','Rıza','Mehdi','Ali','Hüseyin','Ruzbeh','Şirin','Kaveh','Araş'],['Kazımi','Rahimi','Kerimi','Ahmedi','Bakıri','Süleymani','Hüseyni','Rızai','Tahrani','Caferi','Muradi','Sadıki'],['','Sartip','Sarlaşkar','Arteşbod']],
  he:[['Yoav','Noa','Eitan','Dana','Avi','Gadi','Moşe','Tamar','Ronen','Udi','Herzi','Amir','Yael','Ofer'],['Peretz','Levin','Mizrahi','Friedman','Cohen','Barak','Şapira','Golan','Ben-David','Katz','Halevi','Aşkenazi'],['','Tat-Aluf','Aluf','Rav-Aluf']],
  gr:[['Nikos','Eleni','Andreas','Yorgos','Kostas','Dimitris','Maria','Panayotis','Stelios','Hristos'],['Pappas','Georgiu','Hristu','Konstantinu','Yoannu','Nikolau','Karamanlis','Hristodulu','Mihail'],['','Ypostratigos','Antistratigos','Stratigos']]};
const TRT={col:{n:'Çöl savaşçısı',d:'çölde saldırı +%12'},dag:{n:'Dağ komandosu',d:'dağ ve tepelikte saldırı ve savunma +%15'},zirh:{n:'Zırh ustası',d:'zırhlı ve mekanize tümenlerde saldırı +%12'},
  loj:{n:'Lojistikçi',d:'birliklerin düzeni %50 daha hızlı toparlanır'},hiz:{n:'Yıldırım harbi',d:'hareket hızı +%15'},kale:{n:'Savunma ustası',d:'kendi topraklarında savunma +%12'},
  nehir:{n:'Köprübaşı uzmanı',d:'nehir geçişinde kayıp %25 yerine %10'},bask:{n:'Baskıncı',d:'düzeni %80 üstündeki tümenlerde saldırı +%10'}};
function mkGen(c){const P=GN[cult(c)]||GN.ar,x=Math.random(),st=x<.15?3:x<.5?2:1,used=n=>S.ar.some(a=>a.cm&&a.cm.nm===n)||(S.gp||[]).some(g=>g.nm===n);
  let nm,k=0;do{nm=rpick(P[0])+' '+rpick(P[1])}while(used(nm)&&++k<30);
  const r=()=>Math.round(st*2+Math.random()*(2+st*2));return {id:S.nid++,nm,rk:P[2][st],st,atk:r(),def:r(),tr:rpick(Object.keys(TRT))}}
function gpool(){S.gp=S.gp||[];while(S.gp.length<3)S.gp.push(mkGen(S.me));return S.gp}
function setGen(a,g){if(!g)g=mkGen(S.me);a.cm=g;a.g=g.rk+' '+g.nm}
const cmOf=u=>{if(!u.ar)return null;const a=S.ar.find(x=>x.id===u.ar);return a&&a.cm||null};
function cmA(g,u,r){let k=1+g.atk/100;const T=RG[r].tr,d=LT(u.tp);if(g.tr==='col'&&T==='col')k*=1.12;if(g.tr==='dag'&&(T==='dag'||T==='tepe'))k*=1.15;if(g.tr==='zirh'&&d.sert>.5)k*=1.12;if(g.tr==='bask'&&u.org>80)k*=1.1;return k}
function cmD(g,u){let k=1+g.def/100;const T=RG[u.r].tr;if(g.tr==='dag'&&(T==='dag'||T==='tepe'))k*=1.15;if(g.tr==='kale'&&S.own[u.r]===u.o)k*=1.12;return k}
function assign(id,a){const u=S.U.find(x=>x.id===id);if(!u||!mine(u.o))return;if(u.ar){const o=S.ar.find(x=>x.id===u.ar);if(o)o.u=o.u.filter(x=>x!==id)}u.ar=a?a.id:0;if(a)a.u.push(id)}
function armyFront(a){if(!a.fr)return null;const E=new Set();for(let r=0;r<NR;r++){const c=S.ctl[r];if(c&&(c===a.fr||(c!==S.me&&atWar(S.me,c)&&ally(c,a.fr))))E.add(r)}
  const F=[];for(let r=0;r<NR;r++)if(S.ctl[r]===S.me&&adjL[r].some(j=>E.has(j)))F.push(r);return F.length?{F,E}:null}
function armyTick(a){a.u=a.u.filter(id=>S.U.some(u=>u.id===id));if(a.fr&&(!alive(a.fr)||ally(S.me,a.fr))){a.fr=null;a.t=-1;a.atk=0}if(!a.cm)setGen(a);if(a.line&&a.line.length&&!(a.atk&&a.fr&&atWar(S.me,a.fr))){lineTick(a);return}if(!a.fr)return;
  if(a.atk&&!atWar(S.me,a.fr))a.atk=0;
  if(a.t>=0&&friend(S.ctl[a.t],S.me)){log(`${a.n}: taarruz hedefi ${near(a.t)} ele geçirildi.`,1);a.t=-1}
  const fr=armyFront(a);if(!fr)return;const units=a.u.map(id=>S.U.find(u=>u.id===id)).filter(u=>u&&!u.emb&&!isS(u.r));
  const at=new Map();for(const u of S.U){if(u.emb)continue;(at.get(u.r)||at.set(u.r,[]).get(u.r)).push(u)}
  const hostile=r=>(at.get(r)||[]).filter(e=>atWar(S.me,e.o));
  const idle=units.filter(u=>!u.path.length&&u.org>30),used=new Set();
  if(a.atk&&atWar(S.me,a.fr)){const T=a.t>=0?RG[a.t]:null,tg=[];
    for(const r of fr.E){const cand=idle.filter(u=>adjL[u.r].includes(r));if(!cand.length)continue;const e=hostile(r).reduce((s,x)=>s+defP(x),0);
      tg.push({r,e,cand,pr:T?-Math.hypot(RG[r].x-T.x,RG[r].y-T.y)/150:0})}
    tg.sort((x,y)=>(y.pr+y.cand.length/(y.e+.5))-(x.pr+x.cand.length/(x.e+.5)));
    for(const t of tg){const c=t.cand.filter(u=>!used.has(u.id)).sort((x,y)=>atkP(y,t.r)-atkP(x,t.r));let p=0;const go=[];
      for(const u of c){const here=(at.get(u.r)||[]).filter(x=>x.o===S.me&&!x.path.length&&!used.has(x.id)).length,thr=adjL[u.r].some(j=>hostile(j).length);
        if(here<=1&&thr&&p>0)continue;go.push(u);p+=atkP(u,t.r);if(p>t.e*1.6+.4)break}
      if(p>t.e*1.15+.2||t.e===0)for(const u of go){u.path=[t.r];u.prog=0;used.add(u.id)}}}
  /* cephe boyunca dağılım */
  const F=fr.F,need=new Map();let tw=0;for(const r of F){const w=1+adjL[r].reduce((s,j)=>s+hostile(j).length,0)*.6;need.set(r,w);tw+=w}
  const cnt=new Map();for(const u of units){const d=u.path.length?u.path[u.path.length-1]:u.r;if(need.has(d))cnt.set(d,(cnt.get(d)||0)+1)}
  const share=r=>units.length*need.get(r)/tw;
  for(const u of idle){if(used.has(u.id))continue;const inF=need.has(u.r);if(inF&&(cnt.get(u.r)||0)<=Math.ceil(share(u.r)))continue;
    let best=-1,bv=-1e9;for(const r of F){const v=share(r)-(cnt.get(r)||0)-dist(u.r,r)/1500;if(v>bv){bv=v;best=r}}
    if(best>=0&&best!==u.r&&bv>.3){const p=path(S.me,u.r,best);if(p&&p.length){u.path=p;u.prog=0;if(inF)cnt.set(u.r,(cnt.get(u.r)||1)-1);cnt.set(best,(cnt.get(best)||0)+1)}}}}

/* elle çizilen savunma hattı: ordu, cephe yerine hattın geçtiği kendi bölgelerine dağılır; düşmana komşu kesimler daha çok asker alır */
function lineTick(a){const F=a.line.filter(r=>S.ctl[r]===S.me);if(!F.length)return;const units=a.u.map(id=>S.U.find(u=>u.id===id)).filter(u=>u&&!u.emb&&!isS(u.r));if(!units.length)return;
  const hc=new Map();for(const u of S.U)if(!u.emb&&atWar(S.me,u.o))hc.set(u.r,(hc.get(u.r)||0)+1);
  const need=new Map();let tw=0;for(const r of F){const w=1+adjL[r].reduce((s,j)=>s+(hc.get(j)||0),0)*.6;need.set(r,w);tw+=w}
  const cnt=new Map();for(const u of units){const d=u.path.length?u.path[u.path.length-1]:u.r;if(need.has(d))cnt.set(d,(cnt.get(d)||0)+1)}
  const share=r=>units.length*need.get(r)/tw;
  for(const u of units){if(u.path.length||u.org<=30)continue;const inF=need.has(u.r);if(inF&&(cnt.get(u.r)||0)<=Math.max(1,Math.ceil(share(u.r))))continue;
    let best=-1,bv=-1e9;for(const r of F){if(r===u.r)continue;const v=share(r)-(cnt.get(r)||0)-dist(u.r,r)/1500;if(v>bv){bv=v;best=r}}
    if(best>=0&&(!inF||bv>.3)){const p=path(S.me,u.r,best);if(p&&p.length){u.path=p;u.prog=0;if(inF)cnt.set(u.r,(cnt.get(u.r)||1)-1);cnt.set(best,(cnt.get(best)||0)+1)}}}}

/* ---------- barış konferansı ve kukla devletler ---------- */
const ORIGC=c=>{const o=[];for(let r=0;r<NR;r++)if(isL(r)&&S.own[r]===c)o.push(r);return o};
function killState(c){const C=S.C[c];C.alive=0;S.U=S.U.filter(u=>u.o!==c);S.A=S.A.filter(w=>w.o!==c);S.F=S.F.filter(f=>f.o!==c);
  S.war=S.war.filter(w=>w.a!==c&&w.b!==c);for(const al of S.allies)al.m=al.m.filter(x=>x!==c);S.allies=S.allies.filter(al=>al.m.length>1);delete S.pup[c];
  for(const x in S.pup)if(S.pup[x]===c){delete S.pup[x]}}
/* teslim olan ülkeyle savaşan oyuncu masaya oturur; yapay zekâ kazananlar kendi işgal ettiklerini alır */
function openConference(c){S.conf={c,sel:ORIGC(c).filter(r=>S.ctl[r]===S.me)};S.bat=[];for(const u of S.U)if(u.path.length&&S.own[u.path[u.path.length-1]]===c&&mine(u.o)){u.path=[];u.prog=0}
  S.U=S.U.filter(u=>u.o!==c);S.A=S.A.filter(w=>w.o!==c);S.F=S.F.filter(f=>f.o!==c);S.war=S.war.filter(w=>w.a!==c&&w.b!==c);
  log(`<b>${NM(c)} teslim oldu.</b> Barış konferansı toplanıyor.`,1);popEv({k:'conf',c})}
function confFinish(mode){const cf=S.conf;if(!cf)return;const c=cf.c,me=S.me,regs=ORIGC(c);let got=0,gave=0;
  for(const r of regs){const h=S.ctl[r],o=h&&h!==me&&h!==c&&h!=='ISY'&&V.C[h]?h:null;
    if(o){S.own[r]=S.ctl[r]=o;gave++;continue}
    if(mode==='annex'||cf.sel.includes(r)){S.own[r]=S.ctl[r]=me;got++;S.res[r]=Math.max(S.res[r]||0,baseRes(S.core[r],me)*.7);S.cmp[r]=S.cmp[r]||0}
    else S.own[r]=S.ctl[r]=c}
  for(let r=0;r<NR;r++)if(S.ctl[r]===c&&S.own[r]!==c)S.ctl[r]=S.own[r];
  const left=regs.filter(r=>S.own[r]===c).length,C=S.C[c];
  if(mode==='annex'||!left){killState(c);log(`Barış antlaşması: ${NM(c)} ortadan kalktı; ${got} bölge topraklarına katıldı.`,1)}
  else{C.alive=1;C.stab=35;C.ws=15;C.tr=Math.max(.2,C.tr*.3);C.prod=[];for(const x of V.ORDER)if(x!==c)S.truce[rk(x,c)]=S.h+24*365;
    const cap=capOf(c);if(cap>=0)for(let i=0;i<2;i++)mkUnit(c,'mi',cap);
    if(mode==='puppet'){S.pup[c]=me;S.pupH[c]=S.h;S.allies=S.allies.filter(al=>!al.m.includes(c));S.allies.push({n:`${SN(me)} himayesi`,m:[me,c],pup:1});addRel(me,c,40);
      log(`Barış antlaşması: ${got} bölge topraklarına katıldı; ${NM(c)} himayende kukla devlet oldu.`,1)}
    else{addRel(me,c,-15);log(`Barış antlaşması: ${got} bölge topraklarına katıldı, kalan ${left} bölge ${ek(c,'e')} bırakıldı.`,1)}}
  if(gave)log(`Müttefiklerin işgal ettikleri ${gave} bölgeyi aldı.`);
  S.conf=null;U.mode=null;S.mapDirty=1;BP=null;evict();resume();dirty(1)}
function annexPuppet(c){if(S.pup[c]!==S.me)return;for(let r=0;r<NR;r++)if(S.own[r]===c){S.own[r]=S.ctl[r]=S.me;S.cmp[r]=Math.max(S.cmp[r]||0,60);S.res[r]=0}
  for(const u of S.U)if(u.o===c)u.o=S.me;for(const w of S.A)if(w.o===c)w.o=S.me;for(const f of S.F)if(f.o===c)f.o=S.me;S.C[S.me].tr+=Math.max(0,S.C[c].tr);
  killState(c);S.mapDirty=1;log(`${NM(c)} barışçıl yoldan topraklarına katıldı.`,1)}
function freePuppet(c,why){delete S.pup[c];S.allies=S.allies.filter(al=>!(al.pup&&al.m.includes(c)));log(`${NM(c)} bağımsızlığını ${why||'kazandı'}.`,1);dirty(1)}

/* ---------- kayıt ---------- */
function save(){if(U.it!=null)return;try{localStorage.setItem(slotKey(S.slot||1),JSON.stringify(S))}catch(e){}}
function load(n){if(n)return loadSlot(n);for(const k of [1,2,3]){const j=loadSlot(k);if(j)return j}return null}

/* ---------- harita çizimi ----------
   Katmanlar (alttan üste): yordamsal arazi kabartması ve deniz derinliği (yarı çözünürlük, bir kez üretilir) → ülke renkleri
   (yakınlaştıkça saydamlaşır; işgal taramalı) → vektör sınırlar ve nehirler (od-sinir.js) → kavisli ülke adları, şehirler →
   ordu cepheleri ve taarruz okları → hareket okları → birlik sayaçları, muharebe işaretleri, yakında asker ve tank figürleri. */
let ids=null,terCv=null,polCv=null,polCtx=null,polImg=null,cv=null,ctx=null,dpr=1;const VW={x:0,y:0,s:.5};
const NTER={LBY:'col',SDN:'col',SSD:'ova',ERI:'dag',ETH:'dag',DJI:'col',SOM:'col',AFG:'dag',PAK:'dag',TKM:'col',UZB:'col',KAZ:'col',ARM:'dag',AZE:'tepe',GEO:'dag',RUS:'ova',BGR:'tepe',GRC:'dag'};
const terOf=r=>RG[r].tr||NTER[RG[r].c]||'tepe';
const hsh=(x,y)=>{let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296};
function vn(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hsh(xi,yi),b=hsh(xi+1,yi),c=hsh(xi,yi+1),d=hsh(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function blur(a,w,h,r,ch){const t=new Float32Array(a.length);for(let pass=0;pass<2;pass++){const src=pass?t:a,dst=pass?a:t;
  for(let k=0;k<ch;k++){if(!pass)for(let y=0;y<h;y++){let s=0;for(let x=-r;x<=r;x++)s+=src[(y*w+clamp(x,0,w-1))*ch+k];for(let x=0;x<w;x++){dst[(y*w+x)*ch+k]=s/(2*r+1);s+=src[(y*w+Math.min(w-1,x+r+1))*ch+k]-src[(y*w+Math.max(0,x-r))*ch+k]}}
    else for(let x=0;x<w;x++){let s=0;for(let y=-r;y<=r;y++)s+=src[(clamp(y,0,h-1)*w+x)*ch+k];for(let y=0;y<h;y++){dst[(y*w+x)*ch+k]=s/(2*r+1);s+=src[(Math.min(h-1,y+r+1)*w+x)*ch+k]-src[(Math.max(0,y-r)*w+x)*ch+k]}}}}}
function mkTerrain(){const TW=MW>>1,TH=MH>>1,N=TW*TH,typ=new Uint8Array(N),amp=new Float32Array(N),base=new Float32Array(N*3);
  const TA={ova:.1,tepe:.45,dag:1,col:.2,bat:.03},TC={ova:[121,128,90],tepe:[124,117,88],dag:[116,108,95],col:[198,174,128],bat:[88,108,82]};
  for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const i=y*TW+x,r=ids[(y*2)*MW+x*2];if(r>=0&&RG[r].t!=='s'){typ[i]=2;const t=terOf(r);amp[i]=TA[t];const c=TC[t];base[i*3]=c[0];base[i*3+1]=c[1];base[i*3+2]=c[2]}else{typ[i]=1;base[i*3]=118;base[i*3+1]=124;base[i*3+2]=92}}
  blur(amp,TW,TH,7,1);blur(base,TW,TH,4,3);
  /* denizde kıyıya uzaklık (çok kaynaklı BFS) */
  const dd=new Uint8Array(N).fill(255),q=new Int32Array(N);let qh=0,qt=0;for(let i=0;i<N;i++)if(typ[i]===2){dd[i]=0;q[qt++]=i}
  while(qh<qt){const i=q[qh++],x=i%TW,y=(i/TW)|0,d=dd[i]+1;if(d>60)continue;for(const j of [x>0?i-1:-1,x<TW-1?i+1:-1,y>0?i-TW:-1,y<TH-1?i+TW:-1])if(j>=0&&dd[j]>d){dd[j]=d;q[qt++]=j}}
  const hgt=new Float32Array(N);for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const i=y*TW+x;if(typ[i]!==2)continue;const a=amp[i];
    let h=0,f=1/64,w=1;for(let o=0;o<5;o++){let n=vn(x*f+o*17,y*f-o*29);if(a>.35)n=1-Math.abs(2*n-1);h+=n*w;f*=2.03;w*=.5}hgt[i]=h*a*1.6+vn(x/9,y/9)*.04}
  const c=document.createElement('canvas');c.width=TW;c.height=TH;const x2=c.getContext('2d'),im=x2.createImageData(TW,TH),px=im.data;
  for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const i=y*TW+x,j=i*4;let R,G,B;
    if(typ[i]===2){const h0=hgt[i],hx=x>0&&y>0?hgt[i-TW-1]:h0,hy=x<TW-1&&y<TH-1?hgt[i+TW+1]:h0,sh=clamp(1+(hx-hy)*5.5,.55,1.4),gr=.95+vn(x*.9,y*.9)*.1;
      R=base[i*3]*sh*gr;G=base[i*3+1]*sh*gr;B=base[i*3+2]*sh*gr}
    else{const t=Math.min(1,dd[i]/34),n=vn(x/14,y/14)*6;R=46-30*t+n;G=82-46*t+n;B=108-52*t+n}
    px[j]=R;px[j+1]=G;px[j+2]=B;px[j+3]=255}
  x2.putImageData(im,0,0);return c}
/* sınır çizgileri: Chaikin ile yumuşatılır; uçlar (kavşaklar) sabit kalır */
let CH=[],CHof=[],RIVP=[];const RX=new Set();
if(typeof ODB!=='undefined')for(let i=0;i<ODB.rx.length;i+=2){RX.add(ODB.rx[i]*1000+ODB.rx[i+1]);RX.add(ODB.rx[i+1]*1000+ODB.rx[i])}
function chaikin(p){if(p.length<6)return p;const o=[p[0],p[1]];for(let i=0;i+3<p.length;i+=2){const ax=p[i],ay=p[i+1],bx=p[i+2],by=p[i+3];o.push(ax*.75+bx*.25,ay*.75+by*.25,ax*.25+bx*.75,ay*.25+by*.75)}o.push(p[p.length-2],p[p.length-1]);return o}
function prepBorders(){for(const e of ODB.b){const pts=chaikin(chaikin(e.slice(2)));const k=CH.length;CH.push({a:e[0],b:e[1],p:pts});for(const r of [e[0],e[1]])if(r>=0)(CHof[r]=CHof[r]||[]).push(k)}
  for(const [n,l] of ODB.riv)RIVP.push({n,p:chaikin(chaikin(l))})}
const crossRiver=(a,b)=>RX.has(a*1000+b);
let BP=null;/* kategori başına Path2D; sahiplik değişince yeniden kurulur */
function buildPaths(){const P={prov:new Path2D(),ctry:new Path2D(),coast:new Path2D(),sea:new Path2D(),nn:new Path2D()},L={ctry:new Path2D(),coast:new Path2D(),sea:new Path2D(),nn:new Path2D()},c=S.ctl;
  for(const ch of CH){const A=ch.a>=0?RG[ch.a]:null,B=ch.b>=0?RG[ch.b]:null;let k;
    if(!A||!B)k=(A&&A.t==='s')||(B&&B.t==='s')?'sea':'coast';
    else if(A.t==='s'&&B.t==='s')k='sea';else if(A.t==='s'||B.t==='s')k='coast';
    else if(A.t==='n'&&B.t==='n')k='nn';else if(A.t==='n'||B.t==='n')k='ctry';else k=c[ch.a]===c[ch.b]?'prov':'ctry';
    const p=ch.p,g=P[k];g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);
    /* uzak görünüm için seyreltilmiş kopya: noktalar en az 3 harita birimi aralıklı (ekranda 1,5 pikselden kısa ayrıntı atılır) */
    if(k!=='prov'){const q=L[k];q.moveTo(p[0],p[1]);let lx=p[0],ly=p[1];for(let i=2;i<p.length;i+=2){const last=i===p.length-2;if(last||Math.abs(p[i]-lx)+Math.abs(p[i+1]-ly)>=3){q.lineTo(p[i],p[i+1]);lx=p[i];ly=p[i+1]}}}}
  P.lo=L;BP=P}
function prep(cb){if(ids)return cb();const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=MW;c.height=MH;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);
    const d=x.getImageData(0,0,MW,MH).data;ids=new Int16Array(MW*MH);for(let i=0,j=0;i<ids.length;i++,j+=4)ids[i]=d[j]+d[j+1]*256-1;
    polCv=document.createElement('canvas');polCv.width=MW;polCv.height=MH;polCtx=polCv.getContext('2d');polImg=polCtx.createImageData(MW,MH);
    occCv=document.createElement('canvas');occCv.width=MW;occCv.height=MH;occCtx=occCv.getContext('2d');occImg=occCtx.createImageData(MW,MH);
    prepBorders();let left=2;const done=()=>{if(--left===0){try{buildWorld()}catch(e){console.error(e)}cb()}};
    if(typeof ODT==='undefined'){terCv=mkTerrain();done()}else{const ti=new Image();ti.onload=()=>{terCv=ti;done()};ti.onerror=()=>{terCv=mkTerrain();done()};ti.src='od-arazi.webp'}
    if(typeof ODW==='undefined')done();else{const wi=new Image();wi.onload=()=>{worldImg=wi;done()};wi.onerror=()=>done();wi.src='od-dunya.webp'}};
  im.src=M.png}
/* ---------- dünya: bölgenin dışı (oynanmaz), 360° döner ----------
   Kabartma od-dunya.webp'ten (araclar/dunya-yap.py); ülke sınırları ve renkleri Küba modunun dünya topolojisinden. */
let worldImg=null,WORLD=null;
const WN={USA:'ABD',CAN:'Kanada',MEX:'Meksika',BRA:'Brezilya',ARG:'Arjantin',CHL:'Şili',PER:'Peru',COL:'Kolombiya',VEN:'Venezuela',BOL:'Bolivya',
  RUS:'Rusya',CHN:'Çin',IND:'Hindistan',PAK:'Pakistan',AFG:'Afganistan',KAZ:'Kazakistan',UZB:'Özbekistan',TKM:'Türkmenistan',MNG:'Moğolistan',JPN:'Japonya',KOR:'G. Kore',PRK:'K. Kore',
  IDN:'Endonezya',THA:'Tayland',VNM:'Vietnam',MMR:'Myanmar',PHL:'Filipinler',MYS:'Malezya',BGD:'Bangladeş',NPL:'Nepal',AUS:'Avustralya',NZL:'Y. Zelanda',
  FRA:'Fransa',DEU:'Almanya',GBR:'Birleşik Krallık',ESP:'İspanya',PRT:'Portekiz',ITA:'İtalya',POL:'Polonya',UKR:'Ukrayna',BLR:'Belarus',ROU:'Romanya',BGR:'Bulgaristan',GRC:'Yunanistan',
  SWE:'İsveç',NOR:'Norveç',FIN:'Finlandiya',SRB:'Sırbistan',HUN:'Macaristan',AUT:'Avusturya',CZE:'Çekya',IRL:'İrlanda',ISL:'İzlanda',GEO:'Gürcistan',ARM:'Ermenistan',AZE:'Azerbaycan',
  EGY:'Mısır',LBY:'Libya',DZA:'Cezayir',MAR:'Fas',TUN:'Tunus',SDN:'Sudan',SSD:'G. Sudan',ETH:'Etiyopya',ERI:'Eritre',SOM:'Somali',KEN:'Kenya',TZA:'Tanzanya',NGA:'Nijerya',NER:'Nijer',
  MLI:'Mali',TCD:'Çad',MRT:'Moritanya',COD:'Kongo DC',AGO:'Angola',ZAF:'G. Afrika',NAM:'Namibya',BWA:'Botsvana',ZMB:'Zambiya',MOZ:'Mozambik',MDG:'Madagaskar',CAF:'Orta Afrika',CMR:'Kamerun',GRL:'Grönland'};
const WPAL=[[164,132,98],[118,150,112],[160,156,104],[126,124,170],[172,116,112],[104,148,160],[176,148,92],[138,114,160],[124,158,136],[180,138,114],[118,128,140],[156,168,124]];
const wcol=iso=>COL[iso]||WPAL[[...String(iso)].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7)%WPAL.length];
const mLat1=Math.asinh(Math.tan(M.LAT1*Math.PI/180)),PXl=lo=>(lo-M.LON0)*Math.PI/180*M.K,PYl=la=>(mLat1-Math.asinh(Math.tan(clamp(la,-85,85)*Math.PI/180)))*M.K;
function buildWorld(){if(WORLD||!worldImg||typeof Datamap==='undefined'||typeof topojson==='undefined')return;
  const topo=Datamap.prototype.worldTopo,obj=topo.objects.world||Object.values(topo.objects)[0],feats=topojson.feature(topo,obj).features;
  const Wc=2048,Hc=Math.round(Wc*ODW.h/ODW.w),fc=document.createElement('canvas');fc.width=Wc;fc.height=Hc;const x=fc.getContext('2d');
  const cx=X=>(X-ODW.x)/ODW.w*Wc,cy=Y=>(Y-ODW.y)/ODW.h*Hc,labels=[];
  for(const f of feats){if(!f.geometry||f.id==='ATA')continue;const c=wcol(f.id);x.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;
    const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;let best=null,ba=0;
    for(const poly of polys){const cross=poly.some(r=>r.some((p,i)=>i&&Math.abs(p[0]-r[i-1][0])>180)),lx=v=>cross&&v<0?v+360:v;
      for(const off of cross?[0,-360]:[0]){x.beginPath();for(const r of poly){r.forEach((p,i)=>{const X=cx(PXl(lx(p[0])+off)),Y=cy(PYl(p[1]));i?x.lineTo(X,Y):x.moveTo(X,Y)});x.closePath()}x.fill('evenodd')}
      const r=poly[0];if(cross||!r||r.length<4)continue;let a=0,mx=0,my=0;for(let i=0;i<r.length-1;i++){const [x1,y1]=r[i],[x2,y2]=r[i+1],k=x1*y2-x2*y1;a+=k;mx+=(x1+x2)*k;my+=(y1+y2)*k}
      if(Math.abs(a)>ba&&a){ba=Math.abs(a);best=[mx/(3*a),my/(3*a)]}}
    if(best&&WN[f.id]&&!V.C[f.id]){const deg=M.K*Math.PI/180,side=Math.sqrt(ba/2)*deg,n=WN[f.id].toLocaleUpperCase('tr');labels.push({n,x:PXl(best[0]),y:PYl(best[1]),fs:Math.min(side*1.5/(n.length*.68),side*.32)})}}
  const bp=new Path2D(),cp=new Path2D();
  const add=(path,m)=>{for(const l of m.coordinates){let last=null;for(let i=0;i<l.length;i++){const [lo,la]=l[i];if(la<-61){last=null;continue}const X=PXl(lo),Y=PYl(la);
    if(last&&Math.abs(lo-l[i-1][0])>180)last=null;if(!last){path.moveTo(X,Y);last=[X,Y];continue}if(i<l.length-1&&Math.abs(X-last[0])+Math.abs(Y-last[1])<3)continue;path.lineTo(X,Y);last=[X,Y]}}};
  add(bp,topojson.mesh(topo,obj,(a,b)=>a!==b));add(cp,topojson.mesh(topo,obj,(a,b)=>a===b));
  WORLD={fc,bp,cp,labels}}
/* siyasi katman: kara parselleri ülke rengiyle (işgal: sahibinin rengiyle tarama), deniz saydam; sınırlar vektör olarak ayrıca çizilir */
const DR=new Set();const markR=r=>{if(r>=0&&isL(r)){DR.add(r);BP=null}};
let occCv=null,occCtx=null,occImg=null;
const sideRGB=o=>mine(o)?[61,220,132]:ally(S.me,o)||S.pup[o]===S.me?[74,168,255]:atWar(S.me,o)?[255,77,77]:[205,208,212];
function colTab(){const o=S.own,c=S.ctl,tab=[],mode=U.mm||'pol',AM=mode==='hava'?airMap():null;
  for(let r=0;r<NR;r++){const R=RG[r];
    /* deniz görünümü: denizler denetleyenin rengiyle, kara soluk */
    if(mode==='den'){if(R.t==='s'){const w=seaOf(r);tab[r]=w?(w==='~'?[[226,194,90],[226,194,90],0]:[sideRGB(w),sideRGB(w),0]):null;continue}if(R.t==='l'){const g=(COL[c[r]]||[90,90,90]).map(v=>v*.12+78);tab[r]=[g,g,0];continue}}
    /* hava görünümü: avcı gücüne göre yeşil (bizde), kırmızı (düşmanda), sarı (çekişmeli) */
    if(mode==='hava'&&R.t==='l'){const p=AM[r];let g=(COL[c[r]]||[90,90,90]).map(v=>v*.12+78);if(p){const k=(p[0]-p[1])/(p[0]+p[1]);g=k>.25?[61,220,132]:k<-.25?[255,77,77]:[226,194,90]}tab[r]=[g,g,0];continue}
    if(R.t==='s'){tab[r]=null;continue}if(R.t==='n'){const w=wcol(R.c);tab[r]=[w,w,0];continue}
    let a=COL[c[r]]||wcol(c[r]),b=COL[o[r]]||a;
    if(mode==='res'){const v=resOf(r);a=b=v<0?[70,74,78]:[60+v*1.9,170-v*1.3,70];tab[r]=[a,b,0];continue}
    if(S.dmg[r]){const k=1-S.dmg[r]*.45;a=a.map(v=>v*k)}
    /* işgal edilen bölge şeritsiz, doğrudan tutan ülkenin rengiyle (asıl sahibi bölge panelinde ve Direnç görünümünde) */
    const hh=(r*2654435761>>>0)%7;tab[r]=[a.map(v=>v*(.95+hh*.012)),b.map(v=>v*.8),false]}return tab}
/* işgal: sahibinin rengiyle piksel taraması */
function pix(i,tab,px){const r=ids[i],j=i*4,t=r>=0?tab[r]:null;if(!t){px[j+3]=0;return}const x=i%MW,y=(i/MW)|0,col=t[2]&&((x+y)&9)<3?t[1]:t[0];px[j]=col[0];px[j+1]=col[1];px[j+2]=col[2];px[j+3]=255}
function paint(){const tab=colTab(),px=polImg.data;
  if(S.mapDirty||!OD._painted){for(let i=0;i<ids.length;i++)pix(i,tab,px);polCtx.putImageData(polImg,0,0);OD._painted=1}
  else for(const r of DR){const [x0,y0,x1,y1]=RG[r].b;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*MW+x;if(ids[i]===r)pix(i,tab,px)}polCtx.putImageData(polImg,0,0,x0,y0,x1-x0+1,y1-y0+1)}
  DR.clear();S.mapDirty=0;BP=null;OD.pver++;labelPos()}
/* ülke adları: ülkenin parsellerinin ana ekseni boyunca, hafif kavisli, harfleri aralıklı */
let LBL={};
function labelPos(){LBL={};const by={};for(let r=0;r<NR;r++){const c=S.ctl[r];if(!c||!isL(r))continue;(by[c]=by[c]||[]).push(r)}
  for(const c in by){const rs=by[c];let sw=0,mx=0,my=0;for(const r of rs){sw+=RG[r].a;mx+=RG[r].x*RG[r].a;my+=RG[r].y*RG[r].a}mx/=sw;my/=sw;
    let cxx=0,cyy=0,cxy=0;for(const r of rs){const dx=RG[r].x-mx,dy=RG[r].y-my,w=RG[r].a;cxx+=dx*dx*w;cyy+=dy*dy*w;cxy+=dx*dy*w}
    let th=.5*Math.atan2(2*cxy,cxx-cyy);if(th>Math.PI/2)th-=Math.PI;if(th<-Math.PI/2)th+=Math.PI;th=clamp(th,-.6,.6);
    const ux=Math.cos(th),uy=Math.sin(th);let t0=1e9,t1=-1e9,n0=1e9,n1=-1e9;
    for(const r of rs){const R=RG[r],h=Math.sqrt(R.a)*.45;for(const [x,y] of [[R.x-h,R.y-h],[R.x+h,R.y-h],[R.x-h,R.y+h],[R.x+h,R.y+h]]){const t=(x-mx)*ux+(y-my)*uy,n=-(x-mx)*uy+(y-my)*ux;t0=Math.min(t0,t);t1=Math.max(t1,t);n0=Math.min(n0,n);n1=Math.max(n1,n)}}
    const txt=SN(c).toLocaleUpperCase('tr'),L=(t1-t0)*.72,fs=Math.min(L/(txt.length*.78+.5),(n1-n0)*.42,95);
    let best=rs[0],bd=1e12;for(const r of rs){const d=(RG[r].x-mx)**2+(RG[r].y-my)**2;if(d<bd){bd=d;best=r}}
    LBL[c]={x:mx*.6+RG[best].x*.4,y:my*.6+RG[best].y*.4,th,L,fs,txt,a:sw}}}
const FONT='Roboto,"Segoe UI","Helvetica Neue",Arial,sans-serif';
function arcText(txt,X,Y,th,L,fs,col,sh){/* ekran koordinatında, merkezi X,Y; yay boyu L */
  const n=txt.length;if(n<1)return;const sag=L*.07;ctx.font=`800 ${fs}px "Big Shoulders Display","Arial Narrow",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<n;i++){const t=(i/(Math.max(1,n-1))-.5);const lx=t*L,ly=-sag*(1-4*t*t)+sag*.5,ang=th+Math.atan(sag*8*t/Math.max(1,L));
    const x=X+lx*Math.cos(th)-ly*Math.sin(th),y=Y+lx*Math.sin(th)+ly*Math.cos(th);ctx.save();ctx.translate(x,y);ctx.rotate(ang);
    if(sh){ctx.fillStyle=sh;ctx.fillText(txt[i],1.2,1.2)}ctx.fillStyle=col;ctx.fillText(txt[i],0,0);ctx.restore()}}
/* seçili bölge: sınır parçalarıyla parlak çizgi */
let selR=-1;function selMask(r){selR=r}
const sx=x=>(x-VW.x)*VW.s,sy=y=>(y-VW.y)*VW.s;
/* telefonda tuval çözünürlüğü en çok 1,5× (2×'e göre neredeyse yarı yarıya az piksel; fark gözle zor seçilir) */
const dprCap=()=>Math.min(cv&&cv.clientWidth<820?1.5:2,window.devicePixelRatio||1);
const inView=(X,Y,m,w,h)=>X>-m&&Y>-m&&X<w+m&&Y<h+m;
function strokeChains(list,lw,col,dash){ctx.beginPath();for(const k of list){const p=CH[k].p;ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1])}ctx.lineWidth=lw/VW.s;ctx.strokeStyle=col;ctx.setLineDash(dash?dash.map(v=>v/VW.s):[]);ctx.stroke();ctx.setLineDash([])}
/* çizim iki aşamalıdır: sabit taban (dünya, arazi, renkler, nehirler, sınırlar, adlar) ekran boyutunda bir önbelleğe yalnızca
   görünüm ya da harita değişince çizilir; kaydırırken hafif sürüm, durunca tam kalite. Birlikler, oklar, cepheler ve
   muharebeler her karede bu önbelleğin üstüne çizilir. Bölge haritası dünyanın içinde tek kopyadır; dünya ±360° tekrarlanır. */
let baseCv=null,baseKey='',baseFast=false,lastMove=0;OD.mver=0;
const TILE=new Map();
function detailTiles(w,h,s){if(typeof ODT==='undefined')return;const T=ODT.ts/ODT.k,x0=Math.max(0,Math.floor(VW.x/T)),y0=Math.max(0,Math.floor(VW.y/T)),
  x1=Math.min(ODT.nx-1,Math.floor((VW.x+w/s)/T)),y1=Math.min(ODT.ny-1,Math.floor((VW.y+h/s)/T));
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const k=tx+'_'+ty;let im=TILE.get(k);
    if(!im){im=new Image();im.onload=()=>{im._ok=1;baseKey=''};im.src=`od-arazi/t${k}.webp`;TILE.set(k,im);
      if(TILE.size>90){for(const [kk] of TILE){if(TILE.size<=70)break;if(kk!==k)TILE.delete(kk)}}continue}
    if(im._ok)ctx.drawImage(im,tx*T,ty*T,im.width/ODT.k,im.height/ODT.k)}}
/* siyasi renk: önce "renk" karışımı (gölgeler korunur), sonra "çarpma", sonra uzaklığa göre düz bir katman */
function tint(img,dx,dy,dw,dh,s,mode){ctx.imageSmoothingEnabled=s<2;
  if(mode==='ter'){ctx.globalAlpha=.12;ctx.drawImage(img,dx,dy,dw,dh)}
  else{ctx.globalCompositeOperation='color';ctx.globalAlpha=.88;ctx.drawImage(img,dx,dy,dw,dh);
    ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.42;ctx.drawImage(img,dx,dy,dw,dh);ctx.globalCompositeOperation='source-over';
    ctx.globalAlpha=mode==='res'?.4:clamp(.4-(s-.5)*.35,.06,.4);ctx.drawImage(img,dx,dy,dw,dh)}
  ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true}
/* uzak görünüm (ölçek ≤ 0,5) için önceden birleştirilmiş katmanlar: arazi + siyasi renk karışımı her karede yeniden
   harmanlanmaz; dünya bir kez (harita türü değişince), bölge her boyamada bir kez birleştirilir. Bu ölçeklerde renk
   katmanının saydamlığı sabit olduğu için görüntü aynıdır; kaydırırken kare başına onlarca karışım işlemi kalkar. */
let WB=null,WBk='',RB=null,RBk='';OD.pver=0;
function bakedWorld(mode){const k=['res','den','hava'].includes(mode)?'ter':mode;if(WB&&WBk===k)return WB;
  const W=2560,H=Math.round(W*ODW.h/ODW.w),c=WB||document.createElement('canvas');c.width=W;c.height=H;const main=ctx;ctx=c.getContext('2d');
  try{ctx.setTransform(W/ODW.w,0,0,H/ODW.h,-ODW.x*W/ODW.w,-ODW.y*H/ODW.h);ctx.lineCap='round';ctx.lineJoin='round';
    ctx.drawImage(worldImg,ODW.x,ODW.y,ODW.w,ODW.h);tint(WORLD.fc,ODW.x,ODW.y,ODW.w,ODW.h,.25,k);
    ctx.strokeStyle='rgba(8,14,20,.75)';ctx.lineWidth=2.2/.3;ctx.stroke(WORLD.cp);ctx.strokeStyle='#07090c';ctx.lineWidth=2.2/.3;ctx.stroke(WORLD.bp)}finally{ctx=main}
  WB=c;WBk=k;return c}
function bakedReg(mode){const k=mode+'|'+OD.pver;if(RB&&RBk===k)return RB;const c=RB||document.createElement('canvas');c.width=MW;c.height=MH;const main=ctx;ctx=c.getContext('2d');
  try{ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(terCv,0,0,MW,MH);tint(polCv,0,0,MW,MH,.25,mode)}finally{ctx=main}RB=c;RBk=k;return c}
function renderBase(w,h,fast){if(!baseCv)baseCv=document.createElement('canvas');const W2=Math.round(w*dpr),H2=Math.round(h*dpr);if(baseCv.width!==W2||baseCv.height!==H2){baseCv.width=W2;baseCv.height=H2}
  const main=ctx;ctx=baseCv.getContext('2d');try{
  const s=VW.s,mode=U.mm||'pol',WW=typeof ODW!=='undefined'?ODW.ww:0,vx0=VW.x,vx1=VW.x+w/s;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#0d1c2a';ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(-VW.x*s,-VW.y*s);ctx.scale(s,s);ctx.imageSmoothingEnabled=true;ctx.lineCap='round';ctx.lineJoin='round';
  /* dünya (bölge dikdörtgeni dışında), bölgeyle aynı stilde */
  if(worldImg&&WORLD)for(let k=-1;k<=1;k++){const ox=k*WW;if(ODW.x+ox>vx1||ODW.x+ox+ODW.w<vx0)continue;ctx.save();ctx.translate(ox,0);
    if(k===0){ctx.beginPath();ctx.rect(ODW.x-20,ODW.y-20,ODW.w+40,ODW.h+40);ctx.rect(0,0,MW,MH);ctx.clip('evenodd')}
    if(s<=.65)ctx.drawImage(bakedWorld(mode),ODW.x,ODW.y,ODW.w,ODW.h);else{
    ctx.drawImage(worldImg,ODW.x,ODW.y,ODW.w,ODW.h);tint(WORLD.fc,ODW.x,ODW.y,ODW.w,ODW.h,s,['res','den','hava'].includes(mode)?'ter':mode);
    ctx.strokeStyle='rgba(8,14,20,.75)';ctx.lineWidth=2.2/s;ctx.stroke(WORLD.cp);if(!fast){ctx.strokeStyle='rgba(190,215,225,.35)';ctx.lineWidth=.7/s;ctx.stroke(WORLD.cp)}
    ctx.strokeStyle='#07090c';ctx.lineWidth=Math.min(4,2+s*.6)/s;ctx.stroke(WORLD.bp);if(!fast){ctx.strokeStyle='rgba(235,230,215,.28)';ctx.lineWidth=.8/s;ctx.stroke(WORLD.bp)}}
    ctx.restore()}
  /* bölge */
  if(s<=.65)ctx.drawImage(bakedReg(mode),0,0,MW,MH);else{ctx.drawImage(terCv,0,0,MW,MH);if(s>1.25)detailTiles(w,h,s);
  tint(polCv,0,0,MW,MH,s,mode)}
  /* nehirler */
  if(s>.45&&!fast){for(const rv of RIVP){ctx.beginPath();const p=rv.p;ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);
    ctx.strokeStyle='#1d3a52';ctx.lineWidth=Math.min(4.2,2.4*s)/s;ctx.stroke();ctx.strokeStyle='#5d93bd';ctx.lineWidth=Math.min(2.6,1.4*s)/s;ctx.stroke()}}
  /* sınırlar */
  const BL=s<=.65?BP.lo:BP;
  if(!fast){ctx.strokeStyle='rgba(150,190,225,.16)';ctx.lineWidth=1/s;ctx.setLineDash([4/s,5/s]);ctx.stroke(BL.sea);ctx.setLineDash([])}
  ctx.strokeStyle='rgba(8,14,20,.75)';ctx.lineWidth=2.2/s;ctx.stroke(BL.coast);if(!fast){ctx.strokeStyle='rgba(190,215,225,.35)';ctx.lineWidth=.7/s;ctx.stroke(BL.coast)}
  if(s>.42&&!fast){ctx.strokeStyle=`rgba(12,14,16,${clamp(.25+s*.12,.25,.55)})`;ctx.lineWidth=Math.min(1.3,.55+s*.25)/s;ctx.stroke(BP.prov)}
  ctx.strokeStyle='rgba(20,22,26,.6)';ctx.lineWidth=1.2/s;ctx.stroke(BL.nn);
  ctx.strokeStyle='#07090c';ctx.lineWidth=Math.min(4,2+s*.6)/s;ctx.stroke(BL.ctry);if(!fast){ctx.strokeStyle='rgba(235,230,215,.28)';ctx.lineWidth=.8/s;ctx.stroke(BL.ctry)}
  ctx.restore();
  ctx.textAlign='center';ctx.textBaseline='middle';
  /* ülke adları: dünya ve bölge */
  if(s<1.45&&mode!=='res'){const al=clamp((1.45-s)/.5,0,1),col=`rgba(245,240,226,${.8*al})`,shd=`rgba(10,12,16,${.55*al})`;
    /* adlar büyükten küçüğe yerleştirilir; daha önce yerleşmiş bir adla çakışan atlanır */
    const cand=[];
    for(const c in LBL){const L=LBL[c],fs=L.fs*s;if(fs<6)continue;const f2=clamp(fs,10,58),Ls=Math.min(Math.max(L.L*s,f2*L.txt.length*.7),f2*L.txt.length*.95);cand.push({t:L.txt,X:sx(L.x),Y:sy(L.y),th:fs<10?0:L.th,Ls,f2,pr:1e3+f2})}
    if(WORLD)for(let k=-1;k<=1;k++)for(const L of WORLD.labels){const X=sx(L.x+k*WW),Y=sy(L.y);if(!inView(X,Y,200,w,h))continue;if(k===0&&L.x>0&&L.x<MW&&L.y>0&&L.y<MH)continue;
      const f2=Math.min(L.fs*s*.85,40);if(f2<10)continue;cand.push({t:L.n,X,Y,th:0,Ls:f2*(L.n.length-1)*.82,f2,pr:f2})}
    cand.sort((a,b)=>b.pr-a.pr);const placed=[];
    for(const q of cand){const hw=(q.Ls/2+q.f2*.4)*Math.abs(Math.cos(q.th))+q.f2*.6*Math.abs(Math.sin(q.th)),hh=q.f2*.6+q.Ls/2*Math.abs(Math.sin(q.th));
      if(placed.some(p=>Math.abs(p.X-q.X)<p.hw+hw&&Math.abs(p.Y-q.Y)<p.hh+hh))continue;placed.push({X:q.X,Y:q.Y,hw,hh});arcText(q.t,q.X,q.Y,q.th,q.Ls,q.f2,col,shd)}}
  /* parsel adları */
  if(s>=1.8&&!fast){ctx.font='italic 11px "IBM Plex Sans Condensed","Arial Narrow",sans-serif';for(let r=0;r<NR;r++){const R=RG[r];if(R.t==='n')continue;const X=sx(R.x),Y=sy(R.y);if(!inView(X,Y,60,w,h)||R.a*s*s<6000)continue;ctx.fillStyle=R.t==='s'?'#9fc3e2aa':'#f5f0e2aa';ctx.fillText(R.n,X,Y+24)}}
  /* şehirler: başkent yıldız, diğerleri nokta */
  for(const c of M.C){const lv=c[3];if((lv===2&&s<.85)||(lv===3&&s<1.8)||s<.3)continue;const X=sx(c[1]),Y=sy(c[2]);if(!inView(X,Y,40,w,h))continue;
    if(c[4]){const en=atWar(S.me,S.ctl[c[5]]);if(en){ctx.fillStyle='rgba(220,40,40,.35)';ctx.beginPath();ctx.arc(X,Y,s<.7?8:10,0,7);ctx.fill()}star(X,Y,(s<.7?4.2:5.5)*(en?1.25:1),en?'#ff3b30':'#f3efe4',en?'#2a0000':'#0a0f15')}else{ctx.fillStyle='#1a1d22';ctx.beginPath();ctx.arc(X,Y,lv===1?3:2.2,0,7);ctx.fill();ctx.fillStyle='#e9e4d6';ctx.beginPath();ctx.arc(X,Y,lv===1?1.9:1.3,0,7);ctx.fill()}
    if(s>=(lv===1?.7:lv===2?1.25:2.3)){ctx.font=`${lv===1?600:400} ${lv===1?12.5:11}px "IBM Plex Sans Condensed","Arial Narrow",sans-serif`;ctx.textAlign='left';ctx.fillStyle='#0a0f15cc';ctx.fillText(c[0],X+7.5,Y+1);ctx.fillStyle='#f3efe4';ctx.fillText(c[0],X+7,Y);ctx.textAlign='center'}}
  /* fabrikalar: testere çatılı küçük simge ve sayı; hasarlı varsa turuncu */
  if(s>=.9)for(let r=0;r<NR;r++){const n=S.fb[r]||0;if(!n)continue;const R=RG[r],X=sx(R.x)-40,Y=sy(R.y)+20;if(!inView(X,Y,30,w,h))continue;const dmg=(S.fd[r]||0)>0;
    ctx.fillStyle='rgba(10,12,16,.85)';ctx.fillRect(X-9,Y-7,28,14);ctx.fillStyle=dmg?'#e2a340':'#cfd5da';ctx.beginPath();ctx.moveTo(X-7,Y+5);ctx.lineTo(X-7,Y-1);ctx.lineTo(X-4,Y-4);ctx.lineTo(X-4,Y-1);ctx.lineTo(X-1,Y-4);ctx.lineTo(X-1,Y-1);ctx.lineTo(X+2,Y-4);ctx.lineTo(X+2,Y+5);ctx.closePath();ctx.fill();ctx.fillRect(X-6,Y-6,1.6,3);
    ctx.font='700 10px "IBM Plex Mono",monospace';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(String(n-(S.fd[r]||0))+(dmg?'+'+S.fd[r]:''),X+5,Y+.5);ctx.textAlign='center'}
  /* hava savunma bataryaları: radar çanağı simgesi ve sayı */
  if(s>=.9&&S.hs)for(const k in S.hs){const n=S.hs[k];if(!n)continue;const R=RG[+k],X=sx(R.x)+34,Y=sy(R.y)+20;if(!inView(X,Y,30,w,h))continue;const sc=sideRGB(S.ctl[+k]);
    ctx.fillStyle='rgba(10,12,16,.85)';ctx.fillRect(X-9,Y-7,24,14);ctx.strokeStyle=`rgb(${sc})`;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(X-3,Y+1,4.5,Math.PI*1.05,Math.PI*1.95);ctx.stroke();ctx.beginPath();ctx.moveTo(X-3,Y+1);ctx.lineTo(X-3,Y+5);ctx.moveTo(X-6,Y+5);ctx.lineTo(X,Y+5);ctx.stroke();
    ctx.fillStyle='#e9e4d6';ctx.font='700 10px "IBM Plex Mono",monospace';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(String(n),X+4,Y+.5);ctx.textAlign='center'}
  }finally{ctx=main}baseFast=fast}
function draw(){if(!cv||!ids||!terCv)return;const w=cv.clientWidth,h=cv.clientHeight;dpr=dprCap();if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
  if((S.mapDirty||DR.size)&&performance.now()-(OD._pt||0)>(S.spd>=2?1000:400)){OD._pt=performance.now();paint()}
  if(!BP){buildPaths();OD.mver++}
  const now=performance.now();
  /* sürüklerken kenara gelince harita kayar */
  if(U.drag){const e=36,v=8/VW.s;let m=0;if(U.drag.x<e){VW.x-=v;m=1}if(U.drag.x>w-e){VW.x+=v;m=1}if(U.drag.y<e+50){VW.y-=v;m=1}if(U.drag.y>h-e-90){VW.y+=v;m=1}if(m){clampView();dragOver()}}
  const s=VW.s,key=[VW.x,VW.y,s,w,h,dpr,OD.mver,U.mm].join('|');
  if(key!==baseKey){const moving=now-lastMove<200;lastMove=now;baseKey=key;renderBase(w,h,moving||(S.spd>=2&&!OD._idleView))}
  else if(baseFast&&now-lastMove>180)renderBase(w,h,false);
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(baseCv,0,0);ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.save();ctx.translate(-VW.x*s,-VW.y*s);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';
  if(S.conf&&U.mode==='conf'){for(const r of ORIGC(S.conf.c)){const on=S.conf.sel.includes(r);if(CHof[r])strokeChains(CHof[r],on?3:1.4,on?'#7fe08f':'rgba(255,255,255,.55)')}}
  if(selR>=0&&CHof[selR]){strokeChains(CHof[selR],5,'rgba(0,0,0,.35)');strokeChains(CHof[selR],2.2,'#ffffff')}
  if(U.drag&&U.drag.over>=0&&CHof[U.drag.over]){const c=U.drag.ok?'#4fd27a':'#ff5a4f';strokeChains(CHof[U.drag.over],6,'rgba(0,0,0,.35)');strokeChains(CHof[U.drag.over],3,c)}
  const rw0=U.drag&&U.drag.wg?U.drag.wg[0]:U.wsel?U.wsel[0]:(U.mode==='airtgt'||U.mode==='airbase')?U.wing:null;
  if(rw0){const wg=S.A.find(x=>x.id===rw0);if(wg){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.5/s;ctx.setLineDash([6/s,5/s]);ctx.beginPath();ctx.arc(RG[wg.base].x,RG[wg.base].y,AT(wg.tp).men/kmpp(RG[wg.base].y),0,7);ctx.stroke();ctx.setLineDash([])}}
  for(const a of S.ar||[])drawFront(a,s);
  for(const a of S.ar||[])if(a.line&&a.line.length&&U.mode!=='drawline')drawLine(a.line,a.c,s,!(U.open&&U.tab==='army'&&U.army===a.id));
  if(U.mode==='drawline'){if(U.lpts&&U.lpts.length>1){ctx.beginPath();ctx.moveTo(U.lpts[0][0],U.lpts[0][1]);for(const p of U.lpts)ctx.lineTo(p[0],p[1]);ctx.lineWidth=3/s;ctx.strokeStyle='rgba(255,255,255,.75)';ctx.stroke()}if(U.line)drawLine(U.line,'#ffe08a',s,0)}
  if(U.pick&&U.pkCh){strokeChains(U.pkCh,7,'rgba(0,0,0,.45)');strokeChains(U.pkCh,3,'#ffe08a')}
  if(U.it!=null){const st=IT[U.it],c=st&&st.cv&&st.cv();if(c&&c.r!=null&&CHof[c.r]){strokeChains(CHof[c.r],7,'rgba(0,0,0,.4)');strokeChains(CHof[c.r],3.5,`rgba(255,224,138,${.6+.4*Math.sin(now/220)})`)}}
  ctx.restore();
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(const wg of S.A){if(wg.t<0||wg.mis==='bekle'||!(mine(wg.o)||(atWar(S.me,wg.o)&&s>1)))continue;const a=RG[wg.base],b=RG[wg.t];ctx.strokeStyle=mine(wg.o)?'rgba(130,200,255,.5)':'rgba(255,120,110,.45)';ctx.lineWidth=1.2;ctx.setLineDash([4,4]);ctx.beginPath();
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2-Math.hypot(b.x-a.x,b.y-a.y)*.18;ctx.moveTo(sx(a.x),sy(a.y));ctx.quadraticCurveTo(sx(mx),sy(my),sx(b.x),sy(b.y));ctx.stroke();ctx.setLineDash([]);
    /* uçuş animasyonu: üsten hedefe gidip dönen küçük jet */
    if(s>.35&&!wg.mv&&visU(wg.o)){const tt=(now/3400+wg.id*.29)%1,out=tt<.5,t=out?tt*2:2-tt*2,P0=[sx(a.x),sy(a.y)],C1=[sx(mx),sy(my)],P1=[sx(b.x),sy(b.y)],
      X=(1-t)*(1-t)*P0[0]+2*(1-t)*t*C1[0]+t*t*P1[0],Y=(1-t)*(1-t)*P0[1]+2*(1-t)*t*C1[1]+t*t*P1[1],dx=2*(1-t)*(C1[0]-P0[0])+2*t*(P1[0]-C1[0]),dy=2*(1-t)*(C1[1]-P0[1])+2*t*(P1[1]-C1[1]);
      ctx.save();ctx.translate(X,Y);ctx.rotate(Math.atan2(dy,dx)+(out?0:Math.PI));ctx.fillStyle=mine(wg.o)?'#bfe6ff':'#ffb0a8';ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(1,-1.6);ctx.lineTo(-1,-6.5);ctx.lineTo(-3,-6.5);ctx.lineTo(-2,-1.4);ctx.lineTo(-6,-1.2);ctx.lineTo(-7.5,-3.5);ctx.lineTo(-8.5,-3.5);ctx.lineTo(-8,0);ctx.lineTo(-8.5,3.5);ctx.lineTo(-7.5,3.5);ctx.lineTo(-6,1.2);ctx.lineTo(-2,1.4);ctx.lineTo(-3,6.5);ctx.lineTo(-1,6.5);ctx.lineTo(1,1.6);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore()}}
  for(const a of S.ar||[])drawOffensive(a,s);
  const mv=new Map();for(const u of S.U){if(!u.path.length||u.emb)continue;const me=mine(u.o);if(!me&&(U.vis===2||!(atWar(S.me,u.o)&&u.path.length===1)))continue;
    const k=u.o+':'+u.r+':'+u.path[u.path.length-1];let g=mv.get(k);if(!g)mv.set(k,g={u,n:0,me,sel:false});g.n++;if(U.sel&&U.sel.has(u.id))g.sel=true}
  if(s>=.3)for(const g of mv.values())moveArrow(g,s);
  for(const f of S.F){if(!f.path.length||!mine(f.o))continue;ctx.strokeStyle='rgba(120,200,255,.8)';ctx.lineWidth=2;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(sx(RG[f.r].x),sy(RG[f.r].y));for(const p of f.path)ctx.lineTo(sx(RG[p].x),sy(RG[p].y));ctx.stroke();ctx.setLineDash([])}
  HIT=[];
  if(s>=.3){const grp=new Map();for(const u of S.U){if(u.emb)continue;if(s<.6&&!mine(u.o)&&!atWar(S.me,u.o)&&!ally(S.me,u.o))continue;if(!visU(u.o))continue;let g=grp.get(u.r);if(!g)grp.set(u.r,g=[]);g.push(u)}
    if(s>=2.2)for(const [r,us] of grp)figures(r,us,s,now);
    for(const [r,us] of grp){const R=RG[r];const X=sx(R.x),Y=sy(R.y)-(isS(r)?18:0);if(!inView(X,Y,40,w,h))continue;stack(X,Y,r,us,now)}
    for(const f of S.F){if(!visU(f.o))continue;const R=RG[f.r];const same=S.F.filter(x=>x.r===f.r&&visU(x.o));const i=same.indexOf(f);const X=sx(R.x)+(i-(same.length-1)/2)*56,Y=sy(R.y)+(i%2)*6;if(!inView(X,Y,40,w,h))continue;ship(X,Y,f)}
    /* uçak simgeleri; "Hava" görünümünde her uzaklıkta, kendi filoların türüne göre ayrı ve dokunulabilir/sürüklenebilir */
    const AIR=U.mm==='hava';
    if(s>=.7||AIR){const ab=new Map();for(const wg of S.A){if((!mine(wg.o)&&s<1.6&&!AIR)||!visU(wg.o))continue;const my=AIR&&mine(wg.o),k=wg.base+':'+wg.o+(my?':'+wg.tp:'');let a=ab.get(k);
        if(!a)ab.set(k,a={r:wg.base,o:wg.o,n:0,tp:my?wg.tp:null,ids:[],act:0});a.n++;a.ids.push(wg.id);if(wg.mis!=='bekle')a.act++}
      const per=new Map();for(const a of ab.values()){const i=per.get(a.r)||0;per.set(a.r,i+1);const R=RG[a.r];const X=sx(R.x)+34+i*44,Y=sy(R.y)+22;if(!inView(X,Y,30,w,h))continue;plane(X,Y,a);
        if(a.tp){const sel=(U.wsel&&a.ids.some(id=>U.wsel.includes(id)))||(U.drag&&U.drag.wg&&a.ids.some(id=>U.drag.wg.includes(id)));
          ctx.font=`700 9px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';const lb=AT(a.tp).k.slice(0,9).toLocaleUpperCase('tr'),tw=ctx.measureText(lb).width+6;
          ctx.fillStyle='rgba(10,14,20,.9)';ctx.fillRect(X-tw/2,Y+11,tw,11);ctx.fillStyle=a.act?'#7fd1a8':'#cfd5da';ctx.fillText(lb,X,Y+17);
          if(sel){ctx.strokeStyle='#ffe08a';ctx.lineWidth=2;ctx.strokeRect(X-21,Y-12,42,24)}HIT.push({X,Y,w:42,h:24,r:a.r,o:a.o,wg:a.ids})}}}
    for(const b of S.bat||[]){const R=RG[b.r];let X=sx(R.x),Y=sy(R.y);if(!b.sea&&b.from&&b.from.length&&b.from[0]!==b.r){const f=RG[b.from[0]];X=(X+sx(f.x))/2;Y=(Y+sy(f.y))/2}
      if(!inView(X,Y,30,w,h))continue;battleMark(X,Y,b,now)}}
  /* deniz denetimi rozetleri: denizin ortasında denetleyenin renginde küçük çapa */
  if(s>=.45&&S.sc&&U.mm!=='den')for(const k in S.sc){const o=S.sc[k],R=RG[+k];const X=sx(R.x),Y=sy(R.y)+20;if(!inView(X,Y,20,w,h))continue;const c=o==='~'?'226,194,90':sideRGB(o).join(',');
    ctx.fillStyle='rgba(12,16,22,.85)';ctx.beginPath();ctx.arc(X,Y,8,0,7);ctx.fill();ctx.strokeStyle=`rgb(${c})`;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(X,Y-4.5);ctx.lineTo(X,Y+4);ctx.moveTo(X-3,Y-2);ctx.lineTo(X+3,Y-2);ctx.moveTo(X-4,Y+1.5);ctx.quadraticCurveTo(X,Y+6.5,X+4,Y+1.5);ctx.stroke()}
  /* rehber: vurgulanan birlik ya da bölge için nabız halkası */
  if(U.it!=null){const st=IT[U.it],c=st&&st.cv&&st.cv();if(c){const p=.5+.5*Math.sin(now/220);let X,Y;const pw=c.plane!=null&&S.A.find(w=>w.id===c.plane),pf=c.fleet!=null&&S.F.find(f=>f.id===c.fleet);
    const r0=c.chip!=null?c.chip:pw?pw.base:pf?pf.r:c.r;const hh=c.chip!=null?HIT.find(t=>t.r===c.chip&&mine(t.o)&&t.ids):pw?HIT.find(t=>t.wg&&t.wg.includes(c.plane)):pf?HIT.find(t=>t.f===c.fleet):null;
    if(hh){X=hh.X;Y=hh.Y}else{X=sx(RG[r0].x);Y=sy(RG[r0].y)}
    ctx.strokeStyle=`rgba(255,224,138,${.5+.5*p})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(X,Y,30+8*p,0,7);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(X,Y,44+10*p,0,7);ctx.stroke();
    if(c.to!=null){const X2=sx(RG[c.to].x),Y2=sy(RG[c.to].y);ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(255,224,138,.9)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X2,Y2);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(X2,Y2,8+4*p,0,7);ctx.stroke()}}}
  if(U.drag)dragArrow()}
let HIT=[];
/* yabancı birlik görünürlüğü: 0 hepsi, 1 yalnız savaştıkların, 2 yalnız seninkiler; ülke seçiminde birlik gösterilmez */
const visU=o=>!U.pick&&(mine(o)||!U.vis||(U.vis===1&&atWar(S.me,o)));
/* savunma hattı: bölge merkezlerinden geçen kesikli çizgi ve düğümler */
function drawLine(l,col,s,dim){if(!l.length)return;ctx.globalAlpha=dim?.55:1;ctx.beginPath();ctx.moveTo(RG[l[0]].x,RG[l[0]].y);for(const r of l)ctx.lineTo(RG[r].x,RG[r].y);
  ctx.lineWidth=7/s;ctx.strokeStyle='rgba(0,0,0,.45)';ctx.stroke();ctx.lineWidth=3.5/s;ctx.strokeStyle=col;ctx.setLineDash([10/s,6/s]);ctx.stroke();ctx.setLineDash([]);
  for(const r of l){ctx.beginPath();ctx.arc(RG[r].x,RG[r].y,4.5/s,0,7);ctx.fillStyle=col;ctx.fill();ctx.lineWidth=1.5/s;ctx.strokeStyle='#0a0f15';ctx.stroke()}ctx.globalAlpha=1}
function star(X,Y,r,f,st){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(X+Math.cos(a)*rr,Y+Math.sin(a)*rr)}ctx.closePath();ctx.fillStyle=f;ctx.fill();if(st){ctx.strokeStyle=st;ctx.lineWidth=1;ctx.stroke()}}
const sideCol=o=>mine(o)?'#3ddc84':ally(S.me,o)?'#4aa8ff':atWar(S.me,o)?'#ff4d4d':o==='ISY'?'#9a9a9a':'#c9cdd2';
/* ---------- modern birlik simgeleri ----------
   Sayaç: koyu cam görünümlü yuvarlak köşeli kart; solda ülke rozeti, ortada birlik türünün silueti, sağda sayı,
   üstte taraf rengi (yeşil kendin, mavi müttefik, kırmızı düşman), altta güç çubuğu. Gövde ön çizimle önbelleğe alınır. */
const SPR=new Map();
function sprite(key,w,h,fn){let c=SPR.get(key);if(c&&c._d===dpr)return c;c=document.createElement('canvas');c.width=Math.ceil(w*dpr);c.height=Math.ceil(h*dpr);const x=c.getContext('2d');x.scale(dpr,dpr);fn(x);c._d=dpr;c._w=w;c._h=h;SPR.set(key,c);return c}
function rrect(x,X,Y,W,H,R){x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath()}
/* siluetler: 24 x 12 birimlik kutuda, merkez (0,0) */
function icon(x,tp,col){x.fillStyle=col;x.strokeStyle=col;x.lineCap='round';x.lineJoin='round';const P=(pts)=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill()};
  if(tp==='zh'){/* ana muharebe tankı */rrect(x,-11,1.6,21,4.4,2.2);x.fill();P([[-10.5,1.8],[-9,-1.6],[8.5,-1.6],[10.8,1.8]]);P([[-5.5,-1.6],[-4,-4.6],[3.2,-4.6],[5.2,-1.6]]);x.fillRect(4,-3.8,9.5,1.1);
    x.globalCompositeOperation='destination-out';for(let i=-8;i<=8;i+=4){x.beginPath();x.arc(i,3.8,1.2,0,7);x.fill()}x.globalCompositeOperation='source-over'}
  else if(tp==='mk'){/* zırhlı piyade aracı */P([[-11,2.6],[-11,-2.2],[-6,-3.6],[9,-3.6],[11.5,0],[11.5,2.6]]);P([[-1,-3.6],[0,-5.6],[4,-5.6],[5,-3.6]]);x.fillRect(4,-5.1,7,.9);
    x.globalCompositeOperation='destination-out';for(const i of [-7,-1.5,4,9.5]){x.beginPath();x.arc(i,3,2.1,0,7);x.fill()}x.globalCompositeOperation='source-over';for(const i of [-7,-1.5,4,9.5]){x.beginPath();x.arc(i,3.3,1.6,0,7);x.fill()}}
  else if(tp==='mi'){/* silahlı pikap */P([[-11,2.4],[-11,-.6],[-3,-.6],[-1.5,-3.6],[4.5,-3.6],[7,-.6],[11,0],[11,2.4]]);x.fillRect(-8,-4.6,1.2,4);x.fillRect(-9,-5.4,7,1.1);
    x.globalCompositeOperation='destination-out';for(const i of [-6.5,6.5]){x.beginPath();x.arc(i,2.6,2.4,0,7);x.fill()}x.globalCompositeOperation='source-over';for(const i of [-6.5,6.5]){x.beginPath();x.arc(i,2.9,1.8,0,7);x.fill()}}
  else{/* piyade: miğferli asker ve tüfek; komando diz çökmüş, deniz piyadesi çapalı */
    const kneel=tp==='ok';x.save();x.translate(kneel?-2:-3,0);
    x.beginPath();x.arc(0,-4.4,1.9,Math.PI,0);x.lineTo(2.3,-4);x.lineTo(-2.3,-4);x.fill();x.beginPath();x.arc(0,-3.5,1.4,0,7);x.fill();
    P([[-2,-2],[2.2,-2],[2.6,2],[-2.4,2]]);x.lineWidth=1.5;x.beginPath();
    if(kneel){x.moveTo(-1.6,2);x.lineTo(-2.4,5.5);x.moveTo(1.8,2);x.lineTo(4.6,3);x.lineTo(4.4,5.5)}else{x.moveTo(-1.2,2);x.lineTo(-1.8,6);x.moveTo(1.4,2);x.lineTo(2,6)}x.stroke();
    x.lineWidth=1;x.beginPath();x.moveTo(-1.5,-.5);x.lineTo(9,-2.6);x.stroke();x.lineWidth=1.4;x.beginPath();x.moveTo(1,-1.2);x.lineTo(4,-.8);x.stroke();x.restore();
    if(tp==='dp'){x.lineWidth=1;x.beginPath();x.moveTo(8,-1);x.lineTo(8,5);x.moveTo(5.5,3);x.quadraticCurveTo(8,6.5,10.5,3);x.moveTo(6.6,0);x.lineTo(9.4,0);x.stroke()}
    if(tp==='ok'){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?1.2:2.8;x.lineTo(9+Math.cos(a)*r,2+Math.sin(a)*r)}x.closePath();x.fill()}}}
function shipIcon(x,col){x.fillStyle=col;x.beginPath();x.moveTo(-12,1);x.lineTo(12,1);x.lineTo(9,4);x.lineTo(-10,4);x.closePath();x.fill();x.fillRect(-6,-2,10,3);x.fillRect(-3,-4.5,4,2.6);x.fillRect(-1.3,-7.5,.9,3);x.fillRect(6,-1,3,2)}
function jetIcon(x,col){x.fillStyle=col;x.beginPath();x.moveTo(0,-7);x.lineTo(1.2,-3);x.lineTo(7,1.5);x.lineTo(7,3);x.lineTo(1.2,1.5);x.lineTo(1,5);x.lineTo(3,6.5);x.lineTo(3,7.5);x.lineTo(0,6.8);x.lineTo(-3,7.5);x.lineTo(-3,6.5);x.lineTo(-1,5);x.lineTo(-1.2,1.5);x.lineTo(-7,3);x.lineTo(-7,1.5);x.lineTo(-1.2,-3);x.closePath();x.fill()}
function cardBody(x,o,side,sel,W,H,drawIcon){const c=COL[o]||[110,110,110];
  x.save();x.shadowColor=sel?'rgba(255,214,90,.95)':'rgba(0,0,0,.55)';x.shadowBlur=sel?8:5;x.shadowOffsetY=sel?0:1.5;
  rrect(x,3,3,W-6,H-6,4);const g=x.createLinearGradient(0,3,0,H-3);g.addColorStop(0,'rgba(44,52,62,.96)');g.addColorStop(1,'rgba(16,20,26,.96)');x.fillStyle=g;x.fill();x.restore();
  rrect(x,3.5,3.5,W-7,H-7,3.6);x.strokeStyle=sel?'#ffd65a':'rgba(255,255,255,.16)';x.lineWidth=1;x.stroke();
  x.save();rrect(x,3,3,W-6,H-6,4);x.clip();x.fillStyle=side;x.fillRect(3,3,W-6,2);x.restore();
  /* ülke rozeti */
  const fx=12,fy=H/2;x.beginPath();x.arc(fx,fy,5.6,0,7);const fg=x.createRadialGradient(fx-2,fy-2,1,fx,fy,6);fg.addColorStop(0,`rgb(${Math.min(255,c[0]+60)},${Math.min(255,c[1]+60)},${Math.min(255,c[2]+60)})`);fg.addColorStop(1,`rgb(${c[0]*.8|0},${c[1]*.8|0},${c[2]*.8|0})`);x.fillStyle=fg;x.fill();
  x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=1.1;x.stroke();
  x.save();x.translate(29,H/2);x.scale(.72,.72);drawIcon(x);x.restore()}
function stack(X,Y,r,us,now){const groups=new Map();for(const u of us){const k=u.o+'|'+(mine(u.o)&&u.ar?'a'+u.ar:(LT(u.tp).sert>.4?'z':'p'));let g=groups.get(k);if(!g)groups.set(k,g=[]);g.push(u)}
  let gs=[...groups.values()].sort((a,b)=>(mine(b[0].o)?1:0)-(mine(a[0].o)?1:0));if(gs.length>4){const rest=gs.slice(3).flat();gs=gs.slice(0,3);gs.push(rest)}
  const y0=Y-(gs.length-1)*10.5;gs.forEach((g,i)=>chip(X,y0+i*21,g,r,now))}
function chip(X,Y,us,r,now){const o=us[0].o,n=us.length,sel=mine(o)&&((U.sel&&us.some(u=>U.sel.has(u.id)))||(U.drag&&U.drag.ids&&us.some(u=>U.drag.ids.includes(u.id))));
  const inb=(S.bat||[]).some(b=>b.r===r||(b.from||[]).includes(r)&&us.some(u=>u.path[0]===b.r));
  const cnt={};for(const u of us)cnt[u.tp]=(cnt[u.tp]||0)+1;const tp=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0],side=sideCol(o),W=54,H=24;
  const sp=sprite(`u|${o}|${tp}|${side}|${sel?1:0}`,W,H,x=>cardBody(x,o,side,sel,W,H,y=>icon(y,tp,'rgba(255,255,255,.93)')));
  ctx.drawImage(sp,X-W/2,Y-H/2,W,H);
  const org=us.reduce((s,u)=>s+u.org,0)/n,str=us.reduce((s,u)=>s+u.str,0)/n;
  ctx.font=`700 11px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(String(n),X+17,Y+.5);
  ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(X-W/2+6,Y+H/2-6,W-12,2);ctx.fillStyle=org>60?'#3ddc84':org>30?'#ffc23d':'#ff5a4f';ctx.fillRect(X-W/2+6,Y+H/2-6,(W-12)*str,2);
  if(inb){const p=.5+.5*Math.sin(now/200);ctx.fillStyle=`rgba(255,80,70,${.6+.4*p})`;ctx.beginPath();ctx.arc(X+W/2-5,Y-H/2+5,3,0,7);ctx.fill()}
  HIT.push({X,Y,w:W,h:H,r,o,ids:us.map(u=>u.id)})}
function ship(X,Y,f){const sel=U.fsel===f.id||(U.drag&&U.drag.f===f.id),side=sideCol(f.o),W=54,H=24;
  const sp=sprite(`s|${f.o}|${side}|${sel?1:0}`,W,H,x=>cardBody(x,f.o,side,sel,W,H,y=>shipIcon(y,'rgba(255,255,255,.93)')));ctx.drawImage(sp,X-W/2,Y-H/2,W,H);
  ctx.font=`700 11px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(String(fleetSize(f)),X+17,Y+.5);
  if(f.carry.length){ctx.fillStyle='#ffd65a';ctx.fillRect(X-W/2+6,Y+H/2-6,Math.min(W-12,f.carry.length*6),2)}
  HIT.push({X,Y,w:W,h:H,r:f.r,o:f.o,f:f.id})}
function plane(X,Y,a){const side=sideCol(a.o),W=40,H=22;const sp=sprite(`p|${a.o}|${side}`,W,H,x=>{const c=COL[a.o]||[110,110,110];x.save();x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=4;rrect(x,3,3,W-6,H-6,4);x.fillStyle='rgba(20,26,34,.94)';x.fill();x.restore();
    x.save();rrect(x,3,3,W-6,H-6,4);x.clip();x.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;x.fillRect(3,3,3,H-6);x.restore();x.save();x.translate(15,H/2);x.scale(.8,.8);jetIcon(x,'rgba(255,255,255,.93)');x.restore()});
  ctx.drawImage(sp,X-W/2,Y-H/2,W,H);ctx.font=`700 10.5px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(String(a.n),X+10,Y+.5)}
function battleMark(X,Y,b,now){const me=mine(b.o)||ally(S.me,b.o),them=mine(b.d)||ally(S.me,b.d),p=b.A/(b.A+b.D+.001),v=me||!them?p:1-p,good=(me||them)?v>.5:false;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;ctx.fillStyle='rgba(16,20,26,.94)';ctx.beginPath();ctx.arc(X,Y,13,0,7);ctx.fill();ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(X,Y,10.5,0,7);ctx.stroke();
  ctx.strokeStyle=good?'#3ddc84':'#ff4d4d';ctx.beginPath();ctx.arc(X,Y,10.5,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(v,.03,1));ctx.stroke();
  const t=.6+.4*Math.sin(now/240);ctx.strokeStyle=`rgba(255,255,255,${t})`;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(X-4.5,Y-4.5);ctx.lineTo(X+4.5,Y+4.5);ctx.moveTo(X+4.5,Y-4.5);ctx.lineTo(X-4.5,Y+4.5);ctx.stroke();
  ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(X-5.5,Y+1.5);ctx.lineTo(X-1.5,Y+5.5);ctx.moveTo(X+5.5,Y+1.5);ctx.lineTo(X+1.5,Y+5.5);ctx.stroke();
  if(!b.sea){ctx.font=`700 10px ${FONT}`;const s='%'+Math.round(v*100),tw=ctx.measureText(s).width+10;rrect(ctx,X-tw/2,Y+15,tw,14,7);ctx.fillStyle='rgba(16,20,26,.92)';ctx.fill();ctx.fillStyle=good?'#7ff0a8':'#ff9a90';ctx.textAlign='center';ctx.fillText(s,X,Y+22.5)}}
/* yakın görünümde gerçekçi figürler: gölgeli asker ve tank siluetleri */
function figures(r,us,s,now){const R=RG[r],X0=sx(R.x),Y0=sy(R.y);if(!inView(X0,Y0,140,cv.clientWidth,cv.clientHeight))return;
  const by={};for(const u of us)(by[u.o]=by[u.o]||[]).push(u);const os=Object.keys(by);const H=clamp(s*8,18,42);
  os.forEach((o,oi)=>{const l=by[o],tanks=l.filter(u=>LT(u.tp).sert>.4).length,inf=l.length-tanks,c=COL[o]||[90,90,90],uni=[(c[0]*.25+92)|0,(c[1]*.25+98)|0,(c[2]*.25+72)|0];
    const moving=l.some(u=>u.path.length),fight=(S.bat||[]).some(b=>b.r===r||(b.from||[]).includes(r)&&l.some(u=>u.path[0]===b.r));
    const dir=moving&&l[0].path.length?Math.sign(RG[l[0].path[0]].x-R.x)||1:(oi?-1:1);
    const figs=[];for(let i=0;i<Math.min(2,inf);i++)figs.push('i');for(let i=0;i<Math.min(2,tanks);i++)figs.push('t');
    figs.forEach((k,i)=>{const X=X0+(oi?1:-1)*(H*1.9+i*H*1.2),Y=Y0+H*1.1+(i%2)*H*.3;if(k==='i')soldier(X,Y,H,uni,dir,moving,fight,now+i*130);else tank(X,Y,H,uni,dir,moving,fight,now+i*170)})})}
const rgb=(c,k=1)=>`rgb(${Math.min(255,c[0]*k)|0},${Math.min(255,c[1]*k)|0},${Math.min(255,c[2]*k)|0})`;
function soldier(X,Y,H,c,dir,mv,fire,t){const k=H/22,st=mv?Math.sin(t/110):0,bob=mv?Math.abs(st)*.6:0;ctx.save();ctx.translate(X,Y-bob);ctx.scale(dir*k,k);
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,bob/k,7.5,1.8,0,0,7);ctx.fill();
  const g=ctx.createLinearGradient(-4,-20,4,0);g.addColorStop(0,rgb(c,1.25));g.addColorStop(1,rgb(c,.7));
  ctx.strokeStyle=rgb(c,.6);ctx.lineCap='round';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(-1,-7);ctx.lineTo(-2.2+st*2.5,-.8);ctx.moveTo(1,-7);ctx.lineTo(1.6-st*2.5,-.8);ctx.stroke();
  ctx.fillStyle='#1e1e1c';ctx.beginPath();ctx.ellipse(-2.2+st*2.5,-.4,1.8,.9,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(1.6-st*2.5,-.4,1.8,.9,0,0,7);ctx.fill();
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-3.4,-15.5);ctx.quadraticCurveTo(0,-17,3.2,-15.5);ctx.lineTo(3,-6.5);ctx.lineTo(-3,-6.5);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgb(c,.55);ctx.fillRect(-3.2,-12.6,6.4,3.2);ctx.fillRect(-2.6,-8.4,5.2,1.2);
  ctx.fillStyle='#c79f7c';ctx.beginPath();ctx.arc(.4,-18,2.1,0,7);ctx.fill();
  ctx.fillStyle=rgb(c,.9);ctx.beginPath();ctx.arc(.2,-18.8,2.9,Math.PI*1.02,Math.PI*-.02);ctx.lineTo(3.4,-18.1);ctx.lineTo(-3,-18.1);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#22231f';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-2,-11);ctx.lineTo(10,-13.4);ctx.stroke();ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-1,-10.8);ctx.lineTo(2,-11.4);ctx.stroke();
  ctx.strokeStyle=rgb(c,.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(2.4,-14);ctx.lineTo(4.6,-12.4);ctx.stroke();
  if(fire&&Math.sin(t/80)>.7){ctx.fillStyle='rgba(255,214,120,.95)';ctx.beginPath();ctx.moveTo(10,-13.4);ctx.lineTo(14,-15.2);ctx.lineTo(13.2,-12);ctx.closePath();ctx.fill()}
  ctx.restore()}
function tank(X,Y,H,c,dir,mv,fire,t){const k=H/24,v=mv?Math.sin(t/70)*.25:0;ctx.save();ctx.translate(X,Y+v);ctx.scale(dir*k,k);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,.6,15,2.4,0,0,7);ctx.fill();
  rrect(ctx,-14,-5.2,28,5.6,2.8);ctx.fillStyle='#1d1e1b';ctx.fill();ctx.fillStyle='#3b3c36';for(let i=-11;i<=11;i+=3.6){ctx.beginPath();ctx.arc(i,-2.4,1.5,0,7);ctx.fill()}
  const g=ctx.createLinearGradient(0,-12,0,-4);g.addColorStop(0,rgb(c,1.2));g.addColorStop(1,rgb(c,.7));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-13.5,-5);ctx.lineTo(-12.5,-8.4);ctx.lineTo(10,-8.4);ctx.lineTo(14,-5.6);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgb(c,.6);ctx.fillRect(-12.5,-6.2,25,1);
  const g2=ctx.createLinearGradient(0,-14,0,-8);g2.addColorStop(0,rgb(c,1.3));g2.addColorStop(1,rgb(c,.8));ctx.fillStyle=g2;
  ctx.beginPath();ctx.moveTo(-7,-8.4);ctx.lineTo(-6,-12.4);ctx.lineTo(3.5,-12.8);ctx.lineTo(6.5,-8.4);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgb(c,.75);ctx.fillRect(-3,-14.2,3,1.6);
  ctx.strokeStyle=rgb(c,.55);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(4.5,-11);ctx.lineTo(19,-11.4);ctx.stroke();ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(17.2,-11.35);ctx.lineTo(19,-11.4);ctx.stroke();
  if(fire&&Math.sin(t/140)>.85){ctx.fillStyle='rgba(255,214,120,.95)';ctx.beginPath();ctx.arc(21,-11.4,2.8,0,7);ctx.fill();ctx.fillStyle='rgba(200,200,200,.35)';ctx.beginPath();ctx.arc(24,-12.5,3.5,0,7);ctx.fill()}
  ctx.restore()}
function moveArrow(g,s){const u=g.u,pts=[[sx(RG[u.r].x),sy(RG[u.r].y)]];for(const p of u.path)pts.push([sx(RG[p].x),sy(RG[p].y)]);if(pts.length<2)return;
  const col=g.me?(g.sel?'255,214,90':'90,200,255'):'255,80,70',w=g.me?clamp(3+g.n*.8,3.5,8):2.5;
  ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;ctx.quadraticCurveTo(pts[i][0],pts[i][1],mx,my)}
  const [ex,ey]=pts[pts.length-1],[px,py]=pts[pts.length-2],an=Math.atan2(ey-py,ex-px),hl=w*1.8+7,bx=ex-Math.cos(an)*hl*.7,by=ey-Math.sin(an)*hl*.7;ctx.lineTo(bx,by);
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=w+3;ctx.stroke();ctx.strokeStyle=`rgba(${col},.85)`;ctx.lineWidth=w;ctx.stroke();
  ctx.fillStyle=`rgba(${col},.95)`;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-hl*Math.cos(an-.42),ey-hl*Math.sin(an-.42));ctx.lineTo(ex-hl*Math.cos(an+.42),ey-hl*Math.sin(an+.42));ctx.closePath();ctx.fill();
  if(g.me&&s>.6){const [mx,my]=pts.length>2?pts[1]:[(pts[0][0]+ex)/2,(pts[0][1]+ey)/2];ctx.font=`600 10.5px ${FONT}`;const t=`${g.n} tümen`,tw=ctx.measureText(t).width+12;
    rrect(ctx,mx-tw/2,my-w-17,tw,15,7.5);ctx.fillStyle='rgba(16,20,26,.9)';ctx.fill();ctx.fillStyle=`rgb(${col})`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,mx,my-w-9.5)}}
/* sürükle-bırak: birlik ya da filo sayacından parmağa ok; hedef bölge yeşil (gidilebilir) ya da kırmızı */
function dragArrow(){const d=U.drag,x0=d.sx,y0=d.sy,x1=d.x,y1=d.y,an=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0);if(L<8)return;const col=d.over<0?'255,255,255':d.ok?'61,220,132':'255,77,77';
  ctx.lineCap='round';ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1-Math.cos(an)*10,y1-Math.sin(an)*10);ctx.stroke();
  ctx.strokeStyle=`rgba(${col},.95)`;ctx.lineWidth=5;ctx.stroke();ctx.fillStyle=`rgba(${col},1)`;ctx.beginPath();ctx.moveTo(x1+Math.cos(an)*4,y1+Math.sin(an)*4);ctx.lineTo(x1-16*Math.cos(an-.45),y1-16*Math.sin(an-.45));ctx.lineTo(x1-16*Math.cos(an+.45),y1-16*Math.sin(an+.45));ctx.closePath();ctx.fill();
  if(d.over>=0){ctx.font=`600 12px ${FONT}`;const t=(d.ok?(d.amph?'⚓ Çıkarma: ':d.wg?'✈ ':''):'✕ ')+RG[d.over].n,tw=ctx.measureText(t).width+16;rrect(ctx,x1-tw/2,y1-44,tw,20,10);ctx.fillStyle='rgba(16,20,26,.94)';ctx.fill();ctx.fillStyle=`rgb(${col})`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x1,y1-34)}}
function dragOver(){const d=U.drag;if(!d)return;const r=regionAt(d.x,d.y);if(r===d.over)return;d.over=r;d.ok=false;if(r<0)return;
  if(d.wg){const ws=S.A.filter(z=>d.wg.includes(z.id));d.ok=ws.some(z=>dist(z.base,r)<=AT(z.tp).men)||(isL(r)&&canStay(S.me,r)&&CITYIN[r].length>0);return}
  if(d.f){const f=S.F.find(z=>z.id===d.f);d.ok=!!f&&isS(r)&&r!==f.r&&!!path(S.me,f.r,r,1)}
  else{const u=S.U.find(z=>z.id===d.ids[0]);d.amph=false;d.ok=!!u&&isL(r)&&r!==u.r&&!!path(u.o,u.r,r);
    /* kara yolu yoksa ve iki uç da kıyıdaysa: tek adımda deniz çıkarması */
    if(u&&!d.ok&&isL(r)&&r!==u.r&&coastal(r)&&coastal(u.r)&&canEnter(S.me,r)){d.ok=true;d.amph=true}}}
function dragDrop(){const d=U.drag;U.drag=null;if(d&&d.wg&&d.over>=0&&d.ok){U.amis={ids:d.wg,t:d.over};dirty(1);return}
  if(!d||d.over<0||!d.ok){if(d&&d.wg&&d.over>=0){toast(`${RG[d.over].n}: filoların menzili dışında.`);dirty(1);return}if(d&&d.over>=0)toast(`${RG[d.over].n}: oraya gidilemez. Yalnızca kendi, müttefik ya da savaşta olduğun ülkelerin topraklarına girebilirsin.`);dirty(1);return}
  if(d.f){const f=S.F.find(z=>z.id===d.f);const p=f&&path(S.me,f.r,d.over,1);if(p){f.path=p;f.prog=0;toast(`${f.name} ${RG[d.over].n} yönünde.`)}dirty(1);return}
  const list=U.sel&&U.sel.size&&d.ids.some(id=>U.sel.has(id))?[...U.sel]:d.ids;if(d.amph){U.amph=list;amphib(d.over);dirty(1);return}move(list,d.over)}
function frontChains(a){const reg=armyFront(a);if(!reg)return [];const en=reg.E,out=[];
  for(const r of reg.F)for(const k of CHof[r]||[]){const ch=CH[k],o=ch.a===r?ch.b:ch.a;if(o>=0&&en.has(o))out.push({k,me:r,en:o})}return out}
function drawFront(a,s){const fc=frontChains(a);a._fc=fc;if(!fc.length)return;const col=a.c||'#b8a6ef';
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();for(const f of fc){const p=CH[f.k].p;ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1])}
  ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=6/s;ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=3.4/s;ctx.stroke();
  ctx.fillStyle=col;const gap=16/s,tl=6/s,tw=3.4/s;
  for(const f of fc){const p=CH[f.k].p,en=f.en;let acc=gap/2;
    for(let i=0;i+3<p.length;i+=2){const ax=p[i],ay=p[i+1],bx=p[i+2],by=p[i+3],L=Math.hypot(bx-ax,by-ay);if(!L)continue;const ux=(bx-ax)/L,uy=(by-ay)/L;
      while(acc<L){const x=ax+ux*acc,y=ay+uy*acc;let nx=-uy,ny=ux;const tx=Math.round(x+nx*3),ty=Math.round(y+ny*3);if(tx<0||ty<0||tx>=MW||ty>=MH||ids[ty*MW+tx]!==en){nx=-nx;ny=-ny}
        ctx.beginPath();ctx.moveTo(x-ux*tw,y-uy*tw);ctx.lineTo(x+nx*tl,y+ny*tl);ctx.lineTo(x+ux*tw,y+uy*tw);ctx.closePath();ctx.fill();acc+=gap}acc-=L}}}
function drawOffensive(a,s){const fc=a._fc;if(!fc||!fc.length)return;const col=a.c||'#b8a6ef';
  let best=null,bl=0;for(const f of fc){const p=CH[f.k].p;let L=0;for(let i=0;i+3<p.length;i+=2)L+=Math.hypot(p[i+2]-p[i],p[i+3]-p[i+1]);if(L>bl){bl=L;best=p}}
  if(best&&bl*s>120){const n=(a.u||[]).length;textAlong(best,`${n} tümen · ${a.n}`,s,col)}
  if(a.t>=0&&a.atk!==undefined){let fx=0,fy=0,bd=1e12;const T=RG[a.t];for(const f of fc){const R=RG[f.me],d=(R.x-T.x)**2+(R.y-T.y)**2;if(d<bd){bd=d;fx=R.x;fy=R.y}}
    const X1=sx(fx),Y1=sy(fy),X2=sx(T.x),Y2=sy(T.y),L=Math.hypot(X2-X1,Y2-Y1);if(L<20)return;const an=Math.atan2(Y2-Y1,X2-X1),bend=L*.12,mx=(X1+X2)/2-Math.sin(an)*bend,my=(Y1+Y2)/2+Math.cos(an)*bend;
    const w=clamp(L*.08,9,22);ctx.lineCap='butt';const g=ctx.createLinearGradient(X1,Y1,X2,Y2),base=a.atk?'255,92,92':'200,190,240';g.addColorStop(0,`rgba(${base},0)`);g.addColorStop(.6,`rgba(${base},.5)`);g.addColorStop(1,`rgba(${base},.85)`);
    ctx.strokeStyle=g;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(X1,Y1);const ex=X2-Math.cos(an)*w*1.2,ey=Y2-Math.sin(an)*w*1.2;ctx.quadraticCurveTo(mx,my,ex,ey);ctx.stroke();
    const a2=Math.atan2(ey-my,ex-mx);ctx.fillStyle=`rgba(${base},.9)`;ctx.beginPath();ctx.moveTo(X2,Y2);ctx.lineTo(ex+Math.cos(a2+Math.PI/2)*w*1.1,ey+Math.sin(a2+Math.PI/2)*w*1.1);ctx.lineTo(ex-Math.cos(a2+Math.PI/2)*w*1.1,ey-Math.sin(a2+Math.PI/2)*w*1.1);ctx.closePath();ctx.fill();
    ctx.font=`600 11px ${FONT}`;const t=a.atk?`Taarruz · ${a.n}`:`Taarruz planı · ${a.n}`,tw=ctx.measureText(t).width+14;rrect(ctx,mx-tw/2,my-9,tw,18,9);ctx.fillStyle='rgba(16,20,26,.9)';ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,mx,my)}}
function textAlong(p,txt,s,col){
  const P=[];for(let i=0;i<p.length;i+=2)P.push([sx(p[i]),sy(p[i+1])]);if(P[0][0]>P[P.length-1][0])P.reverse();
  const seg=[];let tot=0;for(let i=0;i+1<P.length;i++){const L=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]);seg.push(L);tot+=L}
  ctx.font=`600 12px ${FONT}`;const tw=ctx.measureText(txt).width*1.06;if(tw>tot*.9)return;let d=(tot-tw)/2;
  const at=dd=>{dd=clamp(dd,0,tot);let i=0;while(i<seg.length-1&&dd>seg[i]){dd-=seg[i];i++}const t=seg[i]?dd/seg[i]:0,A=P[i],Bq=P[i+1]||A;return [A[0]+(Bq[0]-A[0])*t,A[1]+(Bq[1]-A[1])*t]};
  const a0=at(d-30),a1=at(d+tw+30);const flip=a1[0]<a0[0];ctx.textAlign='center';ctx.textBaseline='middle';
  for(const ch of txt){const cw=ctx.measureText(ch).width*1.06,m=d+cw/2,[x,y]=at(m),p=at(m-30),q=at(m+30);let an=Math.atan2(q[1]-p[1],q[0]-p[0]);if(flip)an+=Math.PI;
    ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.translate(0,-11);ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.strokeText(ch,0,0);ctx.fillStyle='#fff';ctx.fillText(ch,0,0);ctx.restore();d+=cw}}
function fit(r,z){const R=RG[r];const w=cv.clientWidth,h=cv.clientHeight;VW.s=z||VW.s;VW.x=R.x-w/2/VW.s;VW.y=R.y-h/2/VW.s;clampView()}
/* görünüm: dünya yatayda döner (bölge haritasının kopyası hiç iki kez görünmez; en fazla dünyanın yarısı kadar uzaklaşılır),
   dikeyde dünya görüntüsünün içinde kalır */
function clampView(){const w=cv.clientWidth,h=cv.clientHeight;
  if(typeof ODW==='undefined'||!worldImg){VW.s=clamp(VW.s,Math.min(w/MW,h/MH)*.9,7);const vw=w/VW.s,vh=h/VW.s;VW.x=vw>=MW?(MW-vw)/2:clamp(VW.x,-vw*.05,MW-vw*.95);VW.y=vh>=MH?(MH-vh)/2:clamp(VW.y,-vh*.08,MH-vh*.55);return}
  const WW=ODW.ww;VW.s=clamp(VW.s,Math.max(h/ODW.h,w/(WW*.55)),7);const vw=w/VW.s,vh=h/VW.s;
  let c=VW.x+vw/2;while(c-MW/2>WW/2){VW.x-=WW;c-=WW}while(c-MW/2<-WW/2){VW.x+=WW;c+=WW}
  VW.y=clamp(VW.y,ODW.y,ODW.y+ODW.h-vh)}

/* ---------- dokunma ----------
   Tek parmak: kaydır. İki parmak: yakınlaş. Kendi birlik ya da filo sayacına basıp sürükle: hedef bölgeye götür.
   Dokun: bölgeyi seç (panel açılır). Çift dokunuş: yakınlaş. */
function bindCanvas(){const P=new Map();let moved=0,pd=0,pm=null,lastTap=0,cand=null,lp=0,lpDone=0,last=null;
  const loc=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  const endLine=()=>{if(U.lining){U.lining=0;U.lpts=[];dirty(1)}};
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,[e.clientX,e.clientY]);moved=0;cand=null;lpDone=0;clearTimeout(lp);
    if(P.size===2){U.drag=null;if(U.lining){U.line.length=U.lst;U.lstk.pop();endLine()}const [a,b]=[...P.values()];pd=Math.hypot(a[0]-b[0],a[1]-b[1]);pm=[(a[0]+b[0])/2,(a[1]+b[1])/2];return}
    const [x,y]=loc(e);
    /* savunma hattı çizimi: tek parmak çizer, iki parmak kaydırır */
    if(U.mode==='drawline'&&U.line){U.lining=1;U.lst=U.line.length;U.lstk.push(U.lst);U.lpts=[[x/VW.s+VW.x,y/VW.s+VW.y]];last=[x,y];lineAdd(x,y);return}
    /* basılı tutma: kendi bölgende bölge bilgisi, yabancı ülkede ilişkiler paneli */
    if(!U.mode&&!U.pick&&S.over!=='lost')lp=setTimeout(()=>{if(P.size===1&&moved<8&&!U.drag){lpDone=1;cand=null;try{navigator.vibrate&&navigator.vibrate(18)}catch(e){}longPress(x,y)}},520);
    if(U.mode||U.pick||S.over==='lost')return;let h=null;for(const t of HIT)if(mine(t.o)&&Math.abs(t.X-x)<t.w/2+4&&Math.abs(t.Y-y)<t.h/2+4){h=t;break}
    if(h)cand={h,x,y}});
  cv.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];
    if(P.size===1){moved+=Math.abs(dx)+Math.abs(dy);P.set(e.pointerId,[e.clientX,e.clientY]);const [x,y]=loc(e);if(moved>=8)clearTimeout(lp);
      if(U.lining){const n=Math.ceil(Math.hypot(x-last[0],y-last[1])/4);for(let i=1;i<=n;i++)lineAdd(last[0]+(x-last[0])*i/n,last[1]+(y-last[1])*i/n);last=[x,y];U.lpts.push([x/VW.s+VW.x,y/VW.s+VW.y]);return}
      if(cand&&!U.drag&&moved>7){U.drag={ids:cand.h.ids||null,f:cand.h.f||null,wg:cand.h.wg||null,sx:cand.h.X,sy:cand.h.Y,x,y,over:-1,ok:false};dirty(1)}
      if(U.drag){U.drag.x=x;U.drag.y=y;dragOver();return}
      if(moved>6){VW.x-=dx/VW.s;VW.y-=dy/VW.s;clampView()}}
    else if(P.size===2){P.set(e.pointerId,[e.clientX,e.clientY]);const [a,b]=[...P.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),m=[(a[0]+b[0])/2,(a[1]+b[1])/2];moved=99;
      const r=cv.getBoundingClientRect();zoomAt(m[0]-r.left,m[1]-r.top,d/pd);VW.x-=(m[0]-pm[0])/VW.s;VW.y-=(m[1]-pm[1])/VW.s;pd=d;pm=m;clampView()}});
  const up=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);clearTimeout(lp);if(P.size)return;if(U.lining){endLine();return}if(lpDone){lpDone=0;cand=null;return}if(U.drag){dragDrop();cand=null;return}cand=null;if(moved>6)return;const [x,y]=loc(e),now=performance.now();
    if(now-lastTap<280&&!U.mode&&!U.pick){zoomAt(x,y,1.8);lastTap=0;return}lastTap=now;tap(x,y)};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{P.delete(e.pointerId);clearTimeout(lp);U.drag=null;cand=null;endLine()});
  for(const ev of ['pointerdown','pointermove','wheel'])cv.addEventListener(ev,()=>{OD._touch=performance.now()},{passive:true});
  cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,Math.exp(-e.deltaY*.0015))},{passive:false})}
function zoomAt(x,y,k){const mx=x/VW.s+VW.x,my=y/VW.s+VW.y;VW.s=clamp(VW.s*k,.02,7);VW.x=mx-x/VW.s;VW.y=my-y/VW.s;clampView()}
function regionAt(x,y){const mx=Math.floor(x/VW.s+VW.x),my=Math.floor(y/VW.s+VW.y);if(mx<0||my<0||mx>=MW||my>=MH)return -1;return ids[my*MW+mx]}
function lineAdd(x,y){const r=regionAt(x,y);if(r<0||!isL(r)||S.ctl[r]!==S.me||U.line.includes(r))return;U.line.push(r);dirty()}
function longPress(x,y){if(U.pick)return;const r=regionAt(x,y);if(r<0)return;const c=S.ctl[r];
  if(isL(r)&&c&&c!==S.me&&c!=='ISY'&&V.C[c]&&alive(c)){U.sel=new Set();U.fsel=null;U.reg=null;selMask(r);cmd('dip:'+c);return}
  select(r,null,'info')}
function tap(x,y){if(U.pick){const r=regionAt(x,y);if(r<0)return;const c=S.own[r];if(c&&c!=='ISY'&&V.ORDER.includes(c))pickSet(c);return}
  if(S.over==='lost'||U.mode==='drawline')return;
  if(U.mode==='seladd'){const r=regionAt(x,y);if(r<0)return;const l=S.U.filter(u=>u.r===r&&mine(u.o)&&!u.emb);if(!l.length)toast('Bu bölgede birliğin yok.');else{const all=l.every(u=>U.sel.has(u.id));for(const u of l)if(all)U.sel.delete(u.id);else U.sel.add(u.id)}dirty(1);return}
  let h=null;for(const t of HIT)if(Math.abs(t.X-x)<t.w/2&&Math.abs(t.Y-y)<t.h/2&&(!h||mine(t.o)))h=t;
  let r=h&&U.mode!=='conf'?h.r:regionAt(x,y);if(r<0)return;
  if(U.mode==='conf'&&S.conf){if(S.own[r]===S.conf.c&&isL(r)){const l=S.conf.sel,i=l.indexOf(r);if(i>=0)l.splice(i,1);else l.push(r)}else toast(`Yalnızca ${NM(S.conf.c)} topraklarını seçebilirsin.`);dirty(1);return}
  if(U.mode==='armytgt'){const a=S.ar.find(x=>x.id===U.army);U.mode=null;if(a){if(!isL(r)||mine(S.ctl[r]))toast('Taarruz hedefi olarak düşman topraklarında bir bölge seç.');else{a.t=r;if(!a.fr)a.fr=S.ctl[r];toast(`${a.n}: taarruz hedefi ${RG[r].n}.${atWar(S.me,a.fr)?'':' Taarruz için önce savaş ilan etmelisin.'}`)}}dirty(1);return}
  if(U.mode==='airtgt'){const wg=S.A.find(w=>w.id===U.wing);U.mode=null;if(wg){if(dist(wg.base,r)>AT(wg.tp).men){toast(`Menzil dışında (${f0(AT(wg.tp).men)} km).`)}else{wg.t=r;if(wg.mis==='bekle')wg.mis=wg.tp==='av'?'ust':wg.tp==='bb'?'bom':'des';toast(`${AT(wg.tp).k} görevi: ${MISN[wg.mis]} · ${RG[r].n}`)}}dirty(1);return}
  if(U.mode==='airbase'){const wg=S.A.find(w=>w.id===U.wing);U.mode=null;if(wg){if(!canStay(S.me,r)||!CITYIN[r].length)toast('Üs olarak kendi (ya da müttefik) topraklarında şehirli bir bölge seç.');else{wg.mv=Math.ceil(dist(wg.base,r)/600)+2;wg.base=r;wg.mis='bekle';wg.t=-1;toast(`Filo ${RG[r].n} üssüne intikal ediyor.`)}}dirty(1);return}
  if(U.mode==='deploy'){U.mode=null;if(S.ctl[r]===S.me&&isL(r)){S.C[S.me].dep=r;toast(`Yeni tümenler ${near(r)} bölgesinde sahaya çıkacak.`);U.tab='uret';U.open=1}else toast('Konuşlanma için kendi topraklarında bir bölge seç.');dirty(1);return}
  if(U.mode==='land'){U.mode=null;amphib(r);dirty(1);return}
  if(U.mode==='para'){U.mode=null;paraDrop(r);dirty(1);return}
  if(U.mode==='raid'){U.mode=null;raid(r);dirty(1);return}
  if(U.mode==='missile'){U.mode=null;const why=fire(S.me,r);if(why)toast(why);dirty(1);return}
  /* hava filosu simgesine dokun: seçilir; sonra hedefe dokununca görev penceresi açılır */
  if(h&&h.wg){U.wsel=h.wg;U.sel=new Set();U.fsel=null;U.open=0;dirty(1);return}
  if(U.wsel){U.amis={ids:U.wsel,t:r};U.wsel=null;dirty(1);return}
  /* kendi birlik simgesine dokun: o yığın seçilir ve paneli açılır (bölgeye dokunmak bölgedeki bütün birlikleri açar) */
  if(h&&h.ids&&mine(h.o)){select(h.r,null,'units');U.sel=new Set(h.ids);dirty(1);return}
  /* seçili filo: denize dokununca rota */
  if(U.fsel!=null&&isS(r)){const f=S.F.find(x=>x.id===U.fsel);if(f&&f.r!==r){const p=path(S.me,f.r,r,1);if(!p)toast('Bu denize yol yok.');else{f.path=p;f.prog=0;toast(`${f.name} ${RG[r].n} yönünde.`)}U.fsel=null;dirty(1);return}}
  /* seçili kara birlikleri: başka bölgeye dokununca hareket */
  if(U.sel.size&&isL(r)&&r!==U.reg&&!(h&&h.f)){move([...U.sel],r);return}
  select(r,h&&h.f)}
function select(r,fid,rm){U.reg=r;U.tab='reg';U.sel=new Set();U.fsel=null;selMask(r);U.rm=rm||(isL(r)&&S.U.some(u=>u.r===r&&mine(u.o)&&!u.emb)?'units':'info');
  if(fid){const f=S.F.find(x=>x.id===fid);if(f&&mine(f.o))U.fsel=f.id}
  else if(isS(r)){const f=S.F.find(x=>x.r===r&&mine(x.o));if(f)U.fsel=f.id}
  U.open=1;dirty(1);
  /* dar ekranda alt panel haritanın altını kapatır: seçilen bölge panelin üstünde kalacak şekilde kaydırılır */
  if(cv.clientWidth<820){const y=sy(RG[r].y),top=70,bot=cv.clientHeight*.34;if(y<top||y>bot){VW.y=RG[r].y-(top+bot)/2/VW.s;clampView()}}}
function move(list,r){let ok=0,bad=0;for(const id of list){const u=S.U.find(x=>x.id===id);if(!u||u.emb)continue;const p=path(u.o,u.r,r);if(p&&p.length){if(u.path[0]!==p[0])u.prog=0;u.path=p;ok++}else bad++}
  if(ok){toast(`${ok} birlik ${RG[r].n} yönünde.${bad?` ${bad} birlik oraya ulaşamıyor.`:''}`);U.sel=new Set();U.itMv=(U.itMv||0)+1}
  else toast(`${RG[r].n}: oraya yol yok. Yalnızca kendi, müttefik ya da savaşta olduğun ülkelerin topraklarına girebilirsin.`);
  dirty(1)}
/* çıkarma: kıyıdaki boşta filo birlikleri alır; yoksa en yakın uygun filo kıyıya çağrılır ve varınca birlikleri alıp götürür.
   Hedef kıyının denizlerinden en az biri düşman denetiminde olmamalı. */
/* hava indirme: komando tugayları, menzilde bir nakliye filosuyla düşman hatlarının gerisindeki savunmasız bir bölgeye iner */
function paraDrop(t){const us=S.U.filter(u=>(U.para||[]).includes(u.id)&&mine(u.o)&&!u.emb&&LT(u.tp).para);U.para=null;if(!us.length)return;
  if(!isL(t)||!canEnter(S.me,t)){toast('Hava indirme için kendi ya da savaştığın bir ülkenin topraklarını seç.');return}
  if(S.U.some(u=>u.r===t&&atWar(S.me,u.o))){toast(`${near(t)} savunuluyor: hava indirme yalnızca düşman birliği olmayan bölgelere yapılır.`);return}
  const nk=S.A.filter(w=>mine(w.o)&&AT(w.tp).tasir&&!w.mv&&dist(w.base,t)<=AT(w.tp).men);if(!nk.length){toast('Menzilde boşta bir nakliye filosu yok (Üretim › Hava › Nakliye filosu).');return}
  const cap=nk.length*2,go=us.filter(u=>u.org>40).slice(0,cap);if(!go.length){toast('Tugayların düzeni çok düşük (en az %40).');return}
  for(const w of nk.slice(0,Math.ceil(go.length/2)))w.mv=24;
  for(const u of go){u.r=t;u.path=[];u.prog=0;u.org=Math.max(30,u.org-30)}if(atWar(S.me,S.ctl[t]))occupy(t,S.me);
  log(`${go.length} komando tugayı ${near(t)} bölgesine paraşütle indi.`,1);U.sel=new Set()}
/* sabotaj baskını: komşu düşman bölgesindeki fabrikayı, hava savunma bataryasını ya da birliklerin düzenini vurur */
function raid(t){const us=S.U.filter(u=>(U.raidU||[]).includes(u.id)&&mine(u.o)&&!u.emb&&LT(u.tp).para);U.raidU=null;if(!us.length)return;
  if(!isL(t)||!atWar(S.me,S.ctl[t])){toast('Baskın için savaştığın bir ülkenin bölgesini seç.');return}
  const u=us.find(x=>(adjL[x.r].includes(t)||x.r===t)&&x.org>50&&(S.cool['rd'+x.id]||0)<=S.h);if(!u){toast('Hedefe komşu, düzeni %50\'nin üstünde ve dinlenmiş bir komando tugayı gerekir (baskınlar arası 7 gün).');return}
  S.cool['rd'+u.id]=S.h+24*7;u.org-=40;const def=S.U.some(x=>x.r===t&&atWar(S.me,x.o)),ok=Math.random()<.65*(def?.7:1)*xpM(u);
  if(!ok){if(Math.random()<.4)u.str=Math.max(.1,u.str-.25);log(`${near(t)} baskını başarısız oldu; komandolar geri çekildi.`,1);return}
  let what;if((S.fb[t]||0)-(S.fd[t]||0)>0){fabHit(t,1);what='bir askerî fabrika devre dışı bırakıldı'}else if(S.hs&&S.hs[t]){S.hs[t]--;OD.mver++;what='bir hava savunma bataryası imha edildi'}
  else{S.dmg[t]=Math.min(.8,(S.dmg[t]||0)+.1);markR(t);for(const x of S.U)if(x.r===t&&atWar(S.me,x.o))x.org-=20;what='ikmal depoları ve köprüler havaya uçuruldu'}
  u.ex=(u.ex||0)+5;log(`${near(t)} sabotaj baskını başarılı: ${what}.`,1)}
function amphib(t){const list=S.U.filter(u=>U.amph&&U.amph.includes(u.id)&&!u.emb);U.amph=null;if(!list.length)return;
  if(!isL(t)||!coastal(t)){toast('Çıkarma için kıyıda bir hedef seç.');return}if(!canEnter(S.me,t)){toast('Bu kıyıya giremezsin (savaşta değilsin).');return}
  const src=list[0].r,grp=list.filter(u=>u.r===src),need=grp.reduce((s,u)=>s+(LT(u.tp).amf||u.tp==='ok'?.5:1),0);
  if(!coastal(src)){toast(`${near(src)} kıyıda değil; çıkarma için birlikler kıyıdaki bir bölgede olmalı.`);return}
  const land=adjS[t].filter(s=>!seaHostile(s,S.me));if(!land.length){toast(`${near(t)} açıklarındaki denizler düşman denetiminde. Önce donanmanla denizi temizle.`);return}
  const route=from=>{let b=null;for(const s of land){const p=s===from?[]:path(S.me,from,s,1);if(p&&(!b||p.length<b.length))b=p}return b};
  const ok=f=>mine(f.o)&&!f.path.length&&!f.carry.length&&!f.pick&&fleetCap(f)>=need;
  let f=S.F.filter(f=>ok(f)&&adjS[src].includes(f.r)).sort((a,b)=>fleetCap(b)-fleetCap(a))[0];
  if(f){const best=route(f.r);if(!best){toast('Filonun o kıyıya deniz yolu yok.');return}
    for(const u of grp){u.emb=f.id;u.r=f.r;u.path=[];u.prog=0;f.carry.push(u.id)}f.path=best;f.prog=0;f.land=t;if(!best.length)disembark(f);
    toast(`${grp.length} birlik ${f.name} gemilerine bindi; hedef ${near(t)}.`);U.sel=new Set();return}
  let bp=null;for(const g of S.F){if(!ok(g))continue;for(const s of adjS[src]){const p=g.r===s?[]:path(S.me,g.r,s,1);if(p&&(!bp||p.length<bp.p.length))bp={g,p}}}
  if(!bp){toast(`${f1(need)} tümen taşıyabilecek boşta bir filon yok. Çıkarma gemisi ya da LHD gerekir (Üretim › Deniz).`);return}
  f=bp.g;f.path=bp.p;f.prog=0;f.pick={ids:grp.map(u=>u.id),src,t};for(const u of grp){u.path=[];u.prog=0}
  toast(`${f.name} birlikleri almak için ${near(src)} kıyısına gidiyor; sonra ${near(t)} çıkarması yapılacak.`);U.sel=new Set()}

/* ---------- arayüz ---------- */
let root=null,lastUI=0,uiDirty=1;
function dirty(now){uiDirty=1;if(now)lastUI=0}
function css(){if(document.getElementById('odcss'))return;const s=document.createElement('style');s.id='odcss';s.textContent=`
#od{position:absolute;inset:0;z-index:5;background:#0c1219;display:flex;flex-direction:column;color:var(--ink);font-family:var(--body);overflow:hidden}
#od[hidden]{display:none}
#odcv{position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block}
#od .odtop{position:relative;z-index:2;display:flex;align-items:center;gap:6px;padding:calc(6px + var(--sat)) 8px 6px;background:linear-gradient(#070b10f2,#070b10c8);border-bottom:1px solid var(--line);flex-wrap:wrap}
#od .odc{display:flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);padding:4px 7px;min-width:0}
#od .odc i{width:14px;height:14px;flex:0 0 auto;border:1px solid #0008}
#od .odc b{font-family:var(--display);font-size:16px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:34vw}
#od .ods{display:flex;gap:9px;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none}
#od .ods::-webkit-scrollbar{display:none}
#od .ods span{display:flex;flex-direction:column;line-height:1.1;white-space:nowrap}
#od .ods small{font-family:var(--mono);font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
#od .ods b{font-family:var(--mono);font-size:12.5px;font-weight:500}
#od .ods b.bad{color:#ff8a7a}#od .ods b.good{color:#7fd1a8}
#od .odclk{display:flex;align-items:center;gap:5px;margin-left:auto}
#od .odclk b{font-family:var(--mono);font-size:11.5px;color:var(--brass);white-space:nowrap}
#od .spd{display:flex;gap:2px}#od .spd button{width:28px;height:24px;border:1px solid var(--line);background:var(--bg);padding:0;font-family:var(--mono);font-size:10px;color:var(--ink)}
#od .spd button.sel{background:var(--brass);border-color:var(--brass);color:#14100a}
#od .menu{width:30px;height:26px;border:1px solid var(--line);background:var(--bg);padding:0;font-size:15px}
#od .odwar{position:relative;z-index:2;align-self:flex-start;margin:6px 8px 0;display:flex;gap:4px;flex-wrap:wrap;pointer-events:none}
#od .odwar span{pointer-events:auto;font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;background:#3a1512e6;border:1px solid #dc5b4e;padding:2px 6px}
#od .odmode{position:relative;z-index:2;align-self:center;margin-top:8px;background:#ece6d6;color:#0a1017;font-family:var(--mono);font-size:11.5px;padding:6px 10px;display:flex;gap:10px;align-items:center;box-shadow:0 4px 16px #000a}
#od .odmode button{background:#0a1017;color:#ece6d6;border:0;padding:3px 8px;font-family:var(--mono);font-size:11px}
#od .odpanel{position:absolute;left:0;right:0;bottom:calc(44px + var(--sab));z-index:3;max-height:min(64%,640px);display:flex;flex-direction:column;background:#0a0f15f5;border-top:1px solid var(--brass);box-shadow:0 -10px 30px #0009}
@media (min-width:820px){#od .odpanel{left:auto;width:min(520px,44vw);top:calc(45px + var(--sat));max-height:none;border-left:1px solid var(--brass);border-top:0;bottom:calc(44px + var(--sab))}}
#od .odpanel[hidden]{display:none}
#od .odph{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;border-bottom:1px solid var(--line)}
#od .odph span{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
#od .odph button{background:none;border:1px solid var(--line);width:28px;height:24px;padding:0}
#od .odpb{padding:10px 12px 14px;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:10px}
#od .odtabs{position:absolute;left:0;right:0;bottom:0;z-index:4;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:5px 6px calc(5px + var(--sab));background:#070b10f2;border-top:1px solid var(--line)}
#od .odtabs button{background:linear-gradient(var(--panel2),var(--panel));border:1px solid var(--line);border-top:2px solid var(--brass);padding:6px 2px;font-family:var(--display);font-size:15px;text-transform:uppercase;letter-spacing:.04em}
#od .odtabs button.sel{background:var(--brass);color:#14100a}
#od h2{font-size:24px}#od h3{font-size:15px}
#od .row{display:flex;gap:8px;align-items:center;justify-content:space-between}
#od .kv{display:grid;grid-template-columns:1fr auto;gap:3px 10px;font-size:13.5px}
#od .kv b{font-family:var(--mono);font-weight:500;font-size:12.5px;text-align:right}
#od .tag{font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;padding:1px 5px;border:1px solid var(--line);color:var(--muted);white-space:nowrap}
#od .tag.war{border-color:#dc5b4e;color:#ff8a7a}#od .tag.al{border-color:#63b690;color:#7fd1a8}#od .tag.tr{border-color:#e2a340;color:#e2c27a}
#od .it{display:flex;align-items:center;gap:8px;padding:7px 8px;background:#121b25;border:1px solid var(--line);text-align:left;width:100%}
#od button.it{color:var(--ink)}
#od .it.sel{border-color:#ffe08a;background:#1d2a36}
#od .it .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
#od .it small{color:var(--muted);font-size:12px}
#od .bar{height:4px;background:#ffffff1a;position:relative;overflow:hidden;min-width:40px}#od .bar i{position:absolute;left:0;top:0;bottom:0;background:#63b690}
#od .bar.o i{background:#e2c27a}#od .bar.r i{background:#dc5b4e}
#od .btns{display:flex;flex-wrap:wrap;gap:6px}
#od .b{background:linear-gradient(var(--panel2),var(--panel));border:1px solid var(--line);padding:7px 10px;font-family:var(--body);font-size:13.5px;color:var(--ink)}
#od .b.pri{background:#ece6d6;color:#0a1017;border-color:#ece6d6;font-weight:600}
#od .b.red{border-color:#dc5b4e;color:#ffb3a8}
#od .b:disabled{opacity:.45}
#od .seg{display:flex;flex-wrap:wrap;gap:4px}#od .seg button{flex:1;min-width:70px;background:#121b25;border:1px solid var(--line);padding:6px 4px;font-size:12.5px;color:var(--ink)}
#od .seg button.sel{background:var(--brass);color:#14100a;border-color:var(--brass)}
#od .note{font-size:12.5px;color:var(--muted)}
#od .sw{width:12px;height:12px;display:inline-block;border:1px solid #0008;flex:0 0 auto}
#od .lg p{font-size:13px;border-bottom:1px solid #ffffff10;padding:5px 0}#od .lg p i{font-family:var(--mono);font-style:normal;font-size:10px;color:var(--muted);margin-right:6px}
#odt{position:absolute;left:50%;transform:translateX(-50%);top:calc(64px + var(--sat));z-index:6;display:flex;flex-direction:column;align-items:center;gap:3px;width:min(86%,380px);pointer-events:none}
.odtoast{background:#0b1118e6;border:1px solid var(--line);border-left:3px solid var(--brass);padding:4px 9px;font-size:12px;line-height:1.3;color:var(--ink);transition:opacity .45s;box-shadow:0 4px 14px #0008;max-width:100%}
.odtoast.cap{border-left-color:#7fd1a8;font-family:var(--mono);font-size:11px}.odtoast .tn{color:var(--brass);font-family:var(--mono);font-size:10.5px}
.odtoast.out{opacity:0}
#odm{position:absolute;inset:0;z-index:7;background:#05080cb8;display:flex;align-items:center;justify-content:center;padding:18px}
#odm[hidden]{display:none}
#odm .win{width:min(100%,400px);max-height:90%}
#odm .win .bd{gap:12px}
.odpick{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;width:100%;max-width:640px;overflow:auto;min-height:0;flex:1;padding:2px}
.odpick button{display:flex;align-items:center;gap:8px;background:#0b1118d0;border:1px solid var(--line);padding:9px 8px;text-align:left;color:#ece6d6}
.odpick button.sel{border-color:#ece6d6;background:#1d2a36}
.odpick button i{width:14px;height:14px;flex:0 0 auto;border:1px solid #000a}
.odpick button span{display:flex;flex-direction:column;min-width:0}.odpick button b{font-size:14px;line-height:1.15}.odpick button small{font-family:var(--mono);font-size:9.5px;color:#9aa3ad;letter-spacing:.06em}
.odsum{width:100%;max-width:640px;background:#0b1118d9;border:1px solid var(--line);padding:10px 12px;font-size:13.5px;color:#b9c0c7;display:flex;flex-direction:column;gap:4px}
.odsum b{color:#ece6d6}
#od .odpanel{bottom:calc(92px + var(--sab))}
#od .odgen{position:absolute;left:0;right:0;bottom:calc(44px + var(--sab));z-index:4;display:flex;gap:5px;padding:4px 6px;overflow-x:auto;scrollbar-width:none;background:linear-gradient(transparent,#070b10cc)}
#od .odgen::-webkit-scrollbar{display:none}
#od .gc{flex:0 0 auto;display:flex;align-items:center;gap:6px;background:#0b1118ee;border:1px solid var(--line);border-bottom:3px solid var(--ac,#b8a6ef);padding:3px 8px 2px 3px;color:var(--ink);height:40px}
#od .gc i{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-family:var(--display);font-size:14px;font-weight:800;color:#14100a;background:var(--ac,#b8a6ef);border:2px solid #0a0f15}
#od .gc span{display:flex;flex-direction:column;line-height:1.12;text-align:left}#od .gc b{font-size:12.5px;white-space:nowrap}#od .gc small{font-family:var(--mono);font-size:9.5px;color:var(--muted);white-space:nowrap}
#od .gc.sel{background:#1d2a36;border-color:#ffe08a}#od .gc.add{border-bottom-color:var(--line);font-family:var(--mono);font-size:11px;padding:0 10px}
#od .odmm{position:absolute;right:8px;bottom:calc(140px + var(--sab));z-index:2;display:flex;flex-direction:column;gap:4px}
#od .odmm button{width:46px;height:30px;background:#0b1118e6;border:1px solid var(--line);font-family:var(--mono);font-size:9px;letter-spacing:.04em;color:var(--ink);padding:0}
#od .odmm button.sel{background:var(--brass);color:#14100a;border-color:var(--brass)}
#od .odmode.conf{flex-wrap:wrap;justify-content:center;max-width:94%}
#odit{position:absolute;left:50%;transform:translateX(-50%);top:calc(52px + var(--sat));z-index:7;width:min(94%,420px);pointer-events:none}
#odit .itc{pointer-events:auto;background:#0b1118f4;border:1px solid var(--brass);box-shadow:0 8px 24px #000c;padding:9px 12px;display:flex;flex-direction:column;gap:5px}
#odit small{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--brass)}
#odit .itc>b{font-family:var(--display);font-size:19px;text-transform:uppercase;letter-spacing:.03em}#odit p{font-size:13.5px;line-height:1.4;margin:0;color:#d8d2c2}
#odit .lnk{background:none;border:0;color:var(--muted);font-size:12px;text-decoration:underline;padding:0}
#odit .dots{display:flex;gap:3px}#odit .dots i{flex:1;height:3px;background:#ffffff22}#odit .dots i.d{background:#7fd1a8}#odit .dots i.on{background:var(--brass)}
#od.it #odt,#od.it #odwar{display:none}#odit.low{top:auto;bottom:calc(100px + var(--sab))}#od.it .odpanel{max-height:min(46%,440px)}
#od .ithl{outline:3px solid #ffe08a!important;outline-offset:2px;animation:ithl 1s infinite;position:relative;z-index:1}@keyframes ithl{50%{outline-color:#ffe08a33}}
#od .odmm button.vis{height:34px;line-height:1.05;margin-top:4px}#od .odmm button.vis.on{border-color:#ffe08a;color:#ffe08a}
#od .gc em{font-style:normal;color:#e2c27a;font-size:9.5px;letter-spacing:1px}
#od .gc.tgt{border-color:#7fe08f;animation:odpl 1.2s infinite}@keyframes odpl{50%{box-shadow:0 0 0 2px #7fe08f88}}
#od .gav{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-family:var(--display);font-size:16px;font-weight:800;color:#14100a;border:2px solid #0a0f15;flex:0 0 auto}
#od em.st{font-style:normal;color:#e2c27a;font-size:11px;letter-spacing:1px}#od b.gp{color:#7fd1a8;font-family:var(--mono);font-weight:500}
#od.pk .odpanel{bottom:calc(8px + var(--sab));max-height:min(46%,420px)}
#odm .odtut .kick{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);margin:0}
#odm .odtut p{font-size:14px;line-height:1.45;margin:0}#odm .odtut .dots{display:flex;gap:5px;justify-content:center}
#odm .odtut .dots i{width:7px;height:7px;border-radius:50%;background:#ffffff30}#odm .odtut .dots i.on{background:var(--brass)}
`;document.head.appendChild(s)}
function mount(){if(root)return;css();root=document.createElement('div');root.id='od';root.hidden=true;root.innerHTML=`<canvas id="odcv"></canvas><div class="odtop" id="odtop"></div><div id="odwar" class="odwar"></div><div id="odmode"></div>
  <div class="odpanel" id="odp" hidden><div class="odph"><span id="odpt"></span><button data-od="close" aria-label="Kapat">✕</button></div><div class="odpb" id="odpb"></div></div>
  <div class="odmm" id="odmm"></div><div class="odgen" id="odgen"></div><div class="odtabs" id="odtabs"></div><div id="odt"></div><div id="odit"></div><div id="odm" hidden></div>`;
  document.getElementById('game').appendChild(root);cv=document.getElementById('odcv');ctx=cv.getContext('2d');dpr=dprCap();bindCanvas();
  root.addEventListener('click',e=>{const b=e.target.closest('[data-od]');if(!b||b.disabled)return;e.stopPropagation();OD._hold=0;cmd(b.dataset.od)});
  /* parmak bir düğmenin üstündeyken paneller yeniden çizilmez; yoksa düğme dokunuşun ortasında değişir ve tıklama kaybolur */
  root.addEventListener('pointerdown',e=>{if(e.target!==cv)OD._hold=performance.now()},true);
  for(const t of ['pointerup','pointercancel'])root.addEventListener(t,()=>setTimeout(()=>{OD._hold=0},120),true);
  const loop=now=>{requestAnimationFrame(loop);if(!OD.on){OD._lt=now;return}const dt=Math.min(.25,(now-(OD._lt||now))/1000);OD._lt=now;
    if(S.spd&&!S.ev.length&&!S.over&&!U.menu&&!U.ask&&!S.conf&&U.tut==null&&!U.pick&&!U.amis){OD._acc=(OD._acc||0)+dt*SPD[S.spd];let n=0;while(OD._acc>=1&&n<48){OD._acc-=1;hour();n++}}
    if(OD._hold&&now-OD._hold>1500)OD._hold=0;
    if(U.it!=null)itTick(now);
    /* kare sınırı: parmak haritadayken 60, oyun akarken 30, duraklatılmış ve hareketsizken 15 kare/sn */
    const idle=now-(OD._touch||0)>500&&!U.drag,anim=U.it!=null||U.mode||U.amis||(S.bat&&S.bat.length)||S.A.some(w=>w.mis!=='bekle');
    const iv=!idle?0:(S.spd||anim)?32:66;if(now-(OD._dl||0)>=iv-3){OD._dl=now;OD._idleView=idle;draw()}
    if(uiDirty&&!OD._hold&&now-lastUI>220){lastUI=now;uiDirty=0;render()}};requestAnimationFrame(loop)}
const setH=(id,h)=>{const e=document.getElementById(id);if(e&&e._h!==h){e.innerHTML=h;e._h=h}};
const B=(a,t,cls='b',dis)=>`<button class="${cls}" data-od="${a}"${dis?' disabled':''}>${t}</button>`;
const bar=(v,c='')=>`<span class="bar ${c}"><i style="width:${clamp(v,0,100)}%"></i></span>`;
function render(){if(U.pick){setH('odtop',`<button class="odc" data-od="pkback"><b>‹ Modlar</b></button><div class="ods"><span><small>Açık Dünya</small><b>Yöneteceğin ülkeye dokun</b></span></div>`);for(const id of ['odwar','odmode','odmm','odgen','odtabs'])setH(id,'');
    const p=document.getElementById('odp');p.hidden=!U.open;if(U.open){const [t,h]=pPick();setH('odpt',t);setH('odpb',h)}modal();return}
  const C=S.C[S.me],me=S.me;
  const net=budget(me)-upkeep(me)+oilRev(me)-(C.wcd||0)-(C.al?(C.al.pt+C.al.za+C.al.tk)*FOP:0);
  setH('odtop',`<button class="odc" data-od="tab:ulke"><i style="background:${V.C[me].col}"></i><b>${SN(me)}</b></button>
    <div class="ods"><span><small>Hazine</small><b class="${C.tr<0?'bad':''}">${f1(C.tr)} mlr $${C.debt>.05?` <small style="color:#ff8a7a;font-size:9px">−${f1(C.debt)} borç</small>`:''}</b></span><span><small>Günlük</small><b class="${net<0?'bad':'good'}">${net<0?'':'+'}${(net*1000).toFixed(0)} mn $</b></span>
    <span><small>İnsan gücü</small><b>${f0(C.mp)} bin</b></span><span><small>İstikrar</small><b class="${C.stab<30?'bad':''}">%${f0(C.stab)}</b></span><span><small>Savaş desteği</small><b>%${f0(C.ws)}</b></span>${C.mis>0||V.C[me].ind>=3?`<span><small>Füze</small><b>${f0(C.mis)}</b></span>`:''}</div>
    <div class="odclk"><b>${dateOf(S.h)} · ${hourOf(S.h)}</b><div class="spd">${[['0','❚❚'],['1','▶'],['2','▶▶'],['3','▶▶▶']].map(([v,t])=>B('spd:'+v,t,S.spd===+v?'sel':'')).join('')}</div>${B('menu','≡','menu')}</div>`);
  setH('odwar',enemiesOf(me).map(e=>`<span data-od="dip:${e}">Savaş · ${SN(e)} · skor ${f0(score(me,e))}</span>`).join(''));
  root.classList.toggle('it',U.it!=null);setH('odit',itCard());
  /* rehber kartı, üstteki seçim ya da çizim çubuğuyla çakışmasın diye o sırada alta iner */
  {const oi=document.getElementById('odit');if(oi)oi.classList.toggle('low',U.it!=null&&!U.open&&!!(U.mode||U.sel.size||U.wsel||U.fsel!=null))}
  setH('odmm',[['pol','Siyasi'],['ter','Arazi'],['res','Direnç'],['den','Deniz'],['hava','Hava']].map(([k,t])=>B('mm:'+k,t,(U.mm||'pol')===k?'sel':'')).join('')+B('vis',['Birlik<br>hepsi','Birlik<br>düşman','Birlik<br>benim'][U.vis||0],'vis'+(U.vis?' on':'')));
  setH('odgen',S.ar.map(a=>{const n=a.u.length,ini=a.g.split(' ').slice(-2).map(w=>w[0]).join('');const add=U.sel.size&&!U.mode;return `<button class="gc${U.tab==='army'&&U.army===a.id&&U.open?' sel':''}${add?' tgt':''}" style="--ac:${a.c}" data-od="${add?'aadd':'army'}:${a.id}"><i>${ini}</i><span><b>${a.n} <em>${'★'.repeat(a.cm?a.cm.st:1)}</em></b><small>${add?`+ seçili ${U.sel.size} birliği ekle`:`${n} tümen${a.fr?' · '+SN(a.fr):''}${a.atk?' · taarruz':a.line&&a.line.length?' · hat':''}`}</small></span></button>`}).join('')+B('newarmy',U.sel.size&&!U.mode?`+ Yeni ordu (${U.sel.size})`:'+ Ordu','gc add'));
  if(U.mode==='conf'&&S.conf){setH('odmode',`<div class="odmode conf">Barış konferansı · ${NM(S.conf.c)} · alınacak bölgelere dokun: <b>${S.conf.sel.length}</b> seçili ${B('cfpart','Kalanı bırak')}${B('cfpup','Kalanı kukla yap')}${B('cfannex','Hepsini al')}</div>`)}
  else if(U.mode==='armytgt')setH('odmode',`<div class="odmode">Taarruz hedefi için düşman bölgesine dokun${B('cancel','Vazgeç')}</div>`);
  else if(U.mode==='drawline'){const a=S.ar.find(x=>x.id===U.army);setH('odmode',`<div class="odmode conf">${a?a.n:'Ordu'} · savunma hattı: tek parmakla kendi topraklarının üstünden çiz, iki parmakla kaydır · <b>${U.line?U.line.length:0}</b> bölge ${B('lundo','Geri al')}${B('lclr','Temizle')}${B('lok','Onayla')}${B('cancel','Vazgeç')}</div>`)}
  else if(U.mode==='seladd')setH('odmode',`<div class="odmode">Eklemek ya da çıkarmak için birliklerin olduğu bölgelere dokun · <b>${U.sel.size}</b> seçili${B('seldone','Tamam')}</div>`);
  else setH('odmode',U.mode?`<div class="odmode">${{airtgt:'Hava görevi için hedef bölgeye dokun',airbase:'Yeni üs için kendi topraklarında şehirli bir bölgeye dokun',land:'Çıkarma için kıyıdaki hedef bölgeye dokun',deploy:'Yeni tümenlerin çıkacağı kendi bölgene dokun',missile:'Füze saldırısı için hedefe dokun',para:'Hava indirme: düşman birliği olmayan hedef bölgeye dokun',raid:'Sabotaj baskını: komandolara komşu düşman bölgesine dokun'}[U.mode]}${B('cancel','Vazgeç')}</div>`:U.sel.size?`<div class="odmode">${U.sel.size} birlik seçili · hedefe dokun${B('seladd','+ Bölge')}${B('desel','Bırak')}</div>`:U.wsel?`<div class="odmode">✈ ${U.wsel.length} hava filosu seçili · hedef bölgeye dokun${B('wdesel','Bırak')}</div>`:U.fsel!=null?`<div class="odmode">Filo seçili · gideceği denize dokun${B('desel','Bırak')}</div>`:'');
  const tabs=[['ordu','Ordu'],['uret','Üretim'],['dip','Diplomasi'],['ulke','Ülke'],['log','Günlük']];
  setH('odtabs',tabs.map(([k,t])=>B('tab:'+k,t,U.open&&U.tab===k?'sel':'')).join(''));
  const p=document.getElementById('odp');p.hidden=!U.open;
  if(U.open){const [t,h]=panel();setH('odpt',t);setH('odpb',h)}
  modal()}
function panel(){switch(U.tab){case 'reg':return pReg();case 'army':return pArmy();case 'ordu':return pOrdu();case 'uret':return pUret();case 'dip':return U.dip?pCountry(U.dip):pDip();case 'ulke':return pUlke();case 'log':return pLog()}return ['','']}
const status=c=>c===S.me?'':S.pup[c]===S.me?'<span class="tag al">Kukla</span>':atWar(S.me,c)?'<span class="tag war">Savaş</span>':ally(S.me,c)?'<span class="tag al">Müttefik</span>':truce(S.me,c)?'<span class="tag tr">Ateşkes</span>':'';
/* günlük ve istatistik */
function pLog(){const sub=U.lsub||'log';let h=`<div class="seg">${B('lsub:log','Günlük',sub==='log'?'sel':'')}${B('lsub:ist','İstatistik',sub==='ist'?'sel':'')}</div>`;
  if(sub==='log')return ['Günlük',h+`<div class="lg">${S.log.map(([hh,t])=>`<p><i>${dateOf(hh)}</i>${t}</p>`).join('')||'<p class="note">Henüz kayıt yok.</p>'}</div>`];
  const H=S.hist||[],m=U.lmet||0,M=[['GSYH (mlr $)',0],['Ordu (tümen)',1],['Toprak (bölge)',2],['Hazine − borç',3]];
  h+=`<div class="seg">${M.map(([n],i)=>B('lmet:'+i,n.split(' ')[0],m===i?'sel':'')).join('')}</div>`;
  if(H.length<2)return ['İstatistik',h+'<p class="note">Grafikler için en az iki aylık veri gerekir; veriler 30 günde bir kaydedilir.</p>'];
  const last=H[H.length-1].d,cs=Object.keys(last).filter(c=>c!==S.me).sort((a,b)=>last[b][m]-last[a][m]).slice(0,5);if(last[S.me])cs.unshift(S.me);
  let mn=1e12,mx=-1e12;for(const p of H)for(const c of cs)if(p.d[c]){mn=Math.min(mn,p.d[c][m]);mx=Math.max(mx,p.d[c][m])}if(mx===mn)mx=mn+1;
  const W=340,HH=170,x=i=>8+i*(W-16)/(H.length-1),y=v=>HH-10-(v-mn)/(mx-mn)*(HH-24);
  const lines=cs.map(c=>{const pts=H.map((p,i)=>p.d[c]?`${x(i).toFixed(1)},${y(p.d[c][m]).toFixed(1)}`:null).filter(Boolean).join(' ');return `<polyline points="${pts}" fill="none" stroke="${V.C[c].col}" stroke-width="${c===S.me?3:1.6}" stroke-linejoin="round" opacity="${c===S.me?1:.85}"/>`}).join('');
  h+=`<svg viewBox="0 0 ${W} ${HH}" style="width:100%;height:auto;background:#0b1118;border:1px solid var(--line)"><text x="6" y="12" fill="#9aa3ad" font-size="10">${f0(mx)}</text><text x="6" y="${HH-2}" fill="#9aa3ad" font-size="10">${f0(mn)}</text>${lines}</svg>
  <p class="note">${dateOf(H[0].h)} – ${dateOf(H[H.length-1].h)}</p><div class="kv">${cs.map(c=>`<span><span class="sw" style="background:${V.C[c].col}"></span> ${SN(c)}${c===S.me?' (sen)':''}</span><b>${f1(last[c][m])}</b>`).join('')}</div>`;
  return ['İstatistik',h]}
function unitRow(u,selectable){const d=LT(u.tp),bt=(S.bat||[]).some(b=>u.path.length&&b.r===u.path[0]&&b.from&&b.from.includes(u.r));
  const st=u.emb?'Gemide':bt?'Muharebede → '+near(u.path[0]):u.path.length?'→ '+near(u.path[u.path.length-1]):isS(u.r)?'Çıkarmada':'Mevzide';
  return `<${selectable?'button':'div'} class="it${U.sel.has(u.id)?' sel':''}"${selectable?` data-od="tog:${u.id}"`:''}><span class="tx"><b>${d.n} ${xpTag(u)}</b><small>${st} · güç %${f0(u.str*100)} · düzen %${f0(u.org)}</small></span>${bar(u.str*100,u.str<.5?'r':'')}</${selectable?'button':'div'}>`}
function pReg(){const r=U.reg,R=RG[r],me=S.me;if(r==null||r<0)return ['Bölge',''];if(U.rm==='units'&&R.t==='l')return pUnits(r);
  if(R.t==='n')return [R.n,`<p class="note">${R.n} bu senaryoda oynanmayan bir komşu ülke. Birlikler buraya giremez.</p>`];
  if(R.t==='s'){const fs=S.F.filter(f=>f.r===r);let h=`<h2>${R.n}</h2>`;
    h+=fs.length?fs.map(f=>{const own=mine(f.o);return `<${own?'button':'div'} class="it${U.fsel===f.id?' sel':''}"${own?` data-od="fsel:${f.id}"`:''}><span class="sw" style="background:${V.C[f.o].col}"></span><span class="tx"><b>${f.name}</b><small>${SN(f.o)} · ${Object.entries(f.sh).map(([k,n])=>n+' '+ST(k).k.toLocaleLowerCase('tr')).join(', ')}${f.carry.length?' · '+f.carry.length+' tümen taşıyor':''}${f.pick?' · birlik almaya gidiyor':''}${f.sh.dz?raidTxt(f):''}${f.path.length?' · → '+RG[f.path[f.path.length-1]].n:''}</small></span>${status(f.o)}</${own?'button':'div'}>`}).join(''):'<p class="note">Bu denizde filo yok.</p>';
    const sc=seaOf(r);h+=`<p class="note">Deniz denetimi: <b style="color:${sc?sc==='~'?'#e2c27a':'rgb('+sideRGB(sc)+')':'inherit'}">${sc?sc==='~'?'çekişmeli':NM(sc):'kimsede değil'}</b>. Denizi denetleyen kıyılarına çıkarma yapabilir ve düşman kıyılarını abluka eder.</p>`;
    const nb=(S.bat||[]).some(b=>b.sea&&b.r===r);if(nb){const me_=fs.filter(f=>friend(f.o,me)),en=fs.filter(f=>atWar(f.o,me)),pw=l=>l.reduce((s,f)=>s+fleetFire(f),0),a=pw(me_),e=pw(en);
      h+=`<h3>Deniz muharebesi</h3><div class="it" style="flex-direction:column;align-items:stretch;gap:4px"><div class="row"><small>Bizim ateş gücümüz <b>${f0(a)}</b></small><small>Düşman <b>${f0(e)}</b></small></div>${bar(100*a/(a+e+.01),a>=e?'':'r')}
      ${[...me_,...en].map(f=>`<small><span class="sw" style="background:${V.C[f.o].col}"></span> ${f.name}: ${Object.entries(f.sh).map(([k,n])=>n+' '+ST(k).k.toLocaleLowerCase('tr')).join(', ')}${f.dmg>.5?` · <span style="color:#e2a340">ağır hasar</span>`:''}</small>`).join('')}</div>`}
    const sk=(S.nl||[]).filter(x=>x[1]===r).slice(0,6);if(sk.length)h+=`<h3>Son kayıplar</h3><div class="lg">${sk.map(x=>`<p><i>${dateOf(x[0])}</i>${SN(x[2])}: bir ${x[3].toLocaleLowerCase('tr')} battı</p>`).join('')}</div>`;
    const myF=S.F.find(f=>f.id===U.fsel);if(myF)h+=`<p class="note">Seçili filo: <b>${myF.name}</b> · taşıma kapasitesi ${fleetCap(myF)} tümen. Gitmesini istediğin denize dokun.</p><div class="btns">${B('fstop:'+myF.id,'Dur')}</div>`;
    const wars=enemiesOf(me);if(wars.length)h+=`<p class="note">Hava kuvvetlerini bu denize <b>bombardıman</b> görevine göndererek düşman gemilerine saldırabilirsin (Ordu › Hava).</p>`;
    return ['Deniz',h]}
  const o=S.own[r],c=S.ctl[r],T=TERR(r);
  let h=`<div class="row"><h2>${R.n}</h2>${status(c)}</div><div class="kv"><span>Ülke</span><b>${NM(o)}</b>${c!==o?`<span>İşgal eden</span><b style="color:#ff8a7a">${NM(c)}</b>`:''}<span>Arazi</span><b>${T.n}</b>${R.oil?`<span>Petrol</span><b>${'●'.repeat(R.oil)}</b>`:''}<span>Ekonomik değer</span><b>${f1(RW[r]*GPW[R.c])} mlr $/yıl</b>${S.dmg[r]?`<span>Hasar</span><b style="color:#ff8a7a">%${f0(S.dmg[r]*100)}</b>`:''}${CITYIN[r].length?`<span>Şehirler</span><b>${CITYIN[r].map(x=>x[0]).join(', ')}</b>`:''}</div>`;
  h+=fabInfo(r)+regEco(r);
  const here=S.U.filter(u=>u.r===r&&!u.emb),my=here.filter(u=>mine(u.o)),oth=here.filter(u=>!mine(u.o));
  if(my.length){h+=`<div class="row"><h3>Birliklerin (${my.length})</h3><div class="btns">${B('selall','Tümü')}${B('selnone','Hiçbiri')}</div></div>${my.map(u=>unitRow(u,1)).join('')}`;
    h+=selActs(r)}
  /* halk ve direnç */
  if(resOf(r)>=0&&mine(c)){const rv=S.res[r]||0,cm=S.cmp[r]||0,tg=resTarget(r,me),gar=garrison(r,me),rf=S.rf[r]||{},ic=.05+RW[r]*.015,cd=(rf.inv||0)>S.h;
    h+=`<h3>Halk ve direnç</h3><div class="kv"><span>Halkın bağlılığı</span><b>${NM(S.core[r])}</b><span>Direnç</span><b style="color:${rv>55?'#ff8a7a':rv>30?'#e2c27a':'#7fd1a8'}">%${f0(rv)} → %${f0(tg)}</b><span>Uyum</span><b>%${f0(cm)}</b><span>Verim</span><b>%${f0(rOut(r,me)*100)}</b><span>Garnizon</span><b>${gar} birlik</b>${rf.ozr?'<span>Yerel meclis</span><b>var</b>':''}</div>
    ${bar(rv,'r')}<p class="note">${rv>55?'Ayaklanma riski yüksek. ':''}Direnç; kültürel uzaklığa, işgal politikana (Ülke sekmesi), garnizona ve uyuma göre değişir. Uyum %80'i geçince bölgeyi topraklarına tam olarak katabilirsin.</p>
    <div class="btns">${B('inv:'+r,`Kalkınma yatırımı (${f1(ic)} mlr $)`,'b',cd||S.C[me].tr<ic)}${rf.ozr?'':B('ozr:'+r,'Yerel meclis kur')}${S.own[r]===me?B('integ:'+r,'Entegre et (0,3 mlr $)','b pri',cm<80||S.C[me].tr<.3):''}</div>`}
  const byO={};for(const u of oth)(byO[u.o]=byO[u.o]||[]).push(u);
  for(const k in byO)h+=`<div class="row"><h3>${NM(k)} (${byO[k].length})</h3>${status(k)}</div><p class="note">${Object.entries(byO[k].reduce((a,u)=>(a[u.tp]=(a[u.tp]||0)+1,a),{})).map(([t,n])=>n+' × '+LT(t).k).join(' · ')}</p>`;
  const b=(S.bat||[]).find(x=>x.r===r&&!x.sea);if(b)h+=`<div class="it"><span class="tx"><b>Muharebe sürüyor</b><small>Saldıran ${SN(b.o)} ${f1(b.A)} · savunan ${SN(b.d)} ${f1(b.D)}</small>${b.as?`<small>Hava üstünlüğü: <b style="color:${(b.as>0?friend(b.o,me):friend(b.d,me))?'#7fd1a8':'#ff8a7a'}">${SN(b.as>0?b.o:b.d)}</b> (%${f0(Math.abs(b.as)*15)} güç)</small>`:''}</span>${bar(100*b.A/(b.A+b.D),'r')}</div>`;
  if(isL(r)){const hs=(S.hs||{})[r]||0,pend=S.C[me].prod.filter(x=>x.k==='h'&&+x.tp===r).length;if(hs||mine(c))h+=`<div class="kv"><span>Hava savunma bataryası</span><b>${hs}${pend?` (+${pend} yapımda)`:''} / 3</b></div>`;
    if(mine(c)){const why=canBuild(me,'h',r);h+=`<div class="btns">${B('hss:'+r,`Hava savunma bataryası kur (${f1(costOf(me,'h',r))} mlr $, ${Math.ceil(timeOf(me,'h')/24)} gün)`,'b',!!why)}</div><p class="note">Patriot / S-400 sınıfı batarya: bu bölgeye ve komşularına gelen düşman uçaklarına ağır kayıp verdirir. Bölge düşerse batarya yok olur.</p>`}}
  const wings=S.A.filter(w=>w.base===r&&mine(w.o));if(wings.length)h+=`<h3>Hava üssü</h3>${wings.map(wingRow).join('')}`;
  const acts=[];if(atWar(me,c)){if(S.C[me].mis>0)acts.push(B('fire:'+r,`Füze saldırısı (${f0(Math.min(10,S.C[me].mis))})`,'b red'))}
  if(c!==me)acts.push(B('dip:'+c,`${SN(c)} ile ilişkiler ›`));
  if(acts.length)h+=`<div class="btns">${acts.join('')}</div>`;
  return [isL(r)?'Bölge':'',h]}
function selActs(r){if(!U.sel.size)return '';return `<p class="note">Seçili ${U.sel.size} birlik: haritada gidecekleri bölgeye dokun ya da sayaçlarından sürükle.</p><div class="btns">${B('stop','Dur / iptal')}${B('seladd','+ Başka bölgeden ekle')}${coastal(r)?B('amph','Deniz çıkarması…'):''}${[...U.sel].some(id=>{const u=S.U.find(x=>x.id===id);return u&&LT(u.tp).para})?B('para','Hava indirme…')+B('raid','Sabotaj baskını…'):''}${B('newarmy','Yeni ordu kur')}${S.ar.map(a=>B('aadd:'+a.id,a.n+"'ya ekle")).join('')}</div>`}
/* birliklerin olduğu bölgeye dokununca açılan panel: ordulara göre gruplu birlikler; bölge bilgisi bir dokunuş ötede (ya da basılı tut) */
function pUnits(r){const my=S.U.filter(u=>u.r===r&&!u.emb&&mine(u.o)),gr=new Map();for(const u of my){const k=u.ar||0;if(!gr.has(k))gr.set(k,[]);gr.get(k).push(u)}
  let h=`<div class="row"><h2>${RG[r].n}</h2>${B('rinfo','Bölge bilgisi ›','b')}</div>`;
  for(const [k,l] of gr){const a=k&&S.ar.find(x=>x.id===k);
    h+=`<div class="row"><h3>${a?`<span class="sw" style="background:${a.c}"></span> ${a.n} · ${a.g}`:'Ordusuz birlikler'} (${l.length})</h3><div class="btns">${B('selg:'+r+':'+k,l.every(u=>U.sel.has(u.id))?'Bırak':'Seç','b')}${a?B('army:'+a.id,'Ordu ›','b'):''}</div></div>${l.map(u=>unitRow(u,1)).join('')}`}
  if(!my.length)h+='<p class="note">Bu bölgede birliğin kalmadı.</p>';
  return ['Birlikler',h+selActs(r)]}
/* denizaltılar düşman kıyısındaki bir denizdeyse ticaret akını yapar */
function raidTxt(f){const t=new Set();for(const r of seaLands(f.r)){const o=S.ctl[r];if(o&&atWar(f.o,o))t.add(o)}return t.size?` · <span style="color:#7fd1a8">ticaret akını: ${[...t].map(SN).join(', ')}</span>`:''}
function wingRow(w){const d=AT(w.tp);return `<div class="it" style="flex-direction:column;align-items:stretch"><div class="row"><span class="tx"><b>${d.n}</b><small>${near(w.base)} · ${f0(w.n)} uçak · menzil ${f0(d.men)} km${w.mv?' · intikalde':''}${w.t>=0?' · hedef '+RG[w.t].n:''}${w.ar?` · <span style="color:#7fd1a8">${(S.ar.find(a=>a.id===w.ar)||{n:'ordu'}).n} desteğinde</span>`:''}</small></span>${bar(100*w.n/d.ucak,'o')}</div>
  <div class="seg">${MIS.filter(m=>m==='bekle'||(m==='ust'&&d.hv>0)||(m==='des'&&d.yer>0)||(m==='bom'&&d.bom>0)).map(m=>B(`wm:${w.id}:${m}`,MISN[m],w.mis===m?'sel':'')).join('')}</div>
  ${S.ar.length&&(d.hv||d.yer)?`<small class="note">Orduya bağla: bağlı filo ordunun muharebelerine kendiliğinden destek verir</small><div class="seg">${B(`war:${w.id}:0`,'Bağımsız',!w.ar?'sel':'')}${S.ar.map(a=>B(`war:${w.id}:${a.id}`,a.n,w.ar===a.id?'sel':'')).join('')}</div>`:''}
  <div class="btns">${B('wt:'+w.id,'Hedef seç')}${B('wb:'+w.id,'Üs değiştir')}${w.n<d.ucak-.5?B('wr:'+w.id,`Acil takviye (${f1((d.ucak-w.n)*d.mal/d.ucak*1.5)} mlr $)`,'b',!canStay(w.o,w.base)||S.C[w.o].tr<(d.ucak-w.n)*d.mal/d.ucak*1.5):''}</div></div>`}
function pOrdu(){const me=S.me,us=S.U.filter(u=>mine(u.o)),by={};for(const u of us)(by[u.emb?'g':u.r]=by[u.emb?'g':u.r]||[]).push(u);
  let h=`<div class="kv"><span>Kara birlikleri</span><b>${us.length} tümen/tugay</b><span>Hava</span><b>${S.A.filter(w=>mine(w.o)).length} filo · ${f0(S.A.filter(w=>mine(w.o)).reduce((s,w)=>s+w.n,0))} uçak</b><span>Deniz</span><b>${S.F.filter(f=>mine(f.o)).reduce((s,f)=>s+fleetSize(f),0)} gemi</b><span>Kayıplar / düşman kaybı</span><b>${S.C[me].lost} / ${S.C[me].kill}</b></div>
  <div class="seg">${[['k','Kara'],['h','Hava'],['d','Deniz']].map(([k,t])=>B('osub:'+k,t,(U.osub||'k')===k?'sel':'')).join('')}</div>`;
  if((U.osub||'k')==='k')h+=Object.entries(by).sort((a,b)=>b[1].length-a[1].length).map(([r,l])=>{const nm=r==='g'?'Gemide':near(+r),mv=l.filter(u=>u.path.length).length;
    return `<button class="it" data-od="${r==='g'?'noop':'go:'+r}"><span class="tx"><b>${nm}</b><small>${Object.entries(l.reduce((a,u)=>(a[u.tp]=(a[u.tp]||0)+1,a),{})).map(([t,n])=>n+' '+LT(t).k).join(' · ')}${mv?' · '+mv+' hareket hâlinde':''}</small></span>${bar(l.reduce((s,u)=>s+u.org,0)/l.length,'o')}</button>`}).join('')||'<p class="note">Kara birliğin yok.</p>';
  if(U.osub==='h')h+=S.A.filter(w=>mine(w.o)).map(wingRow).join('')||'<p class="note">Hava kuvvetin yok.</p>';
  if(U.osub==='d')h+=S.F.filter(f=>mine(f.o)).map(f=>`<button class="it" data-od="fgo:${f.id}"><span class="tx"><b>${f.name}</b><small>${RG[f.r].n} · ${Object.entries(f.sh).map(([k,n])=>n+' '+ST(k).k.toLocaleLowerCase('tr')).join(', ')} · kapasite ${fleetCap(f)}${f.path.length?' · → '+RG[f.path[f.path.length-1]].n:''}</small></span></button>`).join('')||'<p class="note">Donanman yok.</p>';
  h+=`<p class="note">Birliği taşımak için sayacına basılı tut ve gideceği bölgeye sürükle; yeşil çerçeve gidilebilir, kırmızı gidilemez demek. Bölgeye dokunmak bilgi panelini açar. İki parmakla yakınlaş; harita yatayda dünyayı dolaşır.</p>`;return ['Silahlı kuvvetler',h]}
/* fabrika yardımcıları (arayüz) */
const fabDmg=c=>{let n=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c)n+=S.fd[r]||0;return n};
function fabSlots(c){let u=0,t=0;for(let r=0;r<NR;r++)if(S.ctl[r]===c){u+=S.fb[r]||0;t+=SLOT[r]}return [u,t]}
function fabSites(c){const C=S.C[c],rs=[];for(let r=0;r<NR;r++)if(S.ctl[r]===c&&freeSlot(r)>0)rs.push(r);rs.sort((a,b)=>SLOT[b]-SLOT[a]);
  const pend=C.fabB.map(b=>`<div class="it"><span class="tx"><b>${b.r>=0?near(b.r):'Fabrika'}</b><small>yapımda · ${b.left} gün kaldı</small></span>${bar(100*(1-b.left/30))}</div>`).join('');
  if(!rs.length)return pend+'<p class="note">Topraklarında boş fabrika yuvası kalmadı. Yeni yuva için toprak kazanmalısın.</p>';
  return pend+`<div class="btns">${rs.slice(0,8).map(r=>B('fab:'+r,`${near(r)} · ${freeSlot(r)} boş`,'b',C.tr<fabCost(c)||C.fabB.length>=2)).join('')}</div>${C.fabB.length>=2?'<p class="note">Aynı anda en fazla iki fabrika kurulabilir.</p>':''}`}
function fabInfo(r){if(!SLOT[r]&&!(S.fb[r]>0))return '';const me=S.me,n=S.fb[r]||0,d=S.fd[r]||0,fr=freeSlot(r);
  let h=`<div class="kv"><span>Askerî fabrika</span><b>${n} / ${SLOT[r]}${d?` · <span style="color:#e2a340">${d} hasarlı (${S.frp[r]||30} günde bir onarım)</span>`:''}</b></div>`;
  if(S.ctl[r]===me&&fr>0)h+=`<div class="btns">${B('fab:'+r,`Fabrika kur (${f1(fabCost(me))} mlr $, 30 gün)`,'b',S.C[me].tr<fabCost(me)||S.C[me].fabB.length>=2)}</div>`;
  else if(S.ctl[r]!==me&&n)h+=`<p class="note">Bu bölgeyi ele geçirirsen fabrikaların dörtte biri yıkılır, kalanı hasarlı olarak senin olur.</p>`;return h}
function pUret(){const me=S.me,C=S.C[me],L=mobOf(me),k=fabEff(me),act=C.al.pt+C.al.za+C.al.tk,free=freeFab(C);
  let h=`<div class="kv"><span>Askerî fabrika</span><b>${C.fab}${fabDmg(me)?` (+${fabDmg(me)} hasarlı)`:''}${C.fabB.length?` · ${C.fabB.length} yapımda`:''}</b><span>Fabrika yuvası</span><b>${fabSlots(me)[0]} / ${fabSlots(me)[1]}</b><span>Verim (sanayi ${IND(me)}/5)</span><b>×${k.toFixed(1)}</b><span>Günlük fabrika gideri</span><b>${f0(act*FOP*1000)} mn $</b>
  <span>İnsan gücü</span><b>${f0(C.mp)} / ${f0(mpCap(me))} bin</b><span>Eğitim kampı</span><b>${C.train.length} / ${trainSlots(me)}</b><span>Hazine</span><b>${f1(C.tr)} mlr $</b></div>`;
  /* seferberlik */
  h+=`<h3>Seferberlik yasası</h3><div class="seg">${MOB.map((m,i)=>B('mob:'+i,m.n,(C.mob==null?1:C.mob)===i?'sel':'',!!(m.ws&&C.ws<m.ws))).join('')}</div><p class="note">${L.d}</p>`;
  /* fabrikalar ve teçhizat */
  h+=`<h3>Teçhizat üretimi</h3>`+Object.entries(EQ).map(([e,E])=>`<div class="it"><span class="tx"><b>${E.n}: ${f0(C.eq[e])}</b><small>${C.al[e]} fabrika · günde +${f1(C.al[e]*E.out*k)}</small></span>${B(`al:${e}:-1`,'−','b',!C.al[e])}${B(`al:${e}:1`,'+','b',!free)}</div>`).join('');
  h+=`<p class="note">${free?`Boşta ${free} fabrika var; bir teçhizata ver. `:''}Fabrikalar her gün çalışır ve gider yazar; hazine yetmezse durur.</p>
  <h3>Fabrika kur · ${f1(fabCost(me))} mlr $, 30 gün</h3>${fabSites(me)}
  <h3>İthalat</h3><div class="btns">${Object.entries(EQ).map(([e,E])=>{const c=E.imp*E.lot*(V.C[me].ind<2?1:1.15);const cd=Math.ceil(((S.cool['im'+me+e]||0)-S.h)/24);return B('imp:'+e,`${E.lot} ${E.k} (${f1(c)} mlr $)${cd>0?' · '+cd+' gün':''}`,'b',C.tr<c||cd>0)}).join('')}</div>`;
  /* tümen kurma */
  const dep=C.dep>=0&&S.ctl[C.dep]===me?C.dep:capOf(me);
  h+=`<h3>Tümen kur</h3><div class="row"><p class="note">Konuşlanma: <b>${dep>=0?near(dep):'—'}</b></p>${B('dep','Değiştir','b')}</div>`+Object.keys(NEED).map(tp=>{const d=LT(tp),n=NEED[tp],why=canRecruit(me,tp);
    const req=Object.entries(n).map(([e,v])=>`${v} ${EQ[e].k}`).join(' + ')+` · ${d.ins} bin kişi · ${TRAIN[tp]} gün`;
    return `<div class="it" style="flex-direction:column;align-items:stretch"><span class="tx"><b>${d.n}</b><small>${req}</small><small>saldırı ${d.sa} · savunma ${d.sv} · ${d.hz} km/sa</small>${why?`<small style="color:#e2a340">${why}</small>`:''}</span>
    <div class="btns">${B(`rec:${tp}:0`,'Eğit','b pri',!!why)}${B(`rec:${tp}:1`,`Hızlı eğit (${Math.ceil(TRAIN[tp]/2)} gün, deneyimsiz)`,'b',!!why)}</div></div>`}).join('');
  if(C.train.length)h+=`<h3>Eğitimde</h3>`+C.train.map((t,i)=>`<div class="it"><span class="tx"><b>${LT(t.tp).n}${t.rush?' · hızlı':''}</b><small>${t.left} gün kaldı</small></span>${bar(100*(1-t.left/t.tot))}${B('trc:'+i,'✕','b')}</div>`).join('');
  /* hava, deniz, füze: para ile sıra */
  if(C.prod.length)h+=`<h3>Hava ve deniz sırası</h3>`+C.prod.map((it,i)=>{const d=it.k==='u'?LT(it.tp):it.k==='a'?AT(it.tp):it.k==='s'?ST(it.tp):it.k==='h'?{n:'Hava savunma bataryası · '+near(+it.tp)}:{n:'10 balistik füze'};return `<div class="it"><span class="tx"><b>${d.n}</b><small>${i<lines(me)?`${Math.ceil(it.left/24)} gün kaldı`:'Hat bekliyor'}</small></span>${bar(100*(1-it.left/it.tot))}${B('pc:'+i,'✕','b')}</div>`}).join('');
  const cat=(kk,T,title)=>`<h3>${title}</h3>`+Object.entries(T).map(([tp,d])=>{const why=canBuild(me,kk,tp),cost=costOf(me,kk,tp);
    const st=kk==='a'?`hava ${d.hv} · kara ${d.yer} · menzil ${d.men} km`:`ateş ${d.at} · dayanıklılık ${d.can}${d.tas?' · '+d.tas+' tümen taşır':''}`;
    return `<div class="it"><span class="tx"><b>${d.n}</b><small>${f1(cost)} mlr $ · ${Math.ceil(timeOf(me,kk,tp)/24)} gün · ${st}</small>${why&&!why.startsWith('Hazine')?`<small style="color:#e2a340">${why}</small>`:''}</span>${B(`q:${kk}:${tp}`,'Üret','b pri',!!why)}</div>`}).join('');
  h+=cat('a',V.A,'Hava')+cat('s',V.S,'Deniz');
  if(V.C[me].ind>=3||V.C[me].mis>0){const why=canBuild(me,'m','m');h+=`<h3>Füze</h3><div class="it"><span class="tx"><b>10 balistik füze</b><small>${f1(MISC)} mlr $ · ${Math.ceil(timeOf(me,'m')/24)} gün · menzil 2.200 km</small><small>İsabet başına bölgeye %6 hasar, birliklere ağır kayıp; fabrikaları ve hava savunma bataryalarını vurur, halkın istikrarını sarsar. Hava savunması ve bataryalar füzelerin bir kısmını önler.</small></span>${B('q:m:m','Üret','b pri',!!why)}</div>`}
  return ['Üretim',h]}
function pDip(){const me=S.me;let h=`<p class="note">Bir ülkeye dokunarak ilişkileri ve diplomatik eylemleri aç.</p>`;
  h+=V.ORDER.filter(c=>c!==me&&alive(c)).sort((a,b)=>rel(me,a)-rel(me,b)).map(c=>{const r=rel(me,c);return `<button class="it" data-od="dip:${c}"><span class="sw" style="background:${V.C[c].col}"></span><span class="tx"><b>${NM(c)}</b><small>İlişki ${r>0?'+':''}${f0(r)} · ${PERSN[PERS(c)]}${S.C[c].prep&&S.C[c].prep.t===me?' · <b style="color:#ff8a7a">sana karşı savaş hazırlığı</b>':''}${(S.tr||[]).filter(t=>pair(t,me,c)).map(t=>' · '+TRN[t.k].k).join('')}</small></span>${status(c)}</button>`}).join('');
  const gone=V.ORDER.filter(c=>!alive(c));if(gone.length)h+=`<p class="note">Teslim olan: ${gone.map(NM).join(', ')}</p>`;
  return ['Diplomasi',h]}
function pCountry(c){const me=S.me,C=S.C[c],d=V.C[c],r=rel(me,c),w=atWar(me,c),al=ally(me,c);
  const reg=S.ctl.filter(x=>x===c).length,lp=landPower(c),mylp=landPower(me);
  let h=`<div class="row">${B('dipback','‹ Liste','b')}${status(c)}</div><div class="row"><h2>${NM(c)}</h2><span class="sw" style="background:${d.col};width:22px;height:22px"></span></div>
  <div class="kv"><span>Yönetim</span><b>${d.gov}</b><span>Başkent</span><b>${V.CAP[c]}</b><span>Nüfus</span><b>${f1(d.pop)} mn</b><span>GSYH (şimdi)</span><b>${f0(gdpOf(c))} mlr $</b><span>Bölge</span><b>${reg}</b><span>Kara gücü (sana göre)</span><b>${mylp?'×'+(lp/mylp).toFixed(2):'—'}</b><span>İstikrar</span><b>%${f0(C.stab)}</b><span>İlişki</span><b>${r>0?'+':''}${f0(r)}</b>${w?`<span>Savaş skoru</span><b>${f0(score(me,c))}</b>`:''}</div>`;
  const als=S.allies.filter(a=>a.m.includes(c));if(als.length)h+=`<p class="note">İttifak: ${als.map(a=>a.n+' ('+a.m.map(SN).join(', ')+')').join('; ')}</p>`;
  if(S.pup[c]!==me){const L=attitude(c),tot=L.reduce((s,x)=>s+x[0],0);
    h+=`<h3>Tutum · <span class="tag">${PERSN[PERS(c)]}</span></h3><div class="it att" style="flex-direction:column;align-items:stretch;gap:2px"><small>${PERSD[PERS(c)]}</small>${L.map(([v,t])=>`<div class="row"><small>${t}</small><b style="font-family:var(--mono);font-size:12px;color:${v>0?'#7fd1a8':'#ff8a7a'}">${v>0?'+':''}${v}</b></div>`).join('')}<div class="row" style="border-top:1px solid var(--line);padding-top:3px"><small><b>Toplam tutum</b></small><b style="font-family:var(--mono);color:${tot>=0?'#7fd1a8':'#ff8a7a'}">${tot>0?'+':''}${tot}</b></div></div>`}
  const cd=k=>(S.cool[k+c]||0)>S.h;
  const acts=[];
  if(S.pup[c]===me){const age=(S.h-(S.pupH[c]||0))/24;acts.push(B('pann:'+c,'Topraklarıma kat (ilhak)','b pri',age<180||r<50));acts.push(B('pfree:'+c,'Bağımsızlık ver','b'));
    h+=`<p class="note">Kukla devlet: dış politikası sana bağlı, savaşlarına katılır ve bütçesinin üçte birini haraç olarak öder (günde ${f0(budget(c)*.35*1000)} mn $). Himayenin 180. gününden sonra ve ilişki +50 iken barışçıl yoldan topraklarına katabilirsin${age<180?` (${Math.ceil(180-age)} gün kaldı)`:''}.</p>`}
  else if(!w){acts.push(B('rel:'+c,'İlişkileri geliştir (0,1 mlr $)','b',cd('r')||S.C[me].tr<.1));acts.push(B('kin:'+c,'Kınama ve yaptırım','b',cd('k')));
    if(!al)acts.push(B('ally:'+c,'İttifak öner','b',cd('a')));else acts.push(B('unally:'+c,'İttifaktan çık','b'));
    if(!al)acts.push(B('dw:'+c,hasCB(me,c)?'Savaş ilan et…':'Savaş ilan et (önce gerekçe)','b red',truce(me,c)||!hasCB(me,c)))}
  else{acts.push(B('pw:'+c,'Beyaz barış öner','b'));acts.push(B('pk:'+c,'Barış: işgal ettiğim yerler bende kalsın','b pri'))}
  h+=`<div class="btns">${acts.join('')}</div>`;
  if(truce(me,c))h+=`<p class="note">Ateşkes ${Math.ceil((S.truce[rk(me,c)]-S.h)/24)} gün daha sürüyor; bu sürede savaş ilan edilemez.</p>`;
  if(U.dmsg)h+=`<p class="say" style="margin:0;font-size:13.5px;color:#d8d2c2;border-left:2px solid var(--brass);padding-left:8px">${U.dmsg}</p>`;
  h+=dipExtra(c);
  return ['Diplomasi',h]}
/* ülke panelindeki anlaşma, silah satışı ve savaş gerekçesi bölümleri */
function dipExtra(c){const me=S.me,C=S.C[me],w=atWar(me,c);if(S.pup[c]===me)return '';let h='';
  if((S.prxK||{})[c])h+=`<p class="note" style="color:#ff8a7a">⚠ ${NM(c)}, ülkendeki isyancılara destek verirken yakalandı.</p>`;
  h+=`<h3>Anlaşmalar</h3>`+['nap','acc','trd','def'].map(k=>{const on=hasTr(me,c,k)||(k==='acc'&&hasTr(me,c,'acc')),wl=trWill(c,k),cd=(S.cool['tp'+k+c]||0)>S.h;
    return `<div class="it" style="flex-direction:column;align-items:stretch;gap:3px"><div class="row"><span class="tx"><b>${TRN[k].n}</b><small>${TRN[k].d}</small></span>${on?'<span class="tag al">Yürürlükte</span>':''}</div>
    <div class="row"><small style="color:${on?'#7fd1a8':wl>=0?'#7fd1a8':'#e2a340'}">${on?'':w?'Savaşta olduğun ülkeyle anlaşma yapılamaz.':wl>=0?'Kabul eder.':`Kabul için tutum ${-wl} puan daha iyi olmalı.`}</small>${on?B(`trc:${k}:${c}`,'İptal et','b'):B(`trp:${k}:${c}`,cd?'Bekle':'Öner','b pri',w||cd)}</div></div>`}).join('');
  if(!w){h+=`<h3>Silah satışı</h3><div class="btns">${Object.entries(EQ).map(([e,E])=>{const p=E.imp*E.lot*.85;return B(`arm:${c}:${e}`,`${E.lot} ${E.k} sat (+${f1(p)} mlr $)`,'b',(C.eq[e]||0)<E.lot||(S.cool['ar'+c]||0)>S.h)}).join('')}</div><p class="note">Deponda yeterli teçhizat varsa satarsın; ilişki iyileşir. Ülke savaştaysa ya da zenginse alır. Onunla savaşan bir dostunsa sana kırılır.</p>`;
    h+=`<h3>Vekâlet savaşı</h3>`+(prxOn(me,c)?`<p class="note" style="color:#e2c27a">${NM(c)} içindeki isyancılara gizli destek veriyorsun (günde 10 mn $): istikrarı her hafta düşer, topraklarında isyancı birlikler doğabilir. Yakalanırsan ilişki −25.</p><div class="btns">${B('prx:'+c,'Desteği kes','b')}</div>`:`<div class="btns">${B('prx:'+c,'İsyancılara destek ver (günde 10 mn $)','b',ally(me,c))}</div><p class="note">Ülkeyi içeriden zayıflatır: istikrarı düşer, topraklarında isyancı birlikler ortaya çıkar. Destek açığa çıkarsa ilişki −25 ve karşı taraf sana karşı savaş gerekçesi kazanır.</p>`);
    const cb=(S.cb||{})[me+'|'+c];
    h+=`<h3>Savaş gerekçesi</h3>`;
    if(cb&&cb.done<=S.h)h+=`<p class="note" style="color:#7fd1a8">Gerekçe hazır: <b>${CBT[cb.k].n}</b>. ${Math.ceil((cb.until-S.h)/24)} gün içinde savaş ilan edersen savaş <b>haklı</b> sayılır: istikrar ve itibar kaybı olmaz, karşı tarafın müttefiklerinin yarısı savaşa girmez.</p>`;
    else if(cb)h+=`<div class="it"><span class="tx"><b>${CBT[cb.k].n} hazırlanıyor</b><small>${Math.ceil((cb.done-S.h)/24)} gün kaldı · basına sızarsa ilişkiler bozulur</small></span>${bar(100*(1-(cb.done-S.h)/(CBT[cb.k].g*24)))}</div>`;
    else h+=`<div class="btns">${Object.entries(CBT).map(([k,t])=>B(`cbs:${k}:${c}`,`${t.n} (${t.g} gün, ${t.c.toFixed(2).replace('.',',')} mlr $)`,'b',(t.req&&!t.req(c))||C.tr<t.c||ally(me,c))).join('')}</div><p class="note"><b>Gerekçe olmadan savaş ilan edemezsin.</b> Hazırlık sürerken basına sızabilir; sızarsa ilişkiler bozulur. Hazır olunca 180 gün geçerlidir.</p>`}
  return h}
/* ülke yatırımları */
/* borç paneli */
function pDebt(){const me=S.me,C=S.C[me],cr=credit(me),d=C.debt||0,lim=budget(me)*365*.6;
  return `<h3>Borç ve kredi notu</h3><div class="kv"><span>Borç</span><b style="color:${d>0?'#ff8a7a':'inherit'}">${f1(d)} mlr $</b><span>Kredi notu</span><b>${cr.n}</b><span>Faiz</span><b>%${f0(cr.r*100)} / yıl${d>0?` · günde ${(d*cr.r/365*1000).toFixed(1)} mn $`:''}</b></div>
  <div class="btns">${B('debt:1','1 mlr $ borç al','b',d+1>lim)}${B('debt:-1','1 mlr $ borç öde','b',d<=0||C.tr<Math.min(1,d))}</div><p class="note">Hazine eksiye düşerse fark kendiliğinden borca yazılır. Borç arttıkça kredi notu düşer ve faiz yükselir; <b>C</b> notunda istikrar her gün erir ve ithalat %30 pahalanır.</p>`}
/* araştırma paneli */
function pTech(){const me=S.me,C=S.C[me];let h=`<h3>Araştırma (Ar-Ge)</h3>`;
  if(C.rs)h+=`<div class="it"><span class="tx"><b>${TECH[C.rs.k].n}</b><small>${C.rs.left} gün kaldı · ${TECH[C.rs.k].d}</small></span>${bar(100*(1-C.rs.left/TECH[C.rs.k].g))}</div>`;
  h+=Object.entries(TECH).map(([k,t])=>{const done=TK(me,k),why=canTech(me,k);return `<div class="it"><span class="tx"><b>${t.n}${done?' ✓':''}</b><small>${t.d}</small><small>${f1(t.c)} mlr $ · ${t.g} gün${t.ind?` · sanayi ${t.ind}+`:''}${t.req?` · önce ${TECH[t.req].n}`:''}</small></span>${done?'':B('rsh:'+k,'Araştır','b pri',!!why)}</div>`}).join('');
  return h}
/* hedefler paneli */
function pGoals(){if(!S.goals)return '';return `<h3>Hedefler</h3>`+S.goals.map(g=>{const v=goalVal(g);return `<div class="it"><span class="tx"><b>${g.done?'✓ ':''}${g.t}</b><small>${g.done?'Tamamlandı: '+dateOf(g.done):g.k==='isyan'?`${v} isyancı birlik kaldı`:g.k==='hurmuz'||g.k==='kibris'?(v?'Şu an denetimde':'Henüz denetlemiyorsun'):`Şu an: ${f0(v)} / ${f0(g.v)}`}</small></span>${g.done?'<span class="tag al">Tamam</span>':''}</div>`}).join('')}
function pInvest(){const me=S.me,C=S.C[me],k=indCost(me);let h=`<h3>Sanayi yatırımı</h3>`;
  if(C.ibB)h+=`<div class="it"><span class="tx"><b>Sanayi düzeyi ${IND(me)} → ${IND(me)+1}</b><small>${Math.ceil((C.ibB-S.h)/24)} gün kaldı</small></span>${bar(100*(1-(C.ibB-S.h)/(24*730)))}</div>`;
  else if(IND(me)>=5)h+=`<p class="note">Sanayi en yüksek düzeyde (5/5).</p>`;
  else h+=`<div class="btns">${B('indv',`Sanayi yatırımı başlat (${f1(k)} mlr $, 2 yıl)`,'b pri',C.tr<k)}</div>`;
  return h+`<p class="note">Sanayi düzeyi fabrika verimini, aynı anda yürüyen hava-deniz üretimi sayısını, eğitim kamplarını ve üretim hızını artırır; yüksek düzey gelişmiş gemi ve füze açar. Bölge bazında <b>altyapı yatırımı</b> için kendi bölgene basılı tut.</p>`}
/* bölge paneli: hasar ve onarım, altyapı yatırımı */
function regEco(r){const me=S.me;if(!isL(r)||S.ctl[r]!==me)return '';let h='';const dm=S.dmg[r]||0,rp=S.rep&&S.rep[r];
  if(dm>.01){const days=Math.ceil(dm/(.8/180*(rp?3:1)));h+=`<div class="kv"><span>Savaş hasarı</span><b style="color:#ff8a7a">%${f0(dm*100)} · ${days} günde onarılır${rp?' (hızlı)':''}</b></div>`;
    if(!rp)h+=`<div class="btns">${B('rep:'+r,`Hızlı onarım (${f1(repCost(r))} mlr $, 3 kat hızlı)`,'b',S.C[me].tr<repCost(r))}</div>`}
  const lv=(S.inf||{})[r]||0,pend=(S.infB||{})[r];
  h+=`<div class="kv"><span>Altyapı</span><b>${lv} / 3${lv?` (üretim +%${lv*10})`:''}${pend?` · yapımda, ${Math.ceil((pend-S.h)/24)} gün`:''}</b></div>`;
  if(!pend&&lv<3)h+=`<div class="btns">${B('infv:'+r,`Altyapı yatırımı (${f1(infCost(r))} mlr $, 365 gün)`,'b',S.C[me].tr<infCost(r))}</div>`;
  return h}
function pUlke(){const me=S.me,C=S.C[me],d=V.C[me],g=gdpOf(me),bl=blockade(me);
  let h=`<div class="row"><h2>${NM(me)}</h2><span class="sw" style="background:${d.col};width:22px;height:22px"></span></div><div class="kv"><span>Yönetim</span><b>${d.gov}</b><span>GSYH</span><b>${f0(g)} mlr $ / yıl</b><span>Savunma payı</span><b>%${f1(d.mil*100*DEF[C.def].m)}</b>
  <span>Günlük bütçe</span><b>${(budget(me)*1000).toFixed(0)} mn $</b><span>Günlük bakım gideri</span><b>${(upkeep(me)*1000).toFixed(0)} mn $</b><span>Petrol geliri (varil ${f0(75*(S.oil||1))} $)</span><b>${(oilRev(me)*1000).toFixed(0)} mn $</b>${C.wcd?`<span>Savaş masrafı (dün)</span><b style="color:#ff8a7a">−${(C.wcd*1000).toFixed(0)} mn $</b>`:''}<span>Zorluk</span><b>${DIFN[S.dif==null?1:S.dif]}</b><span>Sanayi düzeyi</span><b>${IND(me)} / 5</b>${bl?`<span>Deniz ablukası</span><b style="color:#ff8a7a">−%${f0(blockParts(me)[0]*100)}</b>${blockParts(me)[1]?`<span>Denizaltı akını</span><b style="color:#ff8a7a">−%${f0(blockParts(me)[1]*100)}</b>`:''}`:''}<span>İnsan gücü</span><b>${f0(C.mp)} bin</b><span>İstikrar</span><b>%${f0(C.stab)}</b><span>Savaş desteği</span><b>%${f0(C.ws)}</b><span>Birlik niteliği</span><b>×${d.q}</b><span>Hava savunması</span><b>${d.ad} / 5</b></div>
  <h3>Savunma bütçesi</h3><div class="seg">${DEF.map((x,i)=>B('def:'+i,x.n,C.def===i?'sel':'')).join('')}</div><p class="note">${DEF[C.def].d}</p>
  ${S.won?'<p class="note" style="color:#7fd1a8">Bölgenin yarısından fazlasını tutuyorsun: bölgesel hegemonsun.</p>':''}
  ${pGoals()}
  ${pDebt()}
  ${pInvest()}
  ${pTech()}
  ${pPolicy()}
  <div class="btns">${B('menu','Oyun menüsü','b')}</div>`;return ['Ülke',h]}
/* işgal ve uyum politikaları */
function pPolicy(){const me=S.me,C=S.C[me],L=C.law||'askeri',regs=[];for(let r=0;r<NR;r++)if(resOf(r)>=0&&S.ctl[r]===me)regs.push(r);
  const avg=regs.length?regs.reduce((s,r)=>s+(S.res[r]||0),0)/regs.length:0,hot=regs.filter(r=>(S.res[r]||0)>55).length,cd=k=>(S.cool[k]||0)>S.h,pups=Object.keys(S.pup).filter(c=>S.pup[c]===me);
  return `<h3>İşgal ve uyum politikası</h3><div class="seg">${Object.entries(LAWS).map(([k,l])=>B('law:'+k,l.n,L===k?'sel':'')).join('')}</div><p class="note">${LAWS[L].d}</p>
  <div class="kv"><span>Halkı sana bağlı olmayan bölge</span><b>${regs.length}</b><span>Ortalama direnç</span><b>%${f0(avg)}</b><span>Ayaklanma riski yüksek</span><b style="color:${hot?'#ff8a7a':'inherit'}">${hot} bölge</b>${pups.length?`<span>Kukla devletler</span><b>${pups.map(SN).join(', ')}</b>`:''}</div>
  <h3>Ulusal kararlar</h3><div class="btns">${B('amnesty','Genel af','b',cd('af'+me)||!regs.length)}${B('minr',C.min?'Azınlık hakları yasası: yürürlükte':'Azınlık hakları yasası çıkar',C.min?'b pri':'b')}${B('uzl','Toplum liderleriyle uzlaşı (0,3 mlr $)','b',cd('uz'+me)||C.tr<.3||!regs.length)}</div>
  <p class="note">Genel af: bütün bölgelerde direnç −15, istikrar −2 (180 günde bir). Azınlık hakları: direnç hedefi %15 düşer, milliyetçi tepkiyle istikrar bir kez −3. Uzlaşı: bütün bölgelerde uyum +8 (90 günde bir).</p>`}
function genCard(a){const g=a.cm,T=TRT[g.tr],sw=U.gsw===a.id;
  let h=`<div class="it"><i class="gav" style="background:${a.c}">${g.nm.split(' ').map(w=>w[0]).join('').slice(0,2)}</i><span class="tx"><b>${g.rk} ${g.nm} <em class="st">${'★'.repeat(g.st)}</em></b><small>Saldırı <b class="gp">+%${g.atk}</b> · Savunma <b class="gp">+%${g.def}</b></small><small>${T.n}: ${T.d}</small><small>Zaferler: ${g.cx||0}${g.st<3?` · terfi için ${8*g.st}`:' · en yüksek rütbe'}</small></span>${B('gsw:'+a.id,sw?'Kapat':'Değiştir','b')}</div>`;
  if(sw){const cd=(S.cool.gp||0)>S.h;h+=`<h3>Komutan adayları</h3>`+gpool().map(c=>`<div class="it"><span class="tx"><b>${c.rk} ${c.nm} <em class="st">${'★'.repeat(c.st)}</em></b><small>Saldırı +%${c.atk} · Savunma +%${c.def} · ${TRT[c.tr].n}</small><small>${TRT[c.tr].d}</small></span>${B(`gset:${a.id}:${c.id}`,'Ata','b pri')}</div>`).join('')
    +`<div class="btns">${B('gnew','Yeni adaylar ara (0,05 mlr $)','b',cd||S.C[S.me].tr<.05)}</div><p class="note">${cd?`Yeni adaylar ${Math.ceil((S.cool.gp-S.h)/24)} gün sonra aranabilir. `:''}Görevden alınan komutan aday listesine döner.</p>`}
  return h}
function pArmy(){const a=S.ar.find(x=>x.id===U.army);if(!a)return ['Ordu','<p class="note">Ordu bulunamadı.</p>'];if(!a.cm)setGen(a);
  const us=a.u.map(id=>S.U.find(u=>u.id===id)).filter(Boolean),n=us.length,org=n?us.reduce((s,u)=>s+u.org,0)/n:0,str=n?us.reduce((s,u)=>s+u.str,0)/n:0;
  const cands=[...new Set([...neighbors(S.me),...enemiesOf(S.me)])].filter(c=>c!==S.me&&!ally(S.me,c)&&alive(c));
  let h=`<div class="row"><h2>${a.n}</h2><span class="sw" style="background:${a.c};width:22px;height:22px"></span></div>${genCard(a)}
  <div class="kv"><span>Tümen</span><b>${n}</b><span>Ortalama güç</span><b>%${f0(str*100)}</b><span>Ortalama düzen</span><b>%${f0(org)}</b><span>Cephe</span><b>${a.fr?NM(a.fr):'atanmadı'}</b><span>Taarruz hedefi</span><b>${a.t>=0?RG[a.t].n:'yok'}</b><span>Savunma hattı</span><b>${a.line&&a.line.length?a.line.length+' bölge':'yok'}</b></div>
  <h3>Cephe ata</h3><div class="seg">${cands.map(c=>B(`afr:${a.id}:${c}`,SN(c),a.fr===c?'sel':'')).join('')||'<span class="note">Komşu düşman yok.</span>'}${a.fr?B(`afr:${a.id}:-`,'Kaldır'):''}</div>
  <p class="note">Cephe atanınca tümenler o ülkeyle olan sınır boyunca kendiliğinden dağılır ve hattı tutar.</p>
  <h3>Savunma hattı</h3><div class="btns">${B('aline:'+a.id,a.line&&a.line.length?'Hattı yeniden çiz':'Savunma hattı çiz','b')}${a.line&&a.line.length?B('alclr:'+a.id,'Hattı kaldır','b'):''}</div>
  <p class="note">Düşman başka bir yerden içeri sızarsa parmağınla haritaya bir hat çiz: ordu cephe yerine bu hattın geçtiği bölgelere dağılır. Taarruz sürerken hat bekler; taarruzu durdurunca ordu hatta döner.</p>
  <div class="btns">${B('atgt:'+a.id,'Taarruz hedefi seç','b')}${a.fr?B('aatk:'+a.id,a.atk?'Taarruzu durdur':'Taarruzu başlat',a.atk?'b red':'b pri',!atWar(S.me,a.fr)):''}</div>
  ${a.fr&&!atWar(S.me,a.fr)?'<p class="note">Taarruz için önce bu ülkeye savaş ilan etmelisin (Diplomasi).</p>':''}
  <div class="btns">${B('asel:'+a.id,'Tümenleri haritada seç','b')}${U.sel.size?B('aadd:'+a.id,`Seçili ${U.sel.size} birliği ekle`,'b'):''}${B('adel:'+a.id,'Orduyu dağıt','b red')}</div>
  <h3>Hava desteği</h3><div class="row"><p class="note" style="flex:1;margin:0">${S.A.some(w=>w.ar===a.id)?`<b>${S.A.filter(w=>w.ar===a.id).length} filo</b> bağlı (${S.A.filter(w=>w.ar===a.id).map(w=>AT(w.tp).k).join(', ')}); ordunun muharebelerine kendiliğinden gider.`:'Açarsan menzildeki hava filoları bu orduya bağlanır ve muharebelerine kendiliğinden destek verir.'}</p>${S.A.some(w=>w.ar===a.id)?B('aair:'+a.id,'Kapat','b'):B('aair:'+a.id,'Hava desteği iste','b pri')}</div>
  ${us.map(u=>unitRow(u,0)).join('')||'<p class="note">Bu orduda tümen yok. Haritada birlik seçip "Orduya ekle"ye bas.</p>'}`;return ['Ordu',h]}
/* ---------- etkileşimli rehber ----------
   Oyunun bir kopyası üzerinde oynanır: rehberde yapılan her şey (hareket, ordu, fabrika, tümen) bitince geri alınır.
   Her adım bir hedefi vurgular (haritada nabız halkası ya da düğme çerçevesi) ve oyuncu o işi yapınca kendiliğinden ilerler. */
const IT=[
 /* ---- başlangıç ve ekran ---- */
 {t:'Hoş geldin',d:'Bu rehber oyunun <b>bir kopyası</b> üzerinde çalışır: burada yaptığın her şey (taşıdığın birlikler, kurduğun fabrikalar, imzaladığın anlaşmalar) rehber bitince geri alınır. Ordu, hava, deniz, ekonomi, üretim, diplomasi, savaş ve barışı adım adım deneyeceksin. Halkayla ya da yanıp sönen çerçeveyle gösterilen yere dokun; açıklama adımlarında <b>İleri</b>ye bas.',man:1},
 {t:'Üst çubuk',d:'<b>Hazine</b>: elindeki para (mlr $). <b>Günlük</b>: bir günde hazineye giren net para; kırmızıysa her gün eksiliyorsun. <b>İnsan gücü</b>: tümen kurmak için kullanılabilecek nüfus. <b>İstikrar</b>: halkın düzene bağlılığı; çok düşerse gösteriler ve grevler çıkar. <b>Savaş desteği</b>: halkın savaşa desteği. Sağda tarih, <b>❚❚ ▶ ▶▶ ▶▶▶</b> zaman düğmeleri ve oyun menüsü (≡) var.',man:1,hl:'#odtop .ods',on:()=>{U.open=0;S.spd=0}},
 {t:'Haritada gezin',d:'Haritayı <b>tek parmakla kaydır</b>, <b>iki parmakla yakınlaş ya da uzaklaş</b>. Çift dokunuş yakınlaştırır. Harita doğu-batı yönünde dünyayı dolaşır. Şimdi biraz kaydır ya da yakınlaş.',on:()=>{U.itV=[VW.x,VW.y,VW.s]},fb:1,ok:()=>Math.abs(VW.s-U.itV[2])/U.itV[2]>.15||Math.hypot(VW.x-U.itV[0],VW.y-U.itV[1])*VW.s>70},
 {t:'Harita görünümleri',d:'Sağdaki düğmeler haritanın neyi gösterdiğini değiştirir: <b>Siyasi</b> (kim nereyi tutuyor), <b>Arazi</b> (dağ, çöl, ova; savaşta önemli), <b>Direnç</b> (işgal ettiğin bölgelerdeki halkın tepkisi), <b>Deniz</b> (denizleri kim denetliyor), <b>Hava</b> (gökyüzünde üstünlük kimde). En alttaki <b>Birlik</b> düğmesi yabancı birlikleri gizler: hepsi → yalnız savaştıkların → yalnız seninkiler.',man:1,hl:'#odmm'},
 /* ---- kara birlikleri ---- */
 {t:'Birliğini seç',d:'Haritada halkayla gösterilen <b>birlik simgesine dokun</b>. O birlikler seçilir ve paneli açılır: türü, gücü (yıpranma), düzeni (savaşa hazırlık) ve deneyimi görünür. Bir şey seçiliyken üstteki çubuktan <b>+ Bölge</b> ile başka bölgelerdeki birlikleri de seçime katabilir, <b>Bırak</b> ile seçimi kaldırabilirsin; panelde <b>Dur / iptal</b> yürüyüşü durdurur.',on:()=>itView(U.itR),cv:()=>({chip:U.itR}),ok:()=>U.sel.size>0},
 {t:'Hedefe dokun',d:'Şimdi birliklerin gideceği yere, sarıyla çevrili <b>{T}</b> bölgesine dokun. Kendi, müttefikinin, geçiş izni aldığın ya da savaştığın ülkelerin topraklarına gidebilirsin.',on:()=>{U.open=0;itView(U.itT)},cv:()=>({r:U.itT}),ok:()=>S.U.some(u=>mine(u.o)&&u.path.length&&u.path[u.path.length-1]===U.itT)},
 {t:'Zamanı başlat',d:'Birlikler ancak zaman akınca yürür. Sağ üstteki <b>▶</b> düğmesine dokun ve birliklerin {T} bölgesine varmasını izle. Mavi ok rotayı gösterir. Arazi (dağ, nehir) ve düzen hızı etkiler.',on:()=>{U.itIds=S.U.filter(u=>mine(u.o)&&u.path.length&&u.path[u.path.length-1]===U.itT).map(u=>u.id)},hl:'[data-od="spd:1"]',wait:1,ok:()=>S.U.some(u=>U.itIds.includes(u.id)&&u.r===U.itT)},
 {t:'Sürükleyerek taşı',d:'Daha hızlı yol: birlik simgesine <b>basılı tut ve sürükle</b>. Yeşil çerçeve gidilebilir, kırmızı gidilemez demek. Birliğini {R} bölgesine geri sürükle. (Kıyıdaki birliği karşı kıyıya sürüklersen deniz çıkarması yapılır.)',on:()=>{S.spd=0;U.itMv=0;U.open=0;itView(U.itT)},cv:()=>({chip:U.itT,to:U.itR}),ok:()=>U.itMv>0},
 {t:'Basılı tut: bölge bilgisi',d:'Kendi toprağındaki bir bölgeye <b>basılı tut</b>. Bölge paneli açılır: arazi, ekonomik değer, şehirler, askerî fabrikalar, hava savunma bataryası ve (işgal ettiğin yerlerde) halkın direnci.',on:()=>{U.open=0;itView(U.itR)},cv:()=>({r:U.itR}),ok:()=>U.open&&U.tab==='reg'&&U.rm==='info'},
 {t:'Basılı tut: komşu ülke',d:'Bir yabancı ülkeye basılı tutunca o ülkeyle <b>ilişkiler paneli</b> açılır. Halkayla gösterilen <b>{X}</b> bölgesine ({C}) basılı tut.',skip:()=>!itX(),on:()=>{U.open=0;itView(U.itX)},cv:()=>({r:U.itX}),fb:1,ok:()=>U.open&&U.tab==='dip'&&U.dip===S.ctl[U.itX]},
 /* ---- ordular ---- */
 {t:'Ordu kur',d:'Birliklerini bir orduya topla: birlik simgesine dokunup seç, sonra alttaki <b>+ Yeni ordu</b> düğmesine bas. Ordular cephe tutar, taarruz eder ve bir komutanın emrindedir. Birlik seçiliyken bir ordu kartına dokunmak birlikleri o orduya ekler.',on:()=>{U.open=0;itView(U.itR)},cv:()=>U.sel.size?null:({chip:U.itR}),hl:()=>U.sel.size?'#odgen [data-od="newarmy"]':null,ok:()=>S.ar.length>0},
 {t:'Komutan',d:'Her ordunun ülkene uygun adlı bir komutanı var. <b>Yıldızı</b> rütbesini, <b>saldırı ve savunma yüzdeleri</b> ordudaki her tümene eklenen gücü, <b>uzmanlığı</b> (çöl, dağ, zırh, lojistik, hız, savunma, nehir, baskın) özel bir üstünlüğü gösterir. <b>Değiştir</b>e dokun ve adaylara bak.',skip:()=>!S.ar.length,on:()=>{itArmyPanel();U.gsw=null},hl:'#odpb [data-od^="gsw:"]',fb:1,ok:()=>U.gsw!=null},
 {t:'Cephe ata',d:'Orduya bir <b>cephe</b> (komşu ülke) ata: tümenler o ülkeyle olan sınır boyunca kendiliğinden dağılır ve düşmanın yoğun olduğu kesimlere ağırlık verir. Bir ülke düğmesine dokun.',skip:()=>!S.ar.length||!neighbors(S.me).some(c=>!ally(S.me,c)),on:()=>{U.gsw=null;itArmyPanel()},hl:'#odpb [data-od^="afr:"]',fb:1,ok:()=>!!(S.ar[0]&&S.ar[0].fr)},
 {t:'Deneyim ve komandolar',d:'Savaşan tümenler deneyim kazanır: <b>Tecrübeli</b> (+%10) ve <b>Seçkin</b> (+%25). Komutanlar zaferleriyle yıldız alır. <b>Komando tugayları</b> seçiliyken iki özel düğme çıkar: <b>Hava indirme</b> (menzilde bir nakliye filosuyla düşman birliği olmayan bir bölgeye paraşütle iner) ve <b>Sabotaj baskını</b> (komşu düşman bölgesindeki fabrikayı ya da hava savunma bataryasını vurur).',man:1},
 {t:'Taarruz',d:'Savaştayken ordu panelinden <b>Taarruz hedefi seç</b> ile düşman topraklarında bir hedef işaretlersin, <b>Taarruzu başlat</b> ile ordu yerel üstünlük kurduğu düşman bölgelerine saldırır; cephe ilerledikçe yeniden dağılır. Haritada muharebe işaretindeki yüzde, muharebeyi kimin kazandığını gösterir. Düzeni biten birlik durur, kuşatılan birlik teslim olur.',man:1,skip:()=>!S.ar.length,on:()=>itArmyPanel(),hl:'#odpb [data-od^="atgt:"]'},
 {t:'Savunma hattı',d:'Düşman başka bir yerden içeri sızarsa orduna elle bir <b>savunma hattı</b> çizebilirsin. <b>Savunma hattı çiz</b>e dokun.',skip:()=>!S.ar.length,on:()=>itArmyPanel(),hl:'#odpb [data-od^="aline:"]',fb:1,ok:()=>U.mode==='drawline'},
 {t:'Hattı çiz',d:'Şimdi <b>tek parmakla kendi topraklarının üstünden bir çizgi çiz</b> (iki parmakla kaydırırsın), sonra üstteki <b>Onayla</b>ya bas. Ordu cephe yerine bu hattın geçtiği bölgelere dağılır; taarruz sürerken hat bekler.',skip:()=>!S.ar.length||U.mode!=='drawline',hl:()=>U.line&&U.line.length?'[data-od="lok"]':null,fb:1,ok:()=>U.mode!=='drawline'},
 {t:'Hava desteği',d:'Ordu panelindeki <b>Hava desteği iste</b> düğmesi, menzildeki hava filolarını bu orduya bağlar; ordunun muharebelerine kendiliğinden giderler (biri hava üstünlüğü kurar, diğerleri yakın destek verir). Düğmeye dokun.',skip:()=>!itAirOk(),on:()=>itArmyPanel(),hl:'#odpb [data-od^="aair:"]',fb:1,ok:()=>S.A.some(w=>w.ar)},
 /* ---- üretim ---- */
 {t:'Üretim',d:'Alttaki <b>Üretim</b> sekmesine dokun. Askerî fabrikalar, teçhizat, tümen eğitimi, seferberlik ve hava-deniz üretimi burada.',on:()=>{U.open=0},hl:'[data-od="tab:uret"]',ok:()=>U.open&&U.tab==='uret'},
 {t:'Seferberlik',d:'<b>Seferberlik yasası</b> insan gücü havuzunu ve günlük artışını belirler. Yükseldikçe daha çok asker toplarsın ama ekonomi yavaşlar; en yüksek düzeyler yeterli savaş desteği ister. Seçeneğin etkisi altında yazar.',man:1,on:()=>{U.open=1;U.tab='uret'},hl:'#odpb [data-od^="mob:"]'},
 {t:'Fabrika ve teçhizat',d:'Her askerî fabrika üç teçhizattan birini üretir: <b>piyade teçhizatı, zırhlı araç, tank</b>. <b>+ / −</b> ile fabrikaları teçhizatlara paylaştır. Fabrikalar her gün işletme gideri yazar; hazine yetmezse durur. Teçhizat kıttır: acele edersen yurt dışından da alabilirsin (İthalat) ama pahalıdır ve her tür için 20 günde bir sevkiyat gelir.',man:1,hl:'#odpb [data-od^="al:"]'},
 {t:'Fabrika kur',d:'Çerçeveli şehir düğmesine dokunarak yeni bir <b>fabrika</b> kur. 30 günde biter; maliyeti 0,67 mlr $\'dan başlar ve sahip olduğun her fabrika %10 ekler. Fabrika yuvaları kıttır ve şehirlere bağlıdır; toprak kazandıkça artar. İşgal ettiğin bölgedeki fabrikaların bir kısmı yıkılır, kalanı hasarlı olarak senin olur. (Rehberde hazinene para eklendi.)',on:()=>{U.open=1;U.tab='uret';S.C[S.me].tr=Math.max(S.C[S.me].tr,8)},hl:'#odpb [data-od^="fab:"]',fb:1,ok:()=>S.C[S.me].fabB.length>0},
 {t:'Tümen eğit',d:'Çerçeveli <b>Eğit</b> düğmesine dokun: teçhizat ve insan gücüyle bir tümen eğitime başlar ve <b>120 gün</b> sonra konuşlanma bölgesinde sahaya çıkar. <b>Hızlı eğit</b> 60 günde biter ama tümen deneyimsiz olur. Savaşa hazırlanmak aylar sürer: önceden planla. Konuşlanma yerini <b>Değiştir</b> ile seçersin.',on:()=>{U.open=1;U.tab='uret';const C=S.C[S.me];C.mp=Math.max(C.mp,300);for(const e in C.eq)C.eq[e]=Math.max(C.eq[e],500);C.train.length=0},hl:'#odpb [data-od^="rec:"][data-od$=":0"]',fb:1,ok:()=>S.C[S.me].train.length>0},
 {t:'Hava, deniz ve füze',d:'Uçak filoları, gemiler ve füzeler doğrudan parayla <b>üretim sırasına</b> girer. Aynı anda kaç işin yürüyeceğini sanayi düzeyin belirler. Uçaklar başkentte, gemiler limanında hazır olur. Sıradaki işi iptal edersen paranın %60\'ı döner. <b>Balistik füzeyi atmak</b> için savaştığın ülkenin bir bölgesine basılı tut ve <b>Füze saldırısı</b>na dokun: her isabet bölgeye ağır hasar verir, fabrikaları ve bataryaları vurur; hava savunması bir kısmını önler.',man:1,on:()=>{U.open=1;U.tab='uret'},hl:'#odpb [data-od^="q:a:"]'},
 /* ---- ekonomi ve iç işler ---- */
 {t:'Ülke ve bütçe',d:'Alttaki <b>Ülke</b> sekmesine dokun: ekonomi, bütçe ve işgal politikası burada.',on:()=>{U.open=0},hl:'[data-od="tab:ulke"]',ok:()=>U.open&&U.tab==='ulke'},
 {t:'Savunma bütçesi',d:'Günlük gelirin ekonominin (GSYH) ne kadarının orduya ayrıldığına bağlıdır. <b>Kısıtlı</b> bütçe halkı rahatlatır ama az para getirir; <b>Yüksek</b> ve <b>Savaş bütçesi</b> geliri büyük ölçüde artırır, istikrarı düşürür. Ordunun bakım gideri her gün düşülür; ticaret anlaşmaları geliri artırır, deniz ablukası azaltır. Hazine eksiye düşerse istikrar erir. Bir bütçe düzeyine dokunmayı dene.',man:1,on:()=>{U.open=1;U.tab='ulke';U.itDef=0},hl:'#odpb [data-od^="def:"]',ok:()=>U.itDef>0},
 {t:'Petrol, savaş masrafı, yatırım',d:'<b>Petrol</b>: petrollü bölgeler (bölge panelinde ●) tutan ülkeye her gün gelir getirir; fiyat olaylarla dalgalanır, Körfez\'de savaş ya da Hürmüz\'de çatışma fiyatı yükseltir. <b>Savaş masrafı</b>: muharebedeki tümenler cephane ve yakıt, düşman toprağındaki tümenler ikmal, görevdeki uçaklar ve seyreden gemiler yakıt harcar; barışta ordu ucuz, savaşta pahalıdır. <b>Sanayi yatırımı</b> (2 yıl) sanayi düzeyini 1 artırır; kendi bölgende basılı tutarak <b>altyapı yatırımı</b> (365 gün, bölge üretimi +%10) ve savaş hasarı için <b>hızlı onarım</b> yapabilirsin. Hasar kendiliğinden 180 günde, ödeme yaparsan 60 günde onarılır.',man:1,on:()=>{U.open=1;U.tab='ulke'},hl:'#odpb [data-od="indv"]'},
 {t:'Hedefler, borç, araştırma',d:'Ülke panelinin üstünde bu oyunun <b>hedefleri</b> var; her biri tamamlanınca hazine ve istikrar ödülü verir. <b>Borç</b>: hazine eksiye düşerse borca yazılır, faizi kredi notuna bağlıdır; istersen bilerek borç alıp ödeyebilirsin. <b>Araştırma</b>: SİHA sürüleri, modern tank, füze kalkanı, gizli uçak gibi teknolojiler para ve zaman karşılığı açılır; aynı anda bir araştırma yürür.',man:1,on:()=>{U.open=1;U.tab='ulke'},hl:'#odpb [data-od^="rsh:"]'},
 {t:'İşgal politikası',d:'İşgal ettiğin bölgelerde halk direnebilir; direnç %55\'i geçerse ayaklanma çıkar. <b>Sivil yönetim, askerî yönetim, sıkıyönetim, yerel özerklik</b> arasında seçim yaparsın: daha sert yönetim daha çok kaynak verir ama halkı uzaklaştırır. <b>Genel af, azınlık hakları ve uzlaşı</b> kararları direnci düşürür. Bölge panelinden yatırım yapar, yerel meclis kurarsın; uyum %80\'i geçince bölgeyi topraklarına tam katarsın.',man:1,on:()=>{U.open=1;U.tab='ulke'},hl:'#odpb [data-od^="law:"]'},
 /* ---- hava kuvvetleri ---- */
 {t:'Hava görünümü',d:'Şimdi uçaklar. Sağdaki <b>Hava</b> düğmesine dokun: uçak filoların haritada türleriyle görünür, bölgeler de hava üstünlüğüne göre boyanır (yeşil sende, kırmızı düşmanda, sarı çekişmeli).',skip:()=>!itWing(),on:()=>{U.open=0;S.spd=0},hl:'[data-od="mm:hava"]',ok:()=>U.mm==='hava'},
 {t:'Uçağı sürükle',d:'Halkayla gösterilen <b>uçak simgesine basılı tut ve {T} üzerine sürükle</b> (ya da simgeye dokunup {T} bölgesine dokun). Sürüklerken çıkan kesikli çember filonun menzilidir.',on:()=>{itWing();const w=S.A.find(x=>x.id===U.itWg);if(w)itView2(w.base,U.itT)},cv:()=>({plane:U.itWg,to:U.itT}),fb:1,ok:()=>!!U.amis},
 {t:'Görevi seç',d:'Açılan pencereden bir görev seç. <b>Hava üstünlüğü</b> düşman uçaklarını kovar ve oradaki kara muharebesine +%15 verir; <b>yakın destek</b> muharebedeki birliklerine güç katar; <b>bombardıman</b> şehri, fabrikaları ve birlikleri vurur (denizde gemileri). Kendi şehrine sürüklersen <b>üs olarak kullan</b> da çıkar.',skip:()=>!U.amis,hl:'#odm [data-od^="amis:"]:not([disabled])',ok:()=>!U.amis},
 {t:'Uçan jetler ve kayıplar',d:'Üssünden hedefe giden kesikli yay ve üzerinde gidip gelen küçük jetler, o filonun <b>görevde</b> olduğunu gösterir. Seninkiler mavi, düşmanınkiler kırmızı. Düşman toprağına uçan filo hava savunmasından kayıp verir; düşmanın <b>hava savunma bataryası</b> olan bölgeler çok tehlikelidir. Kendi bölgene batarya kurmak için bölgeye basılı tut. Eksik uçağı olan filoya Ordu › Hava\'dan <b>acil takviye</b> yapabilirsin.',man:1,on:()=>{S.spd=0;const w=S.A.find(x=>x.id===U.itWg);if(w)itView2(w.base,U.itT)}},
 /* ---- deniz kuvvetleri ---- */
 {t:'Deniz görünümü',d:'Şimdi donanma. Sağdaki <b>Deniz</b> düğmesine dokun: denizler, onları denetleyen ülkenin rengine boyanır. Bir denizde en güçlü donanma o denizi denetler.',skip:()=>!itFleet(),on:()=>{U.open=0;S.spd=0},hl:'[data-od="mm:den"]',ok:()=>U.mm==='den'},
 {t:'Filonu sürükle',d:'Halkayla gösterilen <b>gemi simgesine basılı tut ve {S} denizine sürükle</b> (ya da filoya dokunup denize dokun).',on:()=>{itFleet();const f=S.F.find(x=>x.id===U.itF);if(f)itView2(f.r,U.itS2)},cv:()=>({fleet:U.itF,to:U.itS2}),fb:1,ok:()=>{const f=S.F.find(x=>x.id===U.itF);return !!f&&f.path.length>0}},
 {t:'Abluka, akın, çıkarma',d:'Düşman kıyısındaki bir denizi denetlersen o ülkeyi <b>abluka</b>ya alırsın; <b>denizaltıların</b> da ticaretine saldırır. İkisi de düşman bütçesini düşürür. <b>Çıkarma</b> için kıyıdaki birliklerini karşı kıyıya sürükle: çıkarma gemisi ya da LHD olan en yakın filon gelip onları alır. Hedef kıyının denizi düşmandaysa önce donanmanla denizi temizle. Muharebe olan denize dokununca iki tarafın gücü ve batan gemiler görünür.',man:1,on:()=>{if(U.mm!=='pol'){U.mm='pol';S.mapDirty=1}}},
 /* ---- diplomasi ---- */
 {t:'Diplomasi',d:'Alttaki <b>Diplomasi</b> sekmesine dokun. Ülkeler ilişkine göre sıralanır; her birinin kişiliği ve seninle olan anlaşmaları yazar.',on:()=>{U.open=0;if(U.mm!=='pol'){U.mm='pol';S.mapDirty=1}},hl:'[data-od="tab:dip"]',ok:()=>U.open&&U.tab==='dip'},
 {t:'Bir ülkeyi aç',d:'Listeden çerçeveli ülkeye dokun ve diplomasi panelini aç.',on:()=>{U.open=1;U.tab='dip';U.dip=null;itX()},hl:()=>U.itC?`#odpb [data-od="dip:${U.itC}"]`:'#odpb [data-od^="dip:"]',fb:1,ok:()=>U.open&&U.tab==='dip'&&!!U.dip},
 {t:'Tutum ve kişilik',d:'Her ülkenin bir <b>kişiliği</b> var: <b>saldırgan</b> zayıf komşusuna kolay savaş açar; <b>temkinli</b> savaştan kaçınır, paktlara açıktır; <b>fırsatçı</b> başı dertte olana saldırır, ticareti sever; <b>sadık</b> müttefiklerini yalnız bırakmaz. <b>Tutum</b> kutusu sana bakışını oluşturan kalemleri gösterir: mevcut ilişki, ortak düşman, toprak anlaşmazlığı, ortak kültür, güç dengesi, anlaşmalar, geçmiş saldırıların. Anlaşma kabulü bu toplama bağlıdır.',man:1,skip:()=>!U.dip,hl:'#odpb .att'},
 {t:'İlişki ve ittifak',d:'<b>İlişkileri geliştir</b> (0,1 mlr $) ilişkiyi artırır; <b>kınama</b> düşürür ama savaş desteğini artırır. İlişki +55\'in üstündeyse <b>ittifak</b> önerebilirsin: müttefikler saldırıya uğrayanı korur ve birlikleri birbirinin topraklarından geçer.',man:1,skip:()=>!U.dip,hl:'#odpb [data-od^="rel:"]'},
 {t:'Anlaşmalar',d:'Dört anlaşma var: <b>saldırmazlık paktı</b> (birbirinize savaş açamazsınız), <b>askerî geçiş izni</b> (birliklerin onun topraklarından geçer), <b>ticaret anlaşması</b> (iki tarafın geliri %4 artar), <b>savunma paktı</b> (biri saldırıya uğrarsa diğeri savaşa girer). Her birinin altında karşı tarafın kabul edip etmeyeceği yazar; yapay zekâ da zaman zaman sana anlaşma teklif eder. Bir anlaşma öner.',skip:()=>!U.dip,on:()=>{U.itTr=0},hl:'#odpb [data-od^="trp:"]:not([disabled])',fb:1,ok:()=>!!U.itTr},
 {t:'Silah satışı',d:'Deponda fazla teçhizat varsa <b>satabilirsin</b>: hazineye para girer, ilişki iyileşir. Savaştaki ya da zengin ülkeler alır. Bir dostunla savaşan ülkeye silah satarsan o dostun sana kırılır.',man:1,skip:()=>!U.dip||atWar(S.me,U.dip),hl:'#odpb [data-od^="arm:"]'},
 {t:'Savaş gerekçesi',d:'Gerekçe olmadan <b>savaş ilan edemezsin</b>. Savaştan önce bir <b>gerekçe</b> hazırla: sınır olayı, azınlığı koruma ya da terörle mücadele. Hazırlık birkaç hafta sürer, basına sızarsa ilişkiler bozulur; hazır olunca 180 gün içinde açılan savaş <b>haklı</b> sayılır ve karşı tarafın müttefiklerinin yarısı savaşa girmez. Bir gerekçe başlat.',skip:()=>!U.dip||atWar(S.me,U.dip)||ally(S.me,U.dip),on:()=>{U.itCb=0;S.C[S.me].tr=Math.max(S.C[S.me].tr,2)},hl:'#odpb [data-od^="cbs:"]:not([disabled])',fb:1,ok:()=>!!U.itCb},
 /* ---- savaş ve barış ---- */
 {t:'Vekâlet savaşı ve olaylar',d:'Savaşmadan da bir ülkeyi zayıflatabilirsin: <b>isyancılara destek</b> verirsen istikrarı düşer ve topraklarında isyancılar ortaya çıkar; yakalanırsan ilişki bozulur. Oyun sırasında ara sıra <b>olay kartları</b> gelir (deprem, grev, darbe girişimi, mülteci akını…): kısa bir karar verirsin, her seçeneğin bedeli yazar.',man:1,skip:()=>!U.dip||ally(S.me,U.dip),hl:'#odpb [data-od^="prx:"]'},
 {t:'Savaş ilanı',d:'<b>Savaş ilan et</b> düğmesi ancak gerekçe hazırsa açılır; önce bir onay penceresi gelir ve saldırmazlık paktını bozup bozmayacağını ve karşına geçecek müttefikleri gösterir. Ateşkes süren (barıştan sonraki 180 gün) bir ülkeye savaş açılamaz.',man:1,skip:()=>!U.dip,hl:'#odpb [data-od^="dw:"]'},
 {t:'Savaşta',d:'Savaştığın ülkeler üstte kırmızı etiketle, başkentleri kırmızı yıldızla görünür. Etiketteki <b>savaş skoru</b> işgal ettiğin ve kaybettiğin topraklarla başkentlere göre hesaplanır. Ele geçirilen ve kaybedilen bölgeler üstte kısa bir satırda bildirilir. Bir ülke başkentini ve topraklarının çoğunu kaybedince hemen değil, savaşın o ana kadar sürdüğü kadar daha direndikten sonra <b>teslim olur</b>. Yapay zekâ da savaştan önce gerekçe hazırlar ve sınıra yığınak yapar: hedefi sensen bildirim gelir ve Diplomasi listesinde <b>sana karşı savaş hazırlığı</b> uyarısı görünür; hazırlanmak için birkaç haftan olur.',man:1,on:()=>{U.open=0}},
 {t:'Barış',d:'Diplomasi panelinden <b>beyaz barış</b> (herkes eski sınırlarına) ya da <b>işgal ettiğim yerler bende kalsın</b> barışı önerebilirsin; ikincisi için karşı tarafın skoru −35\'e inmeli ya da başkenti düşmüş olmalı. Karşı taraf da sana barış önerebilir. Teslim olan ülke için <b>barış konferansı</b> toplanır: tamamını ilhak eder, bölgeleri tek tek seçer ya da <b>kukla devlet</b> kurarsın. Kukla devlet direnç doğurmaz, savaşlarına katılır ve haraç öder. Barıştan sonra 180 günlük ateşkes başlar. Kukla devleti 180 gün sonra ve ilişki +50 iken barışçıl yoldan ilhak edebilir ya da bağımsızlık verebilirsin.',man:1},
 {t:'Direnç ve uyum',d:'Haritada <b>Direnç</b> görünümü açıldı: işgal ettiğin bölgelerin halkı yeşilden kırmızıya, sana ne kadar direndiğini gösterir. Direnç kültürel uzaklığa, işgal politikana, garnizona ve uyuma göre değişir. Kırmızı bölgelerde ayaklanma çıkabilir; garnizon bırak ya da politikayı yumuşat. İsyancılar bir bölgeni ele geçirirse bir orduya <b>İsyancılar</b> cephesi atayıp taarruz başlatarak bastırırsın.',man:1,on:()=>{U.mm='res';S.mapDirty=1}},
 {t:'Günlük',d:'Alttaki <b>Günlük</b> sekmesine dokun: olan biten her şey tarihleriyle burada. Ekranın üstündeki bildirimler kısa tutulur; ayrıntı burada. Sekmedeki <b>İstatistik</b> görünümü GSYH, ordu, toprak ve hazineni en büyük ülkelerle aylık grafikte karşılaştırır.',on:()=>{U.mm='pol';S.mapDirty=1;U.open=0},hl:'[data-od="tab:log"]',fb:1,ok:()=>U.open&&U.tab==='log'},
 {t:'Menü ve kayıt',d:'Oyun 3 günde bir kendiliğinden kaydedilir. <b>Üç kayıt yuvası</b> var: yeni oyunun yuvasını ve <b>zorluğu</b> (Kolay / Normal / Zor) ülke seçim ekranında seçersin. Sağ üstteki <b>≡</b> menüsünden elle ya da başka bir yuvaya kaydedebilir, bu rehberi yeniden açabilir, sesi ayarlayabilir ya da yeni oyun başlatabilirsin.',man:1,on:()=>{U.open=0},hl:'[data-od="menu"]'},
 {t:'Hazırsın',d:'Hepsi bu kadar. Şimdi her şey sıfırlanıp <b>gerçek oyun</b> başlıyor: zamanı ▶ ile başlat. İyi şanslar.',man:1,last:1}];
function itStart(){if(U.it!=null||!S)return;let best=-1,bn=0,bt=-1;
  for(let r=0;r<NR;r++){if(!isL(r)||S.ctl[r]!==S.me)continue;const n=S.U.filter(u=>u.r===r&&mine(u.o)&&!u.emb&&!u.path.length).length;if(!n)continue;
    const ts=adjL[r].filter(j=>isL(j)&&S.ctl[j]===S.me),t0=ts.find(j=>!S.U.some(u=>u.r===j&&mine(u.o))),t=t0!==undefined?t0:ts[0];if(t===undefined)continue;if(n>bn){bn=n;best=r;bt=t}}
  if(best<0){U.tut=0;return}
  U.itSnap=JSON.stringify(S);U.itR=best;U.itT=bt;U.it=0;U.itS=-1;U.itIds=[];U.itMan=0;S.spd=0;U.open=0;U.menu=0;U.tut=null;U.sel=new Set();U.mode=null;selMask(-1);dirty(1)}
function itEnd(){if(U.it==null)return;const snap=U.itSnap;U.it=null;U.itSnap=null;itHL(null);
  S=migrate(JSON.parse(snap));OD.S=S;for(const c of V.ORDER)if(S.C[c])recalcFab(c);
  U.sel=new Set();U.fsel=null;U.mode=null;U.open=0;U.tab='ordu';U.reg=null;U.dip=null;U.drag=null;U.line=null;U.army=null;U.amis=null;U.wsel=null;U.mm='pol';S.spd=0;U.wasSpd=1;selMask(-1);S.mapDirty=1;OD.mver++;tutSeen();
  const t=document.getElementById('odt');if(t)t.innerHTML='';const cap=capOf(S.me);if(cap>=0&&cv)fit(cap);toast('Rehber bitti; gerçek oyun başlıyor. Zamanı ▶ ile başlat.');dirty(1)}
/* rehberde kullanılacak filo: hedef bölgeye menzili yeten, en yakın üsteki uçak filosu */
function itWing(){let b=null,bd=1e9;for(const w of S.A){if(!mine(w.o)||w.mv)continue;const d=AT(w.tp);if(!d.hv&&!d.yer)continue;const k=dist(w.base,U.itT);if(k<=d.men&&k<bd){bd=k;b=w}}U.itWg=b?b.id:null;return b}
/* rehberde kullanılacak donanma: boştaki bir filo ve bir adım ötedeki deniz */
function itFleet(){for(const f of S.F){if(!mine(f.o)||f.path.length||f.carry.length)continue;for(let s=0;s<NR;s++){if(!isS(s)||s===f.r)continue;const p=path(S.me,f.r,s,1);if(p&&p.length===1){U.itF=f.id;U.itS2=s;return f}}}U.itF=null;return null}
/* iki bölgeyi birlikte gösterecek görünüm (rehber kartı üstte, panel altta) */
function itView2(a,b){if(!cv)return;const A=RG[a],B=RG[b],w=cv.clientWidth,h=cv.clientHeight,dx=Math.abs(A.x-B.x)+140,dy=Math.abs(A.y-B.y)+140;VW.s=clamp(Math.min(w*.8/dx,h*.4/dy),.35,1.4);VW.x=(A.x+B.x)/2-w/2/VW.s;VW.y=(A.y+B.y)/2-h*.55/VW.s;clampView()}
/* rehber yardımcıları: komşu yabancı bölge, ordu panelini açma, hava desteği yapılabilir mi */
function itX(){let b=-1,bd=1e12;for(let r=0;r<NR;r++){if(!isL(r))continue;const c=S.ctl[r];if(!c||c===S.me||c==='ISY'||!V.C[c]||!alive(c))continue;if(!adjL[r].some(j=>S.ctl[j]===S.me))continue;const d=dist(r,U.itR);if(d<bd){bd=d;b=r}}
  U.itX=b>=0?b:null;U.itC=b>=0?S.ctl[b]:null;return b>=0}
function itArmyPanel(){const a=S.ar[0];if(a){U.army=a.id;U.tab='army';U.open=1}}
function itAirOk(){const a=S.ar[0];if(!a||S.A.some(w=>w.ar===a.id))return false;const rs=a.u.map(id=>S.U.find(u=>u.id===id)).filter(u=>u&&!u.emb).map(u=>u.r);
  return S.A.some(w=>mine(w.o)&&!w.ar&&(AT(w.tp).hv||AT(w.tp).yer)&&rs.some(r=>dist(w.base,r)<=AT(w.tp).men))}
function itView(r){if(!cv)return;fit(r,Math.max(VW.s,1.3));if(cv.clientWidth<820){VW.y+=cv.clientHeight*.14/VW.s;clampView()}}
function itHL(sel){const cur=document.querySelector('.ithl');if(U._hlS===sel&&(!sel||cur))return;if(cur)for(const e of document.querySelectorAll('.ithl'))e.classList.remove('ithl');U._hlS=sel;if(!sel)return;
  const e=document.querySelector(sel);if(e){e.classList.add('ithl');if(!U.itScr&&e.closest('#odpb')){e.scrollIntoView({block:'center',behavior:'smooth'});U.itScr=1}}}
function itTick(now){const st=U.it!=null?IT[U.it]:null;if(!st)return;
  if(U.itS!==U.it){if(st.skip&&st.skip()){U.it++;U.itS=-1;if(U.it>=IT.length)itEnd();dirty(1);return}U.itS=U.it;U.itT0=now;U.itScr=0;U.itMan=0;if(st.on)st.on();dirty(1)}
  if(!st.wait&&S.spd)S.spd=0;
  itHL(typeof st.hl==='function'?st.hl():st.hl||null);
  if(st.ok&&st.ok()){U.it++;try{aSfx('toast')}catch(e){}if(U.it>=IT.length)itEnd();dirty(1)}
  else if((st.wait||st.fb)&&now-U.itT0>(st.fb?10000:15000)&&!U.itMan){U.itMan=1;dirty(1)}}
function itCard(){const st=U.it!=null?IT[U.it]:null;if(!st)return '';const tx=st.d.split('{T}').join(near(U.itT)).split('{R}').join(near(U.itR)).split('{S}').join(U.itS2!=null?RG[U.itS2].n:'').split('{X}').join(U.itX!=null?RG[U.itX].n:'').split('{C}').join(U.itC?NM(U.itC):'');
  return `<div class="itc"><div class="row"><small>Rehber · ${U.it+1} / ${IT.length}</small>${st.last?'':B('itx','Rehberi atla','lnk')}</div><b>${st.t}</b><p>${tx}</p>${st.man||((st.wait||st.fb)&&U.itMan)?`<div class="btns">${B('itn',st.last?'Gerçek oyuna başla':'İleri ›','b pri')}</div>`:''}<div class="dots">${IT.map((_,i)=>`<i class="${i<U.it?'d':i===U.it?'on':''}"></i>`).join('')}</div></div>`}
/* kısa eğitim kartları: menüden açılan hızlı başvuru */
const TUT=[
  ["Harita","Kaydır, yakınlaş, keşfet",["Tek parmakla kaydır, iki parmakla yakınlaş; çift dokunuş yakınlaştırır. Harita yatayda dünyayı dolaşır.","Sağdaki düğmeler harita türünü (siyasi, arazi, direnç) değiştirir. <b>Birlik</b> düğmesi yabancı birlikleri gizler: hepsi → yalnız savaştıkların → yalnız seninkiler."]],
  ["Birlikler","Basılı tut ve sürükle",["Kendi birlik sayacına basılı tut ve gideceği bölgeye sürükle: yeşil çerçeve gidilebilir, kırmızı gidilemez demek.","Birlik simgesine <b>dokun</b>: o birlikler seçilir ve paneli açılır; sonra haritada hedefe dokun. Bölgeye dokunmak bölgedeki bütün birliklerini açar. <b>+ Bölge</b> ile başka bölgelerdeki birlikleri de seçime katarsın."]],
  ["Dokun ve basılı tut","Bilgi bir dokunuş ötede",["Bir bölgeye <b>basılı tut</b>: kendi toprağındaysa şehir ve bölge bilgisi, yabancı bir ülkedeyse o ülkeyle ilişkiler paneli açılır.","Savaştığın ülkelerin başkentleri kırmızı yıldızla gösterilir."]],
  ["Ordular","Komutan, cephe, savunma hattı",["Birlikleri seçip alttaki <b>+ Ordu</b>ya bas. Birlik seçiliyken bir ordu kartına dokunmak onları o orduya ekler.","Her ordunun bir komutanı var: yıldızı, saldırı ve savunma yüzdesi, bir de uzmanlığı. Ordu panelinden değiştirebilirsin.","<b>Cephe</b> ata, ordu sınıra dağılsın; <b>taarruz</b> başlat; ya da parmağınla bir <b>savunma hattı</b> çiz."]],
  ["Üretim","Fabrika → teçhizat → tümen",["Askerî fabrikalar her gün piyade teçhizatı, zırhlı araç ya da tank üretir ve gider yazar.","Teçhizat ve insan gücüyle tümen eğit. Yeni fabrika 30 günde kurulur; yuvalar kıttır, toprak kazandıkça artar. Seferberlik yasası insan gücünü belirler."]],
  ["Hava kuvvetleri","Sürükle, görev seç",["Sağdaki <b>Hava</b> düğmesine bas: uçak filoların haritada türleriyle görünür ve dokunulabilir olur. Bölgeler hava üstünlüğüne göre boyanır: yeşil sende, kırmızı düşmanda, sarı çekişmeli.","Bir uçak simgesini hedef bölgeye <b>sürükle</b> (ya da simgeye dokunup hedefe dokun). Açılan pencerede görevi seç: <b>hava üstünlüğü</b> (düşman uçaklarını kovar, kara muharebesine +%15), <b>yakın destek</b> (muharebedeki birliklerine güç), <b>bombardıman</b> (şehri, fabrikaları ve birlikleri vurur) ya da kendi şehrine sürüklediysen <b>üs olarak kullan</b>. Sürüklerken kesikli çember menzili gösterir.","Üs ile hedef arasında gidip gelen küçük jetler o an görevde olan filolardır. Ordu panelindeki <b>Hava desteği iste</b> düğmesi menzildeki filoları o orduya bağlar; ordunun muharebelerine kendiliğinden giderler."]],
  ["Deniz kuvvetleri","Filo, denetim, çıkarma",["Gemi simgesini gideceği denize <b>sürükle</b> ya da filoya dokunup denize dokun.","Bir denizde en güçlü donanma o denizi <b>denetler</b> (sağdaki <b>Deniz</b> görünümü ve denizlerdeki çapa rozetleri). Düşman kıyısındaki denetim abluka yapar, denizaltılar ticarete saldırır; ikisi de düşman bütçesini düşürür.","<b>Çıkarma</b>: kıyıdaki birliklerini karşı kıyıya sürükle; çıkarma gemisi ya da LHD olan en yakın filon gelip onları alır. Hedef kıyının denizleri düşman denetimindeyse önce donanmanla denizi temizle. Muharebe olan denize dokununca iki tarafın gücü ve batan gemiler görünür."]],
  ["Diplomasi ve savaş","Savaş, barış, antlaşma",["Diplomasi sekmesinden ilişkileri geliştir, ittifak kur ya da savaş ilan et.","Başkenti düşen ülke teslim olur. Barış konferansında tamamını ilhak edebilir, bölgeleri tek tek seçebilir ya da kukla devlet kurabilirsin."]],
  ["İşgal ve zaman","Halkı kazan, saati yönet",["İşgal ettiğin bölgelerde halk direnebilir. Ülke sekmesindeki işgal politikası, yatırım ve uzlaşı direnci düşürür; uyum %80'i geçince bölgeyi topraklarına katarsın.","Sağ üstteki düğmeler zamanı durdurur ya da hızlandırır; önemli olaylar oyunu kendiliğinden durdurur. Bu rehbere menüden (≡) yeniden ulaşabilirsin."]]];
function tutSeen(){try{localStorage.setItem(SK('odtut'),'1')}catch(e){}}
function modal(){const m=document.getElementById('odm');const e=S.ev[0];let h='';
  /* hava görevi seçimi: filo bir bölgeye sürüklenince ya da seçilip hedefe dokununca */
  if(U.amis){const {ids,t}=U.amis,ws=S.A.filter(w=>ids.includes(w.id)),inr=w=>dist(w.base,t)<=AT(w.tp).men,can=(w,m)=>{const d=AT(w.tp);return m==='ust'?d.hv>0:m==='des'?d.yer>0:d.bom>0};
    const en=isL(t)?atWar(S.me,S.ctl[t]):S.F.some(f=>f.r===t&&atWar(S.me,f.o)),out=ws.filter(w=>!inr(w)).length;
    const opt=['ust','des','bom'].map(m=>{const n=ws.filter(w=>inr(w)&&can(w,m)).length;return B('amis:'+m,`${MISN[m]}${n&&n<ws.length?` (${n} filo)`:''}`,m==='des'?'b pri':m==='bom'?'b red':'b',!n)}).join('');
    const base=isL(t)&&canStay(S.me,t)&&CITYIN[t].length>0&&!ws.every(w=>w.base===t);
    h=`<div class="win"><div class="tb"><span>Hava görevi · ${RG[t].n}</span><button data-od="amisx">✕</button></div><div class="bd"><p>${ws.length} filo: ${ws.map(w=>AT(w.tp).k).join(', ')}</p>
      <div class="btns" style="flex-direction:column;align-items:stretch">${opt}${base?B('amis:base','Üs olarak kullan (intikal)','b'):''}${B('amis:bekle','Görevi bitir, üste bekle','b')}</div>
      <p class="note"><b>Hava üstünlüğü</b>: düşman uçaklarını kovar, buradaki kara muharebelerine +%15. <b>Yakın destek</b>: muharebedeki birliklerine saldırı gücü. <b>Bombardıman</b>: şehri, fabrikaları ve birliklerin düzenini vurur; denizde gemileri.${out?` <b>${out} filo menzil dışında.</b>`:''}${en||base?'':' Bu bölge düşmanın değil: görevler ancak savaşta etkili olur.'}</p></div></div>`}
  else if(U.tut!=null&&TUT[U.tut]){const t=TUT[U.tut],n=TUT.length;h=`<div class="win odtut"><div class="tb"><span>Nasıl oynanır · ${U.tut+1} / ${n}</span><button data-od="tutx">✕</button></div><div class="bd"><p class="kick">${t[0]}</p><h2>${t[1]}</h2>${t[2].map(x=>`<p>${x}</p>`).join('')}<div class="dots">${TUT.map((_,i)=>`<i class="${i===U.tut?'on':''}"></i>`).join('')}</div><div class="btns">${U.tut?B('tutp','‹ Geri','b'):B('tutx','Atla','b')}${B('tutn',U.tut<n-1?'İleri ›':'Oyuna başla','b pri')}</div></div></div>`}
  else if(U.menu)h=`<div class="win"><div class="tb"><span>Açık Dünya</span><button data-od="menu">✕</button></div><div class="bd"><p>${dateOf(S.h)} · ${NM(S.me)}</p>${B('itgo','Rehber: nasıl oynanır','b')}${B('save',`Kaydet (yuva ${S.slot||1})`,'b')}<div class="seg">${[1,2,3].map(n=>B('saveto:'+n,`Yuva ${n}`,(S.slot||1)===n?'sel':'')).join('')}</div>${B('quit','Kaydet ve hikâyelere dön','b pri')}${B('settings','Ses ayarları','b')}${B('newg','Yeni oyun (kayıt silinir)','b red')}</div></div>`;
  else if(U.ask)h=`<div class="win"><div class="tb"><span>Onay</span></div><div class="bd">${U.ask.t}<div class="btns">${B('yes',U.ask.y||'Evet','b red')}${B('no','Vazgeç','b')}</div></div></div>`;
  else if(e){const T={war:()=>[`Savaş`,`<h2>${NM(e.a)} sana savaş ilan etti</h2><p>Sınırlarını savun, müttefiklerini çağır. Saldıranın müttefikleri de savaşa katılabilir.</p>`],
    demand:()=>[`Barış talebi`,`<h2>${NM(e.c)} barış istiyor</h2><p>Şartı: işgal ettiği toprakların kendisinde kalması. Savaş skoru: ${f0(score(S.me,e.c))}.</p>`],
    olay:()=>{const E=EVT.find(z=>z.id===e.id);return [`Olay`,`<h2>${E.t}</h2><p>${E.d(e)}</p>`]},
    trq:()=>[`Anlaşma teklifi`,`<h2>${NM(e.c)} ${TRN[e.kk].n.toLocaleLowerCase('tr')} öneriyor</h2><p>${TRN[e.kk].d}</p><p class="note">${NM(e.c)} · ${PERSN[PERS(e.c)]}. Kabul edersen ilişkiler iyileşir; reddedersen biraz bozulur.</p>`],
    offer:()=>[`Barış önerisi`,`<h2>${NM(e.c)} barış öneriyor</h2><p>${e.keep?'İşgal ettiğin toprakları sana bırakmaya hazır.':'Herkes savaştan önceki sınırlarına çekilecek.'}</p>`],
    lost:()=>[`Yenilgi`,`<h2>${NM(S.me)} teslim oldu</h2><p>Başkentin düştü, topraklarının çoğu işgal altında. Devlet, savaşı kazananlar arasında paylaşıldı.</p>`],
    cap:()=>[`Zafer`,`<h2>${NM(e.c)} teslim oldu</h2><p>Ülkenin kalanı topraklarına katıldı.</p>`],
    conf:()=>{const cf=S.conf,regs=cf?ORIGC(cf.c):[],mineN=regs.filter(r=>S.ctl[r]===S.me).length,oth=regs.filter(r=>S.ctl[r]!==S.me&&S.ctl[r]!==cf.c&&S.ctl[r]!=='ISY').length,br=baseRes(e.c,S.me);
      return [`Barış konferansı`,`<h2>${NM(e.c)} teslim oldu</h2><p>Antlaşmanın şartlarını sen belirliyorsun. ${regs.length} bölgesinin ${mineN} tanesi senin işgalinde${oth?`, ${oth} tanesi müttefiklerinin elinde (onlar kendi işgal ettiklerini alır)`:''}.</p>
      <p class="note">Bu halk sana karşı ${br>=60?'çok yüksek':br>=40?'yüksek':br>=20?'orta':'düşük'} bir dirençle başlar (temel %${br}). İlhak ettiğin her bölge isyan riski taşır; kukla devlet ise direnç doğurmaz, savaşlarına katılır ve haraç öder.</p>
      <div class="kv"><span>Tamamını ilhak et</span><b>${regs.length-oth} bölge</b><span>Bölge seç</span><b>seçtiklerin + kalanı</b><span>Kukla devlet</span><b>toprak almadan</b></div>`]},
    won:()=>[`Hegemonya`,`<h2>Bölgesel hegemon</h2><p>Orta Doğu'nun ekonomik ağırlığının yarısından fazlası artık senin denetiminde. Oyun sürüyor; dilediğin kadar devam edebilirsin.</p>`]}[e.k]();
    const bt=e.k==='olay'?EVT.find(z=>z.id===e.id).o.map((o,i)=>B('olay:'+i,o[0],i?'b':'b pri')).join(''):e.k==='conf'?B('cfannex','Tamamını ilhak et','b pri')+B('cfpick','Bölgeleri haritada seç','b')+B('cfpupall','Kukla devlet kur','b'):e.k==='demand'||e.k==='offer'||e.k==='trq'?B('evyes','Kabul et','b pri')+B('evno','Reddet','b'):e.k==='lost'?B('quit','Ana menüye dön','b pri')+B('newg','Yeni oyun','b'):B('evok','Tamam','b pri');
    h=`<div class="win"><div class="tb"><span>${T[0]} · ${dateOf(S.h)}</span></div><div class="bd">${T[1]}<div class="btns">${bt}</div></div></div>`}
  m.hidden=!h;setH('odm',h)}
function cmd(s){const [a,x,y]=s.split(':');const me=S.me;U.dmsg=a.startsWith('rel')||a.startsWith('kin')||a.startsWith('ally')||a.startsWith('pw')||a.startsWith('pk')?U.dmsg:'';
  switch(a){
   case 'spd':S.spd=+x;if(S.spd)U.wasSpd=S.spd;break;
   case 'menu':U.menu=!U.menu;if(U.menu){U.mspd=S.spd;S.spd=0}else if(U.mspd)S.spd=U.mspd;break;
   case 'settings':U.menu=0;try{act('settings')}catch(e){}break;
   case 'save':save();toast(`Yuva ${S.slot||1}'e kaydedildi.`);U.menu=0;break;
   case 'saveto':S.slot=+x;save();toast(`Yuva ${x}'e kaydedildi; bundan sonra bu yuvaya kaydedilecek.`);U.menu=0;break;
   case 'lsub':U.lsub=x;break;
   case 'lmet':U.lmet=+x;break;
   case 'olay':{const e=S.ev.shift();const E=e&&EVT.find(z=>z.id===e.id);if(E&&E.o[+x])E.o[+x][1](e);const C=S.C[me];C.stab=clamp(C.stab,0,100);C.ws=clamp(C.ws,0,100);resume();break}
   case 'rsh':{const why=startTech(me,x);toast(why||`Araştırma başladı: ${TECH[x].n} (${TECH[x].g} gün).`);break}
   case 'debt':{const C=S.C[me];if(+x>0){if((C.debt||0)+1<=budget(me)*365*.6){C.debt=(C.debt||0)+1;C.tr+=1;toast('1 mlr $ borç alındı.')}}else{const p=Math.min(1,C.debt||0);if(p>0&&C.tr>=p){C.tr-=p;C.debt-=p;toast(`${f1(p)} mlr $ borç ödendi.`)}}break}
   case 'prx':{const k=me+'|'+x;S.prx=S.prx||{};if(S.prx[k]){delete S.prx[k];toast(`${NM(x)} içindeki isyancılara destek kesildi.`)}else{S.prx[k]=S.h;toast(`${NM(x)} içindeki isyancılara gizli destek başladı (günde 10 mn $).`)}break}
   case 'para':U.para=[...U.sel];U.mode='para';U.open=0;break;
   case 'raid':U.raidU=[...U.sel];U.mode='raid';U.open=0;break;
   case 'pkslot':U.nslot=+x;break;
   case 'quit':save();exit();return;
   case 'newg':U.ask={t:`<p>Yuva ${S.slot||1}'deki kayıt silinip ülke seçimine dönülecek.</p>`,y:'Yeni oyun',go:()=>{try{localStorage.removeItem(slotKey(S.slot||1))}catch(e){}exit()}};U.menu=0;break;
   case 'yes':{const g=U.ask&&U.ask.go;U.ask=null;if(g)g();return dirty(1)}
   case 'no':U.ask=null;break;
   case 'close':U.open=0;U.reg=null;selMask(-1);U.sel=new Set();U.fsel=null;U.dip=null;break;
   case 'tab':if(U.open&&U.tab===x){U.open=0}else{U.tab=x;U.open=1;if(x!=='dip')U.dip=null}if(x!=='reg'){selMask(-1);U.reg=null}break;
   case 'cancel':if(U.mode==='drawline'){U.line=null;U.lpts=[]}U.mode=null;U.amph=null;break;
   case 'vis':U.vis=((U.vis||0)+1)%3;try{localStorage.setItem(SK('odvis'),U.vis)}catch(e){}toast(['Bütün birlikler görünüyor.','Yalnızca senin ve savaştığın ülkelerin birlikleri görünüyor.','Yalnızca senin birliklerin görünüyor.'][U.vis]);break;
   case 'rinfo':U.rm='info';break;
   case 'selg':{const r=+x,k=+y,l=S.U.filter(u=>u.r===r&&mine(u.o)&&!u.emb&&(u.ar||0)===k),all=l.every(u=>U.sel.has(u.id));for(const u of l)if(all)U.sel.delete(u.id);else U.sel.add(u.id);break}
   case 'seladd':U.mode='seladd';U.open=0;break;
   case 'seldone':U.mode=null;break;
   /* savunma hattı */
   case 'aline':U.mode='drawline';U.army=+x;U.line=[];U.lstk=[];U.lpts=[];U.open=0;break;
   case 'alclr':{const ar=S.ar.find(z=>z.id===+x);if(ar){ar.line=null;toast(`${ar.n}: savunma hattı kaldırıldı.`)}break}
   case 'lundo':if(U.line&&U.lstk&&U.lstk.length)U.line.length=U.lstk.pop();break;
   case 'lclr':U.line=[];U.lstk=[];break;
   case 'lok':{const ar=S.ar.find(z=>z.id===U.army);if(!U.line||!U.line.length){toast('Önce kendi topraklarının üstünden bir hat çiz.');break}
     if(ar){ar.line=U.line.slice();ar.atk=0;armyTick(ar);toast(`${ar.n} ${ar.line.length} bölgelik savunma hattına yerleşiyor.`)}U.mode=null;U.line=null;U.tab='army';U.open=1;break}
   /* komutanlar */
   case 'gsw':U.gsw=U.gsw===+x?null:+x;break;
   case 'gset':{const ar=S.ar.find(z=>z.id===+x),p=gpool(),g=p.find(z=>z.id===+y);if(ar&&g){S.gp=p.filter(z=>z!==g);if(ar.cm)S.gp.push(ar.cm);if(S.gp.length>6)S.gp.shift();setGen(ar,g);U.gsw=null;toast(`${ar.n} komutanlığına ${ar.g} atandı.`)}break}
   case 'gnew':{if((S.cool.gp||0)>S.h||S.C[me].tr<.05)break;S.C[me].tr-=.05;S.cool.gp=S.h+24*30;S.gp=[];gpool();break}
   /* eğitim */
   case 'tut':U.menu=0;if(U.mspd)S.spd=U.mspd;U.tut=0;break;
   case 'itgo':U.menu=0;itStart();break;
   case 'itn':U.it++;U.itMan=0;if(U.it>=IT.length)itEnd();break;
   case 'itx':itEnd();break;
   /* deniz ve hava */
   case 'hss':{const why=queue(me,'h',+x);toast(why||`${near(+x)}: hava savunma bataryası yapımı başladı.`);break}
   case 'war':{const w=S.A.find(z=>z.id===+x);if(w){w.ar=+y||0;if(w.ar){airArmy();toast(`${AT(w.tp).k} filosu ${(S.ar.find(a=>a.id===w.ar)||{n:'orduya'}).n} desteğine verildi.`)}else{w.mis='bekle';w.t=-1;toast('Filo bağımsız; görevini sen seçersin.')}}break}
   case 'wr':{const w=S.A.find(z=>z.id===+x);if(w){const d=AT(w.tp),c=(d.ucak-w.n)*d.mal/d.ucak*1.5;if(canStay(w.o,w.base)&&S.C[me].tr>=c){S.C[me].tr-=c;w.n=d.ucak;toast(`${d.k} filosu tam kadroya ulaştı.`)}}break}
   case 'tutn':U.tut++;if(U.tut>=TUT.length){U.tut=null;tutSeen()}break;
   case 'tutp':U.tut=Math.max(0,U.tut-1);break;
   case 'tutx':U.tut=null;tutSeen();break;
   /* haritada ülke seçimi */
   case 'pkdif':U.dif=+x;break;
   case 'pkgo':{const c=U.pick;pickEnd();const m=S0();m.setup='od';m.story='od';start(c);ui();return}
   case 'pkres':{const j=load(+x||0);if(!j)break;pickEnd();const m=S0();m.setup='od';m.story='od';start(j.me,j);ui();return}
   case 'pkback':exit();return;
   case 'desel':U.sel=new Set();U.fsel=null;break;
   case 'tog':{const id=+x;if(U.sel.has(id))U.sel.delete(id);else U.sel.add(id);break}
   case 'selall':for(const u of S.U)if(u.r===U.reg&&mine(u.o)&&!u.emb)U.sel.add(u.id);break;
   case 'selnone':U.sel=new Set();break;
   case 'stop':for(const id of U.sel){const u=S.U.find(z=>z.id===id);if(u){u.path=[];u.prog=0}}break;
   case 'amph':U.amph=[...U.sel];U.mode='land';break;
   case 'go':select(+x);fit(+x,Math.max(VW.s,1.4));return;
   case 'fgo':{const f=S.F.find(z=>z.id===+x);if(f){select(f.r,f.id);fit(f.r,Math.max(VW.s,1))}return}
   case 'fsel':U.fsel=U.fsel===+x?null:+x;break;
   case 'fstop':case 'fname':{const f=S.F.find(z=>z.id===+x);if(f){f.path=[];f.prog=0}break}
   case 'osub':U.osub=x;break;
   case 'wm':{const w=S.A.find(z=>z.id===+x);if(w){w.mis=y;if(y!=='bekle'&&w.t<0){U.mode='airtgt';U.wing=w.id}}break}
   case 'wt':U.mode='airtgt';U.wing=+x;break;
   case 'wb':U.mode='airbase';U.wing=+x;break;
   case 'fire':{const why=fire(me,+x);if(why)toast(why);break}
   case 'q':{const why=queue(me,x,y);if(why)toast(why);else toast('Üretim sırasına eklendi.');break}
   case 'mob':{const m=MOB[+x];if(m.ws&&S.C[me].ws<m.ws){toast(`Savaş desteği en az %${m.ws} olmalı.`);break}S.C[me].mob=+x;if(S.C[me].mp>mpCap(me))S.C[me].mp=mpCap(me);toast(`Seferberlik yasası: ${m.n}.`);break}
   case 'al':{const C=S.C[me],d=+y;if(d>0&&freeFab(C)>0)C.al[x]++;else if(d<0&&C.al[x]>0)C.al[x]--;break}
   case 'fab':{const why=buildFab(me,+x);toast(why||`${near(+x)} bölgesinde fabrika yapımı başladı (30 gün).`);break}
   case 'imp':{const why=importEq(me,x);toast(why||`${EQ[x].lot} ${EQ[x].k} yurt dışından alındı.`);break}
   case 'rec':{const why=recruit(me,x,+y===1);toast(why||`${LT(x).n} eğitime başladı.`);break}
   case 'trc':{const C=S.C[me],t=C.train.splice(+x,1)[0];if(t){const n=NEED[t.tp];for(const e in n)C.eq[e]+=n[e]*.7;C.mp+=LT(t.tp).ins;toast('Eğitim iptal edildi; teçhizatın %70\'i depoya döndü.')}break}
   case 'dep':U.mode='deploy';U.open=0;break;
   case 'pc':{const it=S.C[me].prod.splice(+x,1)[0];if(it){S.C[me].tr+=it.cost*.6;if(it.k==='u')S.C[me].mp+=LT(it.tp).ins;toast('İptal edildi; maliyetin %60\'ı geri döndü.')}break}
   case 'dip':U.tab='dip';U.dip=x;U.open=1;U.dmsg='';break;
   case 'dipback':U.dip=null;break;
   case 'def':S.C[me].def=+x;U.itDef=(U.itDef||0)+1;break;
   case 'indv':{const C=S.C[me],k=indCost(me);if(C.ibB||IND(me)>=5||C.tr<k)break;C.tr-=k;C.ibB=S.h+24*730;toast(`Sanayi yatırımı başladı (${f1(k)} mlr $, 2 yıl).`);break}
   case 'infv':{const r=+x,k=infCost(r);if(S.ctl[r]!==me||S.C[me].tr<k||((S.inf||{})[r]||0)>=3||(S.infB||{})[r])break;S.C[me].tr-=k;S.infB=S.infB||{};S.infB[r]=S.h+24*365;toast(`${near(r)}: altyapı yatırımı başladı (${f1(k)} mlr $, 365 gün).`);break}
   case 'rep':{const r=+x,k=repCost(r);if(S.C[me].tr<k||!S.dmg[r])break;S.C[me].tr-=k;S.rep=S.rep||{};S.rep[r]=1;toast(`${near(r)}: hızlı onarım başladı.`);break}
   case 'rel':{if(S.C[me].tr<.1)break;S.C[me].tr-=.1;addRel(me,x,7);S.cool['r'+x]=S.h+24*14;U.dmsg=`${NM(x)} heyeti ağırlandı; ilişkiler iyileşti.`;break}
   case 'kin':{addRel(me,x,-10);S.C[me].ws+=2;S.cool['k'+x]=S.h+24*7;U.dmsg=`${NM(x)} sert bir dille kınandı.`;break}
   case 'ally':{S.cool['a'+x]=S.h+24*30;const busy=enemiesOf(x).some(e=>ally(e,me))||enemiesOf(me).some(e=>ally(e,x));
     if(rel(me,x)>=55&&!busy&&Math.random()<.4+rel(me,x)/200){S.allies.push({n:`${SN(me)}–${SN(x)} ittifakı`,m:[me,x]});addRel(me,x,10);U.dmsg=`${NM(x)} ittifakı kabul etti.`;log(`${NM(x)} ile ittifak kuruldu.`,1)}
     else U.dmsg=`${NM(x)} öneriyi geri çevirdi.${rel(me,x)<55?' (İlişki en az +55 olmalı.)':''}`;break}
   case 'unally':for(const al of S.allies)if(al.m.includes(me)&&al.m.includes(x))al.m=al.m.filter(z=>z!==me);S.allies=S.allies.filter(al=>al.m.length>1);addRel(me,x,-20);log(`${NM(x)} ile ittifak sona erdi.`,1);break;
   case 'dw':{if(!hasCB(me,x)){toast('Savaş ilan etmek için önce bir savaş gerekçesi hazırlamalısın (ülke paneli › Savaş gerekçesi).');break}const join=[...new Set([...bloc(x),...(S.tr||[]).filter(t=>t.k==='def'&&(t.a===x||t.b===x)).map(t=>t.a===x?t.b:t.a)])].filter(z=>z!==x&&z!==me&&!ally(z,me));U.ask={t:`<h2>${ek(x,'e')} savaş</h2><p>${hasCB(me,x)?'<b>Savaş gerekçen hazır</b>: savaş haklı sayılacak. ':rel(me,x)>-30?'Gerekçen yok ve ilişkiler henüz bu kadar kötü değil: haksız savaş istikrarını, savaş desteğini ve bütün ülkelerle ilişkini düşürür. ':''}${hasTr(me,x,'nap')?'<b>Saldırmazlık paktını bozacaksın</b>: istikrar −10, bütün ülkelerle ilişki −8. ':''}${join.length?'Karşına geçecek müttefikleri: <b>'+join.map(NM).join(', ')+'</b>.':'Bilinen bir müttefiki yok.'}</p>`,y:'Savaş ilan et',go:()=>{declare(me,x);U.dip=x}};break}
   case 'pw':{const s=score(x,me),age=(S.h-(warOf(me,x)||{h:S.h}).h)/24;if(s<=5||(age>45&&s<20&&Math.random()<.5)){makePeace(me,x,null);U.dmsg=`${NM(x)} beyaz barışı kabul etti.`}else U.dmsg=`${NM(x)} savaşı sürdürmek istiyor (onların skoru ${f0(s)}).`;break}
   case 'pk':{const s=score(x,me),capLost=S.ctl[CAPR[x]]!==x;if(s<=-35||capLost){makePeace(me,x,'a');U.dmsg=`${NM(x)} şartlarını kabul etti: işgal edilen topraklar artık senin.`}else U.dmsg=`${NM(x)} reddetti: henüz yeterince kaybetmedi (onların skoru ${f0(s)}; −35 ya da başkentinin düşmesi gerekir).`;break}
   case 'evok':S.ev.shift();resume();break;
   /* barış konferansı */
   case 'cfannex':case 'cfpart':case 'cfpup':case 'cfpupall':{if(S.ev[0]&&S.ev[0].k==='conf')S.ev.shift();if(a==='cfpupall'&&S.conf)S.conf.sel=[];confFinish({cfannex:'annex',cfpart:'partial',cfpup:'puppet',cfpupall:'puppet'}[a]);break}
   case 'cfpick':if(S.ev[0]&&S.ev[0].k==='conf')S.ev.shift();U.mode='conf';U.open=0;if(S.conf){const c=capOf(S.conf.c)>=0?capOf(S.conf.c):CAPR[S.conf.c];if(c>=0)fit(c,Math.max(VW.s,.9))}break;
   /* harita modu */
   case 'mm':U.mm=x;U._am=null;U.wsel=null;S.mapDirty=1;if(x==='hava')toast('Hava görünümü: uçak simgesini hedefe sürükle ya da dokunup hedefe dokun.');break;
   case 'wdesel':U.wsel=null;break;
   case 'amisx':U.amis=null;break;
   case 'amis':{const A=U.amis;U.amis=null;U.wsel=null;if(!A)break;const t=A.t,ws=S.A.filter(w=>A.ids.includes(w.id)&&mine(w.o));let n=0;
     for(const w of ws){const d=AT(w.tp);
       if(x==='base'){if(canStay(me,t)&&CITYIN[t].length&&w.base!==t){w.mv=Math.ceil(dist(w.base,t)/600)+2;w.base=t;w.mis='bekle';w.t=-1;w.ar=0;n++}}
       else if(x==='bekle'){w.mis='bekle';w.t=-1;w.ar=0;n++}
       else if(dist(w.base,t)<=d.men&&(x==='ust'?d.hv>0:x==='des'?d.yer>0:d.bom>0)){w.mis=x;w.t=t;w.ar=0;n++}}
     toast(x==='base'?`${n} filo ${RG[t].n} üssüne intikal ediyor.`:x==='bekle'?`${n} filo üste bekliyor.`:`${n} filo · ${MISN[x]} · ${RG[t].n}`);break}
   case 'aair':{const ar=S.ar.find(z=>z.id===+x);if(!ar)break;const att=S.A.filter(w=>w.ar===ar.id);
     if(att.length){for(const w of att){w.ar=0;w.mis='bekle';w.t=-1}toast(`${ar.n}: hava desteği kapatıldı.`);break}
     const rs=ar.u.map(id=>S.U.find(u=>u.id===id)).filter(u=>u&&!u.emb).map(u=>u.r);
     const cand=S.A.filter(w=>mine(w.o)&&!w.ar&&(AT(w.tp).hv||AT(w.tp).yer)&&rs.some(r=>dist(w.base,r)<=AT(w.tp).men));let ws=cand.filter(w=>w.mis==='bekle');if(!ws.length)ws=cand;
     if(!ws.length){toast('Ordunun bulunduğu yerlere menzili yeten hava filosu yok. Bir filonun üssünü yaklaştır.');break}
     for(const w of ws)w.ar=ar.id;airArmy();toast(`${ar.n}: ${ws.length} hava filosu destek veriyor.`);break}
   /* ordular */
   case 'army':if(U.open&&U.tab==='army'&&U.army===+x)U.open=0;else{U.army=+x;U.tab='army';U.open=1}break;
   case 'newarmy':{if(!U.sel.size){toast('Önce haritada bir bölgeye dokunup birlik seç, sonra "+ Ordu"ya bas.');break}const ar=mkArmy([...U.sel]);U.sel=new Set();selMask(-1);U.army=ar.id;U.tab='army';U.open=1;toast(`${ar.n} kuruldu: komutan ${ar.g}.`);break}
   case 'aadd':{const ar=S.ar.find(z=>z.id===+x);if(ar){const n=U.sel.size;for(const id of U.sel)assign(id,ar);U.sel=new Set();U.army=ar.id;U.tab='army';U.open=1;selMask(-1);toast(`${n} birlik ${ar.n} emrine verildi.`)}break}
   case 'asel':{const ar=S.ar.find(z=>z.id===+x);if(ar){U.sel=new Set(ar.u);U.reg=null;selMask(-1);toast(`${ar.n}: ${ar.u.length} tümen seçildi. Hedefe dokun.`)}break}
   case 'adel':{const ar=S.ar.find(z=>z.id===+x);if(ar){for(const id of [...ar.u])assign(id,null);if(ar.cm){gpool().push(ar.cm);if(S.gp.length>6)S.gp.shift()}S.ar=S.ar.filter(z=>z!==ar);U.open=0}break}
   case 'afr':{const ar=S.ar.find(z=>z.id===+x);if(ar){ar.fr=y==='-'?null:y;if(!ar.fr){ar.atk=0;ar.t=-1}else if(!armyFront(ar))toast(`${NM(y)} ile ortak sınırın yok.`)}break}
   case 'atgt':U.mode='armytgt';U.army=+x;break;
   case 'aatk':{const ar=S.ar.find(z=>z.id===+x);if(ar){ar.atk=ar.atk?0:1;toast(ar.atk?`${ar.n} taarruza geçiyor.`:`${ar.n} hattı tutacak.`)}break}
   /* politikalar */
   case 'law':S.C[me].law=x;toast(`İşgal politikası: ${LAWS[x].n}.`);break;
   case 'amnesty':{if((S.cool['af'+me]||0)>S.h)break;S.cool['af'+me]=S.h+24*180;for(let r=0;r<NR;r++)if(S.ctl[r]===me&&resOf(r)>=0)S.res[r]=Math.max(0,(S.res[r]||0)-15);S.C[me].stab-=2;toast('Genel af ilan edildi.');break}
   case 'minr':{const C=S.C[me];C.min=C.min?0:1;if(C.min){C.stab-=3;toast('Azınlık hakları yasası çıkarıldı.')}else toast('Azınlık hakları yasası kaldırıldı.');break}
   case 'uzl':{if((S.cool['uz'+me]||0)>S.h||S.C[me].tr<.3)break;S.cool['uz'+me]=S.h+24*90;S.C[me].tr-=.3;for(let r=0;r<NR;r++)if(S.ctl[r]===me&&resOf(r)>=0)S.cmp[r]=Math.min(100,(S.cmp[r]||0)+8);toast('Toplum liderleriyle uzlaşı sağlandı.');break}
   case 'inv':{const r=+x,rf=S.rf[r]=S.rf[r]||{},ic=.05+RW[r]*.015;if((rf.inv||0)>S.h||S.C[me].tr<ic)break;S.C[me].tr-=ic;rf.inv=S.h+24*30;S.cmp[r]=Math.min(100,(S.cmp[r]||0)+12);S.res[r]=Math.max(0,(S.res[r]||0)-8);toast(`${near(r)}: okul, hastane ve yol yatırımı başladı.`);break}
   case 'ozr':{const r=+x;(S.rf[r]=S.rf[r]||{}).ozr=1;toast(`${near(r)}: yerel meclis kuruldu.`);break}
   case 'integ':{const r=+x;if((S.cmp[r]||0)<80||S.C[me].tr<.3||S.own[r]!==me)break;S.C[me].tr-=.3;S.core[r]=me;S.res[r]=0;markR(r);log(`${near(r)} topraklarına tam olarak katıldı.`,1);break}
   /* kukla devlet */
   case 'pann':annexPuppet(x);U.dip=null;break;
   case 'pfree':freePuppet(x,'senin kararınla kazandı');addRel(me,x,25);break;
   case 'evyes':{const e=S.ev.shift();if(e.k==='trq')trAdd(e.kk,e.c,me);else if(e.k==='demand')makePeace(e.c,me,'a');else if(e.k==='offer')makePeace(me,e.c,e.keep?'a':null);resume();break}
   case 'evno':{const e=S.ev.shift();if(e.k==='trq'){addRel(me,e.c,-4);log(`${ek(e.c,'in')} anlaşma teklifi reddedildi.`)}else log(`${ek(e.c,'in')} barış önerisi reddedildi.`);resume();break}
   /* anlaşmalar, silah satışı, savaş gerekçesi */
   case 'trp':{const k=x,c=y;if(atWar(me,c)||hasTr(me,c,k)||(S.cool['tp'+k+c]||0)>S.h)break;S.cool['tp'+k+c]=S.h+24*30;U.itTr=1;
     if(trWill(c,k)>=0){trAdd(k,me,c);U.dmsg=`${NM(c)} ${TRN[k].n.toLocaleLowerCase('tr')} teklifini kabul etti.`}else{U.dmsg=`${NM(c)} ${TRN[k].n.toLocaleLowerCase('tr')} teklifini reddetti.`}toast(U.dmsg);break}
   case 'trc':{const k=x,c=y;trEnd(me,c,k);addRel(me,c,k==='trd'?-5:-12);U.dmsg=`${NM(c)} ile ${TRN[k].n.toLocaleLowerCase('tr')} sona erdi.`;toast(U.dmsg);break}
   case 'arm':{const c=x,e=y,E=EQ[e],C=S.C[me],B_=S.C[c],price=E.imp*E.lot*.85;if(atWar(me,c)||(C.eq[e]||0)<E.lot||(S.cool['ar'+c]||0)>S.h)break;
     if(!(enemiesOf(c).length>0||B_.tr>price*4)||B_.tr<price){U.dmsg=`${NM(c)} şu an silah almak istemiyor.`;S.cool['ar'+c]=S.h+24*7;toast(U.dmsg);break}
     C.eq[e]-=E.lot;B_.eq[e]=(B_.eq[e]||0)+E.lot;B_.tr-=price;C.tr+=price;addRel(me,c,6);S.cool['ar'+c]=S.h+24*14;U.itArm=1;
     for(const z of enemiesOf(c))if(!mine(z)&&(ally(me,z)||rel(me,z)>40))addRel(me,z,-12);
     U.dmsg=`${NM(c)} ${E.lot} ${E.k} satın aldı; hazineye ${f1(price)} mlr $ girdi.`;toast(U.dmsg);break}
   case 'cbs':{const k=x,c=y,t=CBT[k];if(!t||S.C[me].tr<t.c||(t.req&&!t.req(c)))break;S.C[me].tr-=t.c;S.cb=S.cb||{};S.cb[me+'|'+c]={k,done:S.h+24*t.g,until:S.h+24*(t.g+180)};U.itCb=1;
     U.dmsg=`${NM(c)} için savaş gerekçesi hazırlanıyor: ${t.n} (${t.g} gün).`;toast(U.dmsg);break}
  }dirty(1)}
function resume(){if(!S.ev.length&&!S.over&&U.wasSpd&&!S.spd)S.spd=U.wasSpd}

/* ---------- giriş, çıkış ---------- */
function start(me,loaded){S=loaded||newState(me);if(!loaded){S.dif=U.dif==null?1:U.dif;S.slot=U.nslot||1;goalInit();histSnap()}OD.S=S;for(const c of V.ORDER)if(S.C[c])recalcFab(c);U.sel=new Set();U.fsel=null;U.mode=null;U.open=0;U.tab='ordu';U.reg=null;U.dip=null;U.menu=0;U.ask=null;U.wasSpd=1;U.tut=null;U.it=null;U.itSnap=null;U.line=null;U.gsw=null;try{U.vis=+localStorage.getItem(SK('odvis'))||0}catch(e){}
  mount();OD.on=true;root.hidden=false;selMask(-1);S.mapDirty=1;OD.mver++;
  prep(()=>{paint();const w=cv.clientWidth,h=cv.clientHeight;VW.s=clamp(Math.min(w/700,h/700),.35,1.2);fit(capOf(S.me)>=0?capOf(S.me):CAPR[S.me]);dirty(1);
    /* her yeni oyunda etkileşimli rehber açılır (istenirse "Rehberi atla") */
    if(!loaded)itStart();
    if(!loaded)log(`${dateOf(0)}: ${NM(S.me)} hükûmetinin başındasın. Birliklerini sayaçlarından tutup sürükleyerek taşı; alttaki sekmelerden üretim, diplomasi ve bütçeyi yönet.`,1);else toast('Kaldığın yerden devam ediyorsun.')})}
/* ülke seçimi haritada: geçici bir oyun durumu çizilir, zaman akmaz; dokunulan ülkenin sınırı vurgulanır */
function pickStart(){S=newState(PICK);OD.S=S;U.pick=PICK;U.sel=new Set();U.fsel=null;U.mode=null;U.open=1;U.tab='pick';U.reg=null;U.dip=null;U.menu=0;U.ask=null;U.tut=null;
  mount();OD.on=true;root.hidden=false;root.classList.add('pk');selMask(-1);S.mapDirty=1;OD.mver++;
  prep(()=>{paint();pickSet(U.pick||PICK);const w=cv.clientWidth,h=cv.clientHeight;VW.s=clamp(Math.min(w/1250,h/1150),.22,1);VW.x=MW*.5-w/2/VW.s;VW.y=MH*.5-h*(w<820?.3:.5)/VW.s;clampView();dirty(1)})}
function pickSet(c){PICK=c;U.pick=c;S.me=c;OD.mver++;U.open=1;U.pkCh=[];for(let k=0;k<CH.length;k++){const ch=CH[k],a=ch.a>=0&&S.own[ch.a]===c,b=ch.b>=0&&S.own[ch.b]===c;if(a!==b)U.pkCh.push(k)}dirty(1)}
function pickEnd(){U.pick=null;U.pkCh=null;if(root)root.classList.remove('pk')}
function pPick(){const c=U.pick,d=V.C[c],kara=(V.KARA[c]||[]).reduce((s,x)=>s+x[2],0),hava=(V.HAVA[c]||[]).reduce((s,x)=>s+x[2],0),den=(V.DENIZ[c]||[]).reduce((s,x)=>s+Object.values(x[2]).reduce((a,b)=>a+b,0),0),sv=load();
  return ['Ülkeni seç',`<div class="row"><h2>${d.n}</h2><span class="sw" style="background:${d.col};width:22px;height:22px"></span></div>
  <div class="kv"><span>Yönetim</span><b>${d.gov}</b><span>Başkent</span><b>${V.CAP[c]}</b><span>Nüfus · GSYH</span><b>${f1(d.pop)} mn · ${f0(d.gdp)} mlr $</b><span>Ordu</span><b>${kara} kara · ${hava} hava · ${den} gemi</b><span>Sanayi · hava savunması</span><b>${d.ind}/5 · ${d.ad}/5${d.mis?' · '+d.mis+' füze':''}</b><span>İstikrar · savaş desteği</span><b>%${d.stab} · %${d.ws}</b></div>
  <h3>Zorluk</h3><div class="seg">${DIFN.map((n,i)=>B('pkdif:'+i,n,(U.dif==null?1:U.dif)===i?'sel':'')).join('')}</div><p class="note">${['Yapay zekâ daha yavaş üretir ve eğitir.','Herkes aynı kurallarla oynar.','Yapay zekâ %30 daha verimli fabrika, daha hızlı eğitim ve ucuz ithalatla oynar.'][U.dif==null?1:U.dif]}</p>
  <h3>Kayıt yuvası</h3><div class="seg">${[1,2,3].map(n=>{const i=slotInfo(n);return B('pkslot:'+n,`Yuva ${n}${i?' · dolu':' · boş'}`,(U.nslot||1)===n?'sel':'')}).join('')}</div>
  <div class="btns">${B('pkgo',`Bu ülkeyle başla (yuva ${U.nslot||1})`,'b pri')}</div>
  ${[1,2,3].map(n=>{const i=slotInfo(n);return i?`<div class="it"><span class="tx"><b>Yuva ${n}: ${NM(i.me)}</b><small>${dateOf(i.h)} · ${DIFN[i.dif==null?1:i.dif]}</small></span>${B('pkres:'+n,'Devam et','b')}</div>`:''}).join('')}<p class="note">Başka bir ülke için haritada ona dokun.</p>`]}
function exit(){if(U.it!=null)itEnd();pickEnd();OD.on=false;if(root)root.hidden=true;U.menu=0;U.ask=null;ODMAIN.reset();ui()}
const S0=ODMAIN.get;
OD.start=start;OD.exit=exit;OD.load=load;OD.prep=prep;OD._t={hour,day,score,declare,makePeace,path,budget,upkeep,gdpOf,queue,fire,landPower,select,amphib,fleetCap,mkArmy,armyFront,confFinish,resOf,rOut,baseRes,annexPuppet,fit,lineTick,cmOf,gpool,pickSet,render:()=>render(),cmd:s=>cmd(s),U,goalInit,histSnap,IND,credit,dip:{attitude,trWill,trAdd,trEnd,hasTr,access,canEnter,hasCB,PERS,opinion},draw:()=>draw(),paint:()=>paint(),airSup,airArmy,blockParts,itStart,itEnd,view:VW,hit:()=>HIT,drag:()=>U.drag,state:()=>S,init:me=>{S=newState(me);OD.S=S;return S}};

/* ---------- ana oyuna bağlantı ---------- */
STORIES.splice(4,0,{id:'od',yr:'2026 · Orta Doğu',t:'Açık Dünya',d:'On sekiz devlet, gerçek sınırlar, gerçek ordular. Bir ülke seç; ekonomisini, ordusunu ve diplomasisini yönet. Sabit bir hikâye yok: savaş, ittifak ya da barış senin kararın.',cta:'Ülke seç'});
PARTS.od='<span class="ph"><img src="od-kapak.png" alt=""></span>';
LDS.od={img:'od-kapak.png',kick:'Dosya 05 · Ocak 2026',title:'Açık Dünya',steps:['Sınırlar çiziliyor…','Ordular konuşlanıyor…','Büyükelçilikler açılıyor…'],next:'odintro'};
window.EPSL=window.EPSL||{};
let PICK='TUR';
{const _v=vTitle;vTitle=function(){
  if(S0().setup!=='odintro')return _v();
  const d=V.C[PICK],kara=(V.KARA[PICK]||[]).reduce((s,x)=>s+x[2],0),hava=(V.HAVA[PICK]||[]).reduce((s,x)=>s+x[2],0),den=(V.DENIZ[PICK]||[]).reduce((s,x)=>s+Object.values(x[2]).reduce((a,b)=>a+b,0),0);
  const sv=load();
  return `<div class="in"><img class="bgp" src="od-kapak.png" alt=""><div class="shade"></div><div class="tp2">${btn('toModes',null,'‹ Modlar','back')}</div>
  <div class="mid"><p class="kick">Dosya 05 · Ocak 2026</p><h1>Açık Dünya</h1><div class="orn"><i></i><b></b><i></i></div><p class="lead">Hangi ülkeyi yöneteceksin?</p></div>
  <div class="odpick" style="position:relative">${V.ORDER.map(c=>btn('odPick',c,`<i style="background:${V.C[c].col}"></i><span><b>${V.C[c].n}</b><small>${f1(V.C[c].pop)} MN · ${f0(V.C[c].gdp)} MLR $</small></span>`,PICK===c?'sel':'')).join('')}</div>
  <div class="odsum" style="position:relative"><b>${d.n}</b><span>${d.gov} · başkent ${V.CAP[PICK]}</span><span>${kara} kara birliği · ${hava} hava filosu · ${den} gemi · sanayi ${d.ind}/5 · hava savunması ${d.ad}/5${d.mis?' · '+d.mis+' füze':''}</span><span>İstikrar %${d.stab} · savaş desteği %${d.ws}</span></div>
  <div class="ft" style="width:100%;max-width:640px">${btn('odStart',PICK,'Göreve başla','start')}${sv?btn('odResume',null,`Kaldığın yerden devam et (${NM(sv.me)} · ${dateOf(sv.h)})`,'lnk'):''}<p>Rakamlar 2025–26 kamuya açık tahminlerinden oyun ölçeğine indirilmiştir. İl sınırları: geoBoundaries (CC BY 4.0); kıyılar ve arazi rengi: Natural Earth; yükseklik: Mapzen/AWS Terrain Tiles (SRTM, ETOPO1, GMTED2010).</p></div></div>`}}
{const _a=act;act=function(a,arg){
  if(a==='odPick'){PICK=arg;return ui()}
  if(a==='odStart'){const m=S0();m.setup='od';m.story='od';start(arg||PICK);return ui()}
  if(a==='odResume'){const j=load();if(!j)return ui();const m=S0();m.setup='od';m.story='od';start(j.me,j);return ui()}
  if(OD.on&&a!=='settings')return;
  return _a(a,arg)}}
/* mod açıkken ana oyunun katmanları boşaltılır, kaydı yazılmaz ve 3B dünya çizilmez; yalnızca ayarlar (ses) penceresi çalışır */
{const _u=ui;ui=function(){if(!OD.on&&S0().setup==='odintro')pickStart();if(OD.on){for(const id of ['title','top','bottom','sheet','pop','drawer'])set(id,'');const sb=$('snd');if(sb)sb.dataset.pos='hide';
    $('cfg').hidden=!ODMAIN.ui().cfg;try{volUI()}catch(e){}$('scrim').hidden=true;dirty(1);return}
  if(root&&!root.hidden)root.hidden=true;return _u()}}
{const _f=frame;frame=function(dt){if(OD.on)return;return _f(dt)}}
/* ayarlar penceresi (ses) Açık Dünya'nın üstünde de açılabilsin; ülke seçim ekranı da bu dosyanın stillerini kullanır */
document.getElementById('cfg').style.zIndex=9;css();
})();
