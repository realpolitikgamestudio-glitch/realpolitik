/* ---------- Kan ve Demir: ekranlar, bitişler, eylemler ---------- */
/* ana dosyanın genel işlevleri bu hikâye için sarılır; diğer hikâyelerde eski davranış aynen sürer */
{const _f=fx;fx=function(e){if(!DE())return _f(e);if(!e)return;let ds=e.s||0,dg=e.g||0,dsa=e.saray||0;
  if(ds<0&&has('roon'))ds*=.7;if(ds<0&&S.course==='C')ds*=1.25;if(dg<0&&(has('bucher')||S.f.bucher2))dg*=.8;if(dsa>0&&has('manteuffel'))dsa*=.6;
  S.s+=ds;S.g+=dg;S.saray+=dsa;for(const k of ['h','o','m','t','lt'])if(e[k])S[k]+=e[k];
  if(e.dip)deAdj(e.dip);deClamp();S.s=cl(S.s);S.t=cl(S.t)}}
{const _n=norm;norm=function(){_n();if(DE())deClamp()}}
{const _d=date;date=function(d){return DE()?deLabel(Math.min(d,DNS)):_d(d)}}
{const _o=off;off=function(){if(!DE())return _o();S.s-=2;S.g-=2;S.offCount++;return ' Bu, ilan ettiğin çizgiye aykırı; sarayda ve basında tutarsızlık konuşuluyor.'}}
{const _c=checkEnd;checkEnd=function(){if(!DE())return _c();norm();if(!S.end&&S.s<=0)end(deN()<=4&&S.saray>=60?'de_cekilme':'de_azil');return !!S.end}}
{const _h=homeOf;homeOf=function(){return DE()?HOME_DE:_h()}}
{const _s=startDay;startDay=function(){return DE()?deStartDay():_s()}}
{const _e=endDay;endDay=function(){return DE()?deEndDay():_e()}}
{const _c=chips;chips=function(e,o){if(!DE())return _c(e,o);const c=[];if(!e)e={};
  const a=(k,l,inv)=>{const v=e[k];if(!v)return;const good=inv?v<0:v>0;c.push(`<span class="chip ${good?'dn':'up'}">${l} ${Math.abs(v)>=8?(v>0?'↑↑':'↓↓'):v>0?'↑':'↓'}</span>`)};
  a('s','Kral');a('t','Koalisyon',1);a('g','Kamuoyu');a('h','Hazine');a('o','Ordu');a('m','Sanayi');a('lt','Meclis gerginliği',1);a('saray','Saray',1);
  if(e.dip)for(const k in e.dip){const d=e.dip[k];if(d.f)c.push(`<span class="chip ${d.f>0?'dn':'up'}">${DEN[k].split(' ')[0]} ${d.f>0?'↑':'↓'}</span>`);else if(d.sus)c.push(`<span class="chip ${d.sus<0?'dn':'up'}">${DEN[k].split(' ')[0]} şüphe ${d.sus>0?'↑':'↓'}</span>`)}
  if(o&&o.off)c.push('<span class="chip bad">Çizgine aykırı</span>');return c.length?`<span class="chips">${c.join('')}</span>`:''}}

/* ---------- olay görselleri ---------- */
ART.d_meclis=()=>AR('#2f2a22','#12100c',`${[0,1,2,3].map(r=>`<path d="M${40+r*16},${96-r*14} Q200,${70-r*16} ${360-r*16},${96-r*14}" fill="none" stroke="#5a4a34" stroke-width="7"/>`).join('')}${[70,110,150,250,290,330].map((x,i)=>`<circle cx="${x}" cy="${74-(i%3)*10}" r="5" fill="#0d0f12"/>`).join('')}<rect x="176" y="20" width="48" height="26" fill="#3d2616" stroke="#c9a45c"/><circle cx="200" cy="14" r="6" fill="#0d0f12"/>${cap('PRUSYA MECLİSİ')}`);
ART.d_saray=()=>AR('#2a2f3a','#0e1218',`<rect x="60" y="44" width="280" height="48" fill="#1c2127" stroke="#4a4234"/><path d="M150,44 H250 L200,14Z" fill="#23292f" stroke="#4a4234"/>${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${76+i*34}" y="54" width="12" height="30" fill="#e9d6a4" fill-opacity="${i===3||i===4?.75:.3}"/>`).join('')}<path d="M200,14 V2" stroke="#c9a45c"/><rect x="200" y="2" width="20" height="10" fill="#d8d2c2"/><rect x="200" y="5" width="20" height="4" fill="#1c2127"/>${cap('SARAY')}`);
ART.d_elci=()=>AR('#2a2f36','#11161c',`<rect x="120" y="40" width="160" height="60" fill="#1c2127" stroke="#4a4234"/><path d="M110,40 H290 L200,12Z" fill="#23292f"/>${[0,1,2,3,4].map(i=>`<rect x="${136+i*28}" y="56" width="14" height="26" fill="#e9d6a4" fill-opacity=".5"/>`).join('')}${cap('WILHELMSTRASSE 76')}`);
ART.d_gazete=()=>AR('#2a2f36','#11161c',`<g transform="rotate(-4 200 55)"><rect x="70" y="10" width="260" height="110" fill="#d9d1b9"/><text x="84" y="40" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="800" font-size="27" fill="#1c2127">BERLİN · SON HABER</text><rect x="84" y="48" width="232" height="2" fill="#1c2127"/>${[0,1,2].map(c=>[0,1,2,3,4,5].map(r=>`<rect x="${84+c*80}" y="${58+r*8}" width="${r%3===2?50:70}" height="3" fill="#1c2127" fill-opacity=".45"/>`).join('')).join('')}</g>`);
ART.d_sahil=()=>AR('#3a5068','#101c28',`<rect y="66" width="400" height="44" fill="#0c1b28"/><path d="M0,66 Q100,58 200,66 T400,62" fill="none" stroke="#5f97d8" stroke-opacity=".6"/><circle cx="330" cy="30" r="14" fill="#e9d6a4" fill-opacity=".5"/><path d="M0,92 Q120,80 260,96 T400,90 V110 H0Z" fill="#5b5038"/><circle cx="120" cy="78" r="4" fill="#0d0f12"/><path d="M114,96 Q120,80 126,96Z" fill="#0d0f12"/><circle cx="140" cy="80" r="4" fill="#0d0f12"/><path d="M134,98 Q140,82 146,98Z" fill="#0d0f12"/>${cap('BİSKAY KIYISI')}`);
ART.d_savas=()=>AR('#5a3a2a','#120908',`<rect y="84" width="400" height="26" fill="#0b0706"/>${[[80,62,22],[200,54,30],[320,66,20]].map(e=>`<circle cx="${e[0]}" cy="${e[1]}" r="${e[2]}" fill="#b9b3a4" fill-opacity=".18"/><circle cx="${e[0]+10}" cy="${e[1]-12}" r="${e[2]*.7}" fill="#b9b3a4" fill-opacity=".12"/>`).join('')}${[40,120,250,340].map(x=>`<g transform="translate(${x},84)"><circle cx="-7" cy="0" r="7" fill="none" stroke="#0b0706" stroke-width="3"/><path d="M-7,-3 L18,-12" stroke="#0b0706" stroke-width="5"/></g>`).join('')}${[170,186,202,218,234].map(x=>`<path d="M${x},84 v-14 M${x},70 l6,-10" stroke="#0b0706" stroke-width="2.5"/><circle cx="${x}" cy="67" r="2.6" fill="#0b0706"/>`).join('')}<path d="M300,84 V40" stroke="#0b0706" stroke-width="2"/><path d="M300,40 h22 v6 h-22z M300,46 h22 v6 h-22z" fill="#d8d2c2" fill-opacity=".8"/><rect x="300" y="46" width="22" height="6" fill="#0b0706"/>${cap('CEPHE')}`);
{const _a=artFor;artFor=function(p){if(!DE())return _a(p);let k='room';
  if(p.type==='dec'){const d=DEC[S.today[p.i].id];k=(d&&d.art)||'room'}else if(p.type==='brief')k='gazete';else if(p.type==='eve')k='room';else if(p.type==='result')k='deal';
  else if(p.type==='end')k=DEND[S.end.type]&&DEND[S.end.type].win?'deal':'saray';
  k={meclis:'d_meclis',saray:'d_saray',elci:'d_elci',gazete:'d_gazete',deniz:'d_sahil',war:'d_savas'}[k]||k;
  return ART[k]?ART[k]():''}}

/* ---------- bitişler ---------- */
const DEND={
 de_imparatorluk:{win:1,t:'Alman İmparatorluğu',x:()=>`Dokuz yılda üç savaş kazandın ve her birinde rakibini yalnız bıraktın. Versay'da Prusya Kralı Alman İmparatoru oldu. ${S.f.alsace===2?'Fransa Alsace ve Lorraine\'i bıraktı; bunu unutmayacak.':S.f.alsace===1?'Fransa Alsace\'ı bıraktı, Metz\'i korudu.':'Fransa sınırını korudu; yalnızca tazminat ödedi.'}${S.f.sertbaris?' Avusturya ise yenilgisinin hesabını hâlâ tutuyor.':''}`,v:()=>S.f.alsace===2?'Avrupa\'nın ortasında yeni bir büyük güç var ve batısında onu affetmeyecek bir komşu. Bundan sonraki işin, kurduğunu korumak için Fransa\'yı yalnız tutmak olacak.':'Avrupa\'nın ortasında yeni bir büyük güç var. Komşularıyla arasındaki yara, tarihte olduğundan daha sığ.'},
 de_kuzey:{win:1,t:'Kuzey Almanya',x:()=>'Avusturya\'yı Almanya\'nın dışına çıkardın ve Main\'in kuzeyini Prusya\'nın çevresinde topladın. Güney devletleri bağımsız kaldı; Fransa\'yla savaş çıkmadı.',v:()=>'Yarım kalmış bir birlik, ama kan dökülmeden korunan bir denge. Birleşmenin gerisini zamana ya da haleflerine bıraktın.'},
 de_buyuk:{win:1,t:'Alman Birliği: savaşsız bir federasyon',x:()=>`Avusturya'yla savaşmadın; onunla birlikte Konfederasyon'u yeniden kurdun. Ortak ordu, ortak gümrük ve ${S.f.geneloy||S.doc.mes==='oy'?'seçilmiş':'hükûmetlerin oluşturduğu'} bir meclis var; başkanlık Berlin ile Viyana arasında dönüyor.${S.f.ortakzafer?' Ren krizinde Fransa bu birliğin karşısında geri adım attı.':''}`,v:()=>'Tarihte yaşanmamış bir Almanya: imparatoru yok, Alsace sorunu yok, iki başkenti var. Ne kadar dayanacağı, Viyana ile Berlin\'in birbirine ne kadar katlanacağına bağlı.'},
 de_ikili:{win:1,t:'İki başlı Almanya',x:()=>'Avusturya\'yla savaşmadın. Almanya, kuzeyde Prusya\'nın, güneyde Avusturya\'nın etkisinde iki alana bölündü; Konfederasyon ayakta.',v:()=>'Londra\'da Disraeli\'ye söylediklerinin hiçbiri olmadı. Prusya büyüdü, ama Almanya kurulmadı.'},
 de_azil:{t:'Azil',x:()=>'Kral\'ın güveni tükendi. Bir sabah saraydan gelen yaver, Majestelerinin hizmetlerine artık ihtiyaç duymadığını bildirdi.',v:()=>'Varzin\'deki ormanda yürüyor ve gazetelerde halefinin adını okuyorsun.'},
 de_cekilme:{t:'Kral tahttan çekildi',x:()=>'Wilhelm, Babelsberg\'deki çekmeceden o kâğıdı çıkardı ve imzaladı. Veliaht Friedrich tahta çıktı; ilk işi seni görevden almak oldu.',v:()=>'Prusya\'da liberal bir dönem başlıyor: meclise karşı sorumlu bakanlar, İngiliz usulü bir krallık. Almanya\'nın birliği başka bir yoldan ve başka ellerle aranacak.'},
 de_istifa:{t:'İstifa',x:()=>'İstifanı sundun ve Kral kabul etti.',v:()=>'Elçiliklerden birine atanman konuşuluyor. Berlin\'de yerine kimin geleceğini kimse bilmiyor.'},
 de_yenilgi:{t:'Yenilgi',x:()=>'Ordu savaş alanında yenildi. Kumar oynadın ve kaybettin; elinde gerçekten olmayan bir milyonu masaya sürmüştün.',v:()=>'Barışı galipler yazıyor. Senin adın, ülkesini felakete sürükleyen maceracı olarak anılacak.'},
 de_ikicephe:{t:'İki cepheli savaş',x:()=>'Rakibini yalnız bırakamadın. İkinci bir büyük güç savaşa girdi; Prusya iki ateş arasında kaldı.',v:()=>'Büyük Friedrich\'in yedi yılda ucuz atlattığı kâbus, bu kez gerçek oldu.'},
 de_olmutz:{t:'İkinci Olmütz',x:()=>'Seferberlikten sonra geri adım attın. Kral küçük düştü, ordu öfkeli, kamuoyu alay ediyor.',v:()=>'Prusya bir kez daha Avusturya\'nın önünde eğildi. Bunu yapan başbakan görevde kalamaz.'}};
function deFile(){const A=S.A;
  return `<p>${A.fra.sus>=60?'Paris, Prusya\'nın büyümesini baştan beri bir tehdit olarak gördü.':'Paris, Almanların birbirini yıpratmasını bekledi ve hakemlik ücretini hesapladı.'}</p>
  <p>${A.rus.f>=50?'Petersburg dost kaldı; arkanı kollayan oydu.':'Petersburg\'la arandaki soğukluk her savaşta sırtında bir ağırlıktı.'}</p>
  <p>${A.ing.f>=45?'Londra seyirci kalmayı seçti.':'Londra seni kıtanın huzurunu bozan adam olarak gördü, ama asker göndermedi.'}</p>
  <p class="muted">${{A:'Olaylar tarihteki seyrine yakın ilerledi.',B:'Bu oyunda Fransa Meksika\'dan erken döndü ve Almanya\'ya daha erken karıştı.',C:'Bu oyunda Kral daha kararsızdı; her ikna daha pahalıya mal oldu.',D:'Bu oyunda Avusturya uzlaşmaya daha açıktı.'}[S.course]}</p>`}
function vEndDE(){const E=DEND[S.end.type],n=deN();
  return win(deLabel(n),`<h1>${E.t}</h1><p>${E.x()}</p><p class="eyebrow">Sonrası</p><p>${E.v()}</p>
    <p class="mono">Kral ${Math.round(S.s)} · Kamuoyu ${Math.round(S.g)} · Ordu ${Math.round(S.o)} · Hazine ${Math.round(S.h)} · Koalisyon riski ${Math.round(S.t)}</p>
    ${E.win?`<p class="mono">Genel değerlendirme ${Math.round(S.score||0)} / 100</p>`:''}
    <p class="eyebrow">Açılan dosya</p>${deFile()}
    ${S.div.length?'<p class="eyebrow">Tarihten sapmaların</p>'+S.div.slice(-8).map(d=>`<div class="item"><span class="tag">${deLabel(d.d)}</span><p>${d.what} <span class="muted">Gerçekte: ${d.real}</span></p></div>`).join(''):'<p class="muted">Tarihin akışından belirgin biçimde sapmadın.</p>'}
    ${btn('finish',null,'Oyunu bitir','go')}`)}

/* ---------- pencereler ---------- */
const deBar=(l,v,cls)=>`<div class="gl" style="display:flex;justify-content:space-between"><span>${l}</span><b>${Math.round(v)}</b></div><div class="bar ${cls||''}"><i style="width:${cl(v)}%"></i></div>`;
const deDot=a=>`<span style="width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:${DCOL[a]};display:flex;align-items:center;justify-content:center;color:#0c131b;font-weight:800">${DEN[a][0]}</span>`;
function vDipDE(){const n=deN();
  const rows=Object.keys(DEN).map(a=>{const A=S.A[a],c=deCap(a,n),ld=deLeader(a,n),big=a!=='ita'&&a!=='sud';
    return btn('dipc',a,`<span style="display:flex;gap:9px;align-items:center">${deDot(a)}<span style="flex:1"><strong style="display:block;color:${DCOL[a]}">${DEN[a]}</strong><small style="display:block">${ld[0]} · Dostluk ${Math.round(A.f)} · Şüphe ${deSusTxt(a)}</small><small style="display:block">${big?'Müdahale ihtimali '+deLvl(deRisk(a)).toLowerCase()+' · kapasite '+(c<25?'kapalı':c<50?'sınırlı':c<70?'açık':'tam'):'Yararlılık '+Math.round(A.use)}</small></span></span>`,'opt')}).join('');
  return win('Dışişleri · Diplomasi',`<p class="mono muted">${deLabel(n).toUpperCase()} · GÖRÜŞME HAKKI: ${S.acted.talk?'kullanıldı':'1'}${S.dw?' · SAVAŞ: '+({dk:'DANİMARKA',aus:'AVUSTURYA',fra:'FRANSA'}[S.dw]):''}</p><p class="say" style="margin:0"><b>Kural</b>Bir savaşı ancak rakibin yalnızken kazanırsın. Savaş anında kapasitesi açık ve şüphesi 60'ın üstünde olan her büyük güç araya girebilir; ikisi birden girerse oyun biter.</p>${rows}`,'closeSheet')}
function deActs(a){const n=deN(),A=S.A[a],L=[];
  L.push({id:'talk',t:'Elçiyle görüş, güvence ver',d:'Şüpheyi dağıtır.',cost:'1 görüşme hakkı',fx:'Dostluk +3 · şüphe −6 · rakibi kuşkulanır',ok:!S.acted.talk,why:'Bu turluk görüşme hakkın bitti'});
  L.push({id:'mission',t:'Ticaret heyeti gönder',d:'Gümrük ve demiryolu görüşmeleri.',cost:'Hazine −3',fx:'Dostluk +5 · yararlılık +4',ok:S.h>=8&&!S.acted['m'+a],why:S.h<8?'Hazine yetersiz':'Bu tur zaten gönderildi'});
  if(a!=='ita'&&a!=='sud')L.push({id:'guar',t:'Tarafsızlık sözü iste',d:'Bir savaşta kenarda kalacağına dair söz.',cost:'Prestij riski',fx:'Başarılıysa 4 tur kapasitesi düşer',ok:n-(S.cool['g'+a]===undefined?-9:S.cool['g'+a])>=3,why:'Üç turda bir istenebilir'});
  L.push({id:'trade',t:'Anlaşmalara bak',d:'Bu ülkeyle yapılabilecek anlaşmalar.',cost:'—',fx:'Anlaşmalar sekmesi açılır',ok:true});
  return L}
function vDipcDE(){const a=U.dipc,n=deN(),A=S.A[a];if(!A)return win(String(a).startsWith('x:')&&U.dipName||'Ülke',(U.dipNote?`<p>${U.dipNote}</p>`:'')+'<p class="muted">Bu ülke bu dosyada masada değil; doğrudan bir ilişkin yok.</p>','closeSheet');
  const ld=deLeader(a,n),c=deCap(a,n),big=a!=='ita'&&a!=='sud',soz=(S.f['soz_'+a]||0)>=n;
  const rows=deActs(a).map(x=>btn('ddipa',a+':'+x.id,`<strong>${x.t}</strong><small>${x.d}</small><small>Maliyet: ${x.cost} · Etki: ${x.fx}</small>${x.ok?'':`<small style="color:var(--sov)">${x.why}</small>`}`,'opt',!x.ok)).join('');
  const contr=S.ctr.filter(i=>DOFRB[i].p===a&&!DOFRB[i].neutral).map(i=>`<small class="muted">• ${DOFRB[i].t}</small>`).join('')||'<small class="muted">Etkin anlaşma yok.</small>';
  const tips=[];if(deSusSeen(a)>55)tips.push('Şüphe yüksek: güvence ver ya da onu kızdıran adımlardan bir süre kaçın.');if(A.f<40)tips.push('Dostluk düşük: heyet gönder ya da bir anlaşma imzala.');if(big&&c>=50&&deSusSeen(a)>=60)tips.push('Şu an bir savaş açarsan bu güç araya girebilir.');if(!tips.length)tips.push('İlişki dengede.');
  return win(DEN[a],`<div style="display:flex;gap:10px;align-items:center;border-bottom:2px solid ${DCOL[a]};padding-bottom:8px">${deDot(a)}<div><b>${ld[0]}</b><br><small class="muted">${ld[1]}</small></div></div>
    <div class="stack"><p class="eyebrow">İlişkilerin</p>${deBar('Dostluk',A.f,'brass')}${deBar(deAtt(a)?'Şüphe · ataşe raporu':'Şüphe (tahmini)',deSusSeen(a),deSusSeen(a)>60?'danger':deSusSeen(a)>40?'warn':'')}${deAttLine(a)}${deBar('Yararlılık',A.use,'brass')}
     ${big?`<p class="mono muted">MÜDAHALE İHTİMALİ: ${deLvl(deRisk(a))} · KAPASİTE: ${c<25?'Kapalı':c<50?'Sınırlı':c<70?'Açık':'Tam'}${soz?' · SÖZ VERDİ':''}</p>`:''}<small class="muted">${deCapWhy(a,n)}</small><small class="muted">${DWANT[a]}</small><small class="muted">${DRED[a]}</small></div>
    <div class="stack"><p class="eyebrow">Anlaşmalar</p>${contr}</div>
    <div class="stack"><p class="eyebrow">Neler yapabilirsin</p>${rows}</div>
    <div class="stack"><p class="eyebrow">Not</p>${tips.map(x=>`<p class="say" style="margin:0">${x}</p>`).join('')}</div>${btn('sheet','dip','‹ Bütün ülkeler','ghost')}`,'closeSheet')}
function vEkoDE(){const O=S.ord,F=deFlows(),seg=(k,cur,list)=>`<div class="seg">${list.map(([v,l])=>btn('deo',k+':'+v,l,cur===v?'sel':'')).join('')}</div>`;
  let net=F.h;for(const id of S.ctr){const x=DOFRB[id];if(x)net+=x.e.h||0}
  const ex=Object.entries(DEXTRA).map(([k,x])=>{const no=S.acted.extra||(k==='hisse'&&S.f.hisse)||(k==='kredi'&&!has('bleich'));return btn('dex',k,`<strong>${x.t}</strong><small>${x.who}</small><small>${x.gain} ${x.cost}</small>`,'opt',!!no)}).join('');
  return win('Devlet',`<p class="mono muted">${deLabel(deN()).toUpperCase()} · TUR BİLANÇOSU ${net>=0?'+':'−'}${Math.abs(Math.round(net*10)/10)}</p>
    <div class="stack"><p class="eyebrow">Durum</p>${deBar('Hazine',S.h,S.h<15?'danger':'brass')}${deBar('Ordu',S.o,S.o<40?'warn':'brass')}${deBar('Demiryolu ve sanayi',S.m,'brass')}${deBar('Kamuoyu',S.g,S.g<25?'danger':'')}${S.f.af?'<p class="mono muted">MECLİS: kavga kapandı</p>':deBar('Meclis gerginliği',S.lt,S.lt>=70?'danger':S.lt>=50?'warn':'')}${deBar('Saray muhalefeti',S.saray,S.saray>=65?'danger':S.saray>=50?'warn':'')}</div>
    <h4>Ayarlar</h4>
    <div class="ctl"><h3>Bütçe</h3>${S.f.af?'<small>Meclis bütçeyi onaylıyor; kavga dönemi kapandı.</small>':seg('butce',O.butce,[[0,'Meclisin verdiğiyle'],[1,'Bütçesiz yönetim']])+`<small>${O.butce?'Vergiler toplanır, ordu reformu sürer. Her tur hazine artar, meclis gerginliği büyür, kamuoyu aşınır.':'Anayasaya uygun. Ordu reformu için para yetmeyebilir.'}</small>`}</div>
    <div class="ctl"><h3>Seferberlik</h3>${seg('sefer',O.sefer,[[0,'Barış'],[1,'Kısmi'],[2,'Tam']])}<small>${['Ordu kışlada. Savaşa hazırlıksız girersen ağır bedel ödersin.','Yedekler çağrıldı. Her tur hazineden yer; komşular kuşkulanır.','Ordu sınırda. Çok pahalı; Viyana ve Paris bunu savaş hazırlığı sayar.'][O.sefer]}</small></div>
    <div class="ctl"><h3>Basın kararnamesi</h3>${seg('basin',O.basin,[[0,'Kapalı'],[1,'Yürürlükte']])}<small>${O.basin?'Muhalefet gazeteleri susturuldu. Saray muhalefeti her tur büyür; Londra\'da itibarın düşer.':'Basın serbest.'}</small></div>
    <div class="ctl"><h3>Memur disiplini</h3>${seg('memur',O.memur,[[0,'Serbest'],[1,'Sıkı']])}<small>${O.memur?'Muhalif memurlar ve yargıçlar baskı altında: meclis gerginliği daha yavaş büyür, kamuoyu aşınır.':'Memurlar siyasetle uğraşabiliyor.'}</small></div>
    <h4>Olağanüstü kaynaklar</h4><p class="mono muted">${S.acted.extra?'Bu tur bir kaynak kullanıldı.':'Her tur bir tanesi kullanılabilir.'}</p>${ex}`,'closeSheet')}
const deEff=e=>Object.entries(e).map(([k,v])=>`${{h:'Hazine',o:'Ordu',m:'Sanayi'}[k]} ${v>0?'+':'−'}${Math.abs(v)}`).join(' · ');
function vTicDE(){const free=3-S.ctr.length,L=deOffers();
  const row=o=>{const on=S.ctr.includes(o.id),no=!on&&(free<=0||(o.req&&!o.req()));
    return `<div class="ctl"><h3 style="color:${o.neutral?'var(--ink)':DCOL[o.p]}">${o.t}</h3><small>Verilen: ${o.give} · Alınan: ${o.get}</small><small>Her tur: ${deEff(o.e)||'—'}${o.neutral?'':` · ${DEN[o.p]} dostluğu ↑`}${Object.keys(o.rv).length?' · '+Object.keys(o.rv).map(k=>DEN[k]).join(', ')+' kuşkulanır':''}</small>${o.req&&!o.req()?`<small style="color:var(--sov)">${o.reqText}</small>`:''}${on?btn('decancel',o.id,'Anlaşmayı bitir','ghost'):btn('designe',o.id,'İmzala','ghost',no)}</div>`};
  return win('Anlaşmalar',`<p class="mono muted">ETKİN: ${S.ctr.length} / 3</p>${L.length?L.map(row).join(''):'<p class="muted">Şu an yapılabilecek anlaşma yok.</p>'}`,'closeSheet')}
function vIcDE(){const grp={};for(const x of DIA){if(x.hide&&x.hide())continue;(grp[x.grp]=grp[x.grp]||[]).push(x)}
  const body=Object.entries(grp).map(([g,L])=>`<div class="stack"><p class="eyebrow">${g}</p>${L.map(x=>{const no=deDiaState(x);return btn('dia',x.id,`<strong>${x.t}</strong><small>${x.d}</small><small>Etki: ${x.fx()}</small>${no?`<small style="color:var(--sov)">${no}</small>`:''}`,'opt',!!no)}).join('')}</div>`).join('');
  return win('Saray ve iç siyaset',`<p class="mono muted">${deLabel(deN()).toUpperCase()} · GİRİŞİM HAKKI: ${S.ap||0} / 2</p>
    ${deBar('Kral\'ın güveni',S.s,S.s<30?'danger':S.s<45?'warn':'brass')}${deBar('Saray muhalefeti',S.saray,S.saray>=65?'danger':S.saray>=50?'warn':'')}${S.f.af?'':deBar('Meclis gerginliği',S.lt,S.lt>=70?'danger':S.lt>=50?'warn':'')}${deBar('Kamuoyu',S.g,S.g<25?'danger':'')}${deBar('Sağlığın',S.sag,S.sag<25?'danger':S.sag<45?'warn':'brass')}
    <p class="say" style="margin:0"><b>Nasıl işler</b>Saray muhalefeti her tur Kral'ın güvenini aşındırır (şu an tur başına yaklaşık −${(S.saray/18).toFixed(1)}). Her tur iki girişimle Kral'ı, sarayı, meclisi ya da basını işleyebilirsin; kullanılmayan hak devretmez.</p>${body}`,'closeSheet')}
{const _v=vSheet;vSheet=function(){if(!DE())return _v();
  if(U.sheet==='ic')return vIcDE();
  if(['orders','actions','dip'].includes(U.sheet))return vDipDE();if(U.sheet==='dipc')return vDipcDE();
  if(U.sheet==='eko')return vEkoDE();if(U.sheet==='tic')return vTicDE();
  if(U.sheet==='log')return win('Günlük',S.hist.length?[...S.hist].reverse().map(l=>`<div class="item"><span class="tag">${deLabel(l.d)}<br>${l.tag}</span><p>${l.text}</p></div>`).join(''):'<p class="muted">Henüz kayıt yok.</p>','closeSheet');
  return _v()}}
{const _v=vDrawer;vDrawer=function(){if(!DE())return _v();const D=S.doc,loy=v=>v>=70?'Sadık':v>=50?'Yanında':v>=35?'Huzursuz':'Küskün';
  return `<div class="ph"><div><h3>Otto von Bismarck</h3><p class="mono muted">Prusya Başbakanı · ${deLabel(deN())}</p></div><button data-act="closeDrawer" aria-label="Kapat">✕</button></div>
  <div class="stack"><p class="eyebrow">Durum</p>
   ${gauge('Kamuoyu',S.s,S.s<30?'danger':S.s<45?'warn':'','Elindeki tek gerçek güç. Sıfıra inerse görevden alınırsın.',null,'Kral\'ın güveni')}
   ${gauge('Gerilim',S.t,S.t>=60?'danger':S.t>=40?'warn':'','Büyük güçlerin sana karşı birlikte hareket etme ihtimali.',null,'Koalisyon riski')}
   ${gauge('Halk',S.g,S.g<25?'danger':'','Liberallerin ve milliyetçilerin desteği.',null,'Kamuoyu')}
   ${gauge('Ordu',S.o,S.o<40?'warn':'brass','Reform, iğneli tüfek, seferberlik hızı. Savaşları bu kazanır.',null,'Ordu')}
   ${gauge('Hazine',S.h,S.h<15?'danger':'brass','Savaş açacaksan en az 30 olmalı.',null,'Hazine')}
   ${gauge('Sanayi',S.m,'brass','Demiryolu, çelik, gümrük birliği.',null,'Demiryolu ve sanayi')}
   ${S.f.af?'':gauge('Meclis',S.lt,S.lt>=70?'danger':S.lt>=50?'warn':'','70\'in üstünde kamuoyu her tur zarar görür.',null,'Meclis gerginliği')}
   ${gauge('Saray',S.saray,S.saray>=65?'danger':S.saray>=50?'warn':'','Kraliçe, Veliaht ve çevresi. Her tur Kral\'ın güvenini aşındırır.',null,'Saray muhalefeti')}
   ${gauge('Sağlık',S.sag,S.sag<25?'danger':S.sag<45?'warn':'brass','Her tur ve her karar yıpratır; savaşta daha hızlı. Sıfıra inerse bir tur yatağa düşersin. Saray sekmesinden dinlenebilirsin.',null,'Sağlık')}</div>
  ${fold('doc','Çizgi ve doktrin',`${Object.entries(DOC).filter(([k,d])=>GRP(d)==='de').map(([k,d])=>{const o=d.o.find(x=>x[0]===D[k]);return o?`<div class="idl"><span><b>${o[1]}</b> · ${d.t}</span><small>${o[2]}</small></div>`:''}).join('')}${S.offCount?`<p class="mono" style="color:var(--sov)">Çizgine aykırı karar: ${S.offCount}</p>`:''}`)}
  ${fold('cab','Yakın çevre',`${S.cab.length?S.cab.map(id=>`<div class="cabr">${av(id)}<div class="tx"><b>${ADV[id].n}</b><small>${ADV[id].r} · ${ADV[id].e}</small><div class="bar ${S.loy[id]<35?'danger':S.loy[id]<50?'warn':'brass'}"><i style="width:${cl(S.loy[id]||0)}%"></i></div><small>${loy(S.loy[id]||0)}</small></div></div>`).join(''):'<p class="muted">Henüz kurulmadı.</p>'}`)}`}}
{const _v=vTop;vTop=function(){if(!DE())return _v();const p=PHOTO.jfk,l=LOOK.jfk;PHOTO.jfk=PHOTO.bismarck||null;LOOK.jfk=LOOK.bismarck;try{return _v()}finally{PHOTO.jfk=p;LOOK.jfk=l}}}
{const _v=vPopInner;vPopInner=function(){const p=S.pops[0];if(!p||S.setup||!DE())return _v();
  if(p.type==='brief')return win(`${deLabel(deN())} · Tur başı`,S.brief.map(b=>`<p>${b}</p>`).join('')+btn('popOk',null,'Anlaşıldı','go'));
  if(p.type==='eve')return win(`Tur raporu · ${deLabel(deN())}`,S.log.map(l=>`<div class="item"><span class="tag">${l.tag}</span><p>${l.text}</p></div>`).join('')+btn('popOk',null,deN()>=DNS?'Sonuca geç':'Yeni tura geç','go'));
  if(p.type==='end')return vEndDE();
  if(p.type==='dec'){const t=S.today[p.i],d=DEC[t.id],opts=d.opts(),h=DUR[t.id]||4;let b=`<h2>${d.title}</h2><p>${txt(d.text)}</p>`;
    {const c=window.DCALL&&DCALL[t.id]&&DCALL[t.id]();if(c)b+=`<p class="say" style="margin:0 0 10px"><b>Geçmişten</b>${c}</p>`}
    b+=`<div class="advs">${S.cab.map(id=>`<button class="avb${U.focus===id?' sel':''}" data-act="focus" data-arg="${id}"><span class="bub">${(SHORT[t.id]||opts.map(o=>o.label))[rec(t.id,opts,id)]||'—'}</span>${av(id)}<small>${ADV[id].k}</small></button>`).join('')}</div>`;
    if(U.focus&&has(U.focus))b+=`<div class="say"><b>${ADV[U.focus].n}</b>${(d.quotes||{})[U.focus]||'Bu seçeneğin arkasındayım, Ekselans.'}</div>`;
    b+=opts.map((o,i)=>{const no=o.req&&!o.req(),who=S.cab.filter(id=>rec(t.id,opts,id)===i).map(id=>ADV[id].k);return btn('pick',i,`<strong>${o.label}</strong><small>${no?o.reqText:o.desc}</small>${no?'':chips(o.eff,o)}${who.length?`<span class="who">Öneren: ${who.join(', ')}</span>`:''}`,'opt',no)}).join('');
    return win(`Wilhelmstrasse gündemi · sonuç ≈ ${h} saat sonra`,b)}
  return _v()}}

/* ---------- harita: 1860'ların Avrupa'sı, bugünün sınırları dönemin devletlerine gruplanarak ---------- */
const DEBLOC={};for(const [k,ids] of Object.entries({PRU:['DEU'],AUS:['AUT','HUN','CZE','SVK','SVN','HRV'],FRA:['FRA','DZA'],
  RUS:['RUS','UKR','BLR','EST','LVA','LTU','MDA','GEO','ARM','AZE','KAZ','UZB','TKM','KGZ','TJK','FIN','POL'],ITA:['ITA'],DNK:['DNK','ISL','GRL'],
  OTT:['TUR','SYR','IRQ','LBN','ISR','PSE','JOR','BGR','ALB','MKD','BIH','kosovo','LBY','EGY','TUN','CYP','northern_cyprus','SAU','YEM','KWT'],VAS:['ROU','SRB'],SWE:['SWE','NOR'],
  ING:['GBR','IRL','CAN','AUS','NZL','IND','PAK','BGD','MMR','LKA','ZAF'],ESP:['ESP'],NLB:['NLD','BEL','LUX','CHE']}))for(const id of ids)DEBLOC[id]=k;
Object.assign(TRBC,{PRU:'#8e9aa8',AUS:'#c9ab5c',FRA:'#5e83c4',RUS:'#6e8a57',DNK:'#c98544',OTT:'#9c4a3e',ESP:'#b99a52',NLB:'#8a7fa6',VAS:'#b7806f',SWE:'#7fa3a0'});
const DELABELS=[['PRU','PRUSYA',17.2,53.1,3.2],['AUS','AVUSTURYA İMP.',17.2,47.4,6,-8],['FRA','FRANSA',2.5,46.8,6.5],['RUS','RUS İMPARATORLUĞU',44,56,30],['ING','B. KRALLIK',-2,53,4.5,-70],
  ['ITA','İTALYA',12.6,42.6,5,-48],['DNK','DANİMARKA',9.3,56.1,2.4],['OTT','OSMANLI İMPARATORLUĞU',33,39.2,13],['ESP','İSPANYA',-3.7,40,7.5],['SWE','İSVEÇ–NORVEÇ',15.5,62.5,6,65],['ROU','ROMANYA',25.3,45.6,2.4],['SRB','SIRBİSTAN',20.9,43.6,1.5],['GRC','YUNANİSTAN',22.3,38.3,1.8],['NLB','BELÇİKA',4.6,50.6,1.6],['USA','BİRLEŞİK DEVLETLER',-98,39.5,36]];
{const _b=trBlocOf;trBlocOf=function(id,n){if(G.de)return DEBLOC[id]||'NEU';return _b(id,n)}}
{const _p=window.trAddParcels;window.trAddParcels=trAddParcels=function(w,f){if(G.de)return;return _p(w,f)}}
function deWorld(on){if(!G.ok)return;if(on){if(G.de&&G.tr)return;G.de=true;const keep=TRLABELS.slice();TRLABELS.length=0;TRLABELS.push(...DELABELS);try{G.tr=false;trWorld(true)}finally{TRLABELS.length=0;TRLABELS.push(...keep)}}
  else if(G.de){G.de=false;if(G.tr)trWorld(false)}}
/* ---------- uzun basma: ülke paneli ---------- */
const DEACT={AUS:'aus',FRA:'fra',RUS:'rus',ING:'ing',ITA:'ita'};
function deHold(sx,sy){if(!DE()||S.setup||S.pops.length||!G.ok)return;G.holdAt=performance.now();const r=$('gl').getBoundingClientRect(),cp=G.camera.position,v=new THREE.Vector3((sx-r.left)/r.width*2-1,1-(sy-r.top)/r.height*2,.5).unproject(G.camera).sub(cp),t=-cp.z/v.z,gx=cp.x+v.x*t,gy=cp.y+v.y*t;
  const lon=((gx+180)%360+360)%360-180,L=Math.exp(gy*Math.PI/180/1.25),lat=(Math.atan(L)-Math.PI/4)/.4*180/Math.PI;
  const pk=window.deParcelAt&&deParcelAt(lon,lat);
  if(pk){U.drawer=false;if(pk==='PRU')U.sheet='eko';else{U.sheet='devlet';U.dev=pk}if(navigator.vibrate)try{navigator.vibrate(18)}catch(e){}return ui()}
  const rg=window.deRegionAt&&deRegionAt(lon,lat);
  if(rg){U.drawer=false;U.dipNote=ENOTE[rg.k]||'';const own={AUS:'aus',ITA:'ita',ING:'ing'}[rg.s];U.sheet='dipc';if(own)U.dipc=own;else{U.dipc='x:'+rg.k;U.dipName=rg.s==='OTT'?'OSMANLI İMPARATORLUĞU · '+ENAME[rg.k].toLocaleUpperCase('tr-TR'):ENAME[rg.k].toLocaleUpperCase('tr-TR')}if(navigator.vibrate)try{navigator.vibrate(18)}catch(e){}return ui()}
  const f=trPick(lon,lat);if(!f)return;const b=DEBLOC[f.id];U.drawer=false;U.dipNote='';
  if(b==='PRU'){if(lat<50&&lon>7.5){U.sheet='dipc';U.dipc='sud'}else U.sheet='eko'}
  else{U.sheet='dipc';U.dipc=DEACT[b]||('x:'+f.id);U.dipName=(DELABELS.find(l=>l[0]===f.id)||DELABELS.find(l=>l[0]===b)||[])[1]||(f.properties&&f.properties.name)||f.id}
  if(navigator.vibrate)try{navigator.vibrate(18)}catch(e){}ui()}
{let t=null,sx=0,sy=0;const cv=$('gl');
  cv.addEventListener('pointerdown',e=>{clearTimeout(t);if(!DE()||S.setup||G.ptr.size>1)return;sx=e.clientX;sy=e.clientY;t=setTimeout(()=>deHold(sx,sy),480)});
  cv.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-sx,e.clientY-sy)>9||G.ptr.size>1)clearTimeout(t)});
  for(const n of ['pointerup','pointercancel'])cv.addEventListener(n,()=>clearTimeout(t))}
const DEPP={aus:[16.4,48.2],fra:[2.35,48.85],rus:[30.3,59.9],ing:[-.1,51.5],ita:[11.25,43.77],sud:[11.58,48.14]};
function refreshUnitsDE(){if(!G.ok)return;const play=!S.setup,n=deN();
  for(const k in G.units){if(k.slice(0,2)!=='d_')G.units[k].sp.visible=false}
  if(G.sites)G.sites.forEach(m=>m.visible=false);for(const k of ['arc','route'])if(G[k])G[k].visible=false;
  const seen={},put=(id,text,col,lon,lat)=>{seen[id]=1;unit(id,text,col,lon,lat,null,play)};
  put('d_ber','★ BERLİN · ORDU %'+Math.round(S.o),'#d8d2c2',13.4,52.5);
  for(const a of ['aus','fra','rus','ing'])put('d_'+a,`${DEN[a].toUpperCase()} · ${deLvl(deRisk(a)).toUpperCase()}`,DCOL[a],DEPP[a][0],DEPP[a][1]);
  put('d_ita','İTALYA'+(S.f.italya&&!S.f.kg?' · MÜTTEFİK':''),DCOL.ita,DEPP.ita[0],DEPP.ita[1]);put('d_sud','MÜNİH'+(S.f.guney?' · MÜTTEFİK':''),DCOL.sud,DEPP.sud[0],DEPP.sud[1]);
  if(S.dw==='dk'||(S.f.kondo&&!S.f.kg))put('d_dk',S.dw==='dk'?'DÜPPEL · SAVAŞ':'DUKALIKLAR','#c98544',9.6,54.6);
  if(S.dw==='aus')put('d_kg','KÖNİGGRÄTZ · SAVAŞ','#dc5b4e',15.83,50.21);
  if(S.dw==='fra')put('d_fr',S.f.sedan?'PARİS · KUŞATMA':'CEPHE','#dc5b4e',S.f.sedan?2.35:6.2,S.f.sedan?48.2:49.2);
  for(const k in G.units)if(k.slice(0,2)==='d_'&&!seen[k])G.units[k].sp.visible=false;
  const w=[];if(S.dw==='dk')w.push([13.4,my(52.5)],[9.6,my(54.6)]);if(S.dw==='fra')w.push([13.4,my(52.5)],[2.35,my(48.85)]);if(S.dw==='aus')w.push([13.4,my(52.5)],[15.83,my(50.21)]);
  if(G.war){G.war.geometry.dispose();G.war.geometry=new THREE.BufferGeometry().setFromPoints(w.map(p=>new THREE.Vector3(p[0],p[1],.06)));G.war.visible=w.length>0}}
{const _r=refreshUnits;refreshUnits=function(){if(DE())return refreshUnitsDE();if(G.ok)for(const k in G.units)if(k.slice(0,2)==='d_')G.units[k].sp.visible=false;return _r()}}

/* ---------- açılış, hazırlık ve kapanış ekranları ---------- */
STORIES.splice(3,0,{id:'de62',yr:'1862–71 · Berlin',t:'Kan ve Demir',d:'Dokuz yıl, üç savaş ve seni her an azledebilecek bir kral. Otto von Bismarck olarak meclisi, sarayı ve beş büyük gücü aynı anda idare et.'});
PARTS.de62='<span class="ph"><img src="de62-kapak.webp" alt=""></span>';
LDS.de62={img:'de62-kapak.webp',kick:'Dosya 04 · Eylül 1862',title:'Kan ve Demir',steps:['Elçilik raporları açılıyor…','Sınırlar 1862\'ye çevriliyor…','Kral bekliyor…'],next:'de62intro'};
PHOTO.bismarck='p/bismarck.jpg';
const EPI_DE=['Eylül 1862\'de meclis ordu reformunu reddettiğinde Kral Wilhelm tahttan çekilmeyi düşünüyordu. Savaş Bakanı Roon\'un ısrarıyla Paris elçisi Otto von Bismarck\'ı çağırdı. Bismarck dört yıl boyunca ülkeyi onaylanmış bütçe olmadan yönetti.',
  '1863\'te Polonya ayaklanmasında Rusya\'nın yanında durdu ve Kral\'ı, Avusturya\'nın Frankfurt\'ta topladığı Prensler Kongresi\'ne gitmemeye ikna etti. 1864\'te Avusturya\'yla birlikte Danimarka\'yı yendi; Schleswig ve Holstein iki devletin ortak yönetimine geçti.',
  'Bu ortaklık iki yıl sürdü. Haziran 1866\'da savaş çıktığında Alman devletlerinin çoğu Avusturya\'nın yanındaydı. 3 Temmuz\'da Königgrätz\'te Prusya kazandı. Bismarck, Kral\'ın isteğine karşı Avusturya\'dan toprak almadı; yalnızca Almanya\'dan çekilmesini istedi.',
  'Prusya Hannover\'i, Hessen-Kassel\'i, Nassau\'yu ve Frankfurt\'u ilhak etti, Kuzey Almanya Konfederasyonu\'nu kurdu. Meclis, bütçesiz geçen yıllar için hükûmeti affetti. Güney devletleriyle gizli ittifaklar imzalandı.',
  '1870 yazında bir Hohenzollern prensinin İspanya tahtına adaylığı Fransa\'yla krize dönüştü. Bismarck, Kral\'ın Ems\'ten gönderdiği telgrafı kısaltarak yayımladı; Fransa 19 Temmuz\'da savaş ilan etti. 2 Eylül\'de Sedan\'da III. Napolyon esir düştü.',
  '18 Ocak 1871\'de, Paris hâlâ kuşatma altındayken, Versay Sarayı\'nın Aynalar Galerisi\'nde Alman İmparatorluğu ilan edildi. Fransa, Alsace\'ı ve Lorraine\'in bir bölümünü bıraktı, beş milyar frank ödedi.',
  'Bismarck on dokuz yıl daha görevde kaldı ve Fransa\'yı yalnız bırakan bir ittifaklar ağı kurdu. 1890\'da genç İmparator II. Wilhelm tarafından görevden alındı. Kurduğu denge, onun gidişinden yirmi dört yıl sonra, 1914\'te çöktü.'];
const EPQ0_DE=['Zamanın büyük sorunları nutuklarla ve çoğunluk kararlarıyla değil, kan ve demirle çözülür.','Otto von Bismarck','Bütçe Komisyonu · 30 Eylül 1862'];
window.EPSL=window.EPSL||{};EPSL.de62=[['de62-kapak.webp','50%']];
{const _v=vTitle;vTitle=function(){
  if(S.setup==='de62intro'){const pf=`<svg viewBox="-32 -32 64 64"><clipPath id="pfbis"><circle r="30"/></clipPath><g clip-path="url(#pfbis)"><rect x="-32" y="-32" width="64" height="64" fill="#101820"/><image href="${PHOTO.bismarck}" x="-30" y="-30" width="60" height="60" preserveAspectRatio="xMidYMin slice"/></g><circle r="30.5" fill="none" stroke="#d8d2c2" stroke-width="1.5"/></svg>`;
    return `<div class="in"><img class="bgp" src="de62-kapak.webp" alt=""><div class="shade"></div><div class="tp2">${btn('toStories',null,'‹ Hikâyeler','back')}</div>
    <div class="mid"><p class="kick">Dosya 04 · Eylül 1862</p><h1>Kan ve Demir</h1><div class="orn"><i></i><b></b><i></i></div><p class="lead">Kral tahttan çekilme belgesini yazdı. Meclis orduya para vermiyor, saray seni istemiyor, Almanya senden nefret ediyor. Rakiplerini tek tek yalnız bırakıp Almanya'yı Prusya'nın etrafında birleştirebilir misin?</p></div>
    <div class="sides" style="display:flex;justify-content:center">${btn('start','de',`${pf}<b>Otto von Bismarck</b><span>Berlin · Prusya Başbakanı</span>`,'side us')}</div>
    <div class="ft">${hasSave('de62')?btn('resume',null,'Kaldığın yerden devam et','lnk'):''}<p>Olaylar tarihten esinlenmiştir; sonuçlar sabit değildir. Başlıca kaynaklar: J. Steinberg, Bismarck: A Life (2011); M. Smith, Bismarck and German Unity (1898). Harita bugünün sınırlarıyla yaklaşık olarak çizilmiştir. Yakın çevredeki bazı isimler göreve tarihte daha geç gelmiştir; savaşsız yollardaki olaylar kurgudur.</p></div></div>`}
  if(!DE())return _v();
  if(S.setup==='doctrine'){const ok=Object.values(S.doc).every(Boolean);
    return `<div class="su1${U.fx?' fx':''}"><div class="hd2"><p class="kick">Hazırlık · 1 / 2</p><h1>Çizgi</h1><div class="prog"><i style="width:50%"></i></div><p class="lead">Göreve başlarken verdiğin dört karar. Başlangıç durumunu ve hangi adımın tutarsızlık sayılacağını belirler.</p></div>
    <div class="grp">${Object.entries(DOC).filter(([k,d])=>GRP(d)==='de').map(([k,d])=>{const cur=d.o.find(o=>o[0]===S.doc[k]);return `<div class="dq"><p class="ql">${d.t}</p><div class="seg2">${d.o.map(o=>btn('doc',k+':'+o[0],o[1],S.doc[k]===o[0]?'sel':'')).join('')}</div><p class="qd">${cur?cur[2]:'Henüz seçilmedi.'}</p></div>`}).join('')}</div>
    ${btn('docNext',null,'Devam','start',!ok)}</div>`}
  if(S.setup==='cabinet')return `<div class="su1${U.fx?' fx':''}"><div class="hd2"><p class="kick">Hazırlık · 2 / 2</p><h1>Yakın çevre</h1><div class="prog"><i style="width:100%"></i></div><p class="lead">Sekiz kişiden altısını seç. Bakanları Kral atar; ama kime kulak vereceğine sen karar verirsin. <b>${S.cab.length} / 6</b></p></div>
    <div class="grp cabg">${Object.entries(ADV).filter(([id,a])=>GRP(a)==='de').map(([id,a])=>btn('cab',id,`${av(id)}<span class="tx"><b>${a.n}</b><small>${a.r} · ${a.e}</small>${U.cabF===id?`<span class="more">${a.plus}<br><i>Risk: ${a.risk}</i></span>`:''}</span><span class="ck">${has(id)?'✓':''}</span>`,'cm'+(has(id)?' sel':''))).join('')}</div>
    ${btn('cabNext',null,'Göreve başla','start',S.cab.length!==6)}</div>`;
  if(S.setup==='epilog')return `<div class="ep"><div class="epbg"><img alt=""><img alt=""></div><div class="shade"></div>
    <div class="roll"><div class="rt"><p class="kick">Gerçekte ne oldu</p><h1>Almanya 1862–1871</h1><div class="orn"><i></i><b></b><i></i></div>${EPI_DE.map(p=>`<p>${p}</p>`).join('')}</div></div>
    <div class="epq lead"><blockquote>“${EPQ0_DE[0]}”</blockquote><div class="rule"></div><p class="who">${EPQ0_DE[1]}</p><p class="wk">${EPQ0_DE[2]}</p></div>
    ${btn('epEnd',null,'Geç ›','back')}</div>`;
  return _v()}}

/* ---------- eylemler ---------- */
function deTabs(){return DE()?[['dip','Diplomasi'],['ic','Saray'+(S.ap>0&&!S.setup?' ·'+S.ap:'')],['eko','Devlet'],['tic','Anlaşma'],['log','Günlük']]:null}
{const _u=ui;ui=function(){if(DE()){S.f=S.f||{};S.cool=S.cool||{};S.acted=S.acted||{};S.pk=S.pk||{};if(S.sag===undefined)S.sag=70}_u();const b=$('bottom');if(b&&DE()&&!S.setup)b.classList.add('tr4')}}
{const _a=act;act=function(a,arg){
  if(a==='story'&&arg==='de62'){U.ld='de62';_a(a,arg);fly(HOME_DE);setTimeout(()=>deWorld(true),900);return}
  if(a==='start'&&arg==='de'){S=newGame();deInit();S.setup='doctrine';U.fx=1;return ui()}
  if(a==='resume'&&S.setup==='de62intro'){try{const j=JSON.parse(localStorage.getItem(SK('de62')));if(j&&j.story==='de62'&&j.A&&j.ord)S=j}catch(e){}fly(HOME_DE);deWorld(true);return ui()}
  if((a==='toStories'||a==='epEnd')&&G.de)setTimeout(()=>deWorld(false),400);
  if(DE()&&S.setup==='cabinet'&&a==='cabNext'){for(const id of S.cab)S.loy[id]=id==='roon'?80:60;deDoctrine();S.setup=null;schedule();return ui()}
  if(DE()&&!S.setup){
    if(a==='pick'){const p=S.pops[0],t=p&&p.type==='dec'&&S.today[p.i];if(t){S.pk=S.pk||{};S.pk[t.id]=+arg;S.sag=(S.sag===undefined?70:S.sag)-.5}}
    if(a==='dia'){const r=deDia(arg);if(r)note('İç siyaset',r);checkEnd();if(S.end)S.pops=[{type:'end'}];return ui()}
    if(a==='deo'){const [k,v]=arg.split(':');if(k==='butce'&&S.f.af)return ui();S.ord[k]=+v;return ui()}
    if(a==='dex'){if(S.acted.extra)return ui();const r=deExtra(arg);if(r)note('Devlet',r);return ui()}
    if(a==='designe'){const o=DOFRB[arg];if(o&&S.ctr.length<3&&!S.ctr.includes(arg)&&!(o.req&&!o.req())){S.ctr.push(arg);if(!o.neutral)deAdj({[o.p]:{f:2}});note('Anlaşma',o.t+' imzalandı.')}return ui()}
    if(a==='decancel'){const o=DOFRB[arg];S.ctr=S.ctr.filter(x=>x!==arg);if(o){if(!o.neutral)deAdj({[o.p]:{f:-4}});note('Anlaşma',o.t+' sona erdirildi.')}return ui()}
    if(a==='dipc'){U.sheet='dipc';U.dipc=arg;return ui()}
    if(a==='ddipa'){const [x,id]=arg.split(':'),n=deN(),rv=DRIV[x],A=S.A[x];
      if(id==='talk'){if(S.acted.talk)return ui();S.acted.talk=1;deAdj({[x]:{sus:-6,f:3},[rv]:{sus:3}});note(DEN[x],'Elçiyle görüşüldü; güvence verildi. '+DEN[rv]+' bu görüşmeden haberdar.')}
      else if(id==='mission'){if(S.h<8||S.acted['m'+x])return ui();S.h-=3;S.acted['m'+x]=1;deAdj({[x]:{f:5,adj:4},[rv]:{sus:2}});norm();note(DEN[x],'Ticaret heyeti gönderildi; görüşmeler olumlu geçti.')}
      else if(id==='guar'){if(n-(S.cool['g'+x]===undefined?-9:S.cool['g'+x])<3)return ui();S.cool['g'+x]=n;
        if(A.f>=50&&A.sus<=50){S.f['soz_'+x]=n+4;deAdj({[x]:{sus:-5}});note(DEN[x],'Bir savaşta kenarda kalacağına dair söz alındı. Söz dört tur geçerli sayılabilir.')}else{deAdj({[x]:{f:-2}});note(DEN[x],'Talep soğuk karşılandı; ilişkiler buna elverişli değil.')}}
      else if(id==='trade'){U.sheet='tic'}
      return ui()}}
  return _a(a,arg)}}
