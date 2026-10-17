/* ---------- Dosya 04 · Kan ve Demir 1862–71 ----------
   Denge Politikası dosyasının iskeleti kullanılır: doktrin → kabine → tur döngüsü → gündemler → tur raporu → bitiş → epilog.
   Saat, bekleyen karar sistemi, danışman baloncukları, gündem pencereleri, çekmece ve ses ana dosyadandır.
   Yeni olan: Kral'ın güveni, meclis gerginliği ve saray muhalefeti; savaşlar hazırlığa ve rakibin yalnızlığına göre çözülür.
   Tarih esnektir: olaylar arka plan ve ilhamdır; sonuçlar oyuncunun kararlarına göre değişir. */
const DE=()=>!!S&&S.story==='de62';
const DNS=28,HOME_DE=[11,47,40];
const DEN={aus:'Avusturya',fra:'Fransa',rus:'Rusya',ing:'İngiltere',ita:'İtalya',sud:'Güney Alman devletleri'};
const DCOL={aus:'#d6b65c',fra:'#7f9fe0',rus:'#8fb070',ing:'#d98a9c',ita:'#6fb86a',sud:'#c9a45c'};
const deN=()=>Math.min(S.day,DNS);
function deLabel(n){n=Math.max(1,Math.min(n,DNS));
  if(n<=17){const i=n-1,s=i%4,y=1862+Math.floor(i/4);return s===0?`Güz ${y}`:s===1?`Kış ${y}–${String(y+1).slice(2)}`:s===2?`İlkbahar ${y+1}`:`Yaz ${y+1}`}
  if(n<=23){const k=n-18;return `${1867+Math.floor(k/2)} · ${k%2?'ikinci':'ilk'} yarı`}
  return ['İlkbahar 1870','Yaz 1870','Güz 1870','Kış 1870–71','İlkbahar 1871'][n-24]}
const DWORLD=[
 "Meclis ordu reformunu 273'e karşı 68 oyla reddetti. Kral tahttan çekilmeyi düşünüyor. Fransa Meksika'da, Rusya köylü reformuyla meşgul; Avusturya, Alman Konfederasyonu'nun başkanlığını bırakmaya niyetli değil.",
 "Ocakta Rus Polonyası'nda ayaklanma başladı. İngiltere, Fransa ve Avusturya Polonyalılara anayasa istiyor; Petersburg yalnız.",
 "Polonya'da çatışmalar sürüyor. Berlin'de meclisle kavga büyüyor; muhalefet basını her gün başbakanı yazıyor.",
 "Avusturya İmparatoru bütün Alman hükümdarlarını Frankfurt'ta kongreye çağırdı. Otuz hükümdar gidiyor; Saksonya Kralı daveti Kral Wilhelm'e elden getirdi.",
 "Meclis feshedildi; ekim seçiminde ilericiler yine kazandı. 15 Kasım'da Danimarka Kralı öldü; yeni kral Schleswig'i Danimarka'ya bağlayan anayasayı imzaladı. Almanya ayakta.",
 "Saksonya ve Hannover birlikleri Konfederasyon adına Holstein'a girdi. Londra Danimarka'ya destek sözü veriyor ama kabine bölünmüş.",
 "Londra'da büyük güçlerin konferansı toplanıyor. Danimarka ordusu Düppel tabyalarına çekildi.",
 "Londra Konferansı sonuçsuz dağıldı. İngiltere Danimarka'yı yalnız bıraktı; Kopenhag barış istiyor.",
 "Dukalıklar Danimarka'dan koptu. Prusya ve Avusturya birlikleri yan yana duruyor; kimin ne alacağı belli değil.",
 "Viyana, dukalıkların geleceği için Berlin'den açık bir cevap bekliyor. Küçük devletler Augustenburg Dükü'nün arkasında toplanıyor.",
 "Avusturya'nın hazinesi boş; Viyana Paris'te borç arıyor. İngiltere kıtadan elini çekmiş görünüyor, Fransa Meksika'ya saplandı.",
 "Kral kaplıcada. Avusturya heyeti Gastein'a geldi; iki Alman gücü ya anlaşacak ya çarpışacak.",
 "Gastein düzeni kâğıt üzerinde işliyor. III. Napolyon Biarritz'de; Avrupa'nın gözü onun ne isteyeceğinde.",
 "Holstein'daki Avusturya yönetimi Augustenburg yanlısı gösterilere göz yumuyor. Floransa, Venedik için ortak arıyor.",
 "İki tarafta da atlar satın alınıyor. III. Napolyon Paris'te bir konferans öneriyor; Alman devletleri taraf seçiyor.",
 "Avusturya dukalıklar meselesini Konfederasyon Meclisi'ne götürdü. Meclis, Prusya'ya karşı seferberliği oyluyor.",
 "Savaş yedi haftada bitti. Alman Konfederasyonu dağıldı; Avusturya Almanya'nın dışında. Paris, tarafsızlığının karşılığını soruyor.",
 "Kuzeyde yeni bir konfederasyon kuruluyor. III. Napolyon Hollanda Kralı'yla Lüksemburg için pazarlıkta; Meksika macerası bitti.",
 "Kuzey Almanya Meclisi çalışıyor. Güneyde Bavyera ve Württemberg bağımsızlıklarına sıkı sıkı sarılıyor.",
 "Gümrük Parlamentosu seçimlerinde güneyde Prusya karşıtları kazandı. Birleşme tıkanmış görünüyor.",
 "Eylülde İspanya'da generaller Kraliçe'yi devirdi. Madrid Avrupa saraylarında bir kral arıyor.",
 "Avrupa sakin. Paris ordusunu yeniliyor; Viyana'da eski Saksonya başbakanı Beust dışişlerinin başında.",
 "Fransa, Avusturya ve İtalya arasında görüşme söylentileri var. Baden, kuzeye katılmak istediğini açıkça söylüyor.",
 "Madrid tahtı bir kez daha öneriyor. Paris'te yeni dışişleri bakanı Gramont göreve başladı; Avrupa başkentleri uzun zamandır bu kadar sessiz olmamıştı.",
 "Temmuz başında haber Paris'e ulaştı: bir Hohenzollern İspanya tahtına aday. Fransız basını ve meclisi ayakta.",
 "Savaş Fransız topraklarında sürüyor. Paris'te imparatorluk devrildi, cumhuriyet ilan edildi; yeni hükûmet bir karış toprak vermeyeceğini söylüyor.",
 "Paris kuşatma altında. Karargâh Versay'da; güney Alman devletleriyle birlik antlaşmaları görüşülüyor.",
 "Paris teslim oldu. Barış görüşmeleri sürüyor; Berlin'de ilk Alman meclisi toplanmak üzere."];
const DWANT={aus:'Ne ister: Konfederasyon başkanlığını korumak, Prusya\'yı küçük tutmak.',fra:'Ne ister: Ren\'de ya da Belçika–Lüksemburg\'da tazminat; bölünmüş bir Almanya.',rus:'Ne ister: Polonya\'da serbest el; Karadeniz maddelerinin kalkması.',ing:'Ne ister: kıtada denge, Belçika\'nın dokunulmazlığı, Danimarka\'nın bütünlüğü.',ita:'Ne ister: Venedik.',sud:'Ne ister: bağımsızlık, Katolik kimlik, gümrük gelirleri.'};
const DRED={aus:'Kırmızı çizgi: dukalıkların Prusya\'ya ilhakı; Konfederasyon\'un dağıtılması.',fra:'Kırmızı çizgi: Güney Alman devletlerinin Prusya\'ya katılması.',rus:'Kırmızı çizgi: Polonya\'ya Batı müdahalesine destek.',ing:'Kırmızı çizgi: Belçika\'ya dokunulması.',ita:'Kırmızı çizgi: Avusturya\'yla ayrı barış.',sud:'Kırmızı çizgi: zorla ilhak.'};
const DRIV={aus:'ita',fra:'rus',rus:'aus',ing:'fra',ita:'aus',sud:'fra'};
function deLeader(a,n){return {aus:['I. Franz Joseph','Avusturya İmparatoru'],fra:['III. Napolyon','Fransız İmparatoru'],rus:['II. Aleksandr','Rus Çarı'],ing:[n<=13?'Lord Palmerston':n<=16?'Lord Russell':n<=19?'Lord Derby':n<=21?'Benjamin Disraeli':'William Gladstone','İngiltere Başbakanı'],ita:['II. Vittorio Emanuele','İtalya Kralı'],sud:[n<=6?'II. Maximilian':'II. Ludwig','Bavyera Kralı']}[a]}
/* kapasite: bir gücün o tur Prusya'ya karşı gerçekten ne yapabileceği (0–100) */
function deCap(a,n){n=n||deN();let v=0;
  if(a==='rus')v=n>=2&&n<=8?15:35;
  else if(a==='fra'){v=n<=17?45:n<=23?60:75;if(S.course==='B'&&n>=14)v=Math.max(v,65)}
  else if(a==='aus')v=S.f.kg?(S.f.sertbaris&&n>=24?50:20):65;
  else if(a==='ing')v=S.dw==='dk'?40:25;
  else if(a==='ita')v=20;else if(a==='sud')v=30;
  if((S.f['soz_'+a]||0)>=n)v-=25;
  return cl(v,0,100)}
function deCapWhy(a,n){n=n||deN();
  if(a==='rus')return n>=2&&n<=8?'Polonya ayaklanmasıyla meşgul.':'Köylü reformu ve boş hazine; uzak ama büyük.';
  if(a==='fra')return n<=17&&!(S.course==='B'&&n>=14)?'Ordunun iyi bölümü Meksika\'da.':n<=23?'Meksika bitti; ordu yenileniyor.':'Ordu hazır, kamuoyu savaş istiyor.';
  if(a==='aus')return S.f.kg?(S.f.sertbaris&&n>=24?'Yenilginin öcünü bekliyor; Fransa\'yla konuşuyor.':'Yenildi; içeride Macarlarla uğraşıyor.'):'Büyük ordu, boş hazine.';
  if(a==='ing')return 'Kara ordusu küçük; yalnızca donanma ve diplomasi.';
  if(a==='ita')return 'Genç krallık; tek başına Avusturya\'ya yetmez.';
  return 'Küçük ordular; Avusturya\'nın ya da Fransa\'nın yanında anlam kazanır.'}
/* ekranda gösterilen müdahale ihtimali; ataşe yoksa şüphe tahminidir (de62-m.js: deSusSeen) */
const deRisk=a=>{const A=S.A[a],s=window.deSusSeen?deSusSeen(a):A.sus;return cl(deCap(a)/100*(s*.8+(55-A.f)*.5))};
const deLvl=v=>v<15?'Düşük':v<30?'Orta':v<45?'Yüksek':'Kritik';
function deAdj(d){for(const k in d){const A=S.A[k];if(!A)continue;for(const p in d[k])A[p]=(A[p]||0)+d[k][p]}deClamp()}
function deClamp(){for(const k in S.A){const A=S.A[k];for(const p of ['f','sus','use'])A[p]=cl(A[p]||0)}for(const k of ['h','g','o','m','lt','saray'])S[k]=cl(S[k]||0)}

/* ---------- kişiler, doktrin ---------- */
Object.assign(ADV,{
  roon:{g:'de',n:'Albrecht von Roon',k:'Roon',r:'Savaş Bakanı',lean:'loyal',e:'Sadık',plus:'Kral\'a doğrudan erişir; Kral\'ın güvenindeki her kayıp hafifler.',risk:'Ordu reformundan taviz verilirse karşına geçer.'},
  moltke:{g:'de',n:'Helmuth von Moltke',k:'Moltke',r:'Genelkurmay Başkanı',lean:'hawk',e:'Planlayıcı',plus:'Seferberlik ve demiryolu planı hazır; savaşlarda belirgin üstünlük.',risk:'Savaşta siyasetin karışmasına direnir.'},
  manteuffel:{g:'de',n:'Edwin von Manteuffel',k:'Manteuffel',r:'Askerî Kabine Şefi',lean:'hawk',e:'Gözü kara',plus:'Kral\'ın yanı başında; saray muhalefeti daha yavaş büyür.',risk:'Emir dinlemez; savaşta bir kararı kendi bildiği gibi uygulayabilir.'},
  bleich:{g:'de',n:'Gerson Bleichröder',k:'Bleichröder',r:'Banker',lean:'dove',e:'Bağlantılı',plus:'Paris ve Viyana piyasasından haber getirir; kredi kapılarını açar.',risk:'Sarayda ve orduda tepki çeker.'},
  bucher:{g:'de',n:'Lothar Bucher',k:'Bucher',r:'Basın ve yazı işleri',lean:'pol',e:'Kalemi güçlü',plus:'Kamuoyu kayıpları azalır.',risk:'Eski bir devrimci; saray ondan hoşlanmaz.'},
  heydt:{g:'de',n:'August von der Heydt',k:'von der Heydt',r:'Maliye',lean:'mid',e:'Kaynak bulur',plus:'Meclis izni olmadan para bulmanın yollarını bilir.',risk:'Liberal geçmişi yüzünden muhafazakârlar güvenmez.'},
  eulenburg:{g:'de',n:'Fritz zu Eulenburg',k:'Eulenburg',r:'İçişleri Bakanı',lean:'mid',e:'Becerikli',plus:'Memur disiplini ve seçimlerde etkili; meclis gerginliği daha yavaş artar.',risk:'Ağırdan alır.'},
  delbruck:{g:'de',n:'Rudolf Delbrück',k:'Delbrück',r:'Gümrük ve yönetim',lean:'dove',e:'Düzenleyici',plus:'Anlaşmalar daha kazançlı; 1867\'den sonra sanayi her tur gelişir.',risk:'Serbest ticaretçi; korumacı adımlara itiraz eder.'}});
Object.assign(LOOK,{bismarck:{hair:'#b9a98a',st:'bald',mu:1,uni:'#3c4a63'},roon:{hair:'#cfc8bb',st:'short',mu:1,uni:'#34425c'},moltke:{hair:'#d9d6cc',st:'short',uni:'#34425c'},manteuffel:{hair:'#8a8780',st:'full',mu:1,uni:'#2f3c55'},
  bleich:{hair:'#3a2f26',st:'slick',gl:1,suit:'#20242b',tie:'#2b2b2b'},bucher:{hair:'#5a4a38',st:'bald',gl:1,suit:'#2b2a2e',tie:'#3c3c3c'},heydt:{hair:'#cfc8bb',st:'slick',suit:'#252b2a',tie:'#5a2f4a'},eulenburg:{hair:'#6a5a48',st:'full',mu:1,suit:'#22262c',tie:'#3a3a52'},delbruck:{hair:'#9a978f',st:'short',gl:1,suit:'#2a2a2e',tie:'#2a3d5c'}});
Object.assign(DOC,{
  alm:{g:'de',t:'Almanya çözümü',o:[['kucuk','Avusturya\'sız birlik','Almanya, Prusya\'nın çevresinde ve Avusturya olmadan birleşir. Viyana baştan şüpheli; milliyetçiler umutlu. Avusturya\'yla kalıcı ortaklık çizgine aykırıdır.'],['ortak','Avusturya\'yla ortak yönetim','Kuzeyde Prusya, güneyde Avusturya. Viyana\'yla ilişki iyi başlar; milliyetçiler soğuk. Avusturya\'ya savaş açmak çizgine aykırıdır.'],['kuzey','Yalnızca Kuzey','Main\'in kuzeyiyle yetinirsin. Fransa ve güney rahat başlar; güneyi zorlamak çizgine aykırıdır.']]},
  mec:{g:'de',t:'Meclisle ilişki',o:[['catisma','Çatışma','Bütçe olmadan da yönetirsin. Kral güvenir; meclis gergin, kamuoyu soğuk başlar. Meclisten izin istemek çizgine aykırıdır.'],['uzlasma','Uzlaşma','Anayasaya bağlı kalırsın. Meclis ve kamuoyu yumuşak, Kral temkinli başlar. Bütçesiz yönetim çizgine aykırıdır.']]},
  bar:{g:'de',t:'Yenilene barış',o:[['ilimli','Ilımlı barış','Yendiğini küçük düşürmezsin. Londra olumlu bakar; ordu hoşnutsuz. Yenilenden toprak koparmak çizgine aykırıdır.'],['sert','Sert barış','Zaferin bedelini alırsın. Ordu memnun; komşular tedirgin. Tazminatsız, topraksız barış çizgine aykırıdır.']]},
  mes:{g:'de',t:'Meşruiyet kaynağı',o:[['hanedan','Hanedan hukuku','Tahtlara ve antlaşmalara dayanırsın. Kral ve saray rahat. Genel oy önermek çizgine aykırıdır.'],['oy','Genel oy ve milliyetçilik','Prenslere karşı halkı koz olarak kullanırsın. Kamuoyu ısınır; Kral ve saray tedirgin. Küçük prenslerin haklarını savunmak çizgine aykırıdır.']]}});
function deDoctrine(){const D=S.doc,A=S.A;
  if(D.alm==='kucuk'){A.aus.sus+=8;S.g+=4}else if(D.alm==='ortak'){A.aus.f+=10;S.g-=4}else{A.fra.sus-=8;A.sud.sus-=10}
  if(D.mec==='catisma'){S.s+=5;S.lt+=10;S.g-=5;S.ord.butce=1}else{S.lt-=10;S.g+=5;S.s-=4;S.ord.butce=0}
  if(D.bar==='ilimli'){A.ing.f+=4;S.o-=2}else{S.o+=3;S.t+=4}
  if(D.mes==='hanedan'){S.s+=4;S.saray-=8}else{S.g+=8;S.s-=3;S.saray+=8}
  deClamp();norm()}

/* ---------- anlaşmalar ve olağanüstü kaynaklar ---------- */
const DOFR=[
 {id:'d_fratic',p:'fra',ok:n=>n<=8,t:'Fransa ile ticaret antlaşması',give:'Gümrük indirimi',get:'Hazine geliri, Paris\'te iyi niyet',e:{h:1.5},f:1,rv:{aus:1.5},use:10},
 {id:'d_zoll',p:'sud',ok:n=>n>=9&&n<=16,t:'Zollverein\'in yenilenmesi',give:'Gümrük gelirinden pay',get:'Sanayi, güneyde bağımlılık',e:{m:1,h:-.5},f:1,rv:{aus:2},use:15},
 {id:'d_krupp',p:'ing',neutral:1,ok:n=>n>=3&&n<=25,t:'Krupp çelik top siparişi',give:'Hazine',get:'Ordu ve sanayi',e:{o:.6,h:-1.5,m:.3},f:0,rv:{},use:0},
 {id:'d_demir',p:'rus',ok:n=>n>=2&&n<=20,t:'Rusya ile sınır ve demiryolu anlaşması',give:'Kredi kolaylığı',get:'Petersburg\'da dostluk',e:{h:-.5},f:1.5,rv:{},use:10},
 {id:'d_itatic',p:'ita',ok:n=>n>=6&&n<=18,t:'İtalya ile ticaret ve tanıma',give:'Krallığın tanınması',get:'Floransa\'da dostluk',e:{h:.5},f:2,rv:{aus:2},use:10},
 {id:'d_guney',p:'sud',ok:n=>n>=17,req:()=>!!S.f.guney,reqText:'Önce güneyle ittifak gerekir',t:'Güney ordularıyla ortak talim',give:'Subay ve silah',get:'Savaşta güney kuvvetleri',e:{o:.5,h:-1},f:1.5,rv:{fra:2},use:10}];
const DOFRB=Object.fromEntries(DOFR.map(o=>[o.id,o]));
function deOffers(){const n=deN();return DOFR.filter(o=>o.ok(n))}
const DEXTRA={
 hisse:{t:'Köln–Minden demiryolu hisselerini sat',who:'Devletin elindeki hisseler şirkete geri satılır.',gain:'Hazine ↑↑ hemen.',cost:'Meclisin izni yok: meclis gerginliği artar. Bir kez yapılabilir.'},
 kredi:{t:'Rothschild kredisi',who:'Deniz Ticaret Bankası üzerinden, Bleichröder aracılığıyla.',gain:'Hazine ↑.',cost:'Borç artar; her tur faiz ödersin. Bleichröder kabinede olmalı.'},
 borc:{t:'Meclise sormadan devlet borçlanması',who:'Tahvil alan herkes.',gain:'Hazine ↑↑.',cost:'Anayasaya aykırı: meclis gerginliği ve kamuoyu sert etkilenir.'},
 kisit:{t:'Ordu harcamalarını kıs',who:'Ordu.',gain:'Hazine ↑.',cost:'Ordu ↓; Roon ve Kral hoşnutsuz.'}};
function deExtra(k){let r='';
  if(k==='hisse'){if(S.f.hisse)return '';S.f.hisse=1;S.h+=22;if(!has('heydt'))S.lt+=8;r='Hisseler şirkete satıldı; para hazinede. '+(has('heydt')?'Von der Heydt işlemi sessizce bağladı.':'Meclis kendisine sorulmadığını not etti.')}
  else if(k==='kredi'){if(!has('bleich'))return '';S.h+=14;S.debt+=14;r='Kredi sağlandı. Borç arttı.'}
  else if(k==='borc'){S.h+=16;S.debt+=8;S.lt+=15;S.g-=6;r='Tahviller meclise sorulmadan çıkarıldı. Muhalefet anayasanın çiğnendiğini söylüyor.'}
  else if(k==='kisit'){S.h+=6;S.o-=5;S.s-=2;r='Harcamalar kısıldı. Roon öfkeli.'}
  S.acted.extra=1;deClamp();norm();return r}

/* ---------- başlangıç ---------- */
function deInit(){const mk=(f,sus,use)=>({f,sus,use,adj:0});
  Object.assign(S,{story:'de62',side:'de',pub:true,doc:{alm:null,mec:null,bar:null,mes:null},t:15,s:50,h:40,g:35,o:45,m:40,lt:50,saray:45,
    A:{aus:mk(35,45,30),fra:mk(45,25,30),rus:mk(55,15,30),ing:mk(40,30,25),ita:mk(40,20,20),sud:mk(30,50,30)},
    ctr:[],ord:{butce:1,sefer:0,basin:0,memur:0},fut:[],debt:0,f:{},cool:{},acted:{},dw:null,lowS:0,sag:70,pk:{},
    course:['A','A','B','C','D'][Math.floor(Math.random()*5)],tab:'dip'});
  S.prev={t:S.t,s:S.s,c:S.c,sec:S.sec}}

/* ---------- savaşların çözümü ---------- */
function deWar(vs,bonus){const base={dk:35,aus:70,fra:75}[vs],notes=[];let ally=0;
  if(vs==='dk'&&S.f.dkaus)ally+=15;
  if(vs==='aus'){if(S.f.italya)ally+=12;ally-=8;notes.push(S.f.italya?'İtalya güneyde cephe açtı; Avusturya kuvvetlerini bölmek zorunda kaldı.':'Avusturya bütün kuvvetiyle kuzeye döndü; güneyde onu tutan kimse yok.')}
  if(vs==='fra'){if(S.f.guney){ally+=10;notes.push('Bavyera, Württemberg ve Baden orduları Prusya komutasına girdi.')}else{ally-=4;notes.push('Güney devletleri seyirci kaldı.')}
    if(S.f.sertbaris&&S.A.rus.f<50&&chance(.5)){ally-=18;notes.push('Avusturya sınıra asker yığdı; kuvvetlerin bir bölümü güneyde tutuldu.')}}
  if(vs!=='dk'&&S.h<30){ally-=S.h<10?12:6;notes.push(S.h<10?'Hazine boş: ikmal çöktü.':'Hazine yetersiz: ikmal aksadı.')}
  let sc=S.o+S.m/4+(has('moltke')?10:0)+ally+[-10,0,6][S.ord.sefer]+(bonus||0)-base+R(-8,8);
  if(has('manteuffel')&&chance(.3)){sc-=4;notes.push('Manteuffel bir emri kendi bildiği gibi yorumladı.')}
  const inter=[];for(const a of ['aus','fra','rus','ing']){if(a===vs||(vs==='dk'&&a==='aus'&&S.f.dkaus))continue;if(deCap(a)>=50&&S.A[a].sus>=60&&chance(window.deInterP?deInterP(a,vs):.5))inter.push(a)}
  if(inter.length){sc-=22*inter.length;S.t+=20;notes.push(inter.map(a=>DEN[a]).join(' ve ')+' araya girdi.')}
  return {sc,inter,notes,res:inter.length>=2&&sc<10?'iki':sc>10?'zafer':sc>=0?'uzun':'yenilgi'}}

/* ---------- tur akışı ---------- */
const DPOOL=[],DANCH={1:['b_butce','b_kanvedemir'],2:['b_karolyi','b_polonya'],3:['b_lassalle','b_basin'],4:['b_frankfurt'],5:['b_danimarka'],6:['b_savas64','b_wrangel'],7:['b_duppel','b_londra'],8:['b_augustenburg'],
  9:['b_schonbrunn','b_bucher'],10:['b_subat'],11:['b_konsey65','b_para'],12:['b_gastein'],13:['b_biarritz'],14:['b_italya','b_konsey66'],15:['b_geneloy','b_suikast','b_pariskonf'],16:['b_holstein','b_savas66'],
  17:['b_af','b_benedetti','b_guney','b_frankfurt66'],18:['b_anayasa','b_luksemburg'],19:['b_delbruck','b_welf'],20:['b_gumrukparl'],21:['b_ispanya'],22:['b_istifa69'],23:['b_baden','b_uclu'],24:['b_leopold'],25:['b_cekilme'],
  26:['b_favre','b_karadeniz','b_bombardiman'],27:['b_bavyera','b_unvan','b_baris71']};
function deDec(o){for(const id in o){const d=o[id];DEC[id]=d;DUR[id]=d.h||4;if(d.real)REAL[id]=d.real;if(d.sh)SHORT[id]=d.sh;if(d.fly)FLY[id]=d.fly;if(d.pool)DPOOL.push(id)}}
/* aynı tur içinde ardından gelen gündem: boş saat dilimi varsa bugüne, yoksa gelecek tura eklenir */
function deNow(id){if(S.done[id]||S.today.some(t=>t.id===id))return;const d=DEC[id];if(d.when&&!d.when())return;const i=S.today.length,h=S.clock%24;
  if(i<5){S.slots[i]=Math.max(S.slots[i],h+.4);if(S.slots[i]<20.6){S.today.push({id});if(d.show)d.show();return}}q(id)}
function deFlows(){const O=S.ord,n=deN();let h=1.5,g=0,o=0,m=.3,lt=0,sa=0;const r=[];
  if(O.butce){h+=2.5;lt+=2;g-=1;r.push('bütçesiz yönetim')}
  if(O.sefer){h-=[0,3,7][O.sefer];r.push(O.sefer===2?'tam seferberlik':'kısmi seferberlik')}
  if(O.basin){sa+=1.5;r.push('basın kararnamesi')}
  if(O.memur){g-=1;lt*=.5}
  if(has('eulenburg'))lt*=.7;
  if(S.f.af)lt=0;
  /* ordu reformu: para varsa ilerler */
  if(S.h>5){h-=2.5;o+=.8}else o+=.2;
  if(n>=18&&has('delbruck'))m+=1;
  if(S.debt>0)h-=S.debt*.04;
  return {h,g,o,m,lt,sa,r}}
function deEndDay(){const L=[],add=(tag,text)=>L.push({tag,text}),n=deN(),O=S.ord,A=S.A;
  const F=deFlows();let dh=F.h,dg=F.g,dO=F.o,dm=F.m;
  for(const id of S.ctr){const x=DOFRB[id];if(!x)continue;dh+=(x.e.h||0)+(x.e.h>0&&has('delbruck')?.5:0);dO+=x.e.o||0;dm+=x.e.m||0;if(!x.neutral){A[x.p].f+=x.f;for(const k in x.rv)if(A[k])A[k].sus+=x.rv[k]}}
  const fut=S.fut.filter(f=>f.at<=n);S.fut=S.fut.filter(f=>f.at>n);for(const f of fut){dh+=f.h||0;dg+=f.g||0;dO+=f.o||0;S.s+=f.s||0;S.t+=f.t||0}
  S.h+=dh;S.g+=dg;S.o+=dO;S.m+=dm;S.lt+=F.lt;S.saray+=F.sa;
  if(O.sefer){S.t+=[0,2,5][O.sefer];for(const a of ['aus','fra'])A[a].sus+=[0,1.5,3][O.sefer]}
  if(O.basin)A.ing.f-=1;
  add('Hazine',`Tur bilançosu ${dh>=0?'+':'−'}${Math.abs(Math.round(dh))}. Hazine ${Math.round(Math.max(0,S.h))}${S.debt?` · borç ${Math.round(S.debt)}`:''}${F.r.length?' ('+F.r.join(', ')+')':''}.`);
  if(S.h<0){S.s-=4;S.h=0;add('Hazine','Hazine boşaldı: ordu tedariki ve maaşlar aksadı. Kral rahatsız.')}
  /* meclis ve kamuoyu */
  if(!S.f.af){const k=O.basin?.6:1;if(S.lt>=90){S.g-=2.5*k;S.saray+=1;add('Meclis','Meclis hükûmeti anayasayı çiğnemekle suçluyor; vergi ödememe çağrıları var.')}else if(S.lt>=70){S.g-=1.5*k;add('Meclis','Bütçe kavgası sürüyor; muhalefet basını sertleşti.')}}
  S.g+=(40-S.g)*.12;
  /* saray: Kraliçe, Veliaht ve çevresi her tur Kral'ı etkiler; kendi hâline bırakılırsa muhalefet büyür */
  S.saray+=(62-S.saray)*.09;
  const why=[];let ds=-S.saray/18+(40-S.s)*.04;
  if(!S.f.af&&S.lt>=90){ds-=1;why.push('meclisle kavga')}
  if(S.t>=50){ds-=1.5;why.push('savaş korkusu')}
  if(S.g<15){ds-=1;why.push('sokaktaki öfke')}
  if(S.course==='C')ds-=.6;if(has('roon')&&ds<0)ds*=.8;S.s+=ds;
  add('Saray',(S.saray>=65?'Kraliçe ve Veliaht çevresi Kral\'ın kulağında; güveni aşınıyor':S.saray>=45?'Sarayda fısıltılar sürüyor':'Saray sakin')+(why.length?'. Kral\'ı ayrıca yıpratan: '+why.join(', '):'')+`. Kral'ın güveni ${ds>=0?'+':'−'}${Math.abs(Math.round(ds*10)/10)}.`);
  /* güçler */
  let top=[];for(const a in A){const x=A[a];x.f+=(40-x.f)*.04;x.sus-=1;if((a==='aus'||a==='fra')&&S.o>=68)x.sus+=1.2;
    let u=({aus:25,fra:30,rus:30,ing:25,ita:20,sud:30}[a])+(x.adj||0);for(const id of S.ctr){const o=DOFRB[id];if(o&&o.p===a&&!o.neutral)u+=o.use}x.use=cl(u);x.adj=(x.adj||0)*.9}
  deClamp();
  for(const a of ['aus','fra','rus','ing'])top.push(deRisk(a));top.sort((p,q)=>q-p);
  const tg=top[0]*.55+top[1]*.45;S.t=cl(S.t*.5+tg*1.6*.5);
  S.lv=S.lv||{};for(const a of ['aus','fra','rus','ing']){const L2=deLvl(deRisk(a));if(S.lv[a]&&S.lv[a]!==L2){const K=['Düşük','Orta','Yüksek','Kritik'];add(DEN[a],K.indexOf(L2)>K.indexOf(S.lv[a])?`Müdahale ihtimali arttı: ${L2.toLowerCase()}.`:`Müdahale ihtimali azaldı: ${L2.toLowerCase()}.`)}S.lv[a]=L2}
  /* sağlık: uykusuzluk, öfke ve fazla iş; çökerse bir tur yatağa düşersin */
  S.sag-=1.5+(S.dw?1.5:0)+(S.s<30?1:0);
  if(S.sag<=0){S.sag=35;S.f.yatak=n+1;S.s-=3;add('Sağlık','Çöktün: mide krampları, uykusuzluk, ateş. Hekim üç hafta yatak istirahati verdi; gelecek tur hiçbir girişimde bulunamayacaksın.')}
  else if(S.sag<25)add('Sağlık','Günlerdir uyumuyorsun. Roon endişeli; dinlenmezsen çökeceksin.');
  /* süren savaşlar */
  if(S.dw==='aus'&&!(S.queue||[]).includes('b_koniggratz')){const r=deAustriaResolve(0);add('Königgrätz',r);if(S.end){norm();S.log=L;return}}else if(S.dw==='aus')add('Königgrätz','Ordular Bohemya\'da ilerliyor; belirleyici muharebe yarın sabah.')
  if(S.dw==='dk'&&n>=8){if(!S.f.dkbitti){const W=deWar('dk',S.f.dkb||0);if(W.res==='yenilgi'||W.res==='iki'){norm();S.log=L;return end(W.res==='iki'?'de_ikicephe':'de_yenilgi')}}
    S.dw=null;if(S.f.aug){add('Barış','Danimarka dukalıkları bıraktı. Schleswig-Holstein, Augustenburg Dükü\'nün yönetiminde yeni bir Alman devleti oldu.')}else{S.f.kondo=1;add('Barış','Viyana Barışı: Danimarka, Schleswig, Holstein ve Lauenburg\'u Prusya ile Avusturya\'ya bıraktı. Dukalıklar iki devletin ortak yönetiminde.')}S.s+=6;S.g+=5;S.saray-=4}
  if(S.dw==='fra'&&!S.f.sedan){const W=deWar('fra',S.f.frab||0);for(const t of W.notes)add('Cephe',t);
    if(W.res==='iki'){norm();S.log=L;return end('de_ikicephe')}if(W.res==='yenilgi'){norm();S.log=L;return end('de_yenilgi')}
    S.f.sedan=1;S.s+=10;S.g+=15;S.saray-=10;S.o+=3;S.h-=20;if(W.res==='uzun'){S.t+=10;S.h-=8;add('Cephe','Savaş beklenenden ağır geçti; kayıplar büyük.')}
    add('Sedan','2 Eylül: Fransız ordusu Sedan\'da kuşatıldı ve teslim oldu. İmparator III. Napolyon esir. Paris\'te cumhuriyet ilan edildi.')}
  if(S.dw==='fra'&&S.f.sedan&&!S.f.baris71&&n>=26){S.h-=4;S.t+=S.f.halksavasi?6:3;add('Kuşatma','Savaş uzadıkça para akıyor; tarafsız başkentlerde sabır azalıyor.')}
  norm();deClamp();S.log=L;
  if(S.s<=0){return end(n<=4&&S.saray>=60?'de_cekilme':'de_azil')}
  if(n>=DNS)return end(deFinal());
  S.screen='evening'}
function deFinal(){const sc=.3*S.s+.2*S.g+.2*S.o+.15*(100-S.t)+.15*S.h;S.score=sc;
  if(S.f.imparator)return 'de_imparatorluk';if(S.f.kg)return 'de_kuzey';
  return S.f.fedreform&&S.A.aus.f>=55?'de_buyuk':'de_ikili'}
/* ---------- iç siyaset: her tur iki girişim hakkı ---------- */
const deIK=()=>!!S.f.ausortak&&!S.f.kg;
const deKralGain=()=>Math.max(1,3-(S.kstreak||0));
const DIA=[
 {id:'kral',grp:'Kral',t:'Kral\'la baş başa görüş',d:'Raporunu kendin sun; kuşkularını tek tek dağıt. Üst üste yapıldıkça etkisi azalır.',fx:()=>`Kral'ın güveni +${deKralGain()}`,cd:1,
  run:()=>{const g=deKralGain();S.s+=g;S.kstreak=(S.kstreak||0)+1;S.kturn=deN();return g>=3?'Kral\'la bir saat baş başa kaldın. Odadan çıkarken omzuna dokundu.':'Kral dinledi; ama bunları geçen sefer de duymuştu.'}},
 {id:'roon',grp:'Kral',t:'Roon\'u devreye sok',d:'Savaş Bakanı Kral\'a istediği an girebilir; senin söyleyemediğini o söyler.',fx:()=>'Kral\'ın güveni +3 · saray −2',cd:4,req:()=>has('roon'),why:'Roon yakın çevrende değil',
  run:()=>{S.s+=3;S.saray-=2;return 'Roon sabah raporundan sonra Kral\'ın yanında kaldı. Öğleden sonra hava değişmişti.'}},
 {id:'izle',grp:'Saray',t:'Kraliçe\'nin çevresini izlet',d:'Kimin kime ne yazdığını bilirsen karşılığını önceden hazırlarsın. Ortaya çıkarsa bedeli olur.',fx:()=>'Saray −5 · beşte bir ihtimalle ortaya çıkar',cd:2,
  run:()=>{if(chance(.2)){S.saray+=6;S.s-=2;return 'Bir uşak yakalandı ve konuştu. Kraliçe, Kral\'a mektupların açıldığını söyledi.'}S.saray-=5;return 'Baden\'den gelen muhtıra Kral\'a ulaşmadan cevabın hazırdı.'}},
 {id:'veliaht',grp:'Saray',t:'Veliaht\'la uzlaşma ara',d:'Bir gün efendin olacak adamla arayı tamamen bozma.',fx:()=>'Saray −7 · kamuoyu +2 · Kral −1',cd:4,
  run:()=>{S.saray-=7;S.g+=2;S.s-=1;return 'Veliaht\'la uzun bir yürüyüş. Anlaşmadınız; ama birbirinize tahammül edebileceğinizi gördünüz. Kral bu yakınlaşmadan pek hoşlanmadı.'}},
 {id:'surgun',grp:'Saray',t:'Bir saray adamını uzak bir elçiliğe ata',d:'Kral\'ın güveni yüksekken, karşındaki halkadan bir ismi koparırsın.',fx:()=>'Saray −9',cd:5,req:()=>S.s>=55,why:'Kral\'ın güveni en az 55 olmalı',
  run:()=>{S.saray-=9;return 'Atama kararnamesi imzalandı. Bir kişi daha "Roma\'ya, ey günahkâr" diye mırıldanarak bavulunu topladı.'}},
 {id:'yemek',grp:'Meclis',t:'Liberal önderlerle akşam yemeği',d:'Bira, puro ve açık konuşma. Eski dostların bunu sevmez.',fx:()=>'Meclis gerginliği −6 · kamuoyu +2 · saray +2',cd:2,hide:()=>!!S.f.af,
  run:()=>{S.lt-=6;S.g+=2;S.saray+=2;return 'Gece yarısına kadar konuşuldu. Kimse ikna olmadı; ama ertesi gün kürsüdeki dil biraz yumuşaktı.'}},
 {id:'secim',grp:'Meclis',t:'Meclisi feshet, seçime git',d:'Kamuoyu arkandaysa meclis değişir; değilse muhalefet güçlenerek döner.',fx:()=>S.g>=45?'Kamuoyu elverişli: gerginlik düşer':'Kamuoyu elverişsiz: gerginlik artabilir',cd:6,hide:()=>!!S.f.af,
  run:()=>{S.h-=2;if(S.g>=45){S.lt-=20;S.g+=3;return 'Seçimden hükûmete yakın bir meclis çıktı.'}S.lt+=6;S.g-=2;return 'İlericiler sandıktan yine birinci çıktı. Meclis daha da sertleşti.'}},
 {id:'basin',grp:'Basın',t:'Gazetelere yazı yazdır',d:'Dost gazetelere imzasız başyazılar.',fx:()=>`Kamuoyu +${has('bucher')||S.f.bucher2?5:3} · hazine −1`,cd:2,
  run:()=>{S.g+=has('bucher')||S.f.bucher2?5:3;S.h-=1;return 'Yazı üç gazetede aynı gün çıktı. Kimin yazdığını herkes biliyor, kimse kanıtlayamıyor.'}},
 {id:'fon',grp:'Basın',t:'Gizli fondan gazeteci besle',d:'Hannover Kralı\'nın parası, Alman birliği için çalışıyor.',fx:()=>'Kamuoyu +4 · güneyde dostluk +2',cd:2,req:()=>!!S.f.welf_fon,why:'Gizli bir ödeneğin yok',
  run:()=>{S.g+=4;deAdj({sud:{f:2}});return 'Münih ve Stuttgart\'ta birkaç yazar daha maaşa bağlandı.'}},
 {id:'tatbikat',grp:'Ordu',t:'Sonbahar tatbikatına Kral\'la birlikte katıl',d:'Kral askerlerinin arasında mutludur. Komşular dürbünle izler.',fx:()=>'Ordu +2 · Kral +1 · hazine −2 · komşular kuşkulanır',cd:3,
  run:()=>{S.o+=2;S.s+=1;S.h-=2;deAdj({aus:{sus:1.5},fra:{sus:1.5}});return 'Kral iğneli tüfeklerin atış hızını saatiyle ölçtü ve çok memnun kaldı.'}}];
DIA.push({id:'dinlen',grp:'Kendin',t:'Birkaç gün Varzin\'e çekil',d:'Orman, köpekler, uzun yürüyüşler. Kâğıtlar bekler.',fx:()=>'Sağlık +14',cd:2,
  run:()=>{S.sag=cl(S.sag+14);return 'Üç gün kimseyle siyaset konuşmadın. İlk kez deliksiz uyudun.'}});
const DIAB=Object.fromEntries(DIA.map(x=>[x.id,x]));
function deDiaState(x){const n=deN(),last=S.cool['i_'+x.id];
  if(x.req&&!x.req())return x.why;if(last!==undefined&&n-last<x.cd)return `${x.cd-(n-last)} tur sonra yeniden yapılabilir`;if((S.ap||0)<=0)return 'Bu turluk girişim hakkın bitti';return ''}
function deDia(id){const x=DIAB[id];if(!x||(x.hide&&x.hide())||deDiaState(x))return '';S.ap--;S.cool['i_'+id]=deN();const r=x.run();deClamp();S.s=cl(S.s);return r}
/* savaş çıkmayan yollarda dünyanın hâli */
const DWORLD2=[
 "Savaş çıkmadı. Prusya ile Avusturya, Almanya'yı Main hattında iki etki alanına ayırdı; Konfederasyon ayakta. Milliyetçiler hayal kırıklığı içinde, borsalar rahat.",
 "Viyana'da Macarlarla pazarlık sürüyor. III. Napolyon Meksika'dan dönüyor ve gözünü Ren'e çeviriyor.",
 "Fransa, Lüksemburg'u Hollanda Kralı'ndan satın almak istiyor. Almanya'da öfke var; Konfederasyon Meclisi toplanıyor.",
 "Avusturya Macaristan'la uzlaştı: imparatorluk artık iki başlı ve içine dönük.",
 "Avrupa sakin. Prusya'da bütçe kavgası altıncı yılında; Kral yaşlanıyor.",
 "İspanya'da generaller Kraliçe'yi devirdi. Fransa ordusunu yeniliyor; Paris'te “Ren'in hakkı” konuşuluyor.",
 "Güney devletleri iki büyük Alman gücü arasında denge arıyor. Paris, Münih'e ve Stuttgart'a kur yapıyor.",
 "III. Napolyon ile Franz Joseph Salzburg'da buluştu. Görüşmenin konusu açıklanmadı.",
 "Paris, Alman Konfederasyonu'ndan Ren'in sol yakasında “sınır düzeltmesi” istedi. Fransız basını savaş çığlıkları atıyor.",
 "Kriz geride kaldı. Frankfurt'ta Konfederasyon'un yeniden kurulması konuşuluyor.",
 "Kral Wilhelm yetmiş dördüne bastı. Berlin'de herkes Veliaht'ın çevresine bakıyor.",
 "Dokuz yıl doldu. Almanya hâlâ tek bir devlet değil; ama bir savaş alanı da değil."];
const DWORLD3=["Paris krizi kazandığını düşünüyor ve sakinleşti. Londra, iki tarafa da karşılıklı silah indirimi öneriyor.",
 "Bavyera'da Prusya karşıtı Yurtseverler Partisi mecliste çoğunlukta; kuzeyle ittifak antlaşmaları tartışılıyor.",
 "Dokuz yıl doldu. Main'in kuzeyi tek devlet; güneyi hâlâ bekliyor."];
function deWorldLine(n){if(deIK()&&n>=17)return DWORLD2[n-17];if(S.f.kg&&!S.f.sedan&&S.dw!=='fra'&&n>=26)return DWORLD3[n-26];return DWORLD[n-1]}
function deStartDay(){const n=deN();S.prev={t:S.t,s:S.s,c:S.c,sec:S.sec};S.idx=0;S.acted={};S.negToday=false;S.focus=null;S.anim=true;
  S.sag=cl(S.sag===undefined?70:S.sag);S.pk=S.pk||{};
  S.ap=S.f.yatak===n?0:S.sag<25?1:2;if(S.kturn!==n-1)S.kstreak=0;
  const gone=[];S.ctr=S.ctr.filter(id=>{const o=DOFRB[id],ok=o&&o.ok(n);if(!ok&&o)gone.push(o.t);return ok});
  let ids=S.queue.splice(0,3).filter(id=>DEC[id]&&!(DEC[id].once&&S.done[id])&&(!DEC[id].when||DEC[id].when()));
  for(const id of (DANCH[n]||[])){const d=DEC[id];if(!d||ids.includes(id)||(d.once&&S.done[id])||(d.when&&!d.when()))continue;ids.push(id)}
  /* tempo: tarihî gündem yoksa en fazla 1 yan olay; tarihî gündem 2 ve üstüyse hiç */
  const want=Math.max(ids.length,Math.min(2,ids.length+1));
  const pool=DPOOL.filter(id=>!ids.includes(id)&&!(DEC[id].once&&S.done[id])&&(!DEC[id].when||DEC[id].when()));
  while(ids.length<want&&pool.length){const ws=pool.map(id=>Math.max(0,DEC[id].w?DEC[id].w():1)),tot=ws.reduce((a,b)=>a+b,0);if(tot<=0)break;let r=Math.random()*tot,i=0;for(;i<pool.length;i++){r-=ws[i];if(r<=0)break}ids.push(pool.splice(Math.min(i,pool.length-1),1)[0])}
  {const extra=ids.slice(3);ids=ids.slice(0,3);for(const x of extra)if(!S.queue.includes(x))S.queue.push(x)}for(const id of ids)if(DEC[id].show)DEC[id].show();
  S.today=ids.map(id=>({id}));S.slots=[8,10.5,13,15.5,18];
  const B=[`<b>${deLabel(n)}.</b> ${deWorldLine(n)}`];
  if(n===2)B.push('<b>İç siyaset:</b> her tur iki girişim hakkın var. Kral\'la görüşmek, sarayı yatıştırmak, meclisi ve basını yönetmek için “Saray” sekmesini kullan; kendi hâline bırakılan saray Kral\'ın güvenini her tur aşındırır.');
  if(n===1){B.push('Babelsberg, 22 Eylül 1862. Kral masadaki kâğıdı gösteriyor: kendi el yazısıyla tahttan çekilme bildirisi. “Meclise boyun eğecek bakan bulamıyorum,” diyor. Soruyor: orduyu, meclisin kararına rağmen savunur musun? “Evet” diyorsun. “Öyleyse savaşı sizinle birlikte sürdürmek görevimdir; çekilmiyorum.”');
    B.push('Sen Prusya Başbakanı Otto von Bismarck\'sın. Kimseye emir veremezsin: orduya Kral komuta eder, bakanları Kral atar. Elindeki tek şey onun güveni; sıfırlanırsa görevden alınırsın. Diplomasiyi, devleti ve anlaşmaları alttaki sekmelerden yönet.')}
  if(n===DNS)B.push('Bu son tur. Tur sonunda dokuz yılın hesabı görülecek.');
  if(n>1&&window.deVoice){const v=deVoice(n);if(v)B.push('<i>'+v+'</i>')}
  if(S.f.yatak===n)B.push('Yataktasın. Bu tur girişim hakkın yok; gündemleri yastığının üzerinden yönetiyorsun.');else if(S.sag<25)B.push('Sağlığın kötü: bu tur yalnızca bir girişim hakkın var. Saray sekmesinden dinlenebilirsin.');
  if(S.dw==='dk')B.push('Danimarka\'yla savaş sürüyor.');if(S.dw==='fra')B.push(S.f.sedan?'Fransa\'yla savaş sürüyor; Paris kuşatma altında.':'Fransa\'yla savaş başladı; ordular sınırda toplanıyor.');
  for(const a of ['aus','fra','rus','ing']){const lv=deLvl(deRisk(a));if(lv!=='Düşük'&&n>1)B.push(`${DEN[a]}: müdahale ihtimali ${lv.toLowerCase()}.`)}
  if(gone.length)B.push('Süresi dolan anlaşma: '+gone.join(', ')+'.');
  if(has('bleich')){const nx=(DANCH[n+1]||[]).map(id=>DEC[id]).filter(d=>d&&(!d.when||d.when())).map(d=>d.title);if(nx.length)B.push('<b>Bleichröder\'in notu:</b> piyasalar önümüzdeki dönemde şunu konuşuyor: '+nx[0]+'.')}
  if(S.h<12)B.push('Hazine boşalmak üzere: '+Math.round(S.h)+'.');
  if(S.s<30)B.push(`Kral'ın güveni tehlikeli ölçüde düşük (${Math.round(S.s)}). Sıfıra inerse görevden alınırsın; 35'in altındayken Kral bir savaşa razı gelmez.`);
  if(S.lt>=70&&!S.f.af)B.push('Meclis gerginliği yüksek; kamuoyu her tur bundan zarar görüyor.');
  if(S.saray>=65)B.push('Saray muhalefeti güçlü; Kraliçe ve Veliaht Kral\'ı sana karşı işliyor.');
  S.brief=B;S.screen='brief'}
