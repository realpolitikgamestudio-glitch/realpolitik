/* ---------- Kan ve Demir: gündemler ---------- */
{const P=(a,d)=>deAdj({[a]:d}),F=()=>S.f,D=()=>S.doc;
deDec({
 /* ===== 1. perde: ayakta kal ve Danimarka (1862–64) ===== */
 b_butce:{title:'Bütçe',once:true,h:3,art:'meclis',
  text:'Meclis ordu reformunun parasını bütçeden çıkardı. Kral reformdan dönmüyor. Anayasa, Kral ile meclis anlaşamazsa ne olacağını söylemiyor.',
  quotes:{roon:'Reform olmadan ordu olmaz, ordu olmadan Prusya olmaz. Para bulunur.',heydt:'Bütçesiz yönetmek mümkündür; vergiler toplanmaya devam eder. Ama her ay faturası büyür.',eulenburg:'Seçim de sonucu değiştirmez; şehirler ilericilerin elinde.',bucher:'Anayasadaki boşluğu "kraliyet doldurur" derseniz bunu her gazete yazar.'},
  sh:['Bütçesiz yönet','Uzlaşma','Fesih'],real:[0,'Uzlaşma önerisini Kral reddetti; bütçe 29 Eylül 1862\'de geri çekildi ve dört yıl bütçesiz yönetildi.'],
  opts:()=>[
   {label:'Bütçeyi geri çek, bütçesiz yönet',desc:'Vergiler toplanır, ordu kurulur. Meclisle köprüler atılır.',lean:'hawk',off:D().mec==='uzlasma',eff:{h:5,lt:12,g:-5},run:()=>{S.ord.butce=1;return 'Bütçe tasarısı geri çekildi. Hükûmet, anayasadaki boşluğu Kral\'ın yetkisiyle dolduracağını bildirdi.'}},
   {label:'Uzlaşma dene: askerliği fiilen iki yıla indir',desc:'Meclis yumuşayabilir; Kral ve Manteuffel reddedebilir.',lean:'dove',off:D().mec==='catisma',eff:{},run:()=>{if(chance(.3)){fx({lt:-15,g:6});S.ord.butce=0;return 'Uzlaşma tuttu: meclisin bir bölümü ikna oldu, Kral gönülsüzce razı geldi.'}fx({s:-5});S.ord.butce=1;return 'Kral "üç yıl" ilkesinden vazgeçmedi, Manteuffel "oyun sonuna kadar oynanmalı" dedi. Uzlaşma düştü; bütçesiz yönetim başladı.'}},
   {label:'Meclisi feshet, seçime git',desc:'Zaman kazanırsın; sonuç değişmeyebilir.',lean:'mid',eff:{g:-3,lt:5},run:()=>'Meclis feshedildi. Anketler ilericilerin yine kazanacağını gösteriyor.'}]},
 b_kanvedemir:{title:'Bütçe Komisyonu\'nda ilk konuşma',once:true,h:3,art:'meclis',
  text:'Başbakan olarak ilk kez meclis komisyonunun önüne çıkıyorsun. Salon dolu; hepsi senin gerici bir darbe için getirildiğine inanıyor.',
  quotes:{roon:'Ne söylerseniz söyleyin, Kral\'ın kulağına Baden-Baden\'den başka bir biçimde gidecek.',bucher:'Bir cümle yeter; yarın bütün Almanya onu tekrar eder. Hangi cümle olacağını siz seçin.',manteuffel:'Onlara dişinizi gösterin. Anladıkları tek dil bu.'},
  sh:['Kan ve demir','Zeytin dalı','Roon konuşsun'],real:[0,'30 Eylül 1862: "Zamanın büyük sorunları nutuklarla ve çoğunluk kararlarıyla değil, kan ve demirle çözülür." Tepki o kadar büyüktü ki Kral onu azletmeye geldi.'],
  opts:()=>[
   {label:'“Büyük sorunlar nutuklarla değil, kan ve demirle çözülür.”',desc:'Ordu memnun; Almanya ayağa kalkar, Kraliçe harekete geçer.',lean:'hawk',eff:{g:-10,saray:10,o:2,dip:{aus:{sus:6}}},run:()=>{q('b_tren');return 'Cümle bir günde bütün Almanya\'yı dolaştı. Liberal basın "sığ bir toprak ağası" diye yazıyor; Kral Baden-Baden\'de Kraliçe\'yle birlikte.'}},
   {label:'Ilımlı konuş, bir zeytin dalı uzat',desc:'Salon şaşırır. Kral\'ın gözünde biraz yumuşak görünürsün.',lean:'dove',eff:{g:3,s:-2},run:()=>'Cebinden bir zeytin dalı çıkarıp gösterdin. Salon şaşırdı; kimse inanmadı ama kimse de saldıramadı.'},
   {label:'Konuşmayı Roon\'a bırak',desc:'Risk almazsın; iz de bırakmazsın.',lean:'mid',eff:{g:-2},run:()=>'Roon kuru bir savunma yaptı. Gazeteler yeni başbakanın sustuğunu yazdı.'}]},
 b_tren:{title:'Jüterbog istasyonu',once:true,h:2,art:'saray',
  text:'Kral Baden-Baden\'den dönüyor; Kraliçe haftalardır ona Strafford\'u ve XVI. Louis\'yi anlatmış. Treni Berlin\'e varmadan yolda karşıladın. Kral kompartımanda tek başına: “Bunun nasıl biteceğini görüyorum. Opera Meydanı\'nda önce sizin kellenizi, sonra benimkini kesecekler.”',
  sh:['Subay onuru','Özür','İstifa'],real:[0,'Bismarck Kral\'ın subay onuruna seslendi; Kral yolun sonunda yeniden savaşmaya hazırdı.'],
  opts:()=>[
   {label:'“Ya sonra, Majeste? Hepimiz öleceğiz; bundan daha onurlu bir ölüm olur mu?”',desc:'Kral\'ın içindeki subaya seslenirsin.',lean:'hawk',eff:{s:10,saray:-4},run:()=>'Konuştukça Kral doğruldu. Berlin\'e vardığında tahtı için dövüşen bir subaydı.'},
   {label:'Özür dile, konuşmayı yumuşatacağına söz ver',desc:'Kral rahatlar; ordu ve dostların hayal kırıklığına uğrar.',lean:'dove',eff:{s:3,g:2,o:-2},run:()=>'Kral başını salladı. Görevde kaldın, ama sözün artık biraz daha hafif.'},
   {label:'İstifanı sun',desc:'Her şeyi tek karta koyarsın: ya vazgeçilmez olursun ya gidersin.',lean:'mid',eff:{},run:()=>{if(chance(S.course==='C'?.35:.5)){fx({s:14});return 'Kral kâğıdı itti: “Beni bu durumda bırakamazsınız.” Görevdesin, hem de eskisinden güçlü.'}end('de_istifa');return 'Kral istifayı kabul etti.'}}]},
 b_karolyi:{title:'Avusturya elçisine ihtar',once:true,h:3,art:'elci',
  text:'Avusturya elçisi Kont Karolyi odanda. Viyana, Konfederasyon Meclisi\'ni Prusya\'yı azınlıkta bırakmak için kullanıyor.',
  sh:['İhtar','Ortaklık','Sus'],real:[0,'4 Aralık 1862: "İlişkilerimiz ya düzelmeli ya bozulmalı. Bizi Avrupa\'nın büyük güçlerinden biri olarak karşınızda bulursunuz."'],
  opts:()=>[
   {label:'“İlişkilerimiz ya düzelir ya bozulur; ağırlık merkezinizi Budapeşte\'ye taşıyın.”',desc:'Açık konuşursun; Viyana seni ciddiye alır ve kollar.',lean:'hawk',eff:{s:2,dip:{aus:{sus:8,use:5}}},run:()=>'Karolyi notunu aldı. Viyana\'da kimse şaşırmadı, kimse de güvenmedi.'},
   {label:'Ortaklık öner: kuzeyde Prusya, güneyde Avusturya',desc:'Viyana\'yla köprü kurarsın.',lean:'dove',off:D().alm==='kucuk',eff:{dip:{aus:{f:6,sus:-3}}},run:()=>'Karolyi öneriyi Viyana\'ya iletti. Cevap kibar ve bağlayıcı olmayan bir teşekkürdü.'},
   {label:'Bir şey söyleme',desc:'Kartlarını göstermezsin.',lean:'mid',eff:{},run:()=>'Görüşme havadan sudan geçti.'}]},
 b_polonya:{title:'Polonya ayaklanması',once:true,h:4,art:'elci',fly:[21,52,22],
  text:'Rus Polonyası\'nda ayaklanma var. Batı Polonyalılara sempati duyuyor; Çar yalnız. General Alvensleben Petersburg\'a gitmeye hazır: asi birlikleri sınırın iki yanında kovalamak için bir sözleşme.',
  quotes:{roon:'Dört kolordu sınırda. Polonya ateşi bize sıçramamalı.',bucher:'Bütün liberal Avrupa bu sözleşmeyi lanetler. Meclis de.',bleich:'Paris borsası Polonya\'ya ağlıyor ama kimse onun için savaşmayacak.',moltke:'Arkamızda dost bir Rusya, önümüzdeki her savaşın yarısıdır.'},
  sh:['Rusya\'yla','Tarafsız','Batı\'yla'],real:[0,'8 Şubat 1863 Alvensleben Sözleşmesi imzalandı. Yürürlüğe girmedi ama Çar\'ın dostluğunu sağladı.'],
  opts:()=>[
   {label:'Rusya\'yla sözleşmeyi imzala',desc:'Çar unutmaz. Liberaller, Paris ve Londra da unutmaz.',lean:'hawk',eff:{g:-8,lt:6,dip:{rus:{f:15,sus:-8},fra:{f:-6},ing:{f:-6}}},run:()=>'Sözleşme imzalandı. Avrupa basını öfkeli; Petersburg\'da ise Prusya elçisi sarayın en gözde konuğu.'},
   {label:'Tarafsız kal',desc:'Kimseyi kızdırmazsın; Çar yalnız bırakıldığını düşünür.',lean:'mid',eff:{dip:{rus:{f:-4}}},run:()=>'Prusya sınırını kapattı ve bekledi.'},
   {label:'Batı\'yla birlikte Polonyalılar için reform iste',desc:'Kamuoyu alkışlar; Rusya\'yı kaybedersin.',lean:'dove',eff:{g:8,dip:{ing:{f:5},fra:{f:5},rus:{f:-20,sus:15}}},run:()=>'Nota verildi. Çar, Prusya\'nın da diğerleri gibi olduğunu söyledi.'}]},
 b_lassalle:{title:'Bir sosyalistle gizli görüşme',once:true,h:3,art:'room',
  text:'Ferdinand Lassalle işçi derneğini kurdu ve liberallerden nefret ediyor. Aracılar bir akşam yemeği öneriyor. Konusu: genel oy.',
  sh:['Görüş','Reddet'],real:[0,'Mayıs 1863\'ten itibaren defalarca görüştüler. Bismarck yıllar sonra onu tanıdığı en zeki insanlardan biri diye andı.'],
  opts:()=>[
   {label:'Görüş',desc:'Liberalleri arkadan kuşatacak bir koz. Duyulursa Kral hoşlanmaz.',lean:'pol',eff:{},run:()=>{S.f.lassalle=1;if(chance(.25)){fx({s:-3});return 'Saatlerce konuştunuz. Ne yazık ki bir uşak da dinliyordu; haber saraya ulaştı.'}return 'Saatlerce konuştunuz. Genel oyun kralcı köylüyü sandığa getireceğine o da inanıyor.'}},
   {label:'Reddet',desc:'Temiz kalırsın.',lean:'mid',eff:{},run:()=>'Davet cevapsız bırakıldı.'}]},
 b_basin:{title:'Basın kararnamesi',once:true,h:3,art:'gazete',
  text:'Muhalefet gazeteleri her gün hükûmeti anayasayı çiğnemekle suçluyor. Kararname hazır: gazeteler mahkemeye gerek kalmadan idari kararla kapatılabilecek.',
  sh:['Çıkar','Çıkarma'],real:[0,'1 Haziran 1863\'te kararname çıktı. Veliaht birkaç gün sonra Danzig\'de açıkça karşı çıktı.'],
  opts:()=>[
   {label:'Kararnameyi çıkar',desc:'Basın susar; Veliaht ve Londra susmaz.',lean:'hawk',eff:{g:-4,saray:10},run:()=>{S.ord.basin=1;q('b_danzig');return 'Kararname yürürlükte. Birkaç gazete uyarı aldı, gerisi satır aralarına çekildi.'}},
   {label:'Çıkarma',desc:'Saldırılar sürer.',lean:'dove',eff:{lt:4},run:()=>{for(let i=1;i<=3;i++)S.fut.push({at:deN()+i,g:-2});return 'Kararname çekmecede kaldı. Gazeteler her sabah aynı şeyi yazıyor.'}}]},
 b_danzig:{title:'Veliaht\'ın Danzig konuşması',once:true,h:2,art:'saray',
  text:'Veliaht Danzig\'de, kararnameden haberi olmadığını ve onaylamadığını söyledi. Kral öfkeden titriyor: oğlunu vatana ihanetten tutuklatmak istiyor.',
  sh:['Yatıştır','Körükle'],real:[0,'Bismarck Kral\'ı tutuklamadan vazgeçirdi; baba ile oğul arasındaki savaş yapıyı sarsacaktı.'],
  opts:()=>[
   {label:'Kral\'ı yatıştır; baba ile oğulun arasını bul',desc:'Hanedan kavgası kimseye yaramaz.',lean:'dove',eff:{s:3,saray:-5},run:()=>'Kral sakinleşti. Veliaht bir süre Berlin\'den uzak duracak.'},
   {label:'Kral\'ın öfkesini körükle',desc:'Kral sana yaslanır; Veliaht seni asla affetmez.',lean:'hawk',eff:{s:5,saray:12},run:()=>'Veliaht resmen uyarıldı. Eşi Londra\'ya uzun bir mektup yazdı.'}]},
 b_frankfurt:{title:'Prensler Kongresi',once:true,h:6,art:'saray',fly:[8.7,50.1,14],
  text:'Avusturya İmparatoru bütün Alman hükümdarlarını Frankfurt\'a çağırdı; Konfederasyon, Viyana\'nın önderliğinde yenilenecek. Kral gitmek istiyor: “Otuz hükümdar, ve haberci olarak bir kral!” Giderse Prusya, Avusturya\'nın kurduğu masaya oturmuş olur.',
  quotes:{roon:'Kral\'a karşı durmak kolay değil. Ama Frankfurt\'a giderse geri dönüş yok.',manteuffel:'Majesteleri\'nin sözü senettir. Bir kez oturursa kalkmaz.',bucher:'Karşı hamleniz hazır: kongreye değil, halkın seçeceği bir Alman meclisine evet deyin.',eulenburg:'Kraliçe Elisabeth bile gitmesini istiyor. Yalnızsınız.'},
  sh:['Gitmesin','Birlikte gidin','Serbest bırak'],real:[0,'Bismarck gece yarısına kadar uğraştı; Kral ret mektubunu imzaladı. İkisi de bitkin düştü. Ardından Prusya, doğrudan seçilmiş bir Alman meclisini şart koşarak planı bitirdi.'],
  opts:()=>[
   {label:'Kral\'ı gitmemeye ikna et; gerekirse istifanı ortaya koy',desc:'Kral\'la sert bir gece. Başarırsan Avusturya\'nın planı çöker.',lean:'hawk',off:D().alm==='ortak',eff:{s:-6,dip:{aus:{sus:10,f:-5}}},run:()=>{S.f.frankfurt=1;return 'Gece yarısı Kral ret mektubunu imzaladı. Odadan çıktığında bir sürahiyi yere çarptın. Kongre Prusya\'sız toplandı ve hiçbir şeye karar veremedi.'}},
   {label:'Birlikte gidin; veto ve eşit başkanlık şart koşun',desc:'Plan sulandırılır; Avusturya\'nın başkanlığı sürer.',lean:'mid',off:D().alm==='kucuk',eff:{s:3,dip:{aus:{f:8}}},run:()=>{S.f.frankfurt=0;return 'Kral Frankfurt\'ta ağırlandı. Reform, Prusya\'nın şartlarıyla sulandırıldı; kimse tam memnun değil.'}},
   {label:'Kral\'ı serbest bırak',desc:'Kral memnun olur. Almanya\'nın geleceği Viyana\'da yazılır.',lean:'dove',off:D().alm==='kucuk',eff:{s:6,dip:{aus:{f:12,sus:-8}}},run:()=>{S.f.frankfurt=-1;S.f.ausortak=1;return 'Kral kongreye katıldı ve reformu imzaladı. Konfederasyon Avusturya\'nın önderliğinde güçlendi; Prusya artık onun ikinci üyesi.'}}]},
 b_danimarka:{title:'Schleswig-Holstein: iki yol',once:true,h:6,art:'elci',fly:[9.6,54.6,10],
  text:'Danimarka\'nın yeni kralı, Schleswig\'i krallığa bağlayan anayasayı imzaladı. Bütün Almanya genç Augustenburg Dükü\'nü dukalıkların meşru hükümdarı ilan ediyor; Kral, Kraliçe ve Veliaht da ondan yana. Oysa Prusya ve Avusturya\'nın imzası 1852 Londra Protokolü\'nde duruyor.',
  quotes:{roon:'Topun ilk atışı bütün antlaşmaları yırtar. Sonra barışı galip yazar.',bucher:'Dük\'ü tanırsanız bir gecede Almanya\'nın kahramanı olursunuz.',moltke:'Avusturya yanımızdaysa Londra kıpırdamaz. Yalnızsak bütün Avrupa karşımızda.',manteuffel:'Kral "Holstein üzerinde hakkım yok" diyor. Önce onu ikna etmelisiniz.'},
  sh:['Dük\'ü tanı','Antlaşmalara bağlı kal','Bekle'],real:[1,'Bismarck 1852 antlaşmalarına bağlı kaldı ve Avusturya\'yı yanına çekti; savaşın sonunda dukalıklar iki devlete kaldı. En gurur duyduğu hamlenin bu olduğunu söylerdi.'],
  opts:()=>[
   {label:'Popüler yol: Augustenburg Dükü\'nü tanı, protokolü yok say',desc:'Almanya seni alkışlar; Avrupa karşına geçer. Kazansan da yeni bir küçük devlet doğar.',lean:'dove',off:D().mes==='hanedan',eff:{g:15,lt:-10,saray:-8,t:15,dip:{ing:{sus:15},rus:{sus:10},fra:{sus:8},aus:{f:-10}}},run:()=>{S.f.aug=1;S.dw='dk';S.f.dkwar=1;return 'Prusya Dük\'ü tanıdı ve orduyu kuzeye yürüttü. Sokaklar bayram yerinde; elçilikler ise nota yağdırıyor.'}},
   {label:'Sevilmeyen yol: 1852\'ye bağlı kal, Avusturya\'yla birlikte Danimarka\'yı sıkıştır',desc:'Milliyetçiler öfkelenir. Avusturya yanında, Avrupa seyirci kalır; ödülü savaşın sonunda sen belirlersin.',lean:'hawk',off:D().mes==='oy',eff:{g:-10,lt:8,t:-5,dip:{aus:{f:10},ing:{sus:-5}}},run:()=>{S.f.dkaus=1;return 'Berlin ve Viyana ortak nota verdi: Danimarka anayasayı geri alsın. Kopenhag\'ın geri adım atmayacağını biliyorsun.'}},
   {label:'Bekle; Konfederasyon halletsin',desc:'Risk almazsın; inisiyatif Saksonya ve Hannover\'e geçer.',lean:'mid',eff:{s:-3,dip:{aus:{use:-5}}},run:()=>'Konfederasyon birlikleri Holstein\'a girdi. Prusya seyrediyor.'}]},
 b_savas64:{title:'Savaş parası',once:true,h:3,art:'meclis',when:()=>!S.dw,
  text:'Meclis, Schleswig harekâtı için istenen 12 milyon talerlik krediyi reddetti. Wrangel\'in ordusu Eider kıyısında emir bekliyor.',
  sh:['Parayı bul','Geri dur'],real:[0,'Bismarck meclise parayı "bulduğu yerden alacağını" söyledi. 1 Şubat 1864\'te ordu Schleswig\'e girdi.'],
  opts:()=>[
   {label:'“Parayı bulduğum yerden alırım.” Harekâtı başlat',desc:'Savaş başlar; meclisle uçurum büyür.',lean:'hawk',off:D().mec==='uzlasma',eff:{lt:10,h:-8},run:()=>{S.dw='dk';S.f.dkwar=1;deNow('b_wrangel');return 'Ordu Eider\'i geçti. Danimarkalılar Dannevirke hattını bir kar fırtınasında boşalttı.'}},
   {label:'Geri dur',desc:'Meclisle kavga büyümez. Kral ve ordu bunu unutmaz.',lean:'dove',eff:{s:-8,o:-3},run:()=>{S.f.aug=1;return 'Prusya çekildi. Avusturya ve Konfederasyon işi üstlendi; dukalıklar Augustenburg Dükü\'ne kalacak gibi görünüyor.'}}]},
 b_wrangel:{title:'Mareşal Wrangel',once:true,h:3,art:'war',when:()=>S.dw==='dk',
  text:'Seksen yaşındaki mareşal Kral\'a şifresiz telgraflar çekiyor: “Darağacına yaraşır diplomatlar” ordunun elini bağlıyormuş. Jutland\'a, asıl Danimarka toprağına girmek istiyor.',
  sh:['Dizginle','Serbest bırak'],real:[0,'Bismarck, Kral\'ı Avusturya\'nın bir adım önüne geçmemeye ikna etti.'],
  opts:()=>[
   {label:'Kral\'a Wrangel\'i dizginlet; Avusturya\'yla adım adım git',desc:'Avrupa\'ya bahane vermezsin; ordu homurdanır.',lean:'mid',eff:{o:-1,t:-4,dip:{aus:{f:4}}},run:()=>'Kral mareşali azarladı. Wrangel, elçilik temsilcisine "Nerelerdeydin evladım?" diyerek barıştı.'},
   {label:'Wrangel\'i serbest bırak',desc:'Savaş hızlanır; Viyana ve Londra tedirgin olur.',lean:'hawk',eff:{dip:{aus:{sus:6},ing:{sus:8}}},run:()=>{S.f.dkb=(S.f.dkb||0)+5;return 'Prusya birlikleri Kolding\'e girdi. "Yanlışlıkla" dendi.'}}]},
 b_duppel:{title:'Düppel tabyaları',once:true,h:5,art:'war',when:()=>S.dw==='dk',fly:[9.75,54.9,6],
  text:'Londra\'da konferans toplanmak üzere. Ordunun elinde henüz gerçek bir zafer yok; Danimarkalılar Düppel tabyalarına gömülmüş. Roon ve Moltke aynı şeyi söylüyor: masaya zaferle oturulur.',
  sh:['Hücum','Kuşatma'],real:[0,'18 Nisan 1864\'te tabyalar altı saatlik hücumla alındı; konferans bir hafta sonra başladı.'],
  opts:()=>[
   {label:'Konferanstan önce hücum',desc:'Kanlı olur. Kazanırsan Londra\'da eli güçlü taraf sensin.',lean:'hawk',eff:{},run:()=>{const W=deWar('dk',(S.f.dkb||0)+3);S.f.dkbitti=1;if(W.res==='iki'){end('de_ikicephe');return 'Hücum sürerken Avrupa araya girdi.'}if(W.res==='yenilgi'){end('de_yenilgi');return 'Hücum püskürtüldü; ordu dağıldı.'}
     fx({s:8,g:8,saray:-6,o:3});S.f.duppel=1;return (W.res==='uzun'?'Tabyalar ağır kayıpla alındı. ':'Kırk altı bölük altı saatte tabyaları aldı. ')+W.notes.join(' ')+' Berlin\'de çanlar çalıyor.'}},
   {label:'Kuşatmayı sürdür',desc:'Kan dökmezsin; konferansa zafersiz girersin.',lean:'dove',eff:{s:-2},run:()=>'Toplar dövmeye devam ediyor. Londra\'da masa kuruldu; Prusya\'nın elinde gösterecek bir şey yok.'}]},
 b_londra:{title:'Londra Konferansı',once:true,h:5,art:'elci',when:()=>S.dw==='dk',fly:[-.1,51.5,14],
  text:'Büyük güçler masada. İngiltere Danimarka\'ya söz vermişti ama kabinesi savaşa yanaşmıyor. Senin elinde üç öneri var.',
  sh:['Kişisel birlik','Tam ayrılık','Oyala'],real:[0,'Prusya ve Avusturya kişisel birlik önerdi; Danimarka inatla reddetti. İngiltere kıpırdamadı, konferans dağıldı.'],
  opts:()=>[
   {label:'Dukalıklar Danimarka tacına yalnızca kişisel birlikle bağlı kalsın',desc:'Makul görünen öneri. Kopenhag reddederse savaş meşru biçimde sürer.',lean:'mid',eff:{dip:{ing:{sus:-5}}},run:()=>{if(chance(.85))return 'Danimarka reddetti. Londra\'da kimse artık onlar için parmağını oynatmayacak.';S.f.dkbitti=1;S.f.aug=0;return 'Danimarka beklenmedik biçimde kabul etti. Savaş bitti; dukalıklar Danimarka Kralı\'nın kişisel mülkü olarak kalıyor.'}},
   {label:'Tam ayrılık ve Augustenburg Dükü',desc:'Almanya sevinir; ilhak yolu daralır.',lean:'dove',eff:{g:6},run:()=>{S.f.augmasa=1;return 'Öneri masada. Avusturya da destekliyor; şimdi her şey Dük\'ün ne kadar uysal olacağına bağlı.'}},
   {label:'Konferansı oyala',desc:'Ordu ilerlerken diplomatlar konuşur.',lean:'hawk',eff:{t:4,dip:{ing:{sus:6}}},run:()=>{S.f.dkb=(S.f.dkb||0)+2;return 'Usul tartışmaları haftalar aldı. Palmerston öfkeli, ama yalnız.'}}]},
 b_augustenburg:{title:'Dük\'le gece görüşmesi',once:true,h:4,art:'saray',when:()=>S.f.dkwar&&!S.f.aug,
  text:'Augustenburg Dükü Berlin\'de. Kral ve Veliaht onu seviyor; Almanya onu bekliyor. Akşam dokuzda odana geliyor.',
  quotes:{roon:'Ordu, döktüğü kanın karşılığını bir başkasının tacında görmek istemez.',manteuffel:'Veliaht\'ın şartlarını kabul ederse elimiz boş kalır. Etmesin.'},
  sh:['Ağır şartlar','Tanı','Görüşme'],real:[0,'1 Haziran 1864: üç saatlik görüşmede Dük, Prusya\'nın şartlarını kabul etmedi. Bismarck onu bir daha Sedan\'ın ertesi günü gördü.'],
  opts:()=>[
   {label:'Ağır şartlar koy: Kiel\'de üs, kanal, askerî sözleşme, muhafazakâr yönetim',desc:'Kabul ederse adı dük, kendisi vali olur. Reddederse aday düşer.',lean:'hawk',eff:{saray:4},run:()=>{if(chance(.8)){S.f.aug=0;return 'Gece yarısı Dük kalktı: “Yine görüşürüz sanırım.” Görüşmediniz. Aday düştü.'}S.f.aug=1;return 'Dük bütün şartları kabul etti. Dukalıklar kâğıt üzerinde onun, gerçekte Prusya\'nın; ama bir gün sözünden dönebilir.'}},
   {label:'Dük\'ü tanı',desc:'Kral, saray ve Almanya memnun olur. Dukalıklar ayrı bir devlet kalır.',lean:'dove',off:D().mes==='oy'?false:false,eff:{g:8,saray:-10,s:3},run:()=>{S.f.aug=1;return 'Prusya Dük\'ü tanıdı. Frankfurt\'ta ona oy verecek bir orta boy devlet daha doğdu.'}},
   {label:'Görüşmeyi reddet',desc:'Kral bunu kabalık sayar.',lean:'mid',eff:{s:-4},run:()=>'Dük bekletildi ve gitti.'}]},
 /* ===== 2. perde: Avusturya (1864–66) ===== */
 b_schonbrunn:{title:'Avusturya ortaklığın bedelini istiyor',once:true,h:4,art:'elci',when:()=>!!S.f.kondo,fly:[16.4,48.2,14],
  text:'Dışişleri Bakanı Rechberg, Prusya\'yla birlikte yürümenin Viyana\'daki tek savunucusu. Karşılığında bir şey götürmek zorunda: Avusturya\'nın ileride gümrük birliğine alınacağına dair bir söz.',
  quotes:{delbruck:'Avusturya\'nın korumacı sanayisi gümrük birliğini içeriden çürütür. Söz bile vermeyin.',bleich:'Rechberg giderse yerine kim gelirse gelsin daha beceriksiz olur. Bu bize yarar.'},
  sh:['Belirsiz söz','Reddet','İtalya\'da destek'],real:[1,'Prusya bakanlıkları Fransız ticaret antlaşmasını seçti; Rechberg düştü, yerine deneyimsiz Mensdorff geldi.'],
  opts:()=>[
   {label:'Belirsiz bir söz ver',desc:'Rechberg ayakta kalır; ortaklık sürer.',lean:'dove',eff:{dip:{aus:{f:6}}},run:()=>{if(has('delbruck'))fx({m:-2});return 'Söz verildi; ne zaman ve nasıl olacağı yazılmadı.'}},
   {label:'Reddet',desc:'Rechberg düşer. Viyana soğur ama daha acemi ellere kalır.',lean:'hawk',eff:{dip:{aus:{f:-8}}},run:()=>{S.f.mensdorff=1;return 'Rechberg istifa etti. Yerine süvari generali Mensdorff geldi; diplomasiyi hiç bilmiyor.'}},
   {label:'Dukalıklar karşılığında İtalya\'da destek öner',desc:'Viyana çok memnun olur; Floransa hiç olmaz.',lean:'mid',off:D().alm==='kucuk',eff:{dip:{aus:{f:10},ita:{f:-10}}},run:()=>'Öneri Schönbrunn\'da ciddiye alındı. Kral, kendi üzerinde hakkı olmayan topraklar için pazarlıktan rahatsız.'}]},
 b_bucher:{title:'Eski bir devrimci',once:true,h:2,art:'room',when:()=>!has('bucher'),
  text:'Lothar Bucher 1848\'de vergi vermeyi reddetme çağrısı yapmış, sürgüne gitmişti. Şimdi bir telgraf ajansında az parayla çalışıyor ve çok iyi yazıyor.',
  sh:['İşe al','Alma'],real:[0,'Bucher 1864\'te Dışişleri\'ne alındı ve ölümüne kadar Bismarck\'ın en yakın yazı yardımcısı oldu.'],
  opts:()=>[
   {label:'Dışişleri\'ne al',desc:'Kalemi senin için yazar; saray kaşlarını kaldırır.',lean:'pol',eff:{s:-2},run:()=>{S.f.bucher2=1;return '“Millî görüşünüzü biliyorum; tam da ona ihtiyacım var.” Bucher işe başladı.'}},
   {label:'Alma',desc:'Sorun çıkmaz.',lean:'mid',eff:{},run:()=>'Dosya kapatıldı.'}]},
 b_subat:{title:'Şubat şartları',once:true,h:4,art:'elci',when:()=>!!S.f.kondo,
  text:'Viyana soruyor: Prusya dukalıklar için tam olarak ne istiyor? Bir cevap vermek zorundasın.',
  sh:['Ağır şartlar','Para öner','Bekle'],real:[0,'Şubat 1865: dukalıkların ordusu, donanması ve gümrüğü Prusya\'ya bağlanacaktı. İmparator "kabul edilemez" dedi.'],
  opts:()=>[
   {label:'Ordu, donanma, kanal ve gümrük Prusya\'ya bağlansın',desc:'Niyetini açıkça söylersin.',lean:'hawk',eff:{o:2,dip:{aus:{sus:12,f:-8}}},run:()=>'Viyana şartları "tümüyle kabul edilemez" buldu. İki ordu Holstein\'da yan yana ve gergin.'},
   {label:'Avusturya\'ya parayla tazminat öner',desc:'Viyana\'nın hazinesi boş; onur meselesi yapabilirler.',lean:'dove',eff:{h:-4,dip:{aus:{f:3}}},run:()=>'Bankerler görüşüyor. Viyana\'dan gelen cevap: “Çok para olmalı; çünkü pek onurlu bir iş değil.”'},
   {label:'Cevabı geciktir',desc:'Viyana, Augustenburg kartını oynar.',lean:'mid',eff:{g:-3},run:()=>'Avusturya, Holstein\'da Dük lehine gösterilere göz yummaya başladı.'}]},
 b_konsey65:{title:'Kraliyet Konseyi',once:true,h:3,art:'saray',when:()=>!!S.f.kondo,
  text:'Kral, bakanları ve generalleri topladı. Avusturya\'nın her tavize yeni bir istekle karşılık vermesinden bıkmış.',
  sh:['İlhakı kabul ettir','Savaşı öner'],real:[0,'29 Mayıs 1865: Kral ilk kez ilhakın "milletin neredeyse oybirliğiyle istediği" şey olduğunu söyledi. Manteuffel bile Bismarck\'ın ateşinden ürktü.'],
  opts:()=>[
   {label:'Kral\'a ilhakı milletin isteği olarak kabul ettir',desc:'“Hakkım yok” diyen Kral\'ı bir adım ileri taşırsın.',lean:'mid',eff:{s:4},run:()=>{S.f.ilhak=1;return 'Kral konuştu: dukalıkların Prusya\'ya katılmasını yalnızca "Prusya\'nın büyümesini istemeyen demokrasi" engelliyormuş.'}},
   {label:'Savaşı şimdi öner',desc:'Ordu ve para hazır değilse Kral ürker.',lean:'hawk',eff:{s:-5},run:()=>{S.f.ilhak=1;return 'Kral dinledi ve başını iki yana salladı. Manteuffel, Roon\'a seni göz önünde tutmasını yazdı.'}}]},
 b_para:{title:'Savaşın parası',once:true,h:4,art:'room',
  text:'Meclis tek kuruş vermiyor. Maliye Bakanı Bodelschwingh her öneriye anayasayı hatırlatıyor. Bir savaş çıkarsa hazinede en az 30 olmalı.',
  quotes:{heydt:'Devletin elinde demiryolu hisseleri var; satın, meclise sormanıza gerek kalmaz.',bleich:'Rothschild konsorsiyumu hazır. Ama savaş kokusu aldıkları an faiz yükselir.',roon:'Para yoksa ordu yürümez; bu kadar basit.'},
  sh:['Hisseleri sat','Rothschild','Meclisten iste','Borçlan'],real:[0,'Köln–Minden demiryolu hisselerinin satışı 28,8 milyon taler getirdi. Maliye bürokratları işlemin yasaya aykırı olduğunu üç kez yazdı; dinlenmedi.'],
  opts:()=>[
   {label:'Köln–Minden demiryolu hisselerini sat',desc:'Büyük ve hızlı para. Meclise sorulmaz.',lean:'mid',req:()=>!S.f.hisse,reqText:'Hisseler zaten satıldı',eff:{h:22},run:()=>{S.f.hisse=1;if(!has('heydt'))fx({lt:8});return 'Şirket hisseleri geri aldı. Viyana\'daki bir diplomat şunu yazdı: “Böyle bir para ancak savaş beklenirken hazır tutulur.”'}},
   {label:'Rothschild kredisi',desc:'Bleichröder aracılığıyla.',lean:'dove',req:()=>has('bleich'),reqText:'Bleichröder kabinede değil',eff:{h:14},run:()=>{S.debt+=14;return 'Kredi anlaşması imzalandı.'}},
   {label:'Meclisten iste',desc:'Büyük ihtimalle reddedilir.',lean:'dove',off:D().mec==='catisma',eff:{},run:()=>{if(chance(.15)){fx({h:12,lt:-8});return 'Meclis beklenmedik biçimde sınırlı bir ödenek çıkardı.'}fx({s:-4});return 'Meclis reddetti. Kral bunun için başbakana ihtiyacı olmadığını söyledi.'}},
   {label:'Meclise sormadan devlet borçlan',desc:'Açıkça anayasaya aykırı.',lean:'hawk',off:D().mec==='uzlasma',eff:{h:16,lt:15,g:-6},run:()=>{S.debt+=8;return 'Tahviller çıkarıldı. Bodelschwingh istifasını masaya bıraktı.'}}]},
 b_gastein:{title:'Gastein',once:true,h:5,art:'elci',when:()=>!!S.f.kondo,fly:[13.1,47.1,10],
  text:'Avusturya heyetinin başında Kont Blome var; geceleri onunla kâğıt oynuyorsun ve bilerek çılgınca oynuyorsun. Viyana\'nın hazinesi boş, anayasası askıda.',
  quotes:{moltke:'Ordu bir yıl sonra bugünkünden çok daha hazır olur.',bleich:'Para hazineye girmeden top patlarsa borsa çöker. Bekleyin.',roon:'Savaşacaksak bugün de savaşırız. Ama Kral istemiyor.'},
  sh:['Yönetimi böl','Şimdi savaş','Satın al'],real:[0,'14 Ağustos 1865: Schleswig\'i Prusya, Holstein\'ı Avusturya yönetecek; Lauenburg Prusya\'ya satıldı. Kral, Bismarck\'ı kont yaptı.'],
  opts:()=>[
   {label:'Yönetimi böl: Schleswig Prusya\'ya, Holstein Avusturya\'ya; Lauenburg\'u satın al',desc:'Savaş ertelenir. İstediğin an bahane çıkarabileceğin bir düzen kurulur.',lean:'mid',eff:{h:-4,s:5,dip:{aus:{f:4}}},run:()=>{S.f.gastein=1;return 'Anlaşma Salzburg\'da imzalandı. Kral seni kont yaptı. Çatlağın üzerine kâğıt yapıştırıldı.'}},
   {label:'Şimdi savaş',desc:'Ordu, para ve Fransa hazır değilse büyük kumar.',lean:'hawk',off:D().alm==='ortak',req:()=>S.f.frankfurt!==-1&&S.s>=35,reqText:S.f.frankfurt===-1?'Kral, Frankfurt\'ta imzaladığı düzene karşı savaşmaz':'Kral\'ın güveni 35\'in altında: savaşa razı gelmez',eff:{},run:()=>deAustria()},
   {label:'Holstein\'ı satın almayı öner',desc:'Savaşsız kazanım mümkün; Viyana onur meselesi yapabilir.',lean:'dove',eff:{},run:()=>{if(chance(S.course==='D'?.6:.3)&&S.h>=18){fx({h:-18,s:6});S.f.holstein=1;S.f.ausortak=1;return 'Viyana kabul etti. Dukalıkların ikisi de Prusya\'nın; ama Avusturya\'yla savaş için elde bahane kalmadı.'}fx({dip:{aus:{f:-3}}});S.f.gastein=1;return 'Viyana teklifi onur kırıcı buldu. Yönetimi bölmekle yetinildi.'}}]},
 b_biarritz:{title:'Biarritz: III. Napolyon\'la sahilde',once:true,h:4,art:'deniz',fly:[-1.56,43.48,12],
  text:'İmparator yürüyüşe çıkmış. Avusturya\'yla bir savaşta Fransa ne yapar? Bunu sormadan öğrenmek zorundasın; o da karşılığında ne alacağını sormadan öğrenmek istiyor.',
  quotes:{bleich:'Paris\'teki dostlarım, İmparator\'un uzun bir Alman savaşı beklediğini söylüyor. İki taraf yorulunca hakem olacak.',manteuffel:'Bir karış Alman toprağı vaat ederseniz Kral sizi affetmez.'},
  sh:['Umut ver','Açık vaat','Vaat yok'],real:[0,'Ekim 1865. Ne konuşulduğu kesin bilinmiyor; tarihçiler Lüksemburg vaadi konusunda ayrışıyor.'],
  opts:()=>[
   {label:'Belirsiz konuş; umut ver, hiçbir şey yazma',desc:'Fransa bekler. Fatura savaştan sonra gelir.',lean:'mid',eff:{dip:{fra:{f:8,sus:-4}}},run:()=>{S.f.vaat=1;return 'İmparator memnun ayrıldı. Sonradan herkes o sahilde ne söylendiğini farklı hatırlayacak.'}},
   {label:'Açık vaat: Lüksemburg ya da Ren\'de bir şerit',desc:'Fransa\'yı sağlama alırsın. Duyulursa Almanya seni affetmez.',lean:'dove',off:true,eff:{dip:{fra:{f:15,sus:-10}}},run:()=>{S.f.vaat=2;if(chance(.35)){fx({g:-12,s:-4,dip:{sud:{sus:10}}});return 'Vaat Paris salonlarında konuşuldu ve Alman gazetelerine ulaştı.'}return 'İmparator elini sıktı. Dua et ki kimse duymasın.'}},
   {label:'Hiçbir şey vaat etme',desc:'Elin temiz kalır; Paris kuşkulanır.',lean:'hawk',eff:{dip:{fra:{sus:6}}},run:()=>{S.f.vaat=0;return 'İmparator kibar ve soğuktu.'}}]},
 b_italya:{title:'İtalya ittifakı',once:true,h:4,art:'deal',when:()=>!S.f.ausortak&&!S.f.kg,fly:[11.25,43.77,14],
  text:'Floransa Venedik\'i istiyor ve bunun için Avusturya\'yla savaşacak bir ortak arıyor. General Govone Berlin\'de. Konfederasyon hukuku, bir üyenin yabancı bir devletle diğer üyeye karşı anlaşmasını yasaklıyor.',
  sh:['İmzala','İmzalama'],real:[0,'8 Nisan 1866: doksan gün içinde savaş çıkarsa İtalya da Avusturya\'ya saldıracaktı.'],
  opts:()=>[
   {label:'Üç aylık saldırı ittifakını imzala; ödül Venedik',desc:'Avusturya iki cephede savaşır. Saat işlemeye başlar.',lean:'hawk',off:D().alm==='ortak',eff:{dip:{ita:{f:15},aus:{sus:10},fra:{f:3}}},run:()=>{S.f.italya=1;return 'Gizli antlaşma imzalandı. Üç ay içinde savaş çıkmazsa hükümsüz.'}},
   {label:'İmzalama',desc:'Hukuka sadık kalırsın; Avusturya bütün gücüyle sana döner.',lean:'dove',eff:{dip:{ita:{f:-6}}},run:()=>'Govone eli boş döndü.'}]},
 b_konsey66:{title:'28 Şubat Konseyi',once:true,h:3,art:'saray',when:()=>!S.f.ausortak&&!S.f.kg,
  text:'Kral, Veliaht, bakanlar, Moltke ve Manteuffel aynı odada. Moltke Avusturya\'nın henüz at satın almadığını bildiriyor; seferberlik başlamamış demek.',
  sh:['Savaşı savun','Barışı savun'],real:[0,'Bismarck, Prusya\'nın onuru için girişilecek bir savaşın iç çatışmayı da çözeceğini söyledi.'],
  opts:()=>[
   {label:'“Onur için girişilen bir savaş, içerideki kavgayı da bitirir.”',desc:'Ordu hazırlığa başlar.',lean:'hawk',off:D().alm==='ortak',eff:{s:2},run:()=>{if(S.ord.sefer<1)S.ord.sefer=1;return 'Kral ağladı ve barış istediğini söyledi. Sonra kısmi seferberlik emrini imzaladı.'}},
   {label:'Barışı savun',desc:'Saray rahatlar; ordu hayal kırıklığına uğrar.',lean:'dove',eff:{saray:-6,o:-2},run:()=>'Konsey karar almadan dağıldı.'}]},
 b_geneloy:{title:'Frankfurt\'ta bomba: genel oy',once:true,h:5,art:'gazete',
  text:'Konfederasyon reformu için son koz: Prusya, doğrudan ve genel oyla seçilecek bir Alman meclisi önerecek. On bir milletli Avusturya bunu asla kabul edemez. Senin muhafazakâr dostların da.',
  quotes:{bucher:'Nihayet. Halk, prenslerden çok daha kralcıdır; göreceksiniz.',manteuffel:'Devrimi çağırıyorsunuz. Kral bunu anlamayacak.',bleich:'Borsa bunu savaş ilanı diye okur.'},
  sh:['Genel oy','Prensler arası reform'],real:[0,'9 Nisan 1866. Bir liberal gazete şunu sordu: “Şeytan kürsüye çıkıp İncil okursa, bu duadan kim etkilenir?”'],
  opts:()=>[
   {label:'Genel oyla seçilecek bir Alman meclisi öner',desc:'Avusturya köşeye sıkışır; eski dostların senden kopar.',lean:'pol',off:D().mes==='hanedan',eff:{g:10,s:-4,saray:6,dip:{aus:{sus:10},sud:{sus:8}}},run:()=>{S.f.geneloy=1;if(S.f.lassalle)fx({g:4});return 'Öneri Frankfurt\'ta okundu. Dresden\'de güldüler, Viyana\'da sustular, Berlin\'de eski dostların selamı kesti.'}},
   {label:'Yalnızca prensler arası bir reform öner',desc:'Kimseyi ürkütmezsin; kimseyi de kazanmazsın.',lean:'mid',off:D().mes==='oy',eff:{g:-2,dip:{aus:{f:2}}},run:()=>'Öneri komisyona havale edildi.'}]},
 b_suikast:{title:'Unter den Linden\'de silah sesleri',once:true,h:2,art:'gazete',
  text:'7 Mayıs. Saraydan yürüyerek dönerken genç bir adam arkandan ateş etti. Bileğinden yakaladın; mermiler paltonu sıyırdı. Akşam yemeğine konuklarını bekletmeden oturdun.',
  sh:['Devam'],
  opts:()=>[
   {label:'İşine dön',desc:'Kral sarsıldı. Sokakta ise bazıları saldırganın mezarına çiçek bırakıyor.',lean:'mid',eff:{s:4,g:-2},run:()=>'Saldırgan hücresinde kendini öldürdü. Kral, Tanrı\'nın seni bir iş için koruduğuna inanıyor.'}]},
 b_pariskonf:{title:'Napolyon\'un konferans daveti',once:true,h:4,art:'elci',when:()=>!S.f.ausortak&&!S.f.kg,fly:[2.35,48.85,14],
  text:'III. Napolyon; Fransa, İngiltere ve Rusya adına iki Alman gücünü Paris\'te konferansa çağırıyor. Gidersen haftalarca Kral\'dan uzak kalırsın.',
  sh:['Kabul','Ret'],real:[0,'Prusya kabul etti; Avusturya, Venedik konuşulacak diye reddetti ve suçlu duruma düştü.'],
  opts:()=>[
   {label:'Kabul et',desc:'Paris memnun olur. Avusturya reddederse suç onda kalır.',lean:'dove',eff:{dip:{fra:{f:5}}},run:()=>{if(chance(S.f.mensdorff?.8:.6)){fx({dip:{ing:{sus:-5},fra:{sus:-3}}});return 'Avusturya, Venedik\'in konuşulmasını kabul etmediği için gelmeyeceğini bildirdi. Konferans doğmadan öldü; kabahat Viyana\'da.'}fx({s:-3,saray:5});return 'Konferans toplandı ve uzadı. Sen Paris\'teyken Berlin\'de rakiplerin Kral\'la baş başa kaldı.'}},
   {label:'Reddet',desc:'Paris gücenir.',lean:'hawk',eff:{t:8,dip:{fra:{sus:10}}},run:()=>'Davet geri çevrildi. İmparator bunu not etti.'}]},
 b_holstein:{title:'Manteuffel ve Avusturya tugayı',once:true,h:2,art:'war',when:()=>!!S.f.gastein&&!S.f.ausortak&&!S.f.kg,
  text:'Avusturya Gastein\'ı bozdu; Prusya birlikleri Holstein\'a girdi. General Manteuffel ise sayıca az Avusturya tugayının sancaklar açık, bando eşliğinde çekilip gitmesine izin verdi. Tek kurşun atılmadı; savaş bahanesi elinden kaçtı. Ona emir veremezsin.',
  sh:['Mektup yaz','Şikâyet et'],real:[0,'Bismarck generale emir veremiyordu. Schiller\'in Wallenstein\'ından dizelerle biten bir mektup yazdı.'],
  opts:()=>[
   {label:'Manteuffel\'e yaz ve Schiller\'le bitir: “Şimdi başım ve hayatım için dövüşüyorum.”',desc:'Elindeki tek silah ikna.',lean:'mid',eff:{o:1},run:()=>'General mektubu okudu ve bir sonraki sefer daha az zarif davranacağına söz verdi.'},
   {label:'Kral\'a şikâyet et',desc:'Kral generalini savunur.',lean:'hawk',eff:{s:-3},run:()=>'Kral, Manteuffel\'in bir centilmen gibi davrandığını söyledi.'}]},
 b_savas66:{title:'Avusturya\'yla hesaplaşma',once:true,h:3,art:'war',when:()=>!S.f.kg&&!S.f.ausortak,fly:[15.8,50.2,12],
  text:()=>(S.f.kondo?'Avusturya dukalıklar meselesini Konfederasyon Meclisi\'ne götürdü; meclis Prusya\'ya karşı seferberliği oyluyor. ':'Konfederasyon reformu çıkmaza girdi; Avusturya, Prusya\'ya karşı seferberlik oylatıyor. ')+'Saksonya, Hannover, Bavyera ve diğerleri Viyana\'nın yanında. İngiliz elçisiyle bahçede oturuyorsun; saat gece yarısını vuruyor.'+(S.h<30?' Hazine 30\'un altında: ordu ikmalde zorlanacak.':''),
  quotes:{moltke:'Üç ordu, üç demiryolu hattı. Yetmiş beş gün önce kâğıda döktüğüm gibi olacak.',roon:'Ordu hazır. Kral hazır değil; onu siz hazırlayacaksınız.',bleich:'Bütün Avrupa Avusturya\'nın kazanacağına bahse giriyor.',manteuffel:'Yenilirsek son hücumda düşeriz. İnsan bir kez ölür.'},
  sh:['Savaş','Geri adım','Paylaş'],real:[0,'15 Haziran 1866 gece yarısı Prusya orduları Hannover, Saksonya ve Hessen\'e girdi. 3 Temmuz\'da Königgrätz\'te savaş kazanıldı.'],
  opts:()=>[
   {label:'Konfederasyon\'un dağıldığını ilan et; ordular yürüsün',desc:'Her şeyi tek karta koyarsın.',lean:'hawk',off:D().alm==='ortak',req:()=>S.f.frankfurt!==-1&&S.s>=35,reqText:S.f.frankfurt===-1?'Kral, Frankfurt\'ta imzaladığı düzene karşı savaşmaz':'Kral\'ın güveni 35\'in altında: savaşa razı gelmez',eff:{},run:()=>deAustria()},
   {label:'Geri adım at',desc:'İkinci bir Olmütz. Kral, ordu ve kamuoyu bunu sana ödetir.',lean:'dove',eff:{s:-10,g:-12,o:-4},run:()=>{S.f.ausortak=1;if(S.s<20&&S.g<20){end('de_olmutz');return 'Prusya geri çekildi.'}return 'Prusya seferberliği durdurdu ve Konfederasyon\'un kararına uydu. Viyana\'da şampanya açıldı.'}},
   {label:'Almanya\'yı paylaş: kuzey Prusya\'nın, güney Avusturya\'nın',desc:'Savaş çıkmaz. Birleşme hayali biter.',lean:'mid',off:D().alm==='kucuk',eff:{g:-8,dip:{aus:{f:15,sus:-15}}},run:()=>{S.f.ausortak=1;S.f.kondo=0;return 'İki güç Main hattında anlaştı. Almanya iki etki alanına bölündü.'}}]},
 b_nikolsburg:{title:'Nikolsburg: Kral\'la kavga',once:true,h:5,art:'saray',when:()=>!!S.f.kg,fly:[16.64,48.8,10],
  text:'Viyana\'nın kuleleri ufukta. Kral zaferin ödülünü istiyor: Bohemya, Avusturya Silezyası, Saksonya\'dan bir parça. Orduda kolera başladı; Fransız elçisi karargâha doğru yolda. Avusturya bir gün sana lazım olacak.',
  quotes:{moltke:'Kazandığımızı tehlikeye atmayalım. Öç değil, çıkar.',roon:'Kral ağlıyor. Ama haklısınız.',manteuffel:'Zafer geçidi Viyana\'dan geçer!'},
  sh:['Ilımlı barış','Kral\'ın istediği','Viyana\'ya yürü'],real:[0,'26 Temmuz 1866: Avusturya toprak vermedi, yalnızca Almanya\'dan çekildi ve 40 milyon taler ödedi. Kral buna "utanç verici barış" dedi; araya Veliaht girdi. Moltke ve kurmaylar da ılımlı barıştan yanaydı.'],
  opts:()=>[
   {label:'Ilımlı barış: toprak yok, Avusturya Almanya\'dan çekilsin, tazminat ödesin',desc:'Kral\'la çatışırsın. Avusturya bir gün dost olabilir.',lean:'dove',off:D().bar==='sert',eff:{s:-10,h:10,t:-15,saray:-8,dip:{aus:{f:15,sus:-15}}},run:()=>'İstifanı masaya koyup odana çekildin. Veliaht babasıyla konuştu. Kral bir pusula gönderdi: “Başbakanım beni düşman karşısında yüzüstü bıraktığına göre bu utanç verici barışa katlanıyorum.”'},
   {label:'Kral\'ın istediği toprakları al',desc:'Kral ve ordu memnun. Avusturya öç bekler; Fransa hemen tepki verebilir.',lean:'hawk',off:D().bar==='ilimli',eff:{s:6,o:3,h:6,dip:{aus:{f:-25,sus:20},fra:{sus:12}}},run:()=>{S.f.sertbaris=1;return 'Avusturya Bohemya\'dan bir şerit ve Silezya\'sını bıraktı. Viyana\'da bunu unutacak kimse yok.'}},
   {label:'Viyana\'ya yürü',desc:'Zafer geçidi için her şeyi riske atarsın: kolera, Macaristan sıcağı ve Fransa.',lean:'hawk',off:D().bar==='ilimli',eff:{t:20,o:-6},run:()=>{S.f.sertbaris=1;if(chance(S.course==='B'?.7:.5)){fx({s:-8,h:-10,dip:{fra:{sus:20}}});return 'Fransa Ren\'e asker yığdı ve arabuluculuğunu dayattı. Viyana\'ya girildi, ama barışı Paris yazdırdı.'}fx({s:4,dip:{aus:{f:-30,sus:25}}});return 'Ordu Viyana\'da geçit töreni yaptı. Avusturya bir kuşak boyunca düşman.'}}]},
 b_ilhak:{title:'Kuzeyde ilhaklar',once:true,h:4,art:'deal',when:()=>!!S.f.kg,
  text:'Avusturya\'nın yanında savaşan kuzey devletleri elinde. Hannover bir krallık; kralı Kraliçe Victoria\'nın kuzeni.',
  sh:['Geniş ilhak','Dar ilhak'],real:[0,'Hannover, Hessen-Kassel, Nassau ve Frankfurt ilhak edildi; Prusya\'nın nüfusu 4,5 milyon arttı.'],
  opts:()=>[
   {label:'Hannover, Hessen-Kassel, Nassau ve Frankfurt\'u ilhak et',desc:'Prusya\'nın doğusu ile batısı birleşir. Londra hoşlanmaz; Hannoverliler unutmaz.',lean:'hawk',eff:{m:6,h:6,dip:{ing:{f:-5}}},run:()=>{S.f.welf=1;return 'Dört devlet haritadan silindi. Hannover Kralı Viyana\'ya sürgüne gitti.'}},
   {label:'Yalnızca Schleswig-Holstein\'ı al',desc:'Ölçülü görünürsün; ordu ve milliyetçiler hayal kırıklığına uğrar.',lean:'dove',eff:{g:-4,dip:{ing:{f:3}}},run:()=>'Kuzey devletleri tahtlarını korudu ve yeni konfederasyona katılmayı kabul etti.'}]},
 /* ===== 3. perde: Fransa (1866–71) ===== */
 b_af:{title:'Af yasası',once:true,h:4,art:'meclis',when:()=>!!S.f.kg,
  text:'Dört yıl bütçesiz yönettin ve kazandın. Şimdi meclisten bunun için af isteyebilirsin. Muhafazakâr dostların dehşet içinde: “Prusya\'yı Prusya yapan her şeyi geçici bir çoğunluğa teslim ediyorsun.”',
  sh:['Af iste','İsteme'],real:[0,'Yasa 14 Eylül 1866\'da imzalandı. Liberallerin bir bölümü hükûmete yaklaştı; eski dostlar koptu.'],
  opts:()=>[
   {label:'Meclisten af iste',desc:'Kavga biter, liberaller yanına gelir. Eski dostların küser.',lean:'dove',off:D().mec==='catisma',eff:{g:10,saray:5},run:()=>{S.f.af=1;S.lt=0;S.ord.butce=0;return 'Meclis affı ve yeni kredileri birlikte kabul etti. Kavga dönemi kapandı.'}},
   {label:'İsteme: kazanan özür dilemez',desc:'Onurun yerinde; meclisle kavga sürer.',lean:'hawk',off:D().mec==='uzlasma',eff:{lt:10,g:-8},run:()=>'Meclis kürsüsünde zaferi anlattın, anayasayı anmadın.'}]},
 b_benedetti:{title:'Fransa faturayı getiriyor',once:true,h:2,art:'elci',when:()=>!!S.f.kg,
  text:'Elçi Benedetti tarafsızlığın karşılığını istiyor: önce 1814 sınırı ve Ren\'in sol yakası, o olmazsa Lüksemburg ve Belçika. Her şeyi yazıya dökmeye hazır.',
  quotes:{bucher:'Yazsın. Kendi el yazısıyla yazsın. Kâğıt bir gün lazım olur.',manteuffel:'Bir köy bile verilmez.'},
  sh:['Oyala, yazdır','Reddet','Lüksemburg'],real:[0,'5 Ağustos 1866 notu Ren\'in sol yakasını istiyordu. Belçika\'yla ilgili taslak antlaşma Benedetti\'nin el yazısıyla Bismarck\'ta kaldı; belgenin tarihi tartışmalıdır.'],
  opts:()=>[
   {label:'Oyala; taleplerini yazıya döktür',desc:'Hiçbir şey vermezsin, elinde belge kalır.',lean:'mid',eff:{dip:{fra:{f:-3}}},run:()=>{S.f.belge=1;return 'Benedetti taslağı kendi eliyle yazdı ve sana bıraktı. Cevabın hep aynı: “Kral\'ı ikna etmem zaman alır.”'}},
   {label:'Açıkça reddet',desc:'Net olursun; Paris öfkelenir.',lean:'hawk',eff:{t:6,dip:{fra:{sus:12}}},run:()=>'“Bir Alman köyü bile verilemez.” Benedetti Paris\'e eli boş döndü.'},
   {label:'Lüksemburg\'a göz yumacağını söyle',desc:'Paris yatışır; Almanya duyarsa öfkelenir.',lean:'dove',eff:{dip:{fra:{f:8}}},run:()=>{S.f.luxsoz=1;return 'Benedetti memnun ayrıldı.'}}]},
 b_guney:{title:'Güneyle gizli ittifak',once:true,h:4,art:'deal',when:()=>!!S.f.kg,fly:[11.58,48.14,12],
  text:'Bavyera, Württemberg ve Baden yenildi ve barış istiyor. Fransa\'dan arabuluculuk umuyorlar. Oysa Paris, onların Ren\'deki topraklarını senden istemişti.',
  sh:['İttifak öner'],real:[0,'Gizli ittifaklar Württemberg\'le 13, Baden\'le 17, Bavyera\'yla 22 Ağustos 1866\'da imzalandı; 1867\'de açıklandı.'],
  opts:()=>[
   {label:S.f.belge?'Fransız talebinin Münih\'in kulağına gitmesini sağla ve ittifak öner':'Hafif barış şartları karşılığında ittifak öner',desc:S.f.belge?'Koruyucularının kendilerini pazarladığını öğrenirler.':'Elinde belge yok; pazarlık zor.',lean:'mid',eff:{},run:()=>{if(S.f.belge||chance(.4)){S.f.guney=1;fx({dip:{sud:{f:15,sus:-12}}});return 'Üç güney devletiyle gizli savunma ve saldırı ittifakı imzalandı: savaşta orduları Prusya Kralı\'nın komutasına girecek.'}fx({h:-5,dip:{sud:{f:3}}});return 'Güney devletleri barışı imzaladı ama ittifaka yanaşmadı. Paris\'e güveniyorlar.'}}]},
 b_frankfurt66:{title:'Frankfurt\'a ceza',once:true,h:3,art:'gazete',when:()=>!!S.f.kg,
  text:'Dokuz yıl yaşadığın serbest şehir savaşta Avusturya\'yı alkışladı. Ordu şehre bir günde ödenmek üzere 25 milyon gulden katkı payı biçti.',
  sh:['Parayı al','Vazgeç'],real:[0,'Belediye başkanı intihar etti; olay Avrupa basınına yansıdı. Kral ve Kraliçe tutarı fazla buldu.'],
  opts:()=>[
   {label:'Katkı payını tahsil et',desc:'Hazine dolar; Avrupa basını yazar.',lean:'hawk',eff:{h:8,g:-6,dip:{ing:{f:-4}}},run:()=>'Belediye başkanı kendini astı. Kayınbiraderi ipi komutana götürdü.'},
   {label:'Vazgeç',desc:'Şehir nefes alır.',lean:'dove',eff:{g:2},run:()=>'Katkı payı kaldırıldı.'}]},
 b_anayasa:{title:'Kuzey Almanya\'nın anayasası',once:true,h:5,art:'meclis',when:()=>!!S.f.kg,
  text:'Yirmi iki devlet, otuz milyon insan. Taslağı Baltık kıyısında kendin yazdırdın. Soru şu: bu devlet kimin elinde olacak?',
  quotes:{delbruck:'Ben yürütürüm; siz yönetin. Ama bir kabine olmadan her kâğıt sizin masanıza gelir.',bucher:'Genel oy sözünü tutun. Halk size borçlu kalsın.'},
  sh:['Tek şansölye','Sorumlu kabine','Genel oyu geri al'],real:[0,'16 Nisan 1867\'de 230\'a 53 oyla kabul edildi: genel oyla seçilen meclis, tek sorumlu şansölye, sabit ordu bütçesi; haklar bildirgesi yok.'],
  opts:()=>[
   {label:'Genel oyla seçilen meclis, tek sorumlu şansölye, sabit ordu bütçesi',desc:'Sözünü tutarsın ve bütün ipleri elinde toplarsın.',lean:'mid',eff:{s:4,g:4},run:()=>{S.f.anayasa=1;S.f.af=S.f.af||0;return 'Anayasa kabul edildi. Şansölye yalnızca Kral\'a karşı sorumlu; yani sen.'}},
   {label:'Sorumlu kabine ve haklar bildirgesi ekle',desc:'Liberaller coşar; Kral ve saray ürker.',lean:'dove',eff:{g:12,s:-8,saray:-5},run:()=>{S.f.anayasa=2;return 'Meclis coşkuyla kabul etti. Kral, kendi bakanlarını artık kimin seçeceğini soruyor.'}},
   {label:'Genel oyu geri al',desc:'Eski dostların sevinir; verdiğin söz yenir.',lean:'hawk',off:D().mes==='oy',eff:{g:-12,saray:-6},run:()=>{S.f.anayasa=0;return 'Üç sınıflı seçim sistemi yeni devlete taşındı. Gazeteler 1866\'daki sözünü hatırlatıyor.'}}]},
 b_luksemburg:{title:'Lüksemburg krizi',once:true,h:5,art:'elci',when:()=>!!S.f.kg,fly:[6.13,49.61,10],
  text:'III. Napolyon dukalığı Hollanda Kralı\'ndan satın almak üzere. Almanya ayakta; kalede Prusya garnizonu var. Moltke ve ordu şimdi savaşmak istiyor: Fransız ordu reformu bitmeden.',
  quotes:{moltke:'Bugün onlardan üstünüz. İki yıl sonra bunu söyleyemem.',roon:'Yeni eyaletlerde seferberlik düzeni kurulmadı. Bir yıl daha lazım.',bleich:'Paris borsası savaş istemiyor; İmparator\'un çevresi istiyor.'},
  sh:['Konferans','Şimdi savaş','Göz yum'],real:[0,'Mayıs 1867 Londra Konferansı: Lüksemburg tarafsız ilan edildi, Prusya garnizonu çekildi. Bismarck: “Savaşın er geç çıkacağına dair kişisel kanaat, onu kışkırtmayı haklı çıkarmaz.”'],
  opts:()=>S.f.luxsoz?[
   {label:'Sözünü tut: satışa göz yum',desc:'Paris memnun; Almanya öfkeli.',lean:'dove',eff:{g:-12,dip:{fra:{f:10},sud:{sus:8}}},run:()=>'Lüksemburg Fransa\'ya satıldı. Meclis kürsüsünde hesap soruluyor.'},
   {label:'Sözünden dön; konferans iste',desc:'Paris aldatıldığını düşünür.',lean:'mid',eff:{o:-1,t:-2,dip:{fra:{sus:14,f:-8},ing:{f:6}}},run:()=>'Londra\'da konferans toplandı: dukalık tarafsız, garnizon çekilecek. İmparator ikinci kez aldatıldığını söylüyor.'}]:[
   {label:'Uluslararası konferans: Lüksemburg tarafsız olsun, garnizon çekilsin',desc:'Savaş çıkmaz, Fransa da alamaz.',lean:'mid',eff:{o:-1,t:-5,dip:{fra:{sus:5},ing:{f:6}}},run:()=>'Londra\'da anlaşıldı: dukalık tarafsız, kale yıkılacak, garnizon çekilecek. İmparator eli boş kaldı.'},
   {label:'Moltke\'nin planını Kral\'a götür: şimdi savaş',desc:'Kral büyük ihtimalle reddeder. Kabul ederse güney hazırlıksız, sen saldırgansın.',lean:'hawk',eff:{},run:()=>{if(chance(.65)){fx({s:-8,o:2});return 'Kral dinledi ve reddetti: “Bana saldırmayan bir komşuya savaş açmam.”'}return deFrance(-8,true)}},
   {label:'Satışa göz yum',desc:'Paris yatışır; Almanya öfkelenir.',lean:'dove',eff:{g:-12,dip:{fra:{f:10},sud:{sus:8}}},run:()=>'Lüksemburg Fransa\'ya satıldı.'}]},
 b_delbruck:{title:'Liberal yasalar',once:true,h:3,art:'room',when:()=>!!S.f.kg,
  text:'Ortak para, metrik ölçü, serbest dolaşım, meslek serbestliği, şirket kurma özgürlüğü. Şansölyelik dairesinden kararname yağıyor; “kararname ishali” diyorsun.',
  sh:['İmzala','Ağırdan al'],real:[0,'1867–70 arasında bu yasaların hepsi çıktı; gerici bilinen bir hükûmetin elinden.'],
  opts:()=>[
   {label:'Hepsini imzala',desc:'Sanayi ve liberaller memnun; eski dostların değil.',lean:'dove',eff:{m:5,g:5,s:-2},run:()=>'Loncaların tekeli kalktı, sermaye serbest. Krupp yeni bir fırın daha yaktı.'},
   {label:'Ağırdan al',desc:'Kimseyi ürkütmezsin.',lean:'mid',eff:{},run:()=>'Tasarılar komisyonlarda bekliyor.'}]},
 b_welf:{title:'Hannover Kralı\'nın serveti',once:true,h:3,art:'deal',when:()=>!!S.f.welf,
  text:'Sürgündeki Kral Georg, Viyana yakınında bir "Hannover Lejyonu" kuruyor. Anlaşmayla kendisine bırakılan 16 milyon talerin geliri senin elinde.',
  sh:['El koy','Anlaşmaya uy'],real:[0,'Gelire el kondu; "Welf fonu" yıllarca gizli ödenek olarak kullanıldı.'],
  opts:()=>[
   {label:'El koy; gizli ödenek yap',desc:'Kimseye hesap vermediğin bir kasa.',lean:'hawk',eff:{h:4,dip:{ing:{f:-3}}},run:()=>{S.f.welf_fon=1;return 'Fon şansölyelik kasasına girdi. Ne için harcandığını yalnızca sen biliyorsun.'}},
   {label:'Anlaşmaya uy',desc:'Londra takdir eder.',lean:'dove',eff:{dip:{ing:{f:2}}},run:()=>'Gelir Kral Georg\'a ödenmeye devam ediyor.'}]},
 b_gumrukparl:{title:'Güney direniyor',once:true,h:4,art:'gazete',when:()=>!!S.f.kg,
  text:'Gümrük Parlamentosu, güneyi kuzeye alıştıracaktı. Bavyera ve Württemberg seçmeni ise Prusya karşıtlarını gönderdi: “Vergi öde, asker ol, çeneni kapa.”',
  sh:['Tehdit','Sabır','Para'],
  opts:()=>[
   {label:'Zollverein\'i feshetmekle tehdit et',desc:'Güney ekonomik olarak sana muhtaç; bunu hatırlatırsın.',lean:'hawk',off:D().alm==='kuzey',eff:{dip:{sud:{use:8,sus:10}}},run:()=>'Münih borsası düştü. Güney hükûmetleri sustu ve içerledi.'},
   {label:'Sabret: saati ileri almak zamanı hızlandırmaz',desc:'Milliyetçiler sabırsızlanır.',lean:'mid',eff:{g:-3,dip:{sud:{sus:-4}}},run:()=>'Birleşme takvimi olmayan bir hedef olarak kaldı.'},
   {label:'Güney basınına para akıt',desc:'Yavaş ama etkili.',lean:'pol',eff:{h:-4,dip:{sud:{f:4}}},run:()=>'Birkaç Bavyera gazetesinin yazı dili yumuşadı.'}]},
 b_ispanya:{title:'Madrid\'de darbe',once:true,h:3,art:'elci',when:()=>!!S.f.kg&&!S.f.sedan,fly:[-3.7,40.4,18],
  text:'İspanyol generalleri Kraliçe\'yi devirdi ve Avrupa saraylarında kral arıyor. Adaylardan biri Hohenzollern ailesinin Katolik kolundan Prens Leopold olabilir.',
  sh:['Açık kalsın','İlgilenme'],real:[0,'3 Ekim 1868 talimatı: “İspanya meselesinin açık kalması bizim çıkarımızadır; Napolyon\'un hoşuna gidecek bir çözüm işimize yaramaz.”'],
  opts:()=>[
   {label:'Talimat ver: İspanya meselesi açık kalsın',desc:'Bir gün işe yarayabilecek bir kapı.',lean:'mid',eff:{},run:()=>{S.f.ispanya=1;return 'Madrid\'e iki gözlemci gönderildi.'}},
   {label:'İlgilenme',desc:'Paris\'le yeni bir sürtüşme çıkmaz.',lean:'dove',eff:{dip:{fra:{sus:-3}}},run:()=>'Dosya kapandı.'}]},
 b_istifa69:{title:'Küçük şeyler, büyük kriz',once:true,h:3,art:'saray',when:()=>!!S.f.kg,
  text:'Kral bir elçiyi görevden almana izin vermedi; Frankfurt\'un ödeyeceği parada Kraliçe\'yi dinledi. Otuz altı saattir uyumuyorsun. Roon yalvarıyor: mektubu gönderme.',
  sh:['İstifa','Varzin'],real:[0,'22 Şubat 1869. Kral\'ın cevabı: “Sizi bırakmamı nasıl düşünürsünüz! En büyük mutluluğum sizinle yaşamak. Asla.”'],
  opts:()=>[
   {label:'İstifa mektubunu gönder',desc:S.s>=40?'Kral sana güveniyor; seni bırakmaz.':'Kral\'ın güveni düşük: istifayı kabul edebilir.',lean:'hawk',eff:{},run:()=>{if(S.s>=40||chance(S.course==='C'?.35:.55)){fx({s:8});return 'Kral\'ın cevabı üç kez altı çizilmiş bir imzayla geldi: “En sadık dostunuz.”'}end('de_istifa');return 'Kral bu kez yorgundu. İstifayı kabul etti.'}},
   {label:'Varzin\'e çekil ve dinlen',desc:'Ormanda yürürsün.',lean:'dove',eff:{s:2},run:()=>'Üç hafta Pomeranya\'da kaldın. Kâğıtlar Delbrück\'e gitti.'}]},
 b_baden:{title:'Baden katılmak istiyor',once:true,h:3,art:'meclis',when:()=>!!S.f.kg&&!S.f.sedan,
  text:'Baden Büyük Dükü, Kral\'ın damadı; ülkesini Kuzey Almanya\'ya katmak istiyor. Mecliste liberaller bunu açıkça soruyor. Paris için güneyin katılması savaş sebebi.',
  sh:['Reddet','Kabul et'],real:[0,'Şubat 1870\'te Bismarck talebi "zamanı değil" diyerek geri çevirdi.'],
  opts:()=>[
   {label:'Reddet: meyve olgunlaşmadan koparılmaz',desc:'Milliyetçiler bozulur; Paris rahatlar.',lean:'mid',eff:{g:-5,dip:{fra:{sus:-5}}},run:()=>'Baden bekleyecek.'},
   {label:'Kabul et',desc:'Paris bunu meydan okuma sayar.',lean:'hawk',off:D().alm==='kuzey',eff:{g:8,t:15,dip:{fra:{sus:20},sud:{f:6}}},run:()=>{S.f.baden=1;return 'Baden konfederasyona alındı. Paris\'te mecliste savaş sözleri edildi.'}}]},
 b_uclu:{title:'Paris, Viyana ve Floransa konuşuyor',once:true,h:2,art:'room',when:()=>!!S.f.kg&&!S.f.sedan,
  text:'İstihbarat: Fransa, Avusturya ve İtalya ortak bir savaş planı görüşüyor. Avusturya genelkurmayı savaşın en geç nisanda başlamasını şart koşmuş; demek ki bu yıl değil, gelecek yıl.',
  sh:['Not al'],real:[0,'Haziran 1870\'te bir anlayışa varıldı; Roma meselesi yüzünden resmî antlaşma imzalanmadı.'],
  opts:()=>[
   {label:'Not al',desc:S.A.aus.f<50?'Avusturya\'yla aran soğuk; tehlike gerçek.':'Avusturya\'yla aran iyi; Viyana ağırdan alıyor.',lean:'mid',eff:{},run:()=>{if(S.A.aus.f<50){fx({t:10});return 'Demek ki zaman onlardan yana işliyor. Savaş çıkacaksa bu yıl çıkmalı.'}return 'Viyana\'daki dostların görüşmeleri uzatıyor.'}}]},
 b_leopold:{title:'İspanyol tahtı',once:true,h:5,art:'saray',when:()=>!!S.f.ispanya&&!S.f.sedan,
  text:'Madrid tahtı Prens Leopold\'a resmen öneriyor. Kral ailenin başı olarak karşı; prensin babası tereddütte. Paris duyarsa ne olacağını herkes biliyor.',
  quotes:{moltke:'Savaş çıkacaksa şimdi çıksın.',roon:'Kral bu işten hoşlanmıyor. Sizi sorumlu tutacak.',bucher:'Devlet bu işe hiç karışmamış olmalı. Kâğıt üzerinde.'},
  sh:['Aile meselesi','Devlet meselesi','Vazgeç'],real:[0,'Leopold 19 Haziran 1870\'te kabul etti. Bismarck işi baştan beri "ailenin meselesi" olarak yürüttü ve Varzin\'e çekildi.'],
  opts:()=>[
   {label:'Kral\'ı ikna et; işi ailenin özel meselesi olarak yürüt',desc:'Fransa köpürürse Prusya devleti geri adım atmış olmaz.',lean:'mid',eff:{s:-4},run:()=>{S.f.aday=1;return 'Kral “itiraz edemem” dedi. Sen Varzin\'e gittin; Berlin\'de kimse bir şey bilmiyor.'}},
   {label:'Adaylığı devlet meselesi olarak sahiplen',desc:'Geri adım atman gerekirse bedeli ağır olur.',lean:'hawk',eff:{},run:()=>{S.f.aday=2;return 'Prusya adaylığı açıkça destekledi.'}},
   {label:'Vazgeç',desc:'Paris\'le kriz çıkmaz.',lean:'dove',eff:{dip:{fra:{sus:-5}}},run:()=>{S.f.aday=0;return 'Prens teşekkür edip reddetti.'}}]},
 b_cekilme:{title:'12 Temmuz',once:true,h:3,art:'gazete',when:()=>!!S.f.aday&&!S.f.sedan,
  text:'Paris ayaklandı; Kral, Ems\'te Fransız elçisiyle konuştu ve prensin babasına yazdı. Leopold adaylıktan çekildi. Wilhelmstrasse\'de arabanda telgrafları okuyorsun: Fransız basını zafer naraları atıyor.',
  sh:['Bekle','Kabullen','İstifa'],real:[0,'Bismarck istifayı düşündü. Ertesi gün Fransa bir adım daha attı ve Ems\'ten telgraf geldi.'],
  opts:()=>[
   {label:'Bekle: Paris bununla yetinmeyebilir',desc:'Gramont\'u “Avrupa\'nın en büyük ahmağı” diye bilirsin.',lean:'mid',eff:{},run:()=>{if(chance(S.f.andrassy||S.A.fra.sus>=30?.9:.8)){deNow('b_ems');return 'Paris yetinmedi: elçi Kral\'dan, adaylığın bir daha asla yenilenmeyeceğine dair söz istedi. Kral reddetti ve olanları sana telgrafla bildirdi.'}fx({s:-6,g:-8});return 'Paris zaferini kutladı ve sustu. Kriz kapandı; kaybeden sensin.'}},
   {label:'Yenilgiyi kabul et',desc:'Savaş çıkmaz.',lean:'dove',eff:{s:-8,g:-10,dip:{fra:{f:5}}},run:()=>'Prusya sustu. Güney, Paris\'in ağırlığını bir kez daha gördü.'},
   {label:'İstifa et',desc:'Olmütz\'ten beter bir aşağılanmanın altına imza atmazsın.',lean:'hawk',eff:{},run:()=>{end('de_istifa');return 'İstifanı Ems\'e gönderdin.'}}]},
 b_ems:{title:'Ems Telgrafı',once:true,h:3,art:'gazete',when:()=>!!S.f.aday&&!S.f.sedan,
  text:'Roon ve Moltke sofranda; ikisinin de iştahı kaçmış. Kral\'ın telgrafı elinde: Fransız elçisi gezinti yolunda yanına gelmiş, ısrarla söz istemiş; Kral reddetmiş ve yaverini göndererek söyleyecek başka bir şeyi olmadığını bildirmiş. Kral, olanların basına verilip verilmemesini sana bırakıyor. Moltke\'ye soruyorsun: hazır mıyız? “Hazırız.”',
  quotes:{moltke:'Önce bir geri çekilme borusuydu; şimdi hücum borusu gibi.',roon:'Eski Tanrı hâlâ yaşıyor ve bizi rezil etmeyecek.',bucher:'Tek kelime eklemeyin. Yalnızca çıkarın.'},
  sh:['Kısalt, yayımla','Aynen yayımla','Yayımlama'],real:[0,'13 Temmuz 1870: Bismarck metni kısaltarak yayımladı. Fransız kabinesi ertesi gün seferberliğe, 19 Temmuz\'da savaşa karar verdi. Paris\'in zaten savaşa eğilimli olduğunu düşünen tarihçiler de var.'],
  opts:()=>[
   {label:'Metni kısalt ve gazetelere, elçiliklere ver',desc:'Kral hakarete uğramış, elçi kovulmuş gibi okunur. Fransa savaş ilan eder; saldırgan o görünür.',lean:'hawk',eff:{g:15,dip:{sud:{f:15},ing:{sus:-5}}},run:()=>deFrance(0,false)},
   {label:'Aynen yayımla',desc:'Dürüst olursun; Paris yine de savaş ilan edebilir.',lean:'mid',eff:{},run:()=>{if(chance(.4))return deFrance(0,false);fx({s:-4});return 'Telgraf olduğu gibi yayımlandı. Paris homurdandı ve sustu.'}},
   {label:'Yayımlama; diplomatik protesto ver',desc:'Savaş çıkmaz.',lean:'dove',eff:{g:-6,s:-4},run:()=>'Nota verildi. Kriz söndü.'}]},
 b_times:{title:'Belçika taslağı',once:true,h:2,art:'gazete',when:()=>!!S.f.belge&&S.dw==='fra',
  text:'Çekmecende Benedetti\'nin el yazısıyla bir taslak var: Fransa\'nın Belçika\'yı alması için Prusya\'nın yardımı. Londra tarafsız, ama hangi tarafa eğileceği belli değil.',
  sh:['Times\'a ver','Sakla'],real:[0,'Taslak 25 Temmuz 1870\'te Times\'ta yayımlandı. Fransız hükûmeti belgeyi "sözde antlaşma" diye reddetti ve fikrin Bismarck\'tan çıktığını öne sürdü.'],
  opts:()=>[
   {label:'Londra\'da Times\'a ver',desc:'İngiltere Belçika konusunda şaka kaldırmaz.',lean:'pol',eff:{t:-10,dip:{ing:{f:10,sus:-10}}},run:()=>'Londra sabah gazetesinde okudu. Fransa için İngiltere\'de konuşacak kimse kalmadı.'},
   {label:'Sakla',desc:'Belki barışta lazım olur.',lean:'mid',eff:{},run:()=>'Kâğıt çekmecede kaldı.'}]},
 b_favre:{title:'Ferrières: cumhuriyetle barış',once:true,h:4,art:'elci',when:()=>!!S.f.sedan&&!S.f.erkenbaris,fly:[2.7,48.82,10],
  text:'İmparator esir, Paris\'te cumhuriyet var. Dışişleri Bakanı Jules Favre, Rothschild\'in şatosunda karşında: Fransa barış istiyor ama “bir karış toprak, bir kale taşı” vermeyecek.',
  quotes:{moltke:'Strazburg ve Metz olmadan sınır savunulamaz.',bleich:'Para öderler. Toprak için ise bir kuşak boyunca dövüşürler.'},
  sh:['Ilımlı şartlar','Alsace-Lorraine'],real:[1,'Almanya Alsace ve Lorraine\'i şart koştu; Fransa reddetti ve halk savaşı başladı.'],
  opts:()=>[
   {label:'Ilımlı şartlar: tazminat ve Strazburg',desc:'Savaş hemen bitebilir. Ordu ve kamuoyu daha fazlasını bekliyor.',lean:'dove',off:D().bar==='sert',eff:{o:-2,g:-4},run:()=>{if(chance(.5)){S.f.erkenbaris=1;fx({t:-10,dip:{fra:{sus:-10}}});return 'Favre ağlayarak kabul etti. Ateşkes imzalandı; geriye birliğin kendisi kaldı.'}S.f.halksavasi=1;return 'Paris reddetti. Gambetta balonla şehirden çıktı ve taşrada ordular kuruyor.'}},
   {label:'Alsace ve Lorraine şart',desc:'Fransa reddeder; savaş uzar.',lean:'hawk',off:D().bar==='ilimli',eff:{t:6,h:-5},run:()=>{S.f.halksavasi=1;return 'Favre masadan kalktı. Fransa topyekûn direniş ilan etti.'}}]},
 b_karadeniz:{title:'Rusya\'nın faturası',once:true,h:3,art:'elci',when:()=>!!S.f.sedan,fly:[30.3,59.9,22],
  text:'Petersburg, Kırım Savaşı\'ndan kalan Karadeniz maddelerini tek taraflı kaldırdığını duyurdu. Londra öfkeli ve elçisini karargâhına gönderdi. Çar ise senden destek bekliyor; Avusturya\'yı yerinde tutan da o.',
  sh:['Destekle','Destekleme'],real:[0,'Almanya Rusya\'yı destekledi; mesele 1871 Londra Konferansı\'nda Rusya lehine çözüldü.'],
  opts:()=>[
   {label:'Rusya\'yı destekle',desc:'Çar arkanı kollamaya devam eder; Londra surat asar.',lean:'mid',eff:{t:-10,dip:{rus:{f:10},ing:{f:-8}}},run:()=>'Bir konferans önerdin; herkes yüzünü kurtardı, Rusya istediğini aldı.'},
   {label:'Destekleme',desc:'Londra memnun; Petersburg kırgın, Viyana serbest.',lean:'dove',eff:{dip:{rus:{f:-15},ing:{f:6},aus:{sus:8}}},run:()=>{S.fut.push({at:deN()+1,t:12});return 'Çar sustu. Viyana\'da savaş bakanlığının ışıkları geç saatlere kadar yanıyor.'}}]},
 b_bombardiman:{title:'Paris: top mu, açlık mı',once:true,h:4,art:'war',when:()=>!!S.f.sedan&&!S.f.erkenbaris,fly:[2.35,48.85,10],
  text:'Şehir kuşatma altında. Roon bombardıman istiyor, Moltke açlığı beklemeyi. Kraliçe ve Veliaht\'ın eşi bombardımanı barbarlık sayıyor. Berlin\'de sokak şarkısı: “Moltke\'ciğim, artık bum bum bum!” Savaş uzadıkça tarafsızlar kıpırdanıyor.',
  quotes:{roon:'Her gün uzayan kuşatma bir tümen eder. Topları konuşturun.',moltke:'Bu askerî bir karardır. Siyasetçi karışmamalı.',bleich:'Londra piyasası sabırsız. Savaş kışı geçerse kredi pahalanır.'},
  sh:['Bombala','Aç bırak'],real:[0,'Tartışma aylarca sürdü; bombardıman 5 Ocak 1871\'de başladı. Bismarck ile Moltke\'nin arası açıldı.'],
  opts:()=>[
   {label:'Bombala',desc:'Savaş kısalır. Avrupa basını, saray ve Moltke karşında.',lean:'hawk',eff:{saray:8,dip:{ing:{f:-8}}},run:()=>{if(has('moltke'))fx({s:-3});S.f.bomba=1;return 'İlk mermi sabah sekizi çeyrek geçe düştü. Üç hafta sonra Paris görüşme istedi.'}},
   {label:'Aç bırak',desc:'Elin temiz kalır; savaş uzar, para akar.',lean:'dove',eff:{t:8,h:-6},run:()=>'Kuşatma sürüyor. Şehirde hayvanat bahçesinin filleri yendi.'}]},
 b_bavyera:{title:'Kral Ludwig\'in mektubu',once:true,h:4,art:'deal',when:()=>!!S.f.sedan,fly:[11.58,48.14,12],
  text:'İmparatorluk tacını Prusya isteyemez; Alman hükümdarlarının en kıdemlisi önermeli. Bavyera Kralı Ludwig şatolar yaptırıyor ve borç içinde. Elçisi karargâhta.',
  sh:['Gizli ödeme','Toprak','Zorla'],real:[0,'Ludwig\'e Welf fonundan ödeme yapıldı; mektubun metnini Bismarck yazdı. Bavyera meclisi antlaşmayı iki oy farkla kabul etti.'],
  opts:()=>[
   {label:'Gizli ödeme yap ve mektubu sen yaz',desc:S.f.welf_fon?'Welf fonundan; hazineye dokunmaz.':'Hazineden ödenir.',lean:'pol',eff:{dip:{sud:{f:15}}},run:()=>{if(!S.f.welf_fon)fx({h:-8});S.f.mektup=1;return 'Ludwig mektubu kendi el yazısıyla temize çekti. Bavyera postasını, demiryolunu ve barış zamanı ordusunu koruyacak.'}},
   {label:'Toprak öner',desc:'Bavyera sevinir; Kral asla.',lean:'dove',eff:{s:-6,dip:{sud:{f:20}}},run:()=>{S.f.mektup=1;return 'Ludwig mektubu gönderdi. Kral, kimin toprağının verildiğini soruyor.'}},
   {label:'Zorla: kuzeyin gümrüğü ve ordusu olmadan yaşasınlar',desc:'Bavyera meclisi reddedebilir.',lean:'hawk',off:D().alm==='kuzey',eff:{dip:{sud:{sus:15}}},run:()=>{if(chance(.5)){S.f.mektup=1;return 'Münih boyun eğdi; içerleyerek.'}S.f.mektup=0;return 'Bavyera meclisi antlaşmayı reddetti. Birlik, Bavyera\'sız kurulacak ya da hiç kurulmayacak.'}}]},
 b_unvan:{title:'“Alman İmparatoru” mu, “Almanya İmparatoru” mu',once:true,h:4,art:'saray',when:()=>!!S.f.sedan,fly:[2.12,48.8,8],
  text:'Tören yarın, Aynalar Galerisi\'nde. Kral, toprağa hükmeden “Almanya İmparatoru” olmak istiyor; Bavyera yalnızca “Alman İmparatoru”nu kabul etti. Kral ağlıyor: “Yarın eski Prusya\'yı toprağa veriyoruz.”',
  sh:['Alman İmparatoru','Almanya İmparatoru','Dük\'e bırak'],real:[0,'18 Ocak 1871: Baden Büyük Dükü unvanı hiç anmadan “Yaşasın İmparator Wilhelm!” diye seslendi. Kral o gün Bismarck\'ın elini sıkmadan önünden geçti.'],
  opts:()=>[
   {label:'“Alman İmparatoru”nda diren',desc:'Bavyera\'ya verdiğin sözü tutarsın. Kral tören günü yüzüne bakmaz.',lean:'mid',eff:{s:-8,dip:{sud:{f:5}}},run:()=>deEmpire('Kral kürsüden inerken önünden geçti ve generallerin elini sıktı. Seninkini değil.')},
   {label:'Kral\'ın istediği unvanı ver',desc:'Kral mutlu; Bavyera çekilebilir.',lean:'dove',eff:{s:5,dip:{sud:{sus:10}}},run:()=>{if(S.f.mektup&&chance(.3)){S.f.mektup=0;return deEmpire('Bavyera heyeti salonu terk etti; birlik onlarsız ilan edildi.')}return deEmpire('Kral gülümsüyordu.')}},
   {label:'Baden Dükü\'ne bırak',desc:'Sorunu törende o çözsün.',lean:'pol',eff:{s:-3},run:()=>deEmpire('Dük elini kaldırdı: “Yaşasın İmparator Wilhelm!” Unvan hiç anılmadı.')}]},
 b_baris71:{title:'Fransa\'ya barış',once:true,h:5,art:'deal',when:()=>!!S.f.sedan,
  text:'Paris teslim oldu. Thiers ve Favre karşında; yanına yalnızca teknik işler için birkaç kişi aldın. Maliye bakanın bir milyar taler istiyor, Moltke Metz\'i.',
  quotes:{moltke:'Metz yüz bin asker eder.',bleich:'Beş milyarı öderler; Rothschild bulur. Ama Economist şimdiden "pazarlıkçı devlet" diye yazıyor.'},
  sh:['Alsace-Lorraine ve 5 milyar','Metz\'siz','Topraksız'],real:[0,'26 Şubat 1871 ön barışı, 10 Mayıs Frankfurt Barışı: Alsace, Lorraine\'in bir bölümü (Metz dahil) ve beş milyar frank.'],
  opts:()=>[
   {label:'Alsace, Metz\'le birlikte Lorraine\'in bir bölümü ve beş milyar frank',desc:'Ordu ve kamuoyu memnun. Fransa bunu asla unutmaz.',lean:'hawk',off:D().bar==='ilimli',eff:{h:25,o:3,g:5,dip:{fra:{sus:40,f:-30}}},run:()=>{S.f.baris71=1;S.f.alsace=2;S.dw=null;return 'Thiers imzaladı. Fransız meclisinde Alsace milletvekilleri ayakta protesto etti.'}},
   {label:'Alsace ve tazminat; Metz Fransa\'da kalsın',desc:'Moltke öfkelenir; Fransa\'nın yarası biraz daha küçük olur.',lean:'mid',eff:{h:20,o:-4,s:-4,dip:{fra:{sus:20,f:-15}}},run:()=>{S.f.baris71=1;S.f.alsace=1;S.dw=null;return 'Metz Fransız kaldı. Generaller bunu sana bağışlamıyor.'}},
   {label:'Yalnızca tazminat; toprak yok',desc:'Avusturya\'ya yaptığını Fransa\'ya da yaparsın. Kral, ordu ve kamuoyu anlamaz.',lean:'dove',off:D().bar==='sert',eff:{h:20,g:-10,o:-8,s:-8,dip:{fra:{sus:-10,f:5}}},run:()=>{S.f.baris71=1;S.f.alsace=0;S.dw=null;return 'Fransa parayı ödeyecek ve sınırını koruyacak. Berlin\'de gazeteler ihanetten söz ediyor.'}}]},
 /* ===== tekrarlayan gündemler ===== */
 p_augusta:{title:'Kraliçe\'nin mektubu',pool:true,h:2,art:'saray',w:()=>S.saray/40,when:()=>S.saray>=45&&!(S.cool.aug>=deN()-3),
  text:'Kraliçe Augusta, Kral\'a uzun bir mektup yazdı; ekinde eski Baden başbakanının bir muhtırası var. Konu yine sensin.',
  sh:['Kral\'ı yatıştır','Kraliçe\'ye rapor','Karşılık ver'],
  opts:()=>[
   {label:'Kral\'la konuş, yatıştır',desc:'Günü kurtarırsın.',lean:'mid',eff:{s:2},run:()=>{S.cool.aug=deN();return 'Kral mektubu çekmeceye koydu.'}},
   {label:'Kraliçe\'ye düzenli rapor göndermeyi dene',desc:'Belki yumuşar; belki raporları sana karşı kullanır.',lean:'dove',eff:{},run:()=>{S.cool.aug=deN();if(chance(.5)){fx({saray:-8});return 'Kraliçe ilk kez teşekkür etti.'}fx({saray:3});return 'Raporların kenarına notlar düşülüp Kral\'a geri gönderildi.'}},
   {label:'Kral\'a “bir hükûmet mi var, iki mi” diye sor',desc:'Kral senden yana çıkar; saray bilenir.',lean:'hawk',eff:{s:3,saray:6},run:()=>{S.cool.aug=deN();return 'Kral, Kraliçe\'ye sert bir cevap yazdı. Bir süre rahatsın.'}}]},
 p_veliaht:{title:'Veliaht ve liberal basın',pool:true,h:2,art:'gazete',w:()=>1,when:()=>S.saray>=40&&!(S.cool.vel>=deN()-4),
  text:'Veliaht\'ın çevresinden bir mektup liberal gazetelere sızdı: başbakanın “korsan politikası” eleştiriliyor.',
  sh:['Görmezden gel','Karşı sızıntı'],
  opts:()=>[
   {label:'Görmezden gel',desc:'Biraz kamuoyu kaybı.',lean:'dove',eff:{g:-3},run:()=>{S.cool.vel=deN();return 'Konu bir hafta konuşuldu.'}},
   {label:'Karşı sızıntı: Veliaht\'ın eşinin Londra\'ya yazdıkları',desc:'Sert karşılık; saray ayağa kalkar.',lean:'hawk',eff:{g:2,saray:7},run:()=>{S.cool.vel=deN();return '“İngiliz hanım” manşetlerde. Veliaht seninle konuşmuyor.'}}]},
 p_gerlach:{title:'Eski dostların mektubu',pool:true,h:2,art:'room',w:()=>.9,when:()=>(S.f.geneloy||S.f.af||S.doc.mes==='oy')&&!(S.cool.ger>=deN()-4),
  text:'Ludwig von Gerlach gazetesinde yazdı: Tanrı\'nın buyrukları siyasetin kapısında bitmezmiş. Hans von Kleist ise bir İncil ayeti göndermiş.',
  sh:['Kulak ver','Yanıtlama'],
  opts:()=>[
   {label:'Kulak ver; bir jest yap',desc:'Muhafazakârlar yatışır; liberaller kuşkulanır.',lean:'dove',eff:{saray:-4,g:-3},run:()=>{S.cool.ger=deN();return 'Bir akşam yemeği, birkaç eski hatıra.'}},
   {label:'Kenarına yaz: “Ah Hans, hep Tanrı\'nın yıldırımıyla öfkeli.”',desc:'Yoluna devam edersin.',lean:'hawk',eff:{saray:3},run:()=>{S.cool.ger=deN();return 'Mektup dosyaya girdi.'}}]},
 p_sinir:{title:'Sinirler',pool:true,h:2,art:'room',w:()=>.8,when:()=>deN()>=6&&!(S.cool.sin>=deN()-5),
  text:'Üç gündür uyumuyorsun; midende kramplar, ayağında ağrı var. Roon endişeli: “Tam bir düşünce özgürlüğü, bozuk bir mideyle bağdaşmaz.”',
  sh:['Dinlen','Çalış'],
  opts:()=>[
   {label:'Birkaç hafta kırda dinlen',desc:'Toparlanırsın; yokluğunda saray boş durmaz.',lean:'dove',eff:{s:2,saray:3},run:()=>{S.cool.sin=deN();return 'Orman yürüyüşleri iyi geldi.'}},
   {label:'Çalışmaya devam et',desc:'İşler aksamaz; öfken çevrene taşar.',lean:'hawk',eff:{s:-2},run:()=>{S.cool.sin=deN();for(const id of S.cab)S.loy[id]-=3;return 'Bir bakanı kapıdan kovdun, bir kâtibi ağlattın.'}}]},
 p_elci:{title:'Bir büyükelçinin ziyareti',pool:true,h:3,art:'elci',w:()=>1.2,when:()=>['aus','fra','rus','ing'].some(a=>S.A[a].sus>=55&&!(S.cool['e'+a]>=deN()-3)),
  show:()=>{S.f.elci=['aus','fra','rus','ing'].filter(a=>S.A[a].sus>=55&&!(S.cool['e'+a]>=deN()-3)).sort((a,b)=>S.A[b].sus-S.A[a].sus)[0]||'fra'},
  text:()=>`${DEN[S.f.elci]} büyükelçisi görüşme istedi. Ton soğuk: Prusya'nın niyetleri hakkında “açıklama” bekleniyor.`,
  sh:['Güvence ver','Açık konuş','Rakibini an'],
  opts:()=>{const a=S.f.elci,rv=DRIV[a];return[
   {label:'Güvence ver',desc:'Şüphe azalır.',lean:'dove',eff:{dip:{[a]:{sus:-10,f:3}}},run:()=>{S.cool['e'+a]=deN();return 'Elçi başkentine yatıştırıcı bir rapor yazdı.'}},
   {label:'Şaşırtacak kadar açık konuş',desc:'Bazen işe yarar: kimse doğruyu söylediğine inanmaz.',lean:'hawk',eff:{},run:()=>{S.cool['e'+a]=deN();if(chance(.5)){deAdj({[a]:{sus:-6,use:5}});return 'Elçi, bunun bir blöf olduğuna karar verdi.'}deAdj({[a]:{sus:6}});return 'Elçi her kelimeyi başkentine aynen iletti.'}},
   {label:`${DEN[rv]} ile aranın iyi olduğunu hatırlat`,desc:'Dengeyi gösterirsin; öteki taraf da duyar.',lean:'mid',eff:{dip:{[a]:{sus:-5},[rv]:{f:2,sus:2}}},run:()=>{S.cool['e'+a]=deN();return 'Elçi mesajı aldı.'}}]}}
});
/* danışmanların baloncukta önerdiği seçenek: sözleriyle tutarlı olsun diye elle verilir */
Object.assign(RECS,{b_butce:{roon:0,heydt:0,eulenburg:0,bucher:1,manteuffel:0},b_kanvedemir:{roon:1,bucher:1,manteuffel:0},b_tren:{roon:0,manteuffel:0},b_polonya:{roon:0,bucher:2,bleich:0,moltke:0},b_frankfurt:{roon:0,manteuffel:2,bucher:0,eulenburg:1},
  b_danimarka:{roon:1,bucher:0,moltke:1,manteuffel:1},b_augustenburg:{roon:0,manteuffel:0},b_schonbrunn:{delbruck:1,bleich:1},b_para:{heydt:0,bleich:1,roon:0},b_gastein:{moltke:0,bleich:0,roon:0},b_biarritz:{bleich:0,manteuffel:2},
  b_geneloy:{bucher:0,manteuffel:1,bleich:1},b_savas66:{moltke:0,roon:0,bleich:1,manteuffel:0},b_nikolsburg:{moltke:0,roon:0,manteuffel:2},b_benedetti:{bucher:0,manteuffel:1},b_anayasa:{delbruck:0,bucher:0},b_luksemburg:{moltke:1,roon:0,bleich:0},
  b_leopold:{moltke:1,roon:0,bucher:0},b_ems:{moltke:0,roon:0,bucher:0},b_favre:{moltke:1,bleich:0},b_bombardiman:{roon:0,moltke:1,bleich:0},b_baris71:{moltke:0,bleich:1}});
/* savaş açma yardımcıları: gündem seçeneklerinin sonucunu üretir */
/* Avusturya savaşı iki adımda: önce ordular yürür, sonra Königgrätz sabahındaki kararla (ya da tur sonunda kendiliğinden) çözülür */
window.deAustria=function(){S.dw='aus';S.ord.sefer=Math.max(S.ord.sefer,1);deNow('b_koniggratz');
  return '15 Haziran gece yarısı ordular Hannover, Saksonya ve Hessen\'e girdi; Hannover ordusu Langensalza\'da teslim oldu. Üç Prusya ordusu ayrı yollardan Bohemya\'ya iniyor. Avusturya\'nın ana ordusu Elbe kıyısında, Königgrätz önünde bekliyor.'};
window.deAustriaResolve=function(bonus){const W=deWar('aus',bonus||0);S.dw=null;
  if(W.res==='iki'){end('de_ikicephe');return W.notes.join(' ')}
  if(W.res==='yenilgi'){end('de_yenilgi');return 'Avusturya süvarisi öğleden önce Prusya\'nın açık kanadına yüklendi; İkinci Ordu yetişemedi. '+W.notes.join(' ')}
  S.f.kg=1;S.f.kondo=0;fx({s:15,g:20,saray:-15,lt:-20,h:-22,o:3});if(W.res==='uzun')fx({h:-8,t:10});S.ord.sefer=0;
  deNow('b_nikolsburg');deNow('b_ilhak');
  return 'Öğleden sonra üçte Veliaht\'ın ordusu sisin içinden çıkıp Avusturya kanadına düştü. Akşam bir Avusturya generali ateşkes istemeye geldi: “İmparatorumun ordusu kalmadı.” '+W.notes.join(' ')+(W.res==='uzun'?' Zafer pahalıya mal oldu.':' Savaş yedi haftada bitti.')+' Aynı gün yapılan seçimde ilericiler çöktü. Ölülerin arasından atla geçerken, en büyük oğlun orada yatsaydı ne hissedeceğini düşündün.'};
window.deFrance=function(bonus,early){S.dw='fra';S.f.frab=bonus||0;S.ord.sefer=2;if(early){S.f.erken=1;fx({g:-6,dip:{ing:{sus:10},sud:{sus:6}}})}
  deNow('b_times');deNow('b_sefer70');
  return early?'Kral imzaladı. Prusya, hazırlığını bitirmemiş bir Fransa\'ya savaş açtı; bu kez saldırgan olan sensin.':'Paris\'te kalabalıklar “Berlin\'e!” diye bağırıyor. Fransa 19 Temmuz\'da savaş ilan etti; güney devletleri ordularını Prusya Kralı\'nın emrine verdi. Moltke\'nin trenleri işliyor.'};
window.deEmpire=function(tail){if(S.f.mektup===0&&!S.f.guney){S.f.imparator=0;return 'Güney devletleri katılmadı; tören yapılmadı. '+tail}
  S.f.imparator=1;fx({g:10,saray:-5});
  return '18 Ocak 1871, Versay. Paris\'in topları duyulurken Aynalar Galerisi\'nde Alman İmparatorluğu ilan edildi. '+tail};
}
