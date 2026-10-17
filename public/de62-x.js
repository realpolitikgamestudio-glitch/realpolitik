/* ---------- Kan ve Demir: tarihte yaşanmamış yollar ----------
   Avusturya'yla savaşılmazsa (iki başlı Almanya) ve Fransa'yla savaş çıkmazsa (Kuzey Almanya) oyunun geri kalanı.
   Buradaki olaylar kurgudur; dönemin gerçek gerilimlerinden (Lüksemburg, Macar uzlaşması, Salzburg görüşmesi,
   Clarendon'ın silah indirimi önerisi, Bavyera Yurtseverler Partisi) türetilmiştir. */
{const IK=deIK,KZ=()=>!!S.f.kg&&!S.f.sedan&&S.dw!=='fra',D=()=>S.doc;
deDec({
 i_main:{title:'Main hattı',once:true,h:4,art:'elci',when:IK,fly:[8.7,50.1,14],
  text:'Savaş çıkmadı; şimdi barışın biçimini bulmak gerekiyor. Viyana, Konfederasyon\'un başına iki güçten oluşan ortak bir yönetim kurulmasını öneriyor. Küçük devletler iki devin arasında ezilmekten korkuyor.',
  quotes:{roon:'Ordu bu barışı bir yenilgi gibi yaşıyor. Karşılığında elle tutulur bir şey almalıyız.',bleich:'Borsa bu haberi bekliyordu. Faizler düşüyor.',bucher:'Milliyetçilere bir şey vermezseniz sizi unutmazlar.'},
  sh:['Ortak yönetim','Kuzey birliği','Olduğu gibi'],
  opts:()=>[
   {label:'Ortak yönetim: başkanlık Viyana ile Berlin arasında dönüşümlü olsun',desc:'Avusturya\'yla eşitlenirsin; küçük devletler ikinize birden tabi olur.',lean:'mid',eff:{s:3,dip:{aus:{f:8},sud:{sus:8}}},run:()=>{S.f.direktuvar=1;return 'Frankfurt\'ta başkanlık koltuğuna ilk kez bir Prusyalı oturdu. Kral çok memnun.'}},
   {label:'Konfederasyon içinde ayrı bir kuzey birliği kur',desc:'Main\'in kuzeyinde ordu ve gümrük senin elinde toplanır. Viyana kuşkulanır.',lean:'hawk',off:D().alm==='ortak',eff:{o:2,m:3,g:4,dip:{aus:{sus:8,f:-4}}},run:()=>{S.f.kuzeybirlik=1;return 'Kuzey devletleri askerî sözleşmeleri imzaladı. Kâğıt üzerinde Konfederasyon aynı; gerçekte kuzeyde tek bir ordu var.'}},
   {label:'Her şey olduğu gibi kalsın',desc:'Kimseyi ürkütmezsin; kimseye de bir şey vermezsin.',lean:'dove',eff:{g:-5,o:-2},run:()=>'Konfederasyon Meclisi eski gündemine döndü: sınır taşları ve posta tarifeleri.'}]},
 i_zoll:{title:'Gümrük birliği mi, Orta Avrupa mı',once:true,h:4,art:'room',when:IK,
  text:'Viyana, ortaklığın gümrükte de sürmesini istiyor: Avusturya\'yı da içine alan yetmiş milyonluk bir Orta Avrupa pazarı. Prusya sanayicileri serbest ticaretten, Avusturyalılar korumadan yana.',
  quotes:{delbruck:'Avusturya girerse tarife yükselir, Fransız antlaşması çöker. Bunun yerine bir Gümrük Parlamentosu kurun; güney oraya kendi ayağıyla gelir.',bleich:'Büyük pazar büyük kredi demek. Ama Viyana\'nın kâğıt parasına kimse güvenmiyor.'},
  sh:['Gümrük Parlamentosu','Orta Avrupa pazarı','Reddet'],
  opts:()=>[
   {label:'Avusturya\'sız bir Gümrük Parlamentosu kur',desc:'Ekonomik birliği seçilmiş bir meclise bağlarsın; siyasi birliğin provası olur.',lean:'pol',off:D().mes==='hanedan',eff:{m:5,g:6,dip:{sud:{use:10},aus:{sus:8}}},run:()=>{S.f.zollparl=1;return 'Güney devletlerinin milletvekilleri ilk kez Berlin\'e geldi. Gümrük konuşuyorlar; herkes asıl konunun başka olduğunu biliyor.'}},
   {label:'Avusturya\'yı gümrük birliğine al',desc:'Viyana\'yla ortaklık derinleşir; sanayicilerin ve liberallerin öfkelenir.',lean:'dove',off:D().alm==='kucuk',eff:{m:-3,g:-4,h:3,dip:{aus:{f:14,sus:-10},fra:{sus:6}}},run:()=>{S.f.ortaavrupa=1;return 'Antlaşma imzalandı. Tuna\'dan Baltık\'a tek gümrük; Paris ve Londra\'da kaşlar çatıldı.'}},
   {label:'Teklifi nazikçe reddet',desc:'İşler olduğu gibi sürer.',lean:'mid',eff:{dip:{aus:{f:-5}}},run:()=>'Viyana\'ya "zamanı gelince" dendi.'}]},
 i_luks:{title:'Lüksemburg krizi',once:true,h:4,art:'elci',when:IK,fly:[6.13,49.61,10],
  text:'III. Napolyon dukalığı satın almak üzere. Kale bir Konfederasyon kalesi ve içinde Prusya garnizonu var. Bu kez Avusturya da masada: Konfederasyon tek ses verecek mi?',
  sh:['Ortak tavır','Konferans','Göz yum'],
  opts:()=>[
   {label:'Viyana\'yla ortak nota: Konfederasyon toprağı satılmaz',desc:'Avusturya yanındaysa Paris geri adım atar.',lean:'hawk',eff:{},run:()=>{if(S.A.aus.f>=50){fx({s:5,g:8,dip:{fra:{sus:12},aus:{f:4}}});S.f.ortaknota=1;return 'İki Alman gücü aynı notayı verdi. Paris satın almadan vazgeçti; Almanya\'da ilk kez "biz" denildi.'}fx({s:-4,g:-4,dip:{fra:{sus:8}}});return 'Viyana notaya imza atmadı. Prusya tek başına kaldı ve sesini alçalttı.'}},
   {label:'Uluslararası konferans: dukalık tarafsız olsun',desc:'Savaş çıkmaz; Fransa da alamaz.',lean:'mid',eff:{t:-5,o:-1,dip:{ing:{f:6},fra:{sus:4}}},run:()=>'Londra\'da anlaşıldı: Lüksemburg tarafsız, garnizon çekilecek.'},
   {label:'Satışa göz yum',desc:'Paris yatışır; Almanya öfkelenir.',lean:'dove',eff:{g:-10,s:-3,dip:{fra:{f:10}}},run:()=>'Lüksemburg Fransa\'ya geçti.'}]},
 i_macar:{title:'Viyana içine dönüyor',once:true,h:3,art:'elci',when:IK,fly:[19.04,47.5,14],
  text:'Franz Joseph Budapeşte\'de Macar tacını giydi. İmparatorluk ikiye bölündü ve yıllarca kendi anayasasıyla uğraşacak. Senin önünde iki yol var: bu zayıflıktan yararlanmak ya da ortağını kollamak.',
  sh:['Serbest el iste','Dostluğu pekiştir'],
  opts:()=>[
   {label:'Kuzeyde tam serbestlik iste; karşılığında Macar meselesine karışma',desc:'Elin güçlenir; Viyana bunu fırsatçılık sayar.',lean:'hawk',eff:{o:2,m:2,dip:{aus:{f:-8,sus:8}}},run:()=>{S.f.kuzeybirlik=1;return 'Viyana homurdanarak kabul etti. Kuzeyde artık kimse Avusturya elçisine danışmıyor.'}},
   {label:'Uzlaşmayı ilk tanıyan sen ol; dostluğu pekiştir',desc:'Viyana bunu unutmaz.',lean:'dove',eff:{dip:{aus:{f:10,sus:-8}}},run:()=>'Kutlama telgrafını ilk gönderen Berlin oldu. Beust bile teşekkür etti.'}]},
 i_liberal:{title:'Altıncı yılında bütçe kavgası',once:true,h:4,art:'meclis',when:()=>IK()&&!S.f.af,
  text:'Zafer yok, af da yok. Meclis hâlâ bütçeyi reddediyor, sen hâlâ onsuz yönetiyorsun. Kral yorgun; Veliaht açıkça uzlaşma istiyor.',
  quotes:{roon:'Ordu reformu bitti. Artık geri alınamaz; biraz esneyebilirsiniz.',bucher:'Bir zafer olmadan af istemek, yenilgiyi kabul etmek gibi görünür.',heydt:'Meclise harcama yetkisinde küçük bir pay verin; rakamları ben ayarlarım.'},
  sh:['Uzlaş','Sürdür','Seçim'],
  opts:()=>[
   {label:'Uzlaş: geçmiş için af, gelecek için meclise bütçe hakkı',desc:'Kavga biter. Kral ve eski dostların bunu zayıflık sayar.',lean:'dove',off:D().mec==='catisma',eff:{g:12,s:-6,saray:-6},run:()=>{S.f.af=1;S.lt=0;S.ord.butce=0;return 'Meclis affı kabul etti. Altı yıllık kavga bir oylamayla kapandı.'}},
   {label:'Sürdür',desc:'İlkenden dönmezsin; kamuoyu aşınmaya devam eder.',lean:'hawk',off:D().mec==='uzlasma',eff:{lt:8,g:-6,s:2},run:()=>'Hükûmet bütçesiz yönetmeye devam ediyor.'},
   {label:'Genel oyla yeni bir seçim sistemi öner',desc:'Liberal burjuvaziyi kralcı köylüyle dengelersin.',lean:'pol',off:D().mes==='hanedan',eff:{g:8,saray:8,s:-3},run:()=>{S.lt-=25;S.f.geneloy=1;return 'Üç sınıflı seçim kaldırıldı. Yeni mecliste ilericiler azınlıkta; eski dostların ise seni devrimci ilan etti.'}}]},
 i_ordu:{title:'Kılıç kınında paslanıyor',once:true,h:3,art:'d_savas',when:IK,
  text:'Roon\'un ordusu hiç sınanmadı. Subaylar homurdanıyor, Moltke planlarını çekmecede tutuyor. Kral, ömrünün işinin boşa gittiğini düşünüyor.',
  sh:['Büyük tatbikat','Orduyu küçült','Roon\'a söz ver'],
  opts:()=>[
   {label:'Kral\'ın huzurunda büyük bir tatbikat düzenle',desc:'Pahalı; Kral\'ı ve orduyu mutlu eder, komşuları ürkütür.',lean:'hawk',eff:{h:-6,o:3,s:5,dip:{aus:{sus:5},fra:{sus:6}}},run:()=>'Yüz bin asker demiryoluyla üç günde toplandı. Yabancı ataşeler not aldı.'},
   {label:'Barış ordusunu küçült',desc:'Hazine ve meclis rahatlar; Kral ve Roon bunu sana ödetir.',lean:'dove',off:D().mec==='catisma',eff:{h:10,o:-8,lt:-10,s:-8,g:5},run:()=>'Üç alay dağıtıldı. Roon seninle bir hafta konuşmadı.'},
   {label:'Roon\'a söz ver: ordu dokunulmaz',desc:'Hiçbir şey değişmez; ordu sana güvenir.',lean:'mid',eff:{s:2},run:()=>'“Bir gün lazım olacak,” dedin. İnandı.'}]},
 i_guney:{title:'Güney kime yaslanacak',once:true,h:4,art:'deal',when:IK,fly:[11.58,48.14,12],
  text:'Bavyera ve Württemberg iki Alman gücünün arasında sıkışmış durumda ve Paris\'ten gelen teklifleri dinliyor. Bir Fransız elçisi Münih\'te “Ren\'in öte yakasında dostlarınız var” demiş.',
  sh:['Askerî anlaşma','Viyana\'ya bırak','Para'],
  opts:()=>[
   {label:'Güneye savunma anlaşması öner',desc:'Kabul ederlerse Fransa\'ya karşı tek cephe olur. Viyana kendi bahçesine girdiğini düşünür.',lean:'hawk',eff:{dip:{aus:{sus:6}}},run:()=>{if(S.A.sud.f>=35||chance(.5)){S.f.guney=1;fx({dip:{sud:{f:12,sus:-8},fra:{sus:8}}});return 'Münih ve Stuttgart imzaladı: bir Fransız saldırısında orduları Konfederasyon komutasına girecek.'}fx({dip:{sud:{f:-3}}});return 'Güney başkentleri "düşüneceklerini" söyledi.'}},
   {label:'Güneyi Viyana\'nın korumasına bırak',desc:'Paylaşıma sadık kalırsın; ortağın memnun olur.',lean:'dove',off:D().alm==='kucuk',eff:{dip:{aus:{f:8},sud:{f:-4}}},run:()=>'Avusturya elçileri güney saraylarında yeniden baş köşede.'},
   {label:'Güney basınına ve demiryollarına para akıt',desc:'Yavaş ve sessiz.',lean:'pol',eff:{h:-5,dip:{sud:{f:8,use:8}}},run:()=>'Nürnberg–Berlin hattı için kredi açıldı.'}]},
 i_salzburg:{title:'Salzburg görüşmesi',once:true,h:4,art:'elci',when:IK,fly:[13.05,47.8,12],
  text:'III. Napolyon ile Franz Joseph Salzburg\'da buluştu. Bleichröder\'in kaynakları, Paris\'in Viyana\'ya bir ittifak önerdiğini söylüyor: Fransa Ren\'i, Avusturya Almanya\'daki eski yerini alacak.',
  quotes:{bleich:'Viyana\'nın paraya ihtiyacı var. Paris\'in verdiğinden fazlasını verirseniz ittifak olmaz.',moltke:'İki cephe. Planlarım buna göre değil.'},
  sh:['Viyana\'ya daha iyisini öner','Rusya\'ya yaslan','Bekle'],
  opts:()=>[
   {label:'Viyana\'ya daha iyisini öner: Balkanlar\'da destek ve kredi',desc:'Pahalı; ortaklığı kurtarır.',lean:'dove',eff:{h:-8,dip:{aus:{f:12,sus:-8},rus:{f:-6}}},run:()=>'Beust Paris\'e kibarca hayır dedi. Petersburg ise Balkanlar sözünü duydu ve hoşlanmadı.'},
   {label:'Petersburg\'a yaslan: Avusturya kıpırdarsa Rusya sınıra yürüsün',desc:'Çar\'ın dostluğu sağlamsa Viyana yerinden oynamaz.',lean:'hawk',eff:{},run:()=>{if(S.A.rus.f>=50){fx({t:-8,dip:{rus:{f:6},aus:{sus:6,f:-4}}});S.f.russoz=1;return 'Çar sözünü verdi. Viyana\'da Salzburg\'dan artık söz edilmiyor.'}fx({t:8,dip:{aus:{f:-6}}});return 'Petersburg soğuk davrandı. Viyana ile Paris yazışmayı sürdürüyor.'}},
   {label:'Bekle',desc:'Belki de yalnızca bir kaplıca ziyaretiydi.',lean:'mid',eff:{t:6,dip:{aus:{f:-5}}},run:()=>'İki imparator bir tebliğ yayımladı: “Avrupa barışı için görüş birliği.”'}]},
 i_kriz70:{title:'Ren krizi',once:true,h:5,art:'gazete',when:IK,fly:[7.6,50.4,10],
  text:()=>'Paris, Konfederasyon\'dan Ren\'in sol yakasında “sınır düzeltmesi” ve Lüksemburg\'un bırakılmasını istiyor. Fransız ordusu sınırda toplanıyor. '+(S.A.aus.f>=55?'Viyana, Konfederasyon toprağının savunulacağını bildirdi.':'Viyana\'nın ne yapacağı belli değil.'),
  quotes:{moltke:'Avusturya yanımızdaysa Fransa bu savaşı açamaz. Yalnızsak açar.',roon:'Kral savaş istemiyor; ama toprak da vermez.',bleich:'Paris borsası çöküyor. İmparator\'un çevresi savaş istiyor, bankerleri istemiyor.'},
  sh:['Ortak cephe','Yalnız diren','Taviz ver'],
  opts:()=>[
   {label:'Viyana\'yla ortak cephe: Konfederasyon toprağı pazarlık konusu değildir',desc:S.A.aus.f>=55?'Avusturya yanında: Fransa büyük ihtimalle geri adım atar.':'Avusturya\'yla aran yeterince iyi değil; yalnız kalabilirsin.',lean:'hawk',eff:{},run:()=>{if(S.A.aus.f>=55){fx({s:10,g:15,saray:-8,dip:{fra:{sus:15,f:-10},aus:{f:6}}});S.f.ortakzafer=1;return 'İki Alman ordusu aynı gün seferberlik ilan etti. Paris talebini geri çekti; Fransız kabinesi düştü. Almanya tek kurşun atmadan kazandı.'}return deRhine()}},
   {label:'Yalnız diren',desc:'Prusya tek başına karşı koyar. Savaş çıkabilir.',lean:'hawk',req:()=>S.s>=35,reqText:'Kral\'ın güveni 35\'in altında: savaşı göze almaz',eff:{},run:()=>deRhine()},
   {label:'Taviz ver: Lüksemburg Fransa\'nın olsun',desc:'Savaş çıkmaz; Almanya bunu sana ödetir.',lean:'dove',eff:{g:-15,s:-8,o:-3,dip:{fra:{f:10,sus:-10}}},run:()=>'Lüksemburg Fransa\'ya bırakıldı. Berlin\'de camın kırıldı.'}]},
 i_reform:{title:'Konfederasyon\'un yeniden kuruluşu',once:true,h:5,art:'meclis',when:IK,fly:[8.7,50.1,14],
  text:()=>'Frankfurt\'ta reform masada: ortak ordu komutası, ortak gümrük ve bir meclis. '+(S.f.ortakzafer?'Ren krizinden sonra kimse “hayır” demeye cesaret edemiyor.':'Herkes bir şey istiyor; kimse bir şey vermek istemiyor.'),
  quotes:{bucher:'Seçilmiş bir meclis olmadan bu yine bir elçiler kulübü olur.',delbruck:'Gümrük ve posta birleşirse gerisi kendiliğinden gelir.'},
  sh:['Seçilmiş meclis','Prensler meclisi','Bırak'],
  opts:()=>[
   {label:'Genel oyla seçilen bir federal meclis ve ortak ordu',desc:'Almanya savaşsız bir federasyona dönüşür. Viyana ve prensler direnebilir.',lean:'pol',off:D().mes==='hanedan',eff:{},run:()=>{if(S.A.aus.f>=55&&(S.f.ortakzafer||S.g>=50)){S.f.fedreform=1;fx({g:15,s:4,dip:{aus:{f:4},sud:{f:8}}});return 'Reform kabul edildi. Frankfurt\'ta seçilmiş bir Alman meclisi toplanacak; başkanlık iki güç arasında dönüşümlü. Kimse buna imparatorluk demiyor, ama Almanya artık bir bütün.'}fx({g:5,saray:6,dip:{aus:{sus:10,f:-6}}});return 'Viyana ve küçük prensler veto etti. Öneri milliyetçilerin belleğinde kaldı.'}},
   {label:'Prenslerin delegelerinden oluşan güçlü bir meclis ve ortak ordu',desc:'Hükümdarları ürkütmeyen bir birlik.',lean:'mid',off:D().mes==='oy',eff:{},run:()=>{if(S.A.aus.f>=50){S.f.fedreform=1;fx({s:6,g:4,dip:{aus:{f:6}}});return 'Reform kabul edildi: ortak komuta, ortak gümrük, hükûmetlerin delegelerinden bir meclis. Liberaller az buldu; hükümdarlar rahat.'}fx({dip:{aus:{f:-4}}});return 'Viyana ortak komutayı reddetti.'}},
   {label:'Reformu bırak',desc:'Konfederasyon olduğu gibi kalır.',lean:'dove',eff:{g:-6},run:()=>'Komisyon bir rapor yazdı ve dağıldı.'}]},
 i_taht:{title:'Yaşlı Kral, sabırsız Veliaht',once:true,h:4,art:'saray',when:IK,
  text:'Kral yetmiş dört yaşında ve yorgun. Veliaht\'ın çevresi şimdiden kabine listeleri yazıyor; adın hiçbirinde yok. Kraliçe ilk kez seni çaya çağırdı.',
  sh:['Veliaht\'la anlaş','Kral\'a tutun','Çekilmeye hazırlan'],
  opts:()=>[
   {label:'Veliaht\'la anlaş: onun döneminde de sen',desc:'Geleceğini güvenceye alırsın; Kral bunu sadakatsizlik sayabilir.',lean:'pol',eff:{saray:-15,s:-6,g:5},run:()=>{S.f.veliahtla=1;return 'Veliaht elini uzattı. “Babamdan sonra da Prusya\'nın size ihtiyacı olacak.” Kral bunu duyduğunda yüzünü çevirdi.'}},
   {label:'Kral\'a tutun',desc:'Sadakatin ödüllendirilir; yarının belirsiz.',lean:'loyal',eff:{s:8,saray:6},run:()=>'Kral elini tuttu: “Beni bırakmadınız.”'},
   {label:'Varzin\'e çekilmeye hazırlan',desc:'Kimseyle kavga etmezsin.',lean:'dove',eff:{saray:-8,s:-2},run:()=>'Ormana yeni fidanlar diktirdin.'}]},
 /* Kuzey Almanya kuruldu ama Fransa'yla savaş çıkmadı */
 k_silah:{title:'Londra\'dan silah indirimi önerisi',once:true,h:4,art:'elci',when:KZ,fly:[-.1,51.5,14],
  text:'İngiliz Dışişleri Bakanı Clarendon, Paris ile Berlin\'e aynı anda ordularını küçültmelerini öneriyor. Paris kabule hazır görünüyor.',
  sh:['Reddet','Kabul et','Oyala'],real:[0,'1870 başında Clarendon önerisini Bismarck geri çevirdi: iki cephesi açık bir ülkenin kendini zayıflatamayacağını söyledi.'],
  opts:()=>[
   {label:'Reddet: sınırları açık bir ülke ordusunu küçültemez',desc:'Ordu ve Kral memnun; Londra ve Paris kuşkulanır.',lean:'hawk',eff:{s:3,dip:{ing:{f:-5},fra:{sus:6}}},run:()=>'Cevap kibar ve kesindi.'},
   {label:'Kabul et',desc:'Hazine ve Londra rahatlar; Kral ve Roon öfkelenir.',lean:'dove',eff:{h:8,o:-6,s:-6,dip:{ing:{f:8},fra:{sus:-10,f:5}}},run:()=>'Her iki ordu on bin kişi azaltıldı. Roon istifasını yazdı, sonra yırttı.'},
   {label:'Oyala: ilke olarak evet, zamanı gelince',desc:'Kimseyi kızdırmazsın.',lean:'mid',eff:{dip:{ing:{f:-2}}},run:()=>'Yazışma aylarca sürdü.'}]},
 k_bavyera:{title:'Münih\'te ittifak tartışması',once:true,h:4,art:'meclis',when:KZ,fly:[11.58,48.14,12],
  text:'Bavyera meclisinde Yurtseverler Partisi çoğunlukta ve kuzeyle ittifak antlaşmasının feshini istiyor. Kral Ludwig şatolarıyla meşgul.',
  sh:['Para ve sabır','Baskı','Bırak'],
  opts:()=>[
   {label:'Sabret; gazetelere ve demiryollarına para akıt',desc:'Güney yavaş yavaş alışır.',lean:'pol',eff:{h:-5,dip:{sud:{f:8}}},run:()=>{S.f.guneysabir=1;return 'Fesih önergesi üç oyla reddedildi.'}},
   {label:'Gümrük birliğinden çıkarmakla tehdit et',desc:'Antlaşma kalır, sevgi kalmaz.',lean:'hawk',off:D().alm==='kuzey',eff:{dip:{sud:{sus:12,use:6}}},run:()=>'Münih boyun eğdi ve küstü.'},
   {label:'Bırak: isteyen kalır',desc:'Güneyle bağ gevşer.',lean:'dove',eff:{g:-5,dip:{sud:{f:-6}}},run:()=>{S.f.guney=0;return 'Bavyera antlaşmayı askıya aldı.'}}]}
});
for(const [n,ids] of Object.entries({17:['i_main'],18:['i_zoll'],19:['i_luks'],20:['i_macar'],21:['i_liberal'],22:['i_ordu'],23:['i_guney'],24:['i_salzburg'],25:['i_kriz70'],26:['i_reform','k_silah'],27:['i_taht','k_bavyera']}))DANCH[n]=(DANCH[n]||[]).concat(ids);
Object.assign(RECS,{i_main:{roon:1,bleich:0,bucher:1},i_zoll:{delbruck:0,bleich:1},i_liberal:{roon:0,bucher:1,heydt:0},i_salzburg:{bleich:0,moltke:1},i_kriz70:{moltke:0,roon:0,bleich:2},i_reform:{bucher:0,delbruck:1}});
/* Ren krizi: Prusya yalnız kalırsa */
window.deRhine=function(){if(chance(S.A.fra.sus>=50?.35:.55)){fx({s:6,g:8,dip:{fra:{sus:10}}});return 'Prusya seferberlik ilan etti ve bekledi. Paris son anda geri adım attı; ama bunu unutmayacak.'}
  const W=deWar('fra',S.A.aus.f>=50?0:-8);
  if(W.res==='iki'){end('de_ikicephe');return W.notes.join(' ')}if(W.res==='yenilgi'){end('de_yenilgi');return 'Fransız ordusu Ren\'i geçti. '+W.notes.join(' ')}
  fx({s:10,g:15,h:-25,t:10,o:3,saray:-8,dip:{fra:{sus:30,f:-25}}});S.f.frzafer=1;S.f.ortakzafer=1;
  return 'Fransa savaş ilan etti. '+W.notes.join(' ')+' Altı hafta sonra Fransız ordusu sınırın gerisine atıldı; barış, eski sınırlar üzerinden yapıldı.'};
}
