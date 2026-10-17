/* ---------- Dosya 04 · Alman devletleri: parçalı harita, devlet paneli, 1866'da taraf seçimi ----------
   1862'nin Alman devletleri haritada ayrı parseller olarak çizilir (sınırlar de62-sinir.js'den); renkleri birleşmenin seyrine göre değişir.
   Her devletin Prusya'ya bir eğilimi vardır. Avusturya'yla savaş çıktığı an eğilimi 50 ve üstünde olanlar Prusya'nın, altında olanlar Avusturya'nın safına geçer;
   tarihteki saflardan sapma savaşın sonucunu ve 1866'daki ilhak listesini değiştirir. Devlete basılı tutunca paneli açılır. */
const DST={
 HAN:{n:'Hannover Krallığı',k:'HANNOVER',cap:'Hannover',r:()=>'V. Georg',pop:1.9,ar:18,lean:30,m:1,ann:1,zv:1,at:[9.6,52.6],
  d:'Kuzeyin en büyük orta devleti. Kral V. Georg kör, inatçı ve Kraliçe Victoria\'nın kuzeni; Prusya\'nın doğusunu batısından ayıran toprak onun.'},
 SAK:{n:'Saksonya Krallığı',k:'SAKSONYA',cap:'Dresden',r:()=>'Johann',pop:2.3,ar:32,lean:15,m:1,zv:1,at:[13.2,51.0],
  d:'Sanayisi güçlü, ordusu iyi. Başbakan Beust, orta devletleri Avusturya ile Prusya arasında üçüncü bir güç yapmaya çalışıyor.'},
 BAV:{n:'Bavyera Krallığı',k:'BAVYERA',cap:'Münih',r:()=>deN()<=6?'II. Maximilian':'II. Ludwig',pop:4.8,ar:50,lean:25,m:1,sud:1,zv:1,at:[11.5,48.7],
  d:'Almanya\'nın üçüncü büyük devleti; Katolik ve Prusya\'ya kuşkulu. 1864\'te tahta çıkan genç II. Ludwig siyasetten çok operayla ilgileniyor.'},
 WUR:{n:'Württemberg Krallığı',k:'WÜRTTEMBERG',cap:'Stuttgart',r:()=>deN()<=7?'I. Wilhelm':'Karl',pop:1.75,ar:16,lean:25,m:1,sud:1,zv:1,at:[9.2,48.5],
  d:'Demokratlar güçlü; "Prusyalaşma"ya karşı Avusturya\'ya yakın duruyor.'},
 BAD:{n:'Baden Büyük Dükalığı',k:'BADEN',cap:'Karlsruhe',r:()=>'I. Friedrich',pop:1.43,ar:10,lean:45,m:1,sud:1,zv:1,at:[8.15,48.4],
  d:'Liberal yönetilen, Fransa\'ya sınır bir güney devleti. Büyük Dük, Kral Wilhelm\'in damadı; Prusya\'ya en yakın güney sarayı burası.'},
 HKS:{n:'Hessen-Kassel Seçiciliği',k:'HESSEN-KASSEL',cap:'Kassel',r:()=>'I. Friedrich Wilhelm',pop:.75,ar:7,lean:30,m:1,ann:1,zv:1,at:[9.4,51.0],
  d:'Seçici Prens anayasasıyla kavgalı ve halkının gözünden düşmüş. Toprağı Prusya\'nın iki yarısı arasındaki yolun üzerinde.'},
 HDA:{n:'Hessen Büyük Dükalığı',k:'HESSEN',cap:'Darmstadt',r:()=>'III. Ludwig',pop:.85,ar:10,lean:25,sud:1,zv:1,at:[8.85,49.8],
  d:'Main\'in iki yakasına yayılmış; başbakan Dalwigk Prusya\'nın açık düşmanı ve Paris\'e yakın.'},
 NAS:{n:'Nassau Dükalığı',k:'NASSAU',cap:'Wiesbaden',r:()=>'Adolf',pop:.47,ar:5,lean:35,ann:1,zv:1,
  d:'Ren kıyısında küçük bir dükalık; Dük Avusturya\'ya, meclisi Prusya\'ya yakın.'},
 FRK:{n:'Frankfurt Serbest Şehri',k:'FRANKFURT',cap:'Frankfurt',r:()=>'Senato',pop:.09,ar:1,lean:20,ann:1,zv:1,
  d:'Konfederasyon Meclisi\'nin şehri ve Rothschild\'lerin bankası. Prusya\'ya en sert yazan basın burada.'},
 MEC:{n:'Mecklenburg dükalıkları',k:'MECKLENBURG',cap:'Schwerin',r:()=>'II. Friedrich Franz',pop:.65,ar:6,lean:70,m:1,at:[12.0,53.7],
  d:'Muhafazakâr, tarım ağırlıklı ve Prusya sarayına akrabalıkla bağlı. Zollverein\'in dışında.'},
 OLD:{n:'Oldenburg Büyük Dükalığı',k:'OLDENBURG',cap:'Oldenburg',r:()=>'Peter',pop:.3,ar:3,lean:65,m:1,zv:1,at:[8.2,53.0],
  d:'Büyük Dük, Holstein üzerinde kendi hanedan hakkını ileri sürüyor ve bunun için Prusya\'nın desteğini arıyor.'},
 BRA:{n:'Brunswick Dükalığı',k:'BRUNSWICK',cap:'Braunschweig',r:()=>'Wilhelm',pop:.29,ar:3,lean:60,zv:1,
  d:'Hannover\'le Prusya arasında sıkışmış küçük bir dükalık; dükün varisi yok.'},
 ANH:{n:'Anhalt dükalıkları',k:'ANHALT',cap:'Dessau',r:()=>'IV. Leopold',pop:.19,ar:2,lean:70,zv:1,
  d:'Dört yanı Prusya toprağıyla çevrili.'},
 THU:{n:'Thüringen devletleri',k:'THÜRİNGEN',cap:'Weimar',r:()=>'Weimar, Gotha, Meiningen ve ötekiler',pop:1.05,ar:9,lean:55,m:1,zv:1,at:[11.0,50.75],
  d:'Bir düzine küçük dükalık ve prenslik. Gotha Dükü Ernst milliyetçilerin dostu; Meiningen Dükü ise Avusturya\'ya bağlı.'},
 LIP:{n:'Lippe, Waldeck ve Schaumburg',k:'LIPPE',cap:'Detmold',r:()=>'Üç küçük prenslik',pop:.2,ar:2,lean:60,zv:1,
  d:'Konfederasyon\'un en küçük üyelerinden.'},
 HSE:{n:'Hansa şehirleri',k:'HAMBURG',cap:'Hamburg',r:()=>'Hamburg, Bremen ve Lübeck senatoları',pop:.42,ar:4,lean:55,
  d:'Ticaret cumhuriyetleri; serbest ticaret istiyorlar ve Zollverein\'in dışındalar.'},
 SCH:{n:'Schleswig Dükalığı',k:'SCHLESWIG',cap:'Schleswig',r:()=>'Danimarka Kralı (dük olarak)',pop:.41,ar:0,lean:0,m:1,duk:1,at:[9.4,54.6],
  d:'Danimarka tacına bağlı ama Konfederasyon\'un dışında; kuzeyi Danca, güneyi Almanca konuşuyor.'},
 HOL:{n:'Holstein ve Lauenburg',k:'HOLSTEIN',cap:'Kiel',r:()=>'Danimarka Kralı (dük olarak)',pop:.6,ar:0,lean:0,m:1,duk:1,at:[10.0,54.05],
  d:'Alman Konfederasyonu üyesi iki dükalık; hükümdarları Danimarka Kralı.'},
 LUX:{n:'Lüksemburg Büyük Dükalığı',k:'LÜKSEMBURG',cap:'Lüksemburg',r:()=>'III. Willem (Hollanda Kralı)',pop:.2,ar:0,lean:0,zv:1,
  d:'Konfederasyon üyesi ve Zollverein\'in içinde; kalesinde Prusya garnizonu var, hükümdarı Hollanda Kralı.'},
 ALS:{n:'Alsace',k:'ALSACE',cap:'Strazburg',r:()=>'İmparatorluk toprağı (Reichsland)',pop:1.07,ar:0,lean:0,fr:1,
  d:'Frankfurt Barışı\'yla Fransa\'dan alındı. Halkı Almanca lehçe konuşuyor ama kendini Fransız sayıyor; doğrudan İmparator\'a bağlı yönetiliyor.'},
 LOR:{n:'Lorraine (Metz)',k:'LORRAINE',cap:'Metz',r:()=>'İmparatorluk toprağı (Reichsland)',pop:.49,ar:0,lean:0,fr:1,
  d:'Moltke Metz kalesini istedi ve aldı. Fransızca konuşan bir şehir; Fransa\'nın asla unutmayacağı yara.'}};
/* NSC: Kuzey Schleswig (1864'ten sonra Prusya'da kalan Danimarka toprağı); durumu ve paneli Schleswig'inkidir */
const DORD=['PRU','HAN','SAK','BAV','WUR','BAD','HKS','HDA','NAS','MEC','OLD','BRA','ANH','THU','LIP','HSE','SCH','HOL','LUX','FRK','NSC','ALS','LOR'];
const DSC={pru:['#6c7584','Prusya'],ndb:['#a3b2c4','Kuzey Alman Konfederasyonu üyesi'],reich:['#a3b2c4','Alman İmparatorluğu üyesi'],kb:['#aebccb','Kuzey birliği (askerî sözleşme)'],
 bund:['#b5a888','Alman Konfederasyonu üyesi'],epru:['#c2c4bb','Prusya\'ya yakın'],eavy:['#d8cba2','Avusturya\'ya yakın'],none:['#000000','—'],isgal:['#c9867a','Prusya işgalinde'],
 ypru:['#94a9c4','Savaşta Prusya safında'],yavy:['#d6b65c','Savaşta Avusturya safında'],guney:['#c79c86','Bağımsız güney devleti'],ittifak:['#a8b87e','Bağımsız; Prusya\'yla gizli ittifakta'],
 dk:['#c98544','Danimarka tacına bağlı'],savas:['#dc5b4e','Savaş bölgesi'],kondo:['#c7b06a','Prusya–Avusturya ortak yönetiminde'],avy:['#d6b65c','Avusturya yönetiminde'],
 aug:['#b48ad0','Augustenburg Dükalığı'],nl:['#9a8fb0','Bağımsız (Hollanda Kralı)']};
const deIsLean=k=>DST[k]&&!DST[k].duk&&!DST[k].fr&&k!=='LUX';
function deDS(){if(!S.ds)S.ds={l:{}};for(const k in DST)if(S.ds.l[k]===undefined)S.ds.l[k]=DST[k].lean;return S.ds}
function deLean(k){const d=DST[k];if(!deIsLean(k))return 0;let v=deDS().l[k];
  if(d.sud)v+=(S.A.sud.f-30)*.5;else if(d.m)v+=(S.g-35)*.15;
  return cl(v)}
function deStat(k){const f=S.f||{},s66=(S.ds&&S.ds.s66)||{};if(k==='NSC')k='SCH';const d=DST[k];
  if(k==='PRU')return 'pru';
  if(d.fr){if(f.baris71&&(f.alsace===2||(f.alsace===1&&k==='ALS')))return 'reich';return S.dw==='fra'&&f.sedan&&!f.baris71?'isgal':'none'}
  if(d.duk){if(f.kg||f.holstein)return 'pru';if(f.gastein)return k==='SCH'?'pru':'avy';if(S.dw==='dk')return 'savas';if(f.kondo)return 'kondo';if(f.aug)return 'aug';return 'dk'}
  if(k==='LUX')return f.kg?'nl':'bund';
  if(f.imparator&&d.sud)return 'reich';
  if(f.kg){if(d.ann&&f.welf&&s66[k]!=='pru')return 'pru';if(d.sud)return k==='BAD'&&f.baden?'ndb':f.guney?'ittifak':'guney';return 'ndb'}
  if(S.dw==='aus')return s66[k]==='pru'?'ypru':'yavy';
  if(deIK()&&f.kuzeybirlik&&!d.sud)return 'kb';
  if(deN()>=13)return deLean(k)>=50?'epru':'eavy';
  return 'bund'}
function deSides(){const s={};for(const k in DST)if(deIsLean(k))s[k]=deLean(k)>=50?'pru':'avy';deDS().s66=s;return s}
const deList=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' ve '+a[a.length-1];

/* ---------- harita ----------
   İki katman: Alman devletleri (DGEO + Kuzey Schleswig ve Alsace–Lorraine) ve 1862 Avrupa'sının bugünkü sınırlarla örtüşmeyen bölgeleri (DGEO2).
   Her ikisi de bugünün kara maskesiyle kırpılır; hücre başına parsel indeksi tutulur, renkler oyunun durumuna göre yeniden boyanır. */
const DB=[5.5,47.1,23.0,56.2],EB=[9.0,34.6,30.5,51.2];
const EORD=['VEN','TIR','PAP','GAL','GAU','TRA','DOB','VOJ','OTG','ION','ASL'];
/* bu parseller boyanmaz, altlarındaki hücreleri siler: Rus Polonyası sınırı ve Avusturya Silezyası (de62-sinir.js) */
const DERASE=new Set(['XRU','ASL']);
/* bölgenin bugün içinde kaldığı ülkenin 1862 bloğu: durum bununla aynıysa boyanmaz, alttaki ülke rengi görünür */
const EBASE={VEN:'ITA',TIR:'ITA',PAP:'ITA',GAL:'RUS',GAU:'RUS',TRA:'VAS',DOB:'VAS',VOJ:'VAS',OTG:'NEU',ION:'NEU',ASL:'RUS'};
const ENOTE={VEN:'Venedik ve Verona kaleleri hâlâ Avusturya\'nın elinde; İtalya onları istiyor. Floransa, Viyana\'ya karşı ortak arıyor.',PAP:'Papa IX. Pius\'un elinde kalan Roma ve çevresi. Bir Fransız garnizonu onu İtalya\'ya karşı koruyor; Fransız askeri çekilirse İtalya Roma\'yı alır.',OTG:'Teselya, Epir, Makedonya, Trakya ve Girit Osmanlı\'nın; Yunanistan Krallığı yalnızca Mora ve Atina çevresinden ibaret.',DOB:'Dobruca Osmanlı\'nın elinde; Romanya\'ya ancak 1878\'de geçecek.',ION:'İyon Adaları 1864\'e kadar İngiliz himayesinde; sonra Yunanistan\'a bırakılıyor.'};
const ENAME={VEN:'Venedik',TIR:'Tirol ve Kıyı Eyaleti',PAP:'Papalık Devleti',GAL:'Galiçya',GAU:'Galiçya ve Bukovina',TRA:'Transilvanya ve Banat',ASL:'Avusturya Silezyası',DOB:'Dobruca',VOJ:'Voyvodina',OTG:'Osmanlı Rumelisi',ION:'İyon Adaları'};
function deEUStat(k){const f=S.f||{},n=deN();
  if(k==='VEN')return f.kg?'ITA':'AUS';if(k==='PAP')return f.sedan?'ITA':'PAP';if(k==='ION')return n<=8?'ING':'NEU';if(k==='OTG'||k==='DOB')return 'OTT';return 'AUS'}
function deZV(k){const f=S.f||{},n=deN();if(k==='NSC')k='SCH';const d=DST[k];if(!d&&k!=='PRU')return false;
  if(k==='PRU'||deStat(k)==='pru')return true;if(d.fr)return deStat(k)==='reich';
  if(d.duk)return false;if(k==='MEC')return !!f.kg&&n>=19;if(k==='HSE')return false;return !!d.zv}
function deOverlay(world,feats,BB,W,order,ringsOf){const x0=BB[0],x1=BB[2],y0=my(BB[1]),y1=my(BB[3]),H=Math.round(W*(y1-y0)/(x1-x0));
  const px=lon=>(lon-x0)/(x1-x0)*W,py=lat=>(y1-my(lat))/(y1-y0)*H;
  /* kara maskesi: parseller bugünün kıyı çizgisini aşmasın */
  const mk=document.createElement('canvas');mk.width=W;mk.height=H;const m=mk.getContext('2d',{willReadFrequently:true});m.fillStyle='#fff';
  for(const f of feats){if(!f.geometry)continue;const P=f.geometry.type==='Polygon'?[f.geometry.coordinates]:(f.geometry.coordinates||[]);
    for(const poly of P){const r=poly&&poly[0];if(!r||r.length<3)continue;let a=1e9,b=-1e9,c=1e9,e=-1e9,jump=false;
      for(let i=0;i<r.length;i++){const p=r[i];if(p[0]<a)a=p[0];if(p[0]>b)b=p[0];if(p[1]<c)c=p[1];if(p[1]>e)e=p[1];if(i&&Math.abs(p[0]-r[i-1][0])>180)jump=true}
      if(jump||b<x0||a>x1||e<BB[1]||c>BB[3])continue;m.beginPath();r.forEach((p,i)=>i?m.lineTo(px(p[0]),py(p[1])):m.moveTo(px(p[0]),py(p[1])));m.closePath();m.fill()}}
  const md=m.getImageData(0,0,W,H).data,cell=new Int8Array(W*H).fill(-1),pc=document.createElement('canvas');pc.width=W;pc.height=H;const g=pc.getContext('2d',{willReadFrequently:true});
  order.forEach((k,idx)=>{const rings=ringsOf(k),val=DERASE.has(k)&&order!==EORD?-1:idx;if(!rings.length)return;let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;g.clearRect(0,0,W,H);g.beginPath();
    for(const r of rings){for(let i=0;i<r.length;i+=2){const X=px(r[i]),Y=py(r[i+1]);if(i===0)g.moveTo(X,Y);else g.lineTo(X,Y);if(X<mnx)mnx=X;if(X>mxx)mxx=X;if(Y<mny)mny=Y;if(Y>mxy)mxy=Y}g.closePath()}
    g.fillStyle='#fff';g.fill('evenodd');
    const bx=Math.max(0,Math.floor(mnx)-1),by=Math.max(0,Math.floor(mny)-1),bw=Math.min(W,Math.ceil(mxx)+2)-bx,bh=Math.min(H,Math.ceil(mxy)+2)-by;if(bw<=0||bh<=0)return;
    const id=g.getImageData(bx,by,bw,bh).data;for(let j=0;j<bh;j++)for(let i=0;i<bw;i++)if(id[(j*bw+i)*4+3]>=128)cell[(by+j)*W+bx+i]=val});
  for(let k=0;k<W*H;k++)if(md[k*4+3]<128)cell[k]=-1;
  /* iki veri kaynağının sınırları arasında kalan ince kara boşluklarını komşu parselle doldur (dış kenarı en fazla 3 piksel taşırır) */
  for(let pass=0;pass<3;pass++){const nx=cell.slice();for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=j*W+i;if(cell[k]>=0||md[k*4+3]<128)continue;const c=cell[k-1]>=0?cell[k-1]:cell[k+1]>=0?cell[k+1]:cell[k-W]>=0?cell[k-W]:cell[k+W];if(c>=0)nx[k]=c}cell.set(nx)}
  /* kenar: komşusu başka bir parsel olan piksel; komşunun indeksi saklanır ki aynı renge geçen sınırlar silikleşsin (-1: parsel dışı) */
  const edge=new Int8Array(W*H).fill(-2);for(let j=0;j<H-1;j++)for(let i=0;i<W-1;i++){const k=j*W+i,c=cell[k];if(c<0)continue;const r=cell[k+1],d=cell[k+W];if(r!==c)edge[k]=r;else if(d!==c)edge[k]=d}
  const out=document.createElement('canvas');out.width=W;out.height=H;const o=out.getContext('2d'),im=o.createImageData(W,H),tex=new THREE.CanvasTexture(out);tex.anisotropy=4;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,y1-y0),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));mesh.position.set((x0+x1)/2,(y0+y1)/2,.012);mesh.renderOrder=1;world.add(mesh);
  return {W,H,cell,edge,im,ctx:o,tex,x0,x1,y0,y1,order,sig:''}}
function deAddParcels(world,feats){
  const circ=(lon,lat,r)=>{const a=[];for(let i=0;i<24;i++){const t=i/24*Math.PI*2;a.push(lon+Math.cos(t)*r*1.5,lat+Math.sin(t)*r)}return a};
  G.dpc=deOverlay(world,feats,DB,1400,DORD.concat(['XRU','ASL']),k=>DGEO[k]||DGEO2[k]||(k==='FRK'?[circ(8.68,50.11,.06)]:[]));
  G.epc=deOverlay(world,feats,EB,1500,EORD,k=>DGEO2[k]||DGEO[k]||[]);
  deParcelPaint(true);
  if(!G.dlMade){G.dlMade=1;for(const k in DST){const d=DST[k];if(!d.at)continue;const s=trTextSprite(d.k,d.m&&!d.duk);s.position.set(d.at[0],my(d.at[1]),.31);s.userData.f=d.duk?.62:.72;s.visible=false;G.scene.add(s);G.units['dn_'+k]={sp:s,text:d.k,color:'#dfe6ec',major:!d.duk}}}}
/* Zollverein hattı yaklaşık 3 piksel kalınlığında: iki piksel içindeki komşulara bakılır */
const ZVN=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if((dx||dy)&&Math.abs(dx)+Math.abs(dy)<=2)ZVN.push({dx,dy});
const deHx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function deParcelPaint(force){if(!S||!DE()||!S.A)return;
  const pc=G.dpc;if(pc){const st=DORD.map(k=>deStat(k)),zv=DORD.map(k=>deZV(k)),sig=st.join(',')+'|'+zv.join('');
    if(force||pc.sig!==sig){pc.sig=sig;const col=st.map(s=>deHx(DSC[s][0])),D=pc.im.data,W=pc.W,N=W*pc.H,cell=pc.cell;
      for(let k=0;k<N;k++){const c=cell[k],o=k*4;if(c<0||st[c]==='none'){D[o+3]=0;continue}
        /* Zollverein sınırı: üye parselin üye olmayan komşusu (ya da kıyısı) — Raab'ın 1860'lar Orta Avrupa haritasındaki pembe hat */
        if(zv[c]){let out=false;for(const q of ZVN){const x=cell[k+q.dx+q.dy*W];if(x===undefined||x<0||!zv[x]||st[x]==='none'){out=true;break}}
          if(out){D[o]=232;D[o+1]=122;D[o+2]=154;D[o+3]=235;continue}}
        const e=pc.edge[k];
        if(e!==-2&&!(e>=0&&st[e]==='none')){const same=e>=0&&st[e]===st[c];D[o]=236;D[o+1]=230;D[o+2]=210;D[o+3]=e<0?150:same?(st[c]==='pru'?40:110):200}
        else{const b=col[c];D[o]=b[0];D[o+1]=b[1];D[o+2]=b[2];D[o+3]=st[c]==='pru'?215:195}}
      pc.ctx.putImageData(pc.im,0,0);pc.tex.needsUpdate=true}}
  const ep=G.epc;if(ep){const st=EORD.map(k=>deEUStat(k)),sig=st.join(',');
    if(force||ep.sig!==sig){ep.sig=sig;const vis=EORD.map((k,i)=>st[i]!==EBASE[k]),col=st.map(s=>deHx(s==='PAP'?'#e6dcb8':TRBC[s]||TRBC.NEU)),D=ep.im.data,N=ep.W*ep.H;
      for(let k=0;k<N;k++){const c=ep.cell[k],o=k*4;if(c<0||!vis[c]){D[o+3]=0;continue}const e=ep.edge[k];
        if(e!==-2&&!(e>=0&&st[e]===st[c])){D[o]=236;D[o+1]=230;D[o+2]=210;D[o+3]=150}else{const b=col[c];D[o]=b[0]*.92;D[o+1]=b[1]*.92;D[o+2]=b[2]*.92;D[o+3]=238}}
      ep.ctx.putImageData(ep.im,0,0);ep.tex.needsUpdate=true}}}
function dePick(pc,lon,lat){if(!pc)return -1;const i=Math.floor((lon-pc.x0)/(pc.x1-pc.x0)*pc.W),j=Math.floor((pc.y1-my(lat))/(pc.y1-pc.y0)*pc.H);
  if(!(i>=0&&i<pc.W&&j>=0&&j<pc.H))return -1;const c=pc.cell[j*pc.W+i];return c>=0?c:-1}
function deParcelAt(lon,lat){if(!DE())return null;const c=dePick(G.dpc,lon,lat);if(c<0)return null;const k=DORD[c];if(deStat(k)==='none')return null;return k==='NSC'?'SCH':k}
/* 1862 bölgeleri: basılı tutunca o bölgenin o günkü sahibinin paneli açılır */
function deRegionAt(lon,lat){if(!DE())return null;const c=dePick(G.epc,lon,lat);if(c<0)return null;const k=EORD[c],s=deEUStat(k);if(s===EBASE[k])return null;return {k,s}}{const _p=trAddParcels;window.trAddParcels=trAddParcels=function(w,f){if(G.de)return deAddParcels(w,f);return _p(w,f)}}
{const _r=refreshUnitsDE;refreshUnitsDE=function(){_r();deParcelPaint()}}
{const _f=frame;frame=function(dt){if(G.ok&&G.units){const on=DE()&&!S.setup,d=G.C.d;for(const k in G.units){if(k.slice(0,3)!=='dn_')continue;const u=G.units[k];u.sp.visible=on&&(u.major?d<34:d<20)}}return _f(dt)}}

/* ---------- savaş: devletlerin safı ---------- */
{const _a=window.deAustria;window.deAustria=function(){const s=deSides(),pro=Object.keys(s).filter(k=>s[k]==='pru'&&DST[k].lean<50),con=Object.keys(s).filter(k=>s[k]==='avy'&&DST[k].lean>=50);
  const r=_a.apply(this,arguments),av=Object.keys(s).filter(k=>s[k]==='avy'&&DST[k].m).map(k=>DST[k].n.split(' ')[0]);
  return r+(av.length?` Avusturya safında: ${deList(av)}.`:' Orta devletlerin hiçbiri Avusturya\'nın yanında değil.')+(pro.length?` ${deList(pro.map(k=>DST[k].n))} bu kez Prusya\'nın yanında.`:'')+(con.length?` ${deList(con.map(k=>DST[k].n))} Avusturya\'ya kaydı.`:'')}}
{const _w=deWar;deWar=function(vs,bonus){if(vs!=='aus'||!S.A)return _w(vs,bonus);const s=(S.ds&&S.ds.s66)||deSides();let b=0;const pro=[],con=[];
  for(const k in s){const d=DST[k],hist=d.lean>=50?'pru':'avy';if(s[k]===hist)continue;if(s[k]==='pru'){b+=d.ar*.18;pro.push(d.n.split(' ')[0])}else{b-=d.ar*.18;con.push(d.n.split(' ')[0])}}
  b=Math.max(-12,Math.min(12,b));const W=_w(vs,(bonus||0)+b);
  if(pro.length)W.notes.push(`${deList(pro)} orduları Prusya\'nın yanında yürüdü; Avusturya\'nın Alman müttefikleri eksik kaldı.`);
  if(con.length)W.notes.push(`${deList(con)} Avusturya\'nın yanında savaştı; kuzeyde ikinci bir cephe açıldı.`);
  return W}}
/* ilhak listesi: Prusya safında savaşan devlet ilhak edilmez */
{const d=DEC.b_ilhak;if(d){const w0=d.when,o0=d.opts,NM={HAN:['Hannover',"'ı"],HKS:['Hessen-Kassel',"'i"],NAS:['Nassau',"'yu"],FRK:['Frankfurt',"'u"]};
  const ann=()=>Object.keys(NM).filter(k=>((S.ds&&S.ds.s66)||{})[k]!=='pru');
  d.when=()=>w0()&&ann().length>0;
  {const t0=d.text;if(typeof t0==='string')Object.defineProperty(d,'text',{configurable:true,get:()=>ann().includes('HAN')?t0:t0.replace(/ Hannover bir krallık;[^.]*\./,'')})}
  d.opts=()=>{const L=o0(),a=ann();if(a.length===4)return L;const nm=a.map(k=>NM[k][0]),sp=Object.keys(NM).filter(k=>!a.includes(k)).map(k=>NM[k][0]),num=['','Bir','İki','Üç','Dört'][a.length];
    L[0]=Object.assign({},L[0],{label:`${deList(nm)}${NM[a[a.length-1]][1]} ilhak et`,desc:a.includes('HAN')?L[0].desc:'Prusya toprağı büyür; Londra hoşlanmaz.',
      run:()=>{S.f.welf=1;return `${num} devlet haritadan silindi.${a.includes('HAN')?' Hannover Kralı Viyana\'ya sürgüne gitti.':''} ${deList(sp)} Prusya safında savaştığı için tahtını korudu.`}});return L}}}

/* ---------- devlet paneli ---------- */
function deDevActs(k){const d=DST[k],n=deN(),L=[],open=deIsLean(k)&&!S.f.kg&&S.dw!=='aus'&&!(deIK()&&n>=17),used=S.acted.dv;if(!open)return L;
  L.push({id:'elci',t:'Elçi ve nişan gönder',d:'Saraya Kara Kartal nişanı, bakanlara güvence.',cost:'Hazine −2',fx:'Eğilim +4–8',ok:!used&&S.h>=4,why:used?'Bu tur bir Alman devletiyle zaten uğraştın':'Hazine yetersiz'});
  if(d.zv&&n>=9)L.push({id:'zoll',t:'Zollverein\'de baskı kur',d:'Gümrük gelirinden payını tehdit et.',cost:'Avusturya şüphesi +3'+(d.sud?' · güneyin şüphesi +4':''),fx:'Eğilim +10',ok:!used,why:'Bu tur bir Alman devletiyle zaten uğraştın'});
  return L}
function deDevAct(k,id){const d=DST[k],x=deDevActs(k).find(a=>a.id===id);if(!x||!x.ok)return;S.acted.dv=1;const l=deDS().l;
  if(id==='elci'){const v=Math.round(R(4,8));S.h-=2;l[k]=cl(l[k]+v);note(d.n,`Elçi saraydan memnun döndü. Eğilim +${v}.`)}
  if(id==='zoll'){l[k]=cl(l[k]+10);deAdj({aus:{sus:3},...(d.sud?{sud:{sus:4}}:{})});note(d.n,'Gümrük konferansında bakanları köşeye sıkıştırdın. Viyana bunu not etti.')}
  deClamp()}
function vDevDE(){const k=U.dev,d=DST[k];if(!d)return win('Devlet','<p class="muted">Bilgi yok.</p>','closeSheet');
  const st=deStat(k),c=DSC[st],l=Math.round(deLean(k)),s66=S.ds&&S.ds.s66&&S.ds.s66[k],row=(a,b)=>`<div class="gl" style="display:flex;justify-content:space-between;gap:12px"><span class="muted">${a}</span><b style="text-align:right">${b}</b></div>`;
  const acts=deDevActs(k).map(x=>btn('ddv',k+':'+x.id,`<strong>${x.t}</strong><small>${x.d}</small><small>Maliyet: ${x.cost} · Etki: ${x.fx}</small>${x.ok?'':`<small style="color:var(--sov)">${x.why}</small>`}`,'opt',!x.ok)).join('');
  const lean=deIsLean(k)?`<div class="stack"><p class="eyebrow">Prusya'ya eğilim</p>${deBar(s66?'Savaş anındaki eğilim':'Eğilim',l,l>=50?'brass':'warn')}
    <small class="muted">${s66?`Avusturya savaşında ${s66==='pru'?'Prusya':'Avusturya'}'nın safında savaştı.`:`Bugün Avusturya'yla savaş çıksa <b>${l>=50?'Prusya':'Avusturya'}</b>'nın safında olur (50 ve üstü Prusya).`}${d.sud?' Güney devletlerinin eğilimi Güney Alman devletleriyle dostluğuna da bağlı.':d.m?' Orta devletlerin eğilimi Alman kamuoyuyla birlikte değişir.':''}</small></div>`:'';
  return win(d.n,`<div style="display:flex;gap:10px;align-items:center;border-bottom:2px solid ${c[0]};padding-bottom:8px"><span style="width:38px;height:38px;flex:0 0 38px;border-radius:6px;background:${c[0]}"></span><div><b>${c[1]}</b><br><small class="muted">${d.r()} · ${d.cap}</small></div></div>
    <p>${d.d}</p>
    <div class="stack">${row('Nüfus','~'+String(d.pop).replace('.',',')+' milyon')}${d.ar?row('Ordu (1866)','~'+(d.ar*1000).toLocaleString('tr-TR')+' asker'):''}${row('Zollverein',deZV(k)?'Üye':'Dışında')}</div>
    ${lean}${acts?`<div class="stack"><p class="eyebrow">Neler yapabilirsin</p>${acts}</div>`:''}
    ${d.sud?btn('dipc','sud','Güney Alman devletleriyle ilişkiler ›','ghost'):''}${btn('sheet','dip','‹ Diplomasi','ghost')}
    <p class="muted" style="font-size:.8em">Sınırlar bugünkü ilçelerin 1862 sahiplerine göre birleştirilmesiyle çizildi; küçük sapmalar olabilir. © GeoBasis-DE / BKG 2021 (dl-de/by-2-0), geoBoundaries, Natural Earth.</p>`,'closeSheet')}
{const _v=vDipDE;vDipDE=function(){const h=_v();
  const rows=DORD.filter(k=>DST[k]).map(k=>{const d=DST[k],st=deStat(k);return btn('devlet',k,`<span style="display:flex;gap:9px;align-items:center"><span style="width:14px;height:14px;flex:0 0 14px;border-radius:3px;background:${DSC[st][0]}"></span><span style="flex:1"><strong style="display:block">${d.n}</strong><small style="display:block">${DSC[st][1]}${deIsLean(k)&&!S.f.kg?' · Eğilim '+Math.round(deLean(k)):''}</small></span></span>`,'opt')}).join('');
  const sec=`<div class="stack"><p class="eyebrow">Alman devletleri</p><p class="say" style="margin:0"><b>Taraf</b>Avusturya'yla savaş çıktığında Prusya'ya eğilimi 50 ve üstünde olan devletler senin, altında olanlar Avusturya'nın safında savaşır. Haritada bir devlete basılı tutarak da paneline ulaşabilirsin.</p>${rows}</div>`;
  return h.replace(/<\/div><\/div>$/,sec+'</div></div>')}}
{const _v=vSheet;vSheet=function(){if(DE()&&U.sheet==='devlet')return vDevDE();return _v()}}
{const _a=act;act=function(a,arg){if(DE()&&!S.setup){
    if(a==='devlet'){U.sheet='devlet';U.dev=arg;return ui()}
    if(a==='ddv'){const [k,id]=String(arg).split(':');deDevAct(k,id);return ui()}}
  return _a(a,arg)}}
{const _i=deInit;deInit=function(){_i();S.ds=null;deDS()}}

/* ---------- askerî ataşe: niyet okuma ----------
   Ataşen yokken büyük güçlerin şüphesini yalnızca tahmini görürsün (her tur değişen ±12'lik sapma).
   Ataşe dört tur görevde kalır: şüphe kesin görünür, "bugün savaş çıksa" sorusunun cevabı verilir; o ülkeyle savaşırsan ordunun dağılımı bilinir. */
const DBIG=['aus','fra','rus','ing'];
/* yönelme eki: son ünlüye göre 'ya' / 'ye' (Fransa'ya, İngiltere'ye) */
const deYa=w=>{const v=(w.match(/[aeıioöuüAEIİOÖUÜ]/g)||['a']).pop();return w+(/[eiöüEİÖÜ]/.test(v)?'\'ye':'\'ya')};
const deAtt=a=>!!(S.att&&S.att[a]>=deN());
function deSusSeen(a){const A=S.A&&S.A[a];if(!A)return 0;if(!DBIG.includes(a)||deAtt(a))return A.sus;
  const n=deN(),h=Math.sin((a.charCodeAt(0)*31+a.charCodeAt(1)*7+n*13.7))*10000,z=(h-Math.floor(h))*2-1;return cl(Math.round(A.sus+z*12))}
const deSusTxt=a=>DBIG.includes(a)&&!deAtt(a)?'≈'+Math.round(deSusSeen(a)):String(Math.round(S.A[a].sus));
function deAttLine(a){if(!DBIG.includes(a))return '';const n=deN();
  if(!deAtt(a))return `<small class="muted">Şüphe tahminidir; gerçek değer ±12 sapabilir. Kesin bilgi için askerî ataşe gönder.</small>`;
  const would=deCap(a)>=50&&S.A[a].sus>=60;
  return `<small><b>Ataşe raporu</b> (${S.att[a]-n+1} tur daha): bugün savaş çıksa ${DEN[a]} ${would?'<b style="color:var(--sov)">yarı yarıya araya girer</b>':'araya <b>girmez</b>'}${S.f['ult_'+a]>=n?'; ültimatomdan beri hazırlanıyor':''}.</small>`}
{const _da=deActs;deActs=function(a){const L=_da(a);if(!DBIG.includes(a))return L;S.att=S.att||{};const n=deN(),on=deAtt(a);
  L.splice(2,0,{id:'attache',t:'Askerî ataşe gönder',d:'Kurmaydan bir subay elçiliğe; ordunun ve sarayın havasını yazar.',cost:'Hazine −1 · şüphe +2',fx:'4 tur boyunca şüphe kesin görünür; bu ülkeyle savaşta küçük üstünlük',ok:!on&&S.h>=3,why:on?'Ataşe zaten görevde':'Hazine yetersiz'});return L}}

/* ---------- ültimatomlar: şüphe 75'i aşınca ve gücü yetince gelir ---------- */
const DULT={
 aus:{t:'Avusturya notası',fly:[16.37,48.2,14],
  text:()=>S.f.kondo&&!S.f.kg?'Viyana\'nın elçisi Kont Károlyi bir nota getirdi: Prusya Holstein\'daki kışkırtmalara son verecek, seferberlik hazırlıklarını durduracak ve dukalıklar meselesini Konfederasyon Meclisi\'ne bırakacak. Cevap için kırk sekiz saat var.':'Viyana\'nın elçisi Kont Károlyi bir nota getirdi: Prusya Konfederasyon kararlarına uyacak ve küçük devletler üzerindeki baskısına son verecek. İmparator cevap bekliyor.',
  part:['Kısmi taviz: Holstein\'da ve Frankfurt\'ta sükûnet sözü ver','Sözle yetinir; Kral bunu geri adım sayar.',{s:-4},'Károlyi sözü not etti. Viyana şimdilik yetiniyor.'],
  full:['Notayı tamamen kabul et','Seferberlik durur; ordu hoşnutsuz, milliyetçiler seni affetmez.',{s:-8,g:-10,o:-3},()=>{S.ord.sefer=0;return 'Seferberlik hazırlıkları durduruldu. Roon odasına kapandı.'}]},
 fra:{t:'Fransız notası',fly:[2.35,48.85,14],
  text:()=>'Fransız elçisi Benedetti bir nota getirdi: Prusya güney devletleriyle askerî bağlarını gevşetecek ve Ren sınırında Fransa\'nın "meşru kaygılarını" tanıyacak. III. Napolyon cevabı Saint-Cloud\'da bekliyor.',
  part:['Kısmi taviz: Ren\'de "dostane görüşme" sözü ver','Belirsiz bir vaat; Paris bunu not eder ve bir gün hesabını sorar.',{g:-3},()=>{S.f.uvaat=(S.f.uvaat||0)+1;return 'Benedetti memnun ayrıldı. Elinde bir söz var; ne olduğu belli olmayan bir söz.'}],
  full:['Notayı kabul et','Fransa sakinleşir, Almanya öfkelenir.',{g:-12,s:-5},()=>{if(S.f.guney){S.f.guney=0;deAdj({sud:{f:-8}});return 'Güney devletleriyle askerî sözleşmeler askıya alındı. Münih rahatladı, Berlin öfkeli.'}return 'Berlin, Fransa\'nın "meşru kaygılarını" tanıdığını açıkladı. Basın bunu Olmütz\'e benzetiyor.'}]},
 ing:{t:'İngiliz notası',fly:[-.1,51.5,14],
  text:()=>'İngiliz elçisi Londra\'nın notasını getirdi: '+(S.dw==='dk'?'Prusya Danimarka\'daki ilerleyişini durduracak ve Londra Konferansı\'nın kararına uyacak.':'Prusya, Belçika\'nın ve Lüksemburg\'un tarafsızlığına saygı gösterdiğini yazılı olarak teyit edecek; aksi halde İngiltere "hareket serbestliğini geri alır".'),
  part:['Kısmi taviz: konferans masasına otur','Zaman kazanırsın; ordu bekler.',{t:-4},'Londra konferans önerisini olumlu karşıladı.'],
  full:['Notayı kabul et','Ordu ve kamuoyu hoşnutsuz; Paris de cevabını okur.',{g:-6,s:-3},()=>{if(S.dw==='dk'){S.f.dkb=0;return 'Ordu Eider hattında durduruldu. Wrangel istifasını yolladı.'}return 'Yazılı güvence Londra\'ya gönderildi. Times olumlu yazdı.'}]},
 rus:{t:'Rus notası',fly:[30.3,59.9,14],
  text:()=>'Rus elçisi Oubril, Gorçakov\'un notasını getirdi: Prusya Polonya meselesinde Batı\'yla aynı safa geçmeyecek ve Rusya\'nın Karadeniz isteklerine karşı çıkmayacak.',
  part:['Kısmi taviz: Polonya sınırında ortak denetim sözü','Petersburg yatışır; Londra ve Paris homurdanır.',{dip:{ing:{sus:3},fra:{sus:3}}},'Gorçakov sözü yeterli buldu.'],
  full:['Notayı kabul et','Rusya\'yla bağın güçlenir; liberaller ve Batı tepki gösterir.',{g:-6,dip:{ing:{sus:6},fra:{sus:6}}},()=>'Gorçakov memnun. Londra\'da Prusya\'nın "Çar\'ın jandarması" olduğu yazılıyor.']}};
{const o={};for(const a of DBIG){const u=DULT[a],rv=DRIV[a],res=x=>typeof x==='function'?x():x;
  o['u_'+a]={title:u.t,h:4,art:'elci',fly:u.fly,get text(){return u.text()},sh:['Reddet','Kısmi taviz','Destek iste','Kabul'],
   quotes:{roon:'Taviz verirsek ordu bunu unutmaz.',moltke:'Hazır değilsek zaman kazanmak da bir zaferdir.',bleich:'Borsa bir savaş daha kaldırmaz; bir kapı açık bırakın.',bucher:'Notayı basına nasıl anlatacağımızı şimdiden düşünelim.'},
   opts:()=>[
    {label:'Notayı reddet',desc:`Onurlu duruş. ${DEN[a]} hazırlığa geçer; bir savaşta karşına çıkma ihtimali yüksek kalır.`,lean:'hawk',eff:{s:3,t:6,dip:{[a]:{f:-8,sus:8}}},run:()=>{S.f['ult_'+a]=deN()+4;return `Ret cevabı gönderildi. ${({aus:'Avusturya',fra:'Fransız',rus:'Rus',ing:'İngiliz'})[a]} elçisi Wilhelmstrasse\'den selam vermeden çıktı.`}},
    {label:u.part[0],desc:u.part[1],lean:'mid',eff:Object.assign({dip:{[a]:{sus:-25,f:4}}},u.part[2],u.part[2].dip?{dip:Object.assign({[a]:{sus:-25,f:4}},u.part[2].dip)}:{}),run:()=>res(u.part[3])},
    {label:`${DEN[rv]}\'dan destek iste`,desc:S.A[rv].f>=50?`${DEN[rv]} ile aran iyi; araya girebilir.`:`${DEN[rv]} ile aran zayıf; destek gelmeyebilir.`,lean:'dove',eff:{},run:()=>{if(S.A[rv].f>=50){deAdj({[a]:{sus:-20},[rv]:{f:3,sus:3}});return `${DEN[rv]} ${deYa(DEN[a])} bir uyarı notası gönderdi. Baskı hafifledi.`}deAdj({[a]:{sus:5}});return `${DEN[rv]} çekimser kaldı. ${DEN[a]} yalnız olduğunu gördü.`}},
    {label:u.full[0],desc:u.full[1],lean:'dove',eff:Object.assign({dip:{[a]:{sus:-45,f:10}}},u.full[2],u.full[2].dip?{dip:Object.assign({[a]:{sus:-45,f:10}},u.full[2].dip)}:{}),run:()=>res(u.full[3])}]}}
 deDec(o)}
{const _s=deStartDay;deStartDay=function(){const r=_s.apply(this,arguments);if(!DE()||S.setup)return r;const n=deN();
  for(const a of DBIG){const A=S.A[a];if(S.dw===a||A.sus<75||deCap(a)<45||n-(S.f['ultn_'+a]===undefined?-9:S.f['ultn_'+a])<5)continue;
    S.f['ultn_'+a]=n;delete S.done['u_'+a];deNow('u_'+a);break}
  return r}}
/* savaşta: ataşe raporu ve ültimatomdan beri hazırlanan rakip */
{const _w=deWar;deWar=function(vs,bonus){let b=bonus||0;const pre=[];
  if(S.att&&S.att[vs]>=deN()){b+=4;pre.push(`Ataşe raporları sayesinde ${DEN[vs]} ordusunun dağılımı biliniyordu.`)}
  if(S.f['ult_'+vs]>=deN()){b-=5;pre.push(`${DEN[vs]} ültimatomun reddinden beri hazırlanıyordu.`)}
  const W=_w(vs,b);if(pre.length)W.notes.unshift(...pre);return W}}
{const _a=act;act=function(a,arg){if(DE()&&!S.setup&&a==='ddipa'){const [x,id]=String(arg).split(':');
    if(id==='attache'){S.att=S.att||{};if(deAtt(x)||S.h<3)return ui();S.h-=1;S.att[x]=deN()+3;deAdj({[x]:{sus:2}});note(DEN[x],'Askerî ataşe görevine başladı. İlk raporu bir hafta içinde gelecek.');return ui()}}
  return _a(a,arg)}}
/* ---------- hareket serbestisi ve Paris'in beklentisi ----------
   Kissinger: Prusya her büyük güce, onların birbirine olduğundan daha yakın durdukça desteğini en yüksek fiyata satabilir.
   Hareket serbestisi = büyük güçlere açık kalan kapıların ortalaması; bağlayıcı ittifaklar ve kalıcı düşmanlıklar kapı kapatır.
   Serbestlik yüksekse bir savaşta araya girme ihtimali düşer (deInterP, de62.js deWar'dan çağrılır).
   Paris'in beklentisi: Napolyon'a verilen belirsiz vaatlerin birikmiş borcu. Ödenmedikçe Fransa tarafsız kalır; 1866'dan sonra fatura gelir. */
function deNP(){if(!S.np)S.np={umut:0,last:-9,ul:-9,kapandi:0,odendi:0,aldatildi:0,sizdi:0};return S.np}
function deBek(){const f=S.f||{},np=deNP();if(np.kapandi||S.dw==='fra'||f.sedan||f.baris71)return 0;
  return cl((f.vaat===1?25:f.vaat===2?45:0)+(f.uvaat||0)*15+(f.belge?10:0)+(f.luxsoz?20:0)+np.umut*15)}
function deDoor(a){const A=S.A[a],f=S.f||{};let v=cl(((A.f-30)/30)*.5+((65-A.sus)/40)*.5,0,1);
  if(a==='fra'&&f.alsace===2)v=0;else if(a==='fra'&&f.alsace===1)v=Math.min(v,.15);
  if(a==='fra'&&deBek()>=25)v=Math.max(v,.5);
  if(a==='aus'&&f.sertbaris)v=Math.min(v,.2);
  return v}
function deHS(){let v=DBIG.reduce((t,a)=>t+deDoor(a),0)/DBIG.length*100;const f=S.f||{},pen=[];
  if(f.ausortak&&!f.kg){v-=10;pen.push('Avusturya\'yla ortaklık')}if(f.fraittifak){v-=15;pen.push('Fransa\'yla gizli antlaşma')}if(f.italya&&!f.kg){v-=5;pen.push('İtalya ittifakı')}
  return {v:cl(Math.round(v)),pen}}
const deDoorTxt=v=>v>=.66?'açık':v>=.33?'aralık':'kapalı';
function deInterP(a,vs){const hs=deHS().v;let p=.5+(50-hs)/150;
  if(a==='fra'&&vs!=='fra'&&deBek()>=25)p-=.2*Math.min(1,deBek()/60);
  return Math.max(.15,Math.min(.85,p))}
function deHSBlock(){const H=deHS(),doors=DBIG.map(a=>{const d=deDoor(a);return `<span style="color:${DCOL[a]}">${DEN[a]}</span> ${deDoorTxt(d)}`}).join(' · '),p=Math.round(.5*100+(50-H.v)/150*100);
  return `<div class="stack"><p class="eyebrow">Hareket serbestisi</p>${deBar('Açık kapılar',H.v,H.v>=60?'brass':H.v<35?'danger':'warn')}
    <small class="muted">${doors}${H.pen.length?' · bağlayan: '+H.pen.join(', '):''}</small>
    <p class="say" style="margin:0"><b>Kissinger</b>Bütün büyük güçlerle kapıyı açık tuttukça her biri senin ötekine kaymandan korkar; savaşta araya girmeye cesaret edemez. Şu an şüphesi yüksek bir gücün araya girme ihtimali yaklaşık <b>%${Math.max(15,Math.min(85,p))}</b>.</p></div>`}
function deBekBlock(){const b=deBek(),np=deNP();if(np.kapandi&&!b)return `<div class="stack"><p class="eyebrow">Paris'in beklentisi</p><small class="muted">${np.odendi?'Fatura ödendi; Paris bir şey beklemiyor.':np.aldatildi?'Paris aldatıldığını düşünüyor; beklenti öfkeye döndü.':'Artık bir beklenti yok.'}</small></div>`;
  return `<div class="stack"><p class="eyebrow">Paris'in beklentisi</p>${deBar('Birikmiş vaat',b,b>=60?'danger':b>=25?'warn':'')}
    <small class="muted">Verdiğin her belirsiz umut buraya yazılır. 25'in üstündeyken Fransa başka bir savaşta tarafsız kalmaya meyillidir. 1866'dan sonra 60'ı geçerse Paris faturayı ister.${S.f.belge?' Elinde Benedetti\'nin el yazısıyla bir taslak var.':''}</small></div>`}
{const _da=deActs;deActs=function(a){const L=_da(a);if(a!=='fra')return L;const np=deNP(),n=deN(),closed=np.kapandi||S.dw==='fra'||S.f.sedan;
  if(!closed)L.splice(2,0,{id:'umut',t:'Napolyon\'a tazminat umudu ver',d:'Belçika, Lüksemburg, Ren… Hiçbirini adıyla anma.',cost:'Paris\'in beklentisi +15',fx:'Şüphe −10 · dostluk +4',ok:n-np.ul>=3,why:'Üç turda bir; sık tekrarlanırsa inandırıcılığını yitirir'});
  if(S.f.belge&&!np.sizdi)L.splice(2,0,{id:'sizdir',t:'Benedetti\'nin taslağını Londra\'ya sızdır',d:'Fransa\'nın Belçika\'yı istediği, elçisinin el yazısıyla Times\'ta.',cost:'Fransa\'yla kapı kapanır',fx:'İngiltere şüphesi −15 · dostluk +8 · Paris\'in beklentisi sıfırlanır',ok:true});
  return L}}
{const _a=act;act=function(a,arg){if(DE()&&!S.setup&&a==='ddipa'){const [x,id]=String(arg).split(':'),np=deNP();
    if(x==='fra'&&id==='umut'){if(deN()-np.ul<3)return ui();np.ul=deN();np.umut++;deAdj({fra:{sus:-10,f:4}});note('Fransa','Benedetti\'ye "Kral\'ın gönlü ikna edilirse" dedin. Hiçbir yer adı geçmedi; Paris yine de not aldı.');return ui()}
    if(x==='fra'&&id==='sizdir'){if(!S.f.belge||np.sizdi)return ui();np.sizdi=1;np.kapandi=1;np.aldatildi=1;deAdj({ing:{sus:-15,f:8},fra:{sus:20,f:-15}});S.g=cl(S.g+5);note('Fransa','Taslak Times\'ta yayımlandı. Londra Fransa\'nın Belçika\'ya göz diktiğini kendi gözüyle gördü; Paris yalanlıyor ama el yazısı Benedetti\'nin.');return ui()}}
  return _a(a,arg)}}
/* mevcut gündemler: Lüksemburg ve Benedetti faturayı öder ya da Paris'i aldatır */
function deCheat(txt){const b=deBek(),np=deNP();if(b>0){deAdj({fra:{sus:Math.round(b/3),f:-Math.round(b/6)}});np.kapandi=1;np.aldatildi=1;return txt+' Biriken vaatler karşılıksız kaldı; Paris\'te beklenti öfkeye döndü.'}return txt}
{const d=DEC.b_luksemburg;if(d){const o0=d.opts;d.opts=()=>o0().map(x=>Object.assign({},x,{run:()=>{const r=x.run();if(/göz yum/i.test(x.label)){const np=deNP();np.kapandi=1;np.odendi=1;return r+' Paris\'in beklentisi karşılandı.'}return /savaş/i.test(x.label)?r:deCheat(r)}}))}}
{const d=DEC.b_benedetti;if(d){const o0=d.opts;d.opts=()=>o0().map(x=>Object.assign({},x,{run:()=>{const r=x.run();return /reddet/i.test(x.label)?deCheat(r):r}}))}}
/* 1866'dan sonra fatura: beklenti 60'ı geçince Benedetti gelir */
deDec({u_np:{title:'Paris faturayı hatırlatıyor',h:4,art:'elci',fly:[2.35,48.85,12],
  get text(){return `Benedetti yine kapıda. Biarritz'te söylenenleri, ültimatoma verilen cevabı, "Kral'ın gönlü ikna edilirse" sözlerini tek tek sayıyor. İmparator artık bir yer adı duymak istiyor.${S.f.belge?' Senin çekmecende ise onun el yazısıyla bir Belçika taslağı duruyor.':''}`},
  sh:['Lüksemburg','Oyala','Hiçbir şey','Sızdır'],
  quotes:{bucher:'Kâğıt bir gün lazım olur demiştim.',moltke:'Fransız ordusu yenilenmeden önce hesaplaşmak bizim yararımıza.',bleich:'Paris borsası bir sözle yatışır; bir sözü daha olsun.'},
  opts:()=>{const L=[
   {label:'Lüksemburg\'u konuşmaya hazır olduğunu söyle',desc:'Paris yatışır; mesele Lüksemburg krizine taşınır.',lean:'dove',eff:{dip:{fra:{sus:-10,f:5}}},run:()=>{S.f.luxsoz=1;deNP().umut=Math.max(0,deNP().umut-2);return 'Benedetti Paris\'e "Lüksemburg" kelimesini götürdü. İmparator\'un gözleri parladı.'}},
   {label:'Oyala: "Kral\'ı ikna etmem zaman alır"',desc:'Bir tur daha kazanırsın; borç büyür.',lean:'mid',eff:{dip:{fra:{sus:-4}}},run:()=>{deNP().umut++;return 'Benedetti yine eli boş ama umutlu döndü. Paris\'te sabır azalıyor.'}},
   {label:'"Ben hiçbir şey vaat etmedim"',desc:'Hesap kapanır; Fransa kandırıldığını düşünür.',lean:'hawk',eff:{t:5},run:()=>deCheat('Benedetti solgun bir yüzle çıktı.')}];
   if(S.f.belge&&!deNP().sizdi)L.push({label:'Benedetti\'nin Belçika taslağını Londra\'ya sızdır',desc:'İngiltere senin yanına geçer; Fransa\'yla kapı kapanır.',lean:'hawk',eff:{g:5,dip:{ing:{sus:-15,f:8}}},run:()=>{deNP().sizdi=1;return deCheat('Taslak Times\'ta yayımlandı.')}});
   return L}}});
{const _s=deStartDay;deStartDay=function(){const r=_s.apply(this,arguments);if(!DE()||S.setup)return r;const n=deN(),np=deNP();
  if(S.f.kg&&deBek()>=60&&n-np.last>=4&&!S.today.some(t=>t.id&&t.id.startsWith('u_'))){np.last=n;delete S.done.u_np;deNow('u_np')}
  return r}}
{const _v=vDipDE;vDipDE=function(){const h=_v();return h.replace('girerse oyun biter.</p>','girerse oyun biter.</p>'+deHSBlock())}}
{const _v=vDipcDE;vDipcDE=function(){const h=_v();if(U.dipc!=='fra')return h;return h.replace('<p class="eyebrow">Neler yapabilirsin</p>',deBekBlock().replace(/^<div class="stack">/,'').replace(/<\/div>$/,'')+'</div><div class="stack"><p class="eyebrow">Neler yapabilirsin</p>')}}
/* ---------- barış masası: 1866 (Nikolsburg–Prag) ve 1871 (Frankfurt) ----------
   Tek seçimli barış kararlarının yerine şartları tek tek seçtiğin masa. Her şartın Kral'a bir değeri ("kral"), yenilen için bir ağırlığı ("agir")
   ve kalıcı bir izi ("iz": o ülkenin öç defteri) vardır. Yenilenin kabul sınırı aşılırsa barış imzalanmaz; Kral'ın beklentisinin altında kalırsan güveni düşer.
   Kissinger: "Savaşlarını hazırlamada acımasız olduğu kadar onları sonuçlandırmada ılımlıydı." İzler hareket serbestisine ve epiloga yansır. */
const BM={
 '66':{t:'Barış masası · Nikolsburg',vs:'aus',who:'Avusturya',lim:()=>4+(S.f.italya?1:0),K:()=>4+(S.doc.bar==='sert'?2:0),
  hist:['cik','taz40','ven'],intro:'Avusturya heyeti karargâhta. Kral zaferin ödülünü istiyor, Fransız elçisi yolda, orduda kolera var. Şartları sen belirleyeceksin.',
  terms:[
   {id:'cik',t:'Avusturya Konfederasyon\'dan çekilir; Alman meselesi Prusya\'ya kalır',fix:1,kral:2,agir:0,d:'Barışın özü; bundan vazgeçilmez.'},
   {id:'taz20',grp:'taz',t:'Savaş tazminatı: 20 milyon taler',kral:1,agir:1,eff:{h:6},iz:{aus:3}},
   {id:'taz40',grp:'taz',t:'Savaş tazminatı: 40 milyon taler',kral:2,agir:2,eff:{h:12},iz:{aus:6}},
   {id:'ven',t:'Venedik İtalya\'ya bırakılır',req:()=>!!S.f.italya,kral:0,agir:1,eff:{dip:{ita:{f:12}}},d:'Müttefikine verdiğin söz. Dışarıda bırakırsan Floransa ihanete uğradığını söyler.'},
   {id:'sil',t:'Avusturya Silezyası ve Bohemya\'dan bir sınır şeridi',kral:3,agir:3,sert:1,eff:{o:2},iz:{aus:20,fra:6},d:'Kral\'ın en çok istediği. Viyana bunu bir kuşak unutmaz.'},
   {id:'sak',t:'Saksonya\'nın kuzeyini ilhak et',kral:2,agir:3,eff:{m:2},iz:{aus:8,fra:6},d:'Viyana, Saksonya\'nın bütünlüğünde ısrar ediyor.'},
   {id:'gec',t:'Viyana\'da zafer geçidi',kral:2,agir:2,sert:1,eff:{g:4,t:8},iz:{aus:10,fra:4},d:'Ordu istiyor; kolera ve Macaristan sıcağı da bekliyor.'},
   {id:'guney',grp:'sud',t:'Güney devletlerine hafif şartlar',kral:-1,agir:0,eff:{dip:{sud:{f:8,sus:-6}}},d:'Bavyera ve Württemberg\'le gizli ittifakın kapısı açık kalır.'},
   {id:'gtaz',grp:'sud',t:'Bavyera ve Württemberg\'den toprak ve tazminat',kral:2,agir:0,eff:{h:6,dip:{sud:{f:-12,sus:10}}},d:'Hazine dolar; güney Paris\'e bakar.'}]},
 '71':{t:'Barış masası · Versay',vs:'fra',who:'Fransa',lim:()=>7+(S.f.halksavasi?0:1),K:()=>5+(S.doc.bar==='sert'?1:0),
  hist:['taz5','als','lor','isg','gec','bel'],intro:'Thiers ve Favre karşında. Maliye bir milyar taler, Moltke Metz\'i, kamuoyu Alsace\'ı istiyor. Thiers ise yalnızca Belfort için yalvarıyor.',
  terms:[
   {id:'taz2',grp:'taz',t:'Tazminat: 2 milyar frank',kral:1,agir:1,eff:{h:12},iz:{fra:5}},
   {id:'taz5',grp:'taz',t:'Tazminat: 5 milyar frank',kral:2,agir:2,eff:{h:25},iz:{fra:10},d:'Bleichröder: "Öderler; Rothschild bulur."'},
   {id:'als',t:'Alsace (Strazburg dahil)',kral:3,agir:2,sert:1,eff:{o:2,g:6},iz:{fra:25},d:'Kamuoyu bunu bekliyor. Fransa ise asla unutmayacak.'},
   {id:'lor',t:'Metz ve Lorraine\'in bir bölümü',req:sel=>!!sel.als,kral:2,agir:2,sert:1,eff:{o:3},iz:{fra:20},d:'Moltke: "Metz yüz bin asker eder." Fransızca konuşan bir şehir.'},
   {id:'bel',t:'Belfort Fransa\'da kalsın',kral:-1,agir:-1,iz:{fra:-3},d:'Thiers\'in tek ricası. Karşılığında Paris\'te kısa bir geçide razı.'},
   {id:'isg',t:'Tazminat ödenene kadar kuzey Fransa\'da işgal ordusu',kral:1,agir:1,eff:{h:-4},iz:{fra:5}},
   {id:'gec',t:'Paris\'te zafer geçidi',kral:2,agir:1,eff:{g:3},iz:{fra:8}}]}};
const deBM=()=>S.bm&&BM[S.bm.k];
function deBMok(t,sel){return !t.req||t.req(sel)}
function deBMsum(){const B=deBM(),sel=S.bm.sel;let kral=0,agir=0;for(const t of B.terms)if(sel[t.id]&&deBMok(t,sel)){kral+=t.kral;agir+=t.agir}return {kral,agir,lim:B.lim(),K:B.K()}}
function deBMopen(k){if(S.bm&&!S.bm.done)return;const B=BM[k],sel={};for(const t of B.terms)if(t.fix)sel[t.id]=1;S.bm={k,sel,spd:S.speed,red:0};S.speed=0;U.sheet='baris'}
const deBarT=(l,t,v,cls)=>`<div class="gl" style="display:flex;justify-content:space-between"><span>${l}</span><b>${t}</b></div><div class="bar ${cls||''}"><i style="width:${cl(v)}%"></i></div>`;
function vBarisDE(){const B=deBM();if(!B)return win('Barış','<p class="muted">Masa kapandı.</p>','closeSheet');const sel=S.bm.sel,Sm=deBMsum(),off=t=>t.sert&&S.doc.bar==='ilimli';
  const rows=B.terms.filter(t=>deBMok(t,sel)||sel[t.id]).map(t=>{const on=!!sel[t.id],ok=deBMok(t,sel);
    const tag=[t.kral?`Kral ${t.kral>0?'+':''}${t.kral}`:'',t.agir?`${B.who} için ağırlık ${t.agir>0?'+':''}${t.agir}`:'',t.iz?Object.entries(t.iz).filter(([a,v])=>v>0).map(([a,v])=>`${DEN[a]} öç defteri +${v}`).join(' · '):'',off(t)?'<span style="color:var(--sov)">doktrinine aykırı</span>':''].filter(Boolean).join(' · ');
    return btn('btg',t.id,`<span style="display:flex;gap:10px;align-items:flex-start"><b style="font-size:1.2em;line-height:1">${on?'☑':'☐'}</b><span style="display:block;text-align:left"><strong style="display:block">${t.t}</strong>${t.d?`<small style="display:block">${t.d}</small>`:''}<small class="muted" style="display:block">${tag}</small></span></span>`,on?'opt sel':'opt',!!t.fix||!ok)}).join('');
  const kralTxt=Sm.kral>=Sm.K+2?'memnun':Sm.kral>=Sm.K?'razı':'"utanç verici barış" diyecek',kabul=Sm.agir<=Sm.lim;
  return win(B.t,`<p>${B.intro}</p>
   <div class="stack">${deBarT('Kral\'ın beklentisi',Sm.kral+' / '+Sm.K,Math.min(100,Sm.kral/Math.max(1,Sm.K)*70),Sm.kral>=Sm.K?'brass':'danger')}<small class="muted">Seçtiklerin Kral'a ${Sm.kral} değerinde: Kral ${kralTxt}.</small>
   ${deBarT(B.who+'\'nın kabul sınırı',Sm.agir+' / '+Sm.lim,Math.min(100,Sm.agir/Math.max(1,Sm.lim)*80),kabul?'':'danger')}<small class="muted">Şartların ağırlığı ${Sm.agir}: ${kabul?B.who+' imzalar.':B.who+' bu şartları kabul etmez'+(S.bm.k==='66'?'; Fransa arabulucu olarak araya girer.':'; savaş uzar.')}</small></div>
   <div class="stack"><p class="eyebrow">Şartlar</p>${rows}</div>
   <p class="say" style="margin:0"><b>Kissinger</b>Bismarck savaşlarını acımasızca hazırladı ama ılımlı bitirdi. Bugün koparılan her şart, yarın kapanan bir kapıdır.</p>
   ${btn('bimza',null,'Barışı imzala','go')}`,null)}
function deBMsign(){const B=deBM(),sel=S.bm.sel,Sm=deBMsum(),k=S.bm.k,L=[];
  if(Sm.agir>Sm.lim){
    if(k==='66'){fx({s:-4,dip:{fra:{sus:15}}});for(const id in sel)if(!['cik','taz20','ven','guney'].includes(id))delete sel[id];sel.taz20=1;L.push('Avusturya şartları reddetti. Benedetti karargâha geldi ve III. Napolyon\'un arabuluculuğunu dayattı: barışı Paris yazdırdı.');S.f.frarabulucu=1}
    else{S.bm.red++;fx({h:-5,t:4});note('Barış masası','Thiers şartları reddetti; savaş bir hafta daha sürüyor. Şartları hafiflet ya da bedelini öde.');return}}
  const iz=S.iz||(S.iz={});let offn=0;
  for(const t of B.terms){if(!sel[t.id]||!deBMok(t,sel))continue;if(t.eff)fx(t.eff);if(t.iz)for(const a in t.iz){iz[a]=(iz[a]||0)+t.iz[a];if(t.iz[a]>0)deAdj({[a]:{f:-t.iz[a],sus:Math.round(t.iz[a]/2)}})}if(t.sert&&S.doc.bar==='ilimli')offn++}
  const S2=deBMsum();if(S2.kral<S2.K){fx({s:-(S2.K-S2.kral)*3,saray:4});L.push('Kral pusulasına "utanç verici barış" yazdı.')}else if(S2.kral>=S2.K+2){fx({s:4});L.push('Kral memnun; seni yanına çağırıp elini sıktı.')}
  if(offn){fx({s:-3*offn});L.push('Doktrinine aykırı şartlar sarayda konuşuluyor.')}
  if(k==='66'){if(sel.sil||sel.gec)S.f.sertbaris=1;if(S.f.italya&&!sel.ven){deAdj({ita:{f:-20,sus:10}});L.push('Floransa Venedik\'in masada unutulduğunu öğrendi.')}
    L.splice(Sm.agir>Sm.lim?1:0,0,sel.sil?'Prag Barışı: Avusturya Almanya\'dan çekildi ve sınır şeridini bıraktı.':'Prag Barışı: Avusturya Almanya\'dan çekildi; toprak vermedi.')}
  else{S.f.baris71=1;S.f.alsace=sel.als?(sel.lor?2:1):0;S.dw=null;if(!sel.als){fx({g:-10,s:-5});L.push('Berlin\'de gazeteler Alsace\'sız barışı ihanet sayıyor.')}
    L.unshift(sel.als?(sel.lor?'Frankfurt Barışı: Alsace ve Metz Almanya\'ya geçti.':'Frankfurt Barışı: Alsace Almanya\'ya geçti; Metz Fransız kaldı.'):'Frankfurt Barışı: Fransa sınırını korudu.')}
  const hist=B.hist.filter(id=>B.terms.some(t=>t.id===id&&deBMok(t,sel))),same=hist.every(id=>sel[id])&&Object.keys(sel).every(id=>hist.includes(id));
  if(!same&&S.div)S.div.push({d:deN(),what:'Barış şartlarını farklı belirledin.',real:k==='66'?'Avusturya toprak vermedi, Almanya\'dan çekildi, tazminat ödedi; Venedik İtalya\'ya geçti.':'Alsace, Metz\'le Lorraine\'in bir bölümü, beş milyar frank, işgal ve Paris\'te geçit; Belfort Fransa\'da kaldı.'});
  S.speed=S.bm.spd||1;S.bm.done=1;S.bm=null;U.sheet=null;deClamp();norm();note('Barış',L.join(' '));checkEnd();if(S.end)S.pops=[{type:'end'}]}
for(const [id,k] of [['b_nikolsburg','66'],['b_baris71','71']]){const d=DEC[id];if(!d)continue;
  d.sh=['Masaya otur'];d.opts=()=>[{label:'Barış masasına otur',desc:'Şartları tek tek sen seçeceksin.',lean:'mid',eff:{},run:()=>{deBMopen(k);return 'Heyetler masaya oturdu.'}}];
  if(typeof RECS!=='undefined')RECS[id]=Object.fromEntries(Object.keys(RECS[id]||{}).map(a=>[a,0]))}
{const _v=vSheet;vSheet=function(){if(DE()&&S.bm&&!S.bm.done)return vBarisDE();return _v()}}
{const _u=ui;ui=function(){if(DE()&&S.bm&&!S.bm.done&&!(S.pops&&S.pops.length)){U.sheet='baris';S.speed=0}return _u()}}
{const _a=act;act=function(a,arg){if(DE()&&S.bm&&!S.bm.done){
    if(a==='btg'){const B=deBM(),t=B.terms.find(x=>x.id===arg);if(!t||t.fix)return ui();const sel=S.bm.sel;if(sel[arg])delete sel[arg];else{if(t.grp)for(const x of B.terms)if(x.grp===t.grp)delete sel[x.id];sel[arg]=1}
      for(const x of B.terms)if(sel[x.id]&&!deBMok(x,sel))delete sel[x.id];return ui()}
    if(a==='bimza'){deBMsign();return ui()}
    if(a==='closeSheet'||a==='sheet'||a==='speed')return ui()}
  return _a(a,arg)}}

/* ---------- epilog: bıraktığın Avrupa ---------- */
function deLegacy(){const H=deHS().v,iz=S.iz||{},grudge=Math.max(0,iz.fra||0)+Math.max(0,iz.aus||0)*.8+(S.f.alsace===2?20:S.f.alsace===1?8:0)+(S.f.sertbaris?12:0);
  const closed=DBIG.filter(a=>deDoor(a)<.33).map(a=>DEN[a]);return {v:cl(Math.round(H*.6+40-grudge*.5)),closed}}
function deLegacyBlock(){const L=deLegacy(),v=L.v;
  const txt=v>=65?'Esnek bir düzen bıraktın. Yeni Almanya hâlâ herkesle konuşabiliyor; halefin seninki kadar usta olmasa da kapılar açık.':v>=40?'Ayakta duran ama gergin bir düzen. Bazı kapılar kapandı; dengeyi tutmak her kuşakta yeni bir usta gerektirecek.':'Kemikleşmiş bir düzen. Kapattığın kapılar Avrupa\'yı Almanya\'ya karşı birleşmeye itiyor; koalisyon kâbusu artık bir ihtimal değil, bir takvim meselesi.';
  return `<p class="eyebrow">Bıraktığın Avrupa</p>${deBar('Düzenin esnekliği',v,v>=65?'brass':v<40?'danger':'warn')}<p>${txt}</p>${L.closed.length?`<p class="muted">Kapanan kapılar: ${deList(L.closed)}.</p>`:''}`}
{const _v=vEndDE;vEndDE=function(){const h=_v();return h.replace('<p class="eyebrow">Açılan dosya</p>',deLegacyBlock()+'<p class="eyebrow">Açılan dosya</p>')}}
/* ---------- kısalık: 28 mevsim 18 turda, üç perde ----------
   İçerik eski 28'lik sayaca (deN) bağlı kalır; sakin mevsimlerde saat bir gün daha ileri sarılır, böylece bütün tarih koşulları geçerli kalır.
   Her turun tarihî gündemleri elle seçildi (en fazla iki; Lüksemburg yılında üç). Atmosfer gündemleri çıkarıldı. */
const DSTART=[1,2,4,5,7,9,11,13,14,15,16,17,18,20,22,24,26,27];
const DPERDE={1:['I','Danimarka','1862–64'],9:['II','Avusturya','1864–66'],17:['III','Fransa','1866–71']};
{const plan={1:['b_butce','b_kanvedemir'],2:['b_karolyi','b_polonya'],4:['b_frankfurt'],5:['b_danimarka','b_savas64'],7:['b_duppel','b_londra'],
  9:['b_augustenburg','b_subat'],11:['b_schonbrunn','b_gastein'],13:['b_biarritz','b_para'],14:['b_italya','b_konsey66'],15:['b_geneloy','b_pariskonf'],16:['b_holstein','b_savas66'],
  17:['b_guney','b_af'],18:['b_benedetti','b_luksemburg','b_anayasa'],20:['b_gumrukparl','b_ispanya'],22:['b_baden','b_uclu'],24:['b_leopold','b_cekilme'],26:['b_donchery','b_karadeniz'],27:['b_bavyera','b_baris71','b_unvan']};
  /* savaşsız yolların (i_, k_) gündemleri: kapsadığı mevsimin turuna */
  const alt={};for(const [n,ids] of Object.entries(DANCH))for(const id of ids)if(/^(i_|k_)/.test(id)){const s=[...DSTART].reverse().find(x=>x<=+n);(alt[s]=alt[s]||[]).push(id)}
  for(const k of Object.keys(DANCH))delete DANCH[k];for(const s of DSTART)DANCH[s]=(plan[s]||[]).concat(alt[s]||[]).filter(id=>DEC[id])}
/* tekrarlayan olaylar: 18'den 7'ye */
{const keep=['p_augusta','p_elci','a_fra_ittifak','a_aus_oylama','a_rus_istek','a_ita_venedik','a_fra_ordu'];for(let i=DPOOL.length-1;i>=0;i--)if(!keep.includes(DPOOL[i]))DPOOL.splice(i,1)}
const deNextStart=n=>DSTART.find(x=>x>n)||DNS+1;
{const _s=deStartDay;deStartDay=function(){if(DE()&&!DSTART.includes(S.day)&&S.day<DNS){const t=DSTART.find(x=>x>S.day)||S.day;S.clock+=24*(t-S.day);S.day=t}return _s.apply(this,arguments)}}
{const _e=deEndDay;deEndDay=function(){if(DE()&&S.day===DSTART[DSTART.length-1]){S.clock+=24*(DNS-S.day);S.day=DNS}return _e.apply(this,arguments)}}
{const _w=deWorldLine;deWorldLine=function(n){let t=_w(n);const nx=Math.min(deNextStart(n),DNS);for(let k=n+1;k<nx;k++){const x=_w(k);if(x&&x!==t)t+=' '+x}
  const P=DPERDE[n];if(P){const H=deHS().v;t=`<b>Perde ${P[0]} · ${P[1]} (${P[2]}).</b> `+(n>1?`Önceki perdenin sonunda Kral'ın güveni ${Math.round(S.s)}, hazine ${Math.round(S.h)}, hareket serbestisi ${H}. `:'')+t}
  if(n===DSTART[DSTART.length-1])t+=' Bu son tur. Tur sonunda dokuz yılın hesabı görülecek.';
  return t}}
/* tur etiketi: birden çok mevsimi kapsayan turlarda aralık gösterilir */
{const _l=deLabel;deLabel=function(n){const a=_l(n);if(!DSTART.includes(n))return a;const nx=Math.min(deNextStart(n),DNS)-1;return nx>n&&n<DSTART[DSTART.length-1]?a+' – '+_l(nx):a}}/* birden çok mevsimi kapsayan turda gelir, ordu, sanayi ve iç gerilim akışları mevsim sayısıyla çarpılır; denge 28 turluk oyundaki gibi kalır */
{const _f=deFlows;deFlows=function(){const F=_f.apply(this,arguments);if(!DE()||!DSTART.includes(deN()))return F;const k=Math.max(1,Math.min(deNextStart(deN()),DNS)-deN());
  if(k>1){for(const x of ['h','g','o','m','lt','sa'])if(typeof F[x]==='number')F[x]*=k;if(F.r&&F.r.length)F.r.push(k+' mevsim')}return F}}/* planlanmış ama koşulu tur başında henüz oluşmamış tarihî gündemler: her karar sonuçlandığında yeniden denenir, olmazsa sonraki tura devreder */
{const _s=deStartDay;deStartDay=function(){if(DE()&&S.dplan){for(const id of S.dplan)if(!S.done[id]&&DEC[id]&&!S.queue.includes(id)&&(!DEC[id].when||DEC[id].when()))S.queue.unshift(id)}
  const r=_s.apply(this,arguments);if(DE()){const n=deN(),shown=S.today.map(t=>t.id);S.dplan=(DANCH[n]||[]).filter(id=>!shown.includes(id)&&!S.done[id]&&!/^(i_|k_)/.test(id))}return r}}
{const _c=complete;complete=function(p){const r=_c.apply(this,arguments);if(DE()&&S.dplan&&S.dplan.length&&!S.end){for(const id of [...S.dplan]){const d=DEC[id];if(S.done[id]||S.today.some(t=>t.id===id)){S.dplan=S.dplan.filter(x=>x!==id);continue}if(!d.when||d.when()){deNow(id);S.dplan=S.dplan.filter(x=>x!==id)}}}return r}}/* tempo: Kan ve Demir'de oyun saati %40 daha yavaş akar (normal hızda bir gün ~37 sn); hızlı düğmesi aynı oranda yavaşlar */
{const _t=tick;tick=function(dt){return _t(DE()?dt*.6:dt)}}