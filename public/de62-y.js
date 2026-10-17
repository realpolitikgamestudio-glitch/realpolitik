/* ---------- Kan ve Demir: derinlik katmanı ----------
   Savaş anı kararları, büyük güçlerin kendi hamleleri, 1867–69 olayları, kişisel gündemler,
   geçmiş seçimlere atıf yapan metinler, danışman sözleri ve tur başındaki kısa sesler. */
{const D=()=>S.doc,after=()=>{deNow('b_favre');deNow('b_bombardiman')},pk=id=>(S.pk||{})[id],KG=()=>!!S.f.kg,PRE=()=>!S.f.kg&&!S.f.ausortak;
deDec({
 /* ===== savaş anı kararları ===== */
 b_koniggratz:{title:'Königgrätz, 3 Temmuz sabahı',once:true,h:2,art:'war',when:()=>S.dw==='aus',fly:[15.83,50.21,7],
  text:'Sis ve yağmur. Birinci Ordu saatlerdir Avusturya toplarının altında eriyor; Veliaht\'ın İkinci Ordusu hâlâ görünmüyor. Telgraf yok, haberci yok. Kral dürbününü indiriyor ve sana dönüyor: “Geri çekilmeyi düşündünüz mü?” Anlatıya göre o sabah puro tabakanı Moltke\'ye uzattın; en iyisini seçip aldı.',
  quotes:{moltke:'Burada Prusya\'nın bütün geleceği söz konusu. Geri çekilme olmayacak.',roon:'Yedeklere dokunmayın. Veliaht gelecek.',manteuffel:'Süvariyi sürün! Beklemek korkakların işidir.',bleich:'Berlin borsası bu sabah açılmadı. Herkes aynı telgrafı bekliyor.'},
  sh:['Moltke\'ye güven','Yedekleri sür','Geri çekil'],real:[0,'Moltke geri çekilmeyi reddetti. Öğleden sonra Veliaht\'ın ordusu Avusturya kanadına düştü. Avusturya komutanı o sabah Prusya\'nın açık kanadına saldırsaydı sonuç başka olabilirdi.'],
  opts:()=>[
   {label:'Moltke\'ye güven: bekle',desc:'Plan, üç ordunun savaş alanında birleşmesine dayanıyor. Birleşemezlerse her şey biter.',lean:'hawk',eff:{},run:()=>deAustriaResolve(has('moltke')?6:3)},
   {label:'Kral\'a yedekleri hemen sürmesini söyle',desc:'Merkez tutunur; kuşatma planı zayıflar ve kayıplar artar.',lean:'mid',eff:{o:-2},run:()=>deAustriaResolve(-3)},
   {label:'Kral\'ı geri çekilmeye hazırla',desc:'Orduyu kurtarırsın; savaşı büyük ihtimalle kaybedersin.',lean:'dove',eff:{s:-5},run:()=>deAustriaResolve(-16)}]},
 b_sefer70:{title:'Karargâhta: yarı tanrılar',once:true,h:3,art:'war',when:()=>S.dw==='fra'&&!S.f.sedan,fly:[6.17,49.12,8],
  text:'Ağustos. Üç ordu sınırı geçti. General Steinmetz emirleri hiçe sayıp Spicheren\'de saldırdı; Gravelotte\'de bir günde yirmi bin kayıp verildi. Sen general üniforması ve çizmelerle karargâhtasın; Moltke\'nin kurmayları sana “sivil” diye bakıyor ve harekât hakkında tek satır bilgi vermiyor.',
  quotes:{moltke:'Savaşta komuta bölünmez. Barışı siz yaparsınız; oraya kadarını ben.',roon:'Çocuklar haksız, ama haklı çıkacaklar. Bırakın yürüsünler.',bleich:'Londra ve Petersburg her gün soruyor. Onları siz oyalayın, savaşı generaller bitirsin.'},
  sh:['Karışma','Bilgi iste','Steinmetz gitsin'],real:[0,'Bismarck ile “yarı tanrılar” dediği kurmaylar arasında açık bir kavga çıktı; Moltke harekâtı kendi bildiği gibi yürüttü. Steinmetz eylülde görevden alındı.'],
  opts:()=>[
   {label:'Harekâta karışma; sen tarafsız başkentleri tut',desc:'Moltke rahat çalışır; Viyana, Londra ve Petersburg seninle konuşur.',lean:'mid',eff:{t:-4},run:()=>{S.f.frab=(S.f.frab||0)+3;return 'Elçilerle günde on telgraf. Avusturya kıpırdamadı.'}},
   {label:'Kral\'dan harekât raporlarının sana da verilmesini iste',desc:'Hakkın; ama kurmaylarla savaş açarsın.',lean:'hawk',eff:{s:-2},run:()=>{S.f.frab=(S.f.frab||0)-2;S.sag-=4;return 'Bir kurmay yarbay emri yerine getirmektense istifa edeceğini bildirdi. Raporlar gelmedi; öfken geldi.'}},
   {label:'Steinmetz\'in görevden alınmasını iste',desc:'Haklısın; bir generalin kellesini isteyen sivil olursun.',lean:'hawk',eff:{o:-1,s:-2},run:()=>{S.f.frab=(S.f.frab||0)+2;return 'Steinmetz terfi ettirilerek Posen\'e gönderildi.'}}]},
 b_donchery:{title:'Donchery: dokumacının kulübesi',once:true,h:3,art:'war',when:()=>!!S.f.sedan&&!S.f.baris71,fly:[4.87,49.7,7],
  text:'2 Eylül, şafak. Fransız İmparatoru yol kenarındaki bir dokumacı kulübesinin önünde, tahta bir sandalyede seni bekliyor. Kılıcını Kral\'a teslim edecek; barışı ise Paris\'teki naipliğe bıraktığını söylüyor. Yüz bin esir tarlada bekliyor.',
  quotes:{moltke:'Esir esirdir. Ordusuyla birlikte Almanya\'ya gider.',bleich:'İmparatorluk ayakta kalırsa barışı imzalayacak biri olur. Cumhuriyetle kim pazarlık eder?',roon:'Kral onu bir hükümdar gibi karşılamak istiyor.'},
  sh:['Esir al','İmparatorluğu yaşat','Kral\'a bırak'],real:[0,'Napolyon Kassel yakınındaki Wilhelmshöhe şatosuna esir gönderildi. İki gün sonra Paris\'te cumhuriyet ilan edildi.'],
  opts:()=>[
   {label:'Onu esir al; barışı Paris\'le konuşursun',desc:'Paris\'te imparatorluk büyük ihtimalle devrilir.',lean:'hawk',eff:{},run:()=>{after();return 'İmparator Wilhelmshöhe\'ye gönderildi. Paris haberi alınca meclisi bastı.'}},
   {label:'İmparatorluğu yaşat: Napolyon\'la hemen barış yap, ordusunu Paris\'e geri gönder',desc:'Tutarsa savaş bugün biter. Tutmazsa silahlı bir orduyu geri vermiş olursun.',lean:'dove',off:D().bar==='sert',eff:{},run:()=>{if(chance(.4)){S.f.erkenbaris=1;fx({t:-12,g:-6,o:-2,dip:{fra:{sus:-15}}});return 'Napolyon ön barışı imzaladı ve ordusunun başında Paris\'e döndü. İmparatorluk ayakta; savaş bitti. Berlin\'de "zafer çalındı" diyenler var.'}fx({g:-4,s:-3});S.f.halksavasi=1;after();return 'Paris imparatoru beklemedi: cumhuriyet ilan edildi. Serbest bıraktığın alaylar şimdi karşında.'}},
   {label:'Kral\'a götür; karar onun',desc:'İki hükümdar yüz yüze gelir.',lean:'mid',eff:{s:3},run:()=>{after();return 'Kral, Napolyon\'la çeyrek saat baş başa kaldı ve gözleri dolu çıktı. İmparator esir olarak Wilhelmshöhe\'ye gönderildi.'}}]},
 /* ===== büyük güçlerin kendi hamleleri ===== */
 a_fra_ittifak:{title:'Paris\'ten teklif: birlikte Avusturya\'ya karşı',pool:true,once:true,h:4,art:'elci',w:()=>2.5,when:()=>PRE()&&deN()>=9&&deN()<=15&&S.A.fra.f>=50,
  text:'Fransız elçisi beklenmedik bir öneriyle geldi: İmparator, Avusturya\'ya karşı açık bir saldırı ittifakına hazır. Prusya Almanya\'yı yeniden düzenler; Fransa bedelini Ren\'in sol yakasında alır.',
  quotes:{moltke:'Fransız ordusu yanımızdaysa savaş üç haftada biter. Sonra o ordu Ren\'de kalır.',bucher:'Bunu kabul ederseniz Almanya\'da adınız anılmaz olur.',bleich:'Paris bunu Viyana\'ya da öneriyor olabilir.'},
  sh:['Reddet','Oyala','Kabul et'],real:[0,'III. Napolyon 1865\'te böyle bir ittifaka hazır olduğunu sezdirdi; Bismarck geri çevirdi ama İtalya ittifakını kurarken Paris\'in iyi niyetinden yararlandı.'],
  opts:()=>[
   {label:'Kibarca reddet',desc:'Alman toprağı pazarlık konusu olmaz. Paris bozulur.',lean:'hawk',eff:{g:3,dip:{fra:{f:-6,sus:4}}},run:()=>'“Kral bir Alman köyünü bile veremez.” Elçi eğildi ve çıktı.'},
   {label:'Oyala: ne evet ne hayır',desc:'Paris umutlanır; tarafsız kalır.',lean:'mid',eff:{dip:{fra:{f:4}}},run:()=>{S.f.vaat=S.f.vaat||1;return 'Görüşmeler “sürüyor”. İmparator bekliyor.'}},
   {label:'Kabul et',desc:'Savaşı garantilersin. Bedeli Alman toprağıdır ve bir gün ortaya çıkar.',lean:'dove',off:true,eff:{dip:{fra:{f:20,sus:-15}}},run:()=>{S.f.fraittifak=1;S.f.vaat=2;S.fut.push({at:deN()+3,g:-15,s:-6});return 'Gizli antlaşma imzalandı. Fransız kolorduları Ren\'e yürüyecek ve orada kalacak.'}}]},
 a_aus_oylama:{title:'Viyana Frankfurt\'ta oylama yaptırıyor',pool:true,once:true,h:3,art:'elci',w:()=>2,when:()=>PRE()&&!!S.f.kondo&&S.A.aus.sus>=60,
  text:'Avusturya\'nın desteğiyle Bavyera, Konfederasyon Meclisi\'ne önerge verdi: Holstein, Augustenburg Dükü\'ne devredilsin. Önerge dokuza karşı altı oyla geçti.',
  sh:['Tanıma','Protesto','Boyun eğ'],real:[0,'1865\'te önerge 9\'a 6 kabul edildi; Prusya kararı tanımadı.'],
  opts:()=>[
   {label:'Kararı tanıma: Konfederasyon\'un yetkisi yok',desc:'Hukuken zayıf, fiilen güçlü.',lean:'hawk',eff:{g:-3,dip:{aus:{sus:6},sud:{sus:6}}},run:()=>'Prusya delegesi salonu terk etti.'},
   {label:'Protesto et, görüşmeye açık ol',desc:'Kapıyı kapatmazsın.',lean:'mid',eff:{dip:{aus:{f:3}}},run:()=>'Nota verildi. Viyana zaman kazandı.'},
   {label:'Karara uy',desc:'Dük Holstein\'a yerleşir; ilhak yolu daralır.',lean:'dove',eff:{s:-6,g:6,dip:{aus:{f:8}}},run:()=>{S.f.aug=1;return 'Dük Kiel\'de karşılandı. Kral sana sormadan bir kutlama telgrafı gönderdi.'}}]},
 a_rus_istek:{title:'Gorçakov bir iyilik istiyor',pool:true,once:true,h:3,art:'elci',w:()=>1.6,when:()=>deN()>=6&&deN()<=23&&S.A.rus.f>=58,
  text:'Rus Dışişleri Bakanı dostça bir mektup yazdı: Prusya\'ya sığınan Polonyalı asilerin teslimini ve günü geldiğinde Karadeniz maddelerinin kaldırılmasına destek sözünü istiyor.',
  sh:['İkisini de ver','Yalnız söz ver','Reddet'],
  opts:()=>[
   {label:'Mültecileri teslim et ve söz ver',desc:'Petersburg çok memnun; liberaller ve Londra hiç değil.',lean:'hawk',eff:{g:-6,dip:{rus:{f:10},ing:{f:-5}}},run:()=>{S.f.karasoz=1;return 'Trenle sınıra götürüldüler. Meclis kürsüsünde adın lanetle anıldı.'}},
   {label:'Karadeniz için söz ver; mültecilere dokunma',desc:'Dengeli.',lean:'mid',eff:{dip:{rus:{f:5}}},run:()=>{S.f.karasoz=1;return 'Gorçakov teşekkür etti ve notunu aldı.'}},
   {label:'İkisini de reddet',desc:'Petersburg\'un dostluğu bedelsiz değildi.',lean:'dove',eff:{g:3,dip:{rus:{f:-10,sus:5}}},run:()=>'Cevap gecikti ve soğuktu.'}]},
 a_ing_mektup:{title:'Kraliçe Victoria\'nın mektubu',pool:true,once:true,h:3,art:'saray',w:()=>2,when:()=>PRE()&&deN()>=13&&deN()<=16,
  text:'Veliaht\'ın eşi annesinden bir mektup getirdi. İngiltere Kraliçesi, Kral Wilhelm\'e doğrudan yazıyor: Alman kanı dökülmesin; “tek bir adamın” hırsı yüzünden Avrupa ateşe atılmasın.',
  quotes:{roon:'Kral iki gecedir uyumuyor. Bu mektubu cevapsız bırakamaz.',manteuffel:'Bir İngiliz kadını Prusya Kralı\'na ne yapacağını söyleyemez.'},
  sh:['Cevabı sen yaz','Kral yazsın','Sızdır'],real:[0,'Victoria 1866 baharında Wilhelm\'e barış için yazdı; cevap Bismarck\'ın elinden çıktı.'],
  opts:()=>[
   {label:'Cevabı sen kaleme al; Kral imzalasın',desc:'Kral\'ı sen konuşturursun.',lean:'mid',eff:{s:2,saray:5,dip:{ing:{f:-3}}},run:()=>'Cevap saygılı ve boştu. Windsor\'da kimin yazdığını anladılar.'},
   {label:'Kral kendi cevabını yazsın',desc:'Kral\'a güvenirsin; o da kuzenine barış sözü verebilir.',lean:'dove',eff:{},run:()=>{if(chance(.5)){fx({s:-5,dip:{ing:{f:5}}});S.f.kralsoz=1;return 'Kral, Kraliçe\'ye “savaşı ben başlatmayacağım” diye yazdı. Bu söz seni bağlar.'}fx({s:3});return 'Kral kısa ve onurlu bir cevap yazdı; sana da gösterdi.'}},
   {label:'Mektubu basına sızdır',desc:'Yabancı bir hükümdarın karışması Almanları kızdırır.',lean:'pol',eff:{g:6,saray:10,dip:{ing:{f:-8}}},run:()=>'“İngiltere Prusya\'ya emir veriyor.” Veliaht\'ın eşi seninle konuşmuyor.'}]},
 a_ita_venedik:{title:'Viyana, Venedik\'i savaşsız bırakmayı öneriyor',pool:true,once:true,h:3,art:'elci',w:()=>3,when:()=>PRE()&&!!S.f.italya,
  text:'Avusturya, Paris aracılığıyla Floransa\'ya haber gönderdi: İtalya tarafsız kalırsa Venedik savaşsız verilecek. İtalyan hükûmeti tereddütte; antlaşmanın süresi dolmak üzere.',
  sh:['İtalya\'yı tut','Bırak'],real:[0,'Haziran 1866\'da Avusturya, Venedik\'i Napolyon\'a devretmeyi önerdi. İtalya onurunu savaşmadan kurtaramayacağına karar verdi ve antlaşmaya bağlı kaldı.'],
  opts:()=>[
   {label:'Floransa\'ya para ve söz gönder: birlikte savaşan birlikte kazanır',desc:'İtalya müttefik kalır.',lean:'hawk',eff:{h:-4,dip:{ita:{f:8}}},run:()=>'Kral Vittorio Emanuele, hediye edilen bir eyaleti değil, kazanılanı istediğini söyledi.'},
   {label:'Karışma',desc:'İtalya çekilebilir.',lean:'dove',eff:{},run:()=>{if(chance(.5)){S.f.italya=0;fx({dip:{ita:{f:-8}}});return 'İtalya antlaşmanın süresinin dolmasını bekledi. Avusturya artık güneyinden emin.'}return 'İtalya sözünde durdu.'}}]},
 a_fra_ordu:{title:'Fransa silahlanıyor',pool:true,once:true,h:3,art:'war',w:()=>2,when:()=>KG()&&!S.f.sedan&&deN()>=19&&deN()<=23,
  text:'Mareşal Niel\'in ordu reformu meclisten geçti. Fransız piyadesi, iğneli tüfekten iki kat uzağa atan Chassepot tüfeğini alıyor; bir de “mitralyöz” denen gizli bir silahtan söz ediliyor.',
  quotes:{moltke:'Tüfekleri bizden iyi. Topları ve demiryolları değil. Farkı Krupp kapatır.',roon:'Yeni eyaletlerdeki alaylar hâlâ talimde. Bir yıl daha lazım.',heydt:'Çelik toplar için para bulunur; ama başka bir kalemden.'},
  sh:['Krupp topları','Bekle','Casus'],
  opts:()=>[
   {label:'Krupp\'tan kuyruktan dolma çelik top siparişi ver',desc:'Pahalı; topçuda üstünlük sağlar.',lean:'hawk',eff:{h:-8,o:3,m:1},run:()=>{S.f.frab=(S.f.frab||0)+3;return 'Essen\'de fırınlar gece gündüz yanıyor.'}},
   {label:'Bekle',desc:'Hazine korunur; açık kapanmaz.',lean:'dove',eff:{},run:()=>{S.f.frab=(S.f.frab||0)-4;return 'Ataşe raporları dosyaya kondu.'}},
   {label:'Paris\'teki ataşeye Fransız seferberlik planını buldur',desc:'Ucuz; ortaya çıkarsa skandal olur.',lean:'pol',eff:{h:-2},run:()=>{if(chance(.7)){S.f.frab=(S.f.frab||0)+2;return 'Planın bir kopyası Berlin\'de. Fransız yedekleri alaylarına ülkenin öbür ucundan gidecek.'}fx({dip:{fra:{sus:10}}});return 'Bir yüzbaşı Paris\'ten sınır dışı edildi.'}}]},
 a_aus_beust:{title:'Beust öç peşinde',pool:true,once:true,h:3,art:'elci',w:()=>2,when:()=>KG()&&!S.f.sedan&&deN()>=19&&deN()<=24&&S.A.aus.f<55,
  text:'Viyana\'nın yeni dışişleri bakanı, 1866\'da senin yüzünden görevinden olan eski Saksonya başbakanı Beust. Güney saraylarını dolaşıyor ve Paris\'le yazışıyor.',
  quotes:{bleich:'Macarlar bir öç savaşı istemiyor; Budapeşte\'de Andrássy\'ye ulaşabilirim.',moltke:'İki cephe için plan var; ama iyi bir plan değil.'},
  sh:['Macarlar','Rusya','Viyana\'ya jest'],
  opts:()=>[
   {label:'Budapeşte\'de Andrássy\'yle temas kur',desc:'Macarlar Viyana\'yı içeriden frenler.',lean:'pol',eff:{h:-3,dip:{aus:{sus:-10}}},run:()=>{S.f.andrassy=1;return 'Andrássy açık konuştu: Macaristan, Almanya\'da kaybedilmiş bir yer için tek asker vermez.'}},
   {label:'Petersburg\'dan Galiçya sınırına birlik kaydırmasını iste',desc:'Çar dostsa Viyana yerinden oynayamaz.',lean:'hawk',eff:{},run:()=>{if(S.A.rus.f>=50){fx({t:-8,dip:{aus:{sus:6}}});S.f.russoz=1;return 'Yüz bin Rus askeri Galiçya sınırında “talim” yapıyor.'}fx({dip:{rus:{f:-3}}});return 'Petersburg oralı olmadı.'}},
   {label:'Viyana\'ya bir jest yap: ticaret kolaylığı',desc:'Yarayı biraz daha sararsın.',lean:'dove',eff:{h:-3,dip:{aus:{f:8}}},run:()=>'Beust gülümsedi. Samimi olup olmadığını kimse bilmiyor.'}]},
 /* ===== 1867–69 ===== */
 b_secim67:{title:'Kuzey Almanya\'nın ilk seçimi',once:true,h:3,art:'meclis',when:KG,
  text:'Kurucu meclis genel oyla seçilecek. Saksonya Kralı ve bazı prensler anayasa taslağına direniyor. Valilere gizli bir talimat gönderebilirsin.',
  quotes:{eulenburg:'Valiler ne denirse onu yapar. Ama bunu yazılı vermeyin.',bucher:'Prensler direnirse arkanızda halkı gösterin; halk direnirse prensleri.'},
  sh:['Radikallere yardım','Muhafazakârlara yardım','Karışma'],real:[0,'Bismarck valilere, direnen hükûmetleri sıkıştırmak için yer yer radikallere yardım edilmesi talimatını verdi. Mecliste Ulusal Liberaller en büyük grup oldu.'],
  opts:()=>[
   {label:'Yer yer radikallere yardım et: prensler korksun',desc:'Küçük devletler hizaya gelir; eski dostların dehşete düşer.',lean:'pol',off:D().mes==='hanedan',eff:{g:5,saray:6,dip:{sud:{sus:4}}},run:()=>'Saksonya Kralı taslağı imzaladı. Berlin\'de bir Yahudi radikal, Savaş Bakanı Roon\'u seçimde yendi.'},
   {label:'Her zamanki gibi muhafazakârlara yardım et',desc:'Dostların memnun; meclis sana daha az borçlu.',lean:'hawk',off:D().mes==='oy',eff:{saray:-5,g:-3},run:()=>'Meclisin yarısı soylu. Liberaller şimdiden haklar bildirgesi istiyor.'},
   {label:'Karışma',desc:'Sonucu sandık belirlesin.',lean:'dove',eff:{g:3},run:()=>'Seçim sakin geçti.'}]},
 b_sergi67:{title:'Paris Dünya Sergisi',once:true,h:3,art:'gazete',when:()=>KG()&&!S.f.sedan&&!S.f.erken,fly:[2.35,48.85,12],
  text:'III. Napolyon bütün hükümdarları Paris\'e çağırdı. Kral gitmek istiyor; Çar da orada olacak. Krupp, sergiye elli tonluk bir çelik top gönderdi; namlusu Paris\'e bakıyor.',
  sh:['Git','Gitme'],real:[0,'Haziran 1867\'de Kral, Bismarck ve Moltke Paris\'te ağırlandı. Aynı günlerde Çar\'a bir Polonyalı ateş etti.'],
  opts:()=>[
   {label:'Kral\'la birlikte git',desc:'Lüksemburg gerginliğinden sonra bir nezaket ziyareti.',lean:'dove',eff:{s:2,dip:{fra:{f:6,sus:-4},rus:{f:2}}},run:()=>'Balolar, geçit törenleri, opera. Moltke Paris\'in tahkimatını uzun uzun seyretti.'},
   {label:'Gitme',desc:'Paris bunu soğukluk sayar.',lean:'hawk',eff:{dip:{fra:{f:-5,sus:4}}},run:()=>'Kral yalnız gitti ve döndüğünde sana kırgındı.'}]},
 b_stosch68:{title:'Bir imparatorluk kabinesi',once:true,h:3,art:'room',when:KG,
  text:'Otuz milyonluk yeni devletin her kâğıdı senin masana geliyor. Generaller ve liberaller aynı şeyi istiyor: sorumlu bakanlardan oluşan gerçek bir kabine; savaş, maliye ve ticaret için ayrı ayrı.',
  quotes:{roon:'Savaş bakanının yetkisini bana veriyorsunuz, unvanını vermiyorsunuz.',delbruck:'Sizi sıkan işleri ben yaparım. Kabineye gerek yok.',bucher:'Bir kabine kurarsanız bir gün size karşı oy kullanır.'},
  sh:['Reddet','Kabine kur'],real:[0,'Bismarck gücü paylaşmayı reddetti; işleri Delbrück\'ün başındaki Şansölyelik Dairesi yürüttü. İmparatorluğun gerçek bir kabinesi hiç olmadı.'],
  opts:()=>[
   {label:'Reddet: şansölye tektir',desc:'İpler elinde kalır; yük de.',lean:'hawk',eff:{s:2,g:-3},run:()=>{S.sag-=5;return 'Delbrück\'ün dairesi kararname yağdırıyor. Sen her birinin altına bakıyorsun.'}},
   {label:'Sorumlu bakanlardan bir kabine kur',desc:'Yükün hafifler; gücün bölünür.',lean:'dove',eff:{g:8,s:-4,saray:-4},run:()=>{S.sag=cl(S.sag+10);S.f.kabine=1;return 'Roon nihayet Konfederasyon Savaş Bakanı. Toplantılarda artık senden başkaları da konuşuyor.'}}]},
 b_vatikan68:{title:'Başpiskopos ve ortak okullar',once:true,h:3,art:'room',when:KG,
  text:'Posen Başpiskoposu Ledochowski, Protestan ve Katolik çocukların birlikte okuyacağı okullara karşı cemaatine çağrı yaptı. Vali ve Din İşleri Bakanı cezalandırılmasını istiyor. Roma\'da ise Papa bir konsil topluyor.',
  sh:['Sessiz geç','Cezalandır'],real:[0,'Bismarck bakana engel oldu: bir Katolik başpiskopos başka türlü konuşamazdı; en iyisi sessiz geçmekti. Kiliseyle asıl kavga 1871\'den sonra çıktı.'],
  opts:()=>[
   {label:'Sessiz geç',desc:'Uyuyan köpeği uyandırmazsın. Güney Katolikleri bunu not eder.',lean:'dove',eff:{dip:{sud:{f:4}}},run:()=>'Bakan homurdandı ve dosyayı kapattı.'},
   {label:'Başpiskoposu cezalandır',desc:'Liberaller alkışlar; Katolik güney ürker.',lean:'hawk',eff:{g:4,dip:{sud:{f:-8,sus:8}}},run:()=>'Münih\'te kürsüden okundu: “İşte kuzeye katılırsak başımıza gelecek olan.”'}]},
 /* ===== kişisel ve tekrarlayan ===== */
 p_johanna:{title:'Johanna\'dan mektup',pool:true,h:2,art:'room',w:()=>S.sag<45?1.6:.6,when:()=>deN()>=4&&!(S.cool.joh>=deN()-6),
  text:'“Çocuklar seni soruyor. Geçen ay üç gün evde kaldın ve üçünde de dişlerini gıcırdatarak uyudun. Kral\'ın başka bakanı olur; benim başka kocam yok.”',
  sh:['Eve git','Yaz'],
  opts:()=>[
   {label:'Birkaç günlüğüne eve git',desc:'Dinlenirsin; Berlin sensiz kalır.',lean:'dove',eff:{saray:3},run:()=>{S.cool.joh=deN();S.sag=cl(S.sag+12);return 'Sofrada siyaset konuşulmadı. Köpek ayağının dibinden ayrılmadı.'}},
   {label:'Uzun bir mektup yaz ve işine dön',desc:'Ona her zaman, hiç istemediğin bir görevi yüklendiğini yazarsın.',lean:'hawk',eff:{},run:()=>{S.cool.joh=deN();S.sag-=3;return '“Bu vitrindeki hayata alışamadım,” diye yazdın. İnanmadı; cevabında yine de inandığını söyledi.'}}]},
 p_motley:{title:'Eski bir dost',pool:true,once:true,h:2,art:'room',w:()=>.9,when:()=>deN()>=7,
  text:'Göttingen\'den oda arkadaşın, Amerikalı John Motley Viyana\'da elçi. Mektubu İngilizce: “Seni Schleswig-Holstein gibi ufak tefek işlerle meşgul sanıp yazmadım.”',
  sh:['Cevap yaz','Sonra'],real:[0,'Bismarck en yoğun günlerinde Motley\'ye İngilizce yazdı: “Jack, sevgili dostum, hangi cehennemdesin?”'],
  opts:()=>[
   {label:'Hemen cevap yaz',desc:'Bir saatliğine yirmi yaşındasın.',lean:'dove',eff:{},run:()=>{S.sag=cl(S.sag+6);return '“Eski dostları unutma; ne de karılarını.” Mektubu yazarken güldüğünü kâtip gördü ve şaşırdı.'}},
   {label:'Sonraya bırak',desc:'Önünde telgraflar var.',lean:'hawk',eff:{},run:()=>'Mektup bir dosyanın arasında kaldı.'}]},
 p_virchow:{title:'Kürsüde hakaret',pool:true,once:true,h:2,art:'meclis',w:()=>1.4,when:()=>!S.f.af&&S.lt>=60&&deN()>=5,
  text:'Profesör Virchow meclis kürsüsünden dürüstlüğünü sorguladı. Salon alkışladı. Sen bir subaysın ve subaylar bu tür sözlere tek bir biçimde karşılık verir.',
  sh:['Düelloya çağır','Görmezden gel','Alaya al'],real:[0,'1865\'te Bismarck, Virchow\'u düelloya çağırdı; hekim, bunun tartışma yöntemi olmadığını söyleyerek reddetti.'],
  opts:()=>[
   {label:'Düelloya çağır',desc:'Ordu ve saray beğenir; şehirler güler.',lean:'hawk',eff:{s:2,g:-4,saray:-3},run:()=>'Virchow reddetti: bilim insanları tabancayla tartışmazmış. Karikatürler haftalarca sürdü.'},
   {label:'Görmezden gel',desc:'Kürsüdeki dil sertleşir.',lean:'dove',eff:{lt:4},run:()=>'Sustun. Ertesi gün bir başkası daha ağırını söyledi.'},
   {label:'Kürsüye çık ve alaya al',desc:'Salon güler; kimse ikna olmaz.',lean:'pol',eff:{g:2,lt:2},run:()=>'“Doktorum izin vermedi; ama bu müzakerelerin zevkinden mahrum kalamazdım.” Kahkahalar arasında yerine döndün.'}]},
 p_borsa:{title:'Bleichröder\'den bir telgraf',pool:true,once:true,h:2,art:'room',w:()=>1,when:()=>has('bleich')&&deN()>=8,
  text:'Bankerin soruyor: hesabındaki demiryolu hisseleri satılsın mı? Önümüzdeki haftalarda ne olacağını Avrupa\'da senden iyi bilen yok.',
  sh:['Sat','Dokunma'],real:[0,'10 Temmuz 1870\'te Bismarck, Bleichröder\'e demiryolu hisselerini satmasını telgrafla bildirdi; savaş bir hafta sonra çıktı.'],
  opts:()=>[
   {label:'Bildiğine göre alıp sat',desc:'Kişisel servetin büyür. Duyulursa skandal olur.',lean:'pol',eff:{},run:()=>{S.f.servet=1;if(chance(.2)){fx({g:-6,s:-3});return 'Bir borsa gazetesi tarihleri yan yana koydu.'}return 'Varzin\'in ormanı biraz daha genişledi.'}},
   {label:'Hesaba dokunma',desc:'Elin temiz kalır.',lean:'mid',eff:{},run:()=>'“Her şey yerinde kalsın.”'}]},
 p_karikatur:{title:'Kladderadatsch',pool:true,h:2,art:'gazete',w:()=>.8,when:()=>!(S.cool.kar>=deN()-6),
  text:'Mizah dergisi bu hafta seni çiziyor: üç tel saç, koca bir çizme ve altında ezilen bir anayasa. Berlin\'de herkes aynı sayfayı açmış.',
  sh:['Gül geç','Toplat'],
  opts:()=>[
   {label:'Gül geç; çizere bir şişe şarap gönder',desc:'Şehirde biraz sempati.',lean:'dove',eff:{g:3},run:()=>{S.cool.kar=deN();return 'Çizer ertesi hafta seni bir kez daha çizdi; bu kez elinde şarap şişesiyle.'}},
   {label:'Sayıyı toplat',desc:'Saray beğenir; şehir unutmaz.',lean:'hawk',eff:{g:-4,saray:-2},run:()=>{S.cool.kar=deN();return 'Toplatılan sayı el altından üç katı fiyata satıldı.'}}]},
 p_junker:{title:'Bir komşunun ricası',pool:true,once:true,h:2,art:'room',w:()=>.8,when:()=>deN()>=3,
  text:'Pomeranya\'dan eski bir komşun kapıda: oğlu için bir kaymakamlık. Seni iktidara taşıyan çevre, karşılığını bekliyor.',
  sh:['Ver','Verme'],
  opts:()=>[
   {label:'İşi ayarla',desc:'Eski dostlar yatışır.',lean:'hawk',eff:{saray:-4,g:-2},run:()=>'Genç adam bir ay sonra görevine başladı.'},
   {label:'Geri çevir: devlet akraba çiftliği değil',desc:'Dostların bozulur; memurlar saygı duyar.',lean:'mid',eff:{saray:4,g:2},run:()=>'Komşun selamı kesti.'}]}
});
/* yeni olayların takvimdeki yeri */
const add=(n,ids,front)=>{DANCH[n]=front?ids.concat(DANCH[n]||[]):(DANCH[n]||[]).concat(ids)};
DANCH[19]=(DANCH[19]||[]).filter(x=>x!=='b_welf');
add(18,['b_secim67','b_sergi67']);add(19,['b_stosch68']);add(20,['b_vatikan68','b_welf']);DANCH[26]=['b_donchery'].concat((DANCH[26]||[]).filter(x=>x!=='b_favre'&&x!=='b_bombardiman'));
Object.assign(RECS,{b_koniggratz:{moltke:0,roon:0,manteuffel:1,bleich:0},b_sefer70:{moltke:0,roon:0,bleich:0},b_donchery:{moltke:0,bleich:1,roon:2},a_fra_ittifak:{moltke:1,bucher:0,bleich:0},a_ing_mektup:{roon:0,manteuffel:2},
  a_fra_ordu:{moltke:0,roon:0,heydt:0},a_aus_beust:{bleich:0,moltke:1},b_secim67:{eulenburg:0,bucher:0},b_stosch68:{roon:1,delbruck:0,bucher:0}});
/* ---------- geçmiş seçimlere atıf: gündem metninin altına eklenen satır ---------- */
window.DCALL={
 b_frankfurt:()=>pk('b_karolyi')===1?'Karolyi\'ye ortaklık önermiştin; Viyana bu kongreyi o ortaklığın sınavı sayıyor.':pk('b_karolyi')===0?'Karolyi\'ye “ağırlık merkezinizi Budapeşte\'ye taşıyın” demiştin. Viyana cevabını Frankfurt\'ta veriyor.':'',
 b_danimarka:()=>[pk('b_polonya')===0?'Petersburg sessiz: Polonya\'da yanında durduğunu unutmadı.':pk('b_polonya')===2?'Çar, Polonya notasını unutmadı; Rusya\'nın ne yapacağı belirsiz.':'',S.f.frankfurt===1?'Frankfurt\'ta kongresini boşa çıkardığın Viyana şimdi sana muhtaç: tek başına kalırsa inisiyatifi küçük devletlere kaptırır.':''].filter(Boolean).join(' '),
 b_savas64:()=>S.lt>=85?'Bütçesiz geçen aylar meclisi bıçak sırtına getirdi; bu oylamayı kaybedeceğin belliydi.':'',
 b_duppel:()=>pk('b_wrangel')===1?'Wrangel\'i serbest bıraktığın için birlikler zaten Jutland\'da; Londra\'nın sabrı azaldı.':'',
 b_augustenburg:()=>S.f.augmasa?'Londra\'da Dük\'ü kendin önermiştin. Şimdi geri adım atarsan Viyana bunu sonuna kadar kullanır.':'',
 b_schonbrunn:()=>S.f.duppel?'Düppel\'i Prusya aldı; Viyana ortak zaferden kendine düşeni arıyor.':'',
 b_gastein:()=>[S.f.mensdorff?'Rechberg gideli beri Viyana\'da ne istediğini bilen kimse yok.':'',`Hazinede ${Math.round(S.h)} var; Moltke'nin hesabına göre bir sefer için en az 30 gerekir.`].filter(Boolean).join(' '),
 b_biarritz:()=>(pk('b_polonya')===0?'Polonya\'da Rusya\'nın yanında durduğunu İmparator unutmadı: sana güvenmiyor, ama seni hafife de almıyor. ':'')+'O sonbahar Biarritz\'e bir başka sebeple de gelmiştin; beklediğin kişi gelmedi.',
 b_italya:()=>pk('b_schonbrunn')===2?'Viyana\'ya İtalya\'da destek sözü vermiştin. Floransa bunu biliyor ve imzadan önce açıklama istiyor.':'',
 b_geneloy:()=>S.f.lassalle?'Lassalle iki yıl önce bir düelloda öldü. O akşam yemeklerinde konuştuklarınız şimdi önündeki kâğıtta.':'',
 b_savas66:()=>[S.f.italya?'İtalya antlaşması yürürlükte: Avusturya güneyde de savaşmak zorunda.':'İtalya\'yla antlaşman yok: Avusturya bütün gücüyle kuzeye dönecek.',S.f.vaat?'Paris\'ten ses yok; Biarritz\'de verdiğin umut işliyor.':'Paris\'in ne yapacağını kimse bilmiyor.',S.A.rus.f>=50?'Petersburg dost.':'Petersburg soğuk.',S.f.kralsoz?'Kral, Kraliçe Victoria\'ya savaşı kendisinin başlatmayacağını yazmıştı; bunu sana hatırlatıyor.':''].filter(Boolean).join(' '),
 b_koniggratz:()=>S.f.italya?'Güneyde İtalyanlar Custoza\'da yenildi; ama Avusturya\'nın yüz bin askeri hâlâ orada, burada değil.':'',
 b_nikolsburg:()=>[S.f.vaat===2?'Benedetti kapıda: Biarritz\'de verdiğin sözü hatırlatmaya geldi.':S.f.fraittifak?'Fransız kolorduları Ren\'de; ittifakın bedelini ödeme vakti.':'',pk('b_koniggratz')===0?'Sabah Moltke\'ye güvenmiştin. Kral bunu da, kendi kuşkusunu da hatırlıyor.':''].filter(Boolean).join(' '),
 b_af:()=>pk('b_kanvedemir')===0?'Dört yıl önce “kan ve demir” dediğinde seni yuhalayan komisyonun üyeleri bugün ayakta alkışlıyor.':'Dört yıl boyunca bu salonda sana “anayasa düşmanı” dediler.',
 b_benedetti:()=>S.f.vaat?'Biarritz\'i hatırlatıyor: “İmparator sözünüze güvenerek kenarda kaldı.”':'',
 b_guney:()=>pk('b_ilhak')===0?'Hannover\'in başına geleni Münih ve Stuttgart gördü.':'',
 b_luksemburg:()=>S.f.belge?'Çekmecende Benedetti\'nin el yazısıyla yazılmış taslak duruyor.':'',
 b_anayasa:()=>S.f.geneloy?'Frankfurt\'ta genel oy sözü vermiştin. Şimdi herkes tutup tutmayacağına bakıyor.':'',
 b_leopold:()=>S.f.sertbaris?'Viyana 1866\'nın öcünü bekliyor; Fransa\'yla bir savaşta arkan açık kalabilir.':KG()?'Nikolsburg\'da incitmediğin Avusturya kıpırdamıyor.':'',
 b_ems:()=>[S.f.guney?'Güneyle ittifak antlaşmaları çekmecede; saldıran Fransa olursa yürürlüğe girer.':'Güneyle ittifakın yok; yalnız savaşabilirsin.',S.f.andrassy?'Andrássy\'nin sözü geçerli: Macarlar Viyana\'yı tutacak.':''].filter(Boolean).join(' '),
 b_favre:()=>pk('b_nikolsburg')===0?'Nikolsburg\'da Avusturya\'ya gösterdiğin ölçüyü Fransa\'ya da gösterecek misin? Generaller bu kez daha kararlı.':'',
 b_karadeniz:()=>S.f.karasoz?'Gorçakov\'a yıllar önce söz vermiştin; şimdi tahsile geldi.':'',
 b_bombardiman:()=>pk('b_sefer70')===1?'Kurmaylarla kavgan sürüyor; bu tartışmayı da kişisel alıyorlar.':'',
 b_unvan:()=>S.f.mektup?'Ludwig\'in mektubu elinde; metnini sen yazmıştın.':S.f.mektup===0?'Bavyera masada değil.':'',
 b_baris71:()=>S.f.erkenbaris?'Savaş erken bitti; ordu, kazandığının karşılığını görmediğini düşünüyor.':S.f.halksavasi?'Halk savaşı aylarca sürdü; karargâhta kimse yumuşak bir barıştan söz etmiyor.':'',
 i_main:()=>S.f.frankfurt===-1?'Kral, Frankfurt\'ta attığı imzayla gurur duyuyor.':'Geri adım attığın geceyi Berlin unutmadı.',
 i_luks:()=>S.f.direktuvar?'Ortak yönetim ilk sınavını veriyor.':'',
 i_kriz70:()=>[S.f.guney?'Güney devletleri savunma anlaşmasına bağlı.':'',S.f.russoz?'Petersburg sözünü hatırlattı: Avusturya kıpırdarsa Rusya yürür.':'',S.f.ortaknota?'Lüksemburg\'da verdiğiniz ortak nota hâlâ hatırlanıyor.':''].filter(Boolean).join(' '),
 i_reform:()=>S.f.zollparl?'Gümrük Parlamentosu üç yıldır çalışıyor; seçilmiş bir Alman meclisi artık kimseye yabancı değil.':S.f.ortaavrupa?'Orta Avrupa gümrük birliği iki ekonomiyi birbirine bağladı.':''};
/* ---------- danışman sözleri: gündemlerin çoğunda en az iki kişinin kendi cümlesi olsun ---------- */
const Q={
 b_tren:{roon:'Kral bir askerdir. Ona korkudan değil, görevden söz edin.',bucher:'Kraliçe haftalardır ona Strafford\'un kellesini anlatıyor. Karşısına daha iyi bir hikâyeyle çıkın.'},
 b_karolyi:{bleich:'Viyana borsası Macar tahvillerinden yorgun. Savaş lafı onları titretir.',roon:'Açık konuşun. Avusturyalılar inceliği zayıflık sanar.'},
 b_lassalle:{bucher:'Onu Londra\'dan tanırım. Kibirli, parlak ve liberallere sizden daha çok kızgın.',roon:'Bir Yahudi ajitatörle aynı masada mı? Kral duymasın.'},
 b_basin:{bucher:'Gazeteyi kapatırsanız okuru kazanamazsınız. Ama susmaları bazen yeter.',eulenburg:'Kararname hazır. Mahkemeler karışamayacak.',roon:'Ordu, her sabah Kral\'a hakaret okunmasından bıktı.'},
 b_danzig:{roon:'Veliaht bir subaydır; tutuklanırsa ordu ikiye bölünür.',manteuffel:'Bir yüzbaşı bunu söyleseydi kurşuna dizilirdi.'},
 b_savas64:{roon:'Para bulunur. Ordu Eider kıyısında bekleyemez.',heydt:'Hazinede geçen yıldan kalan fazla var; iki ay yeter.',moltke:'Dannevirke kışın donan bataklıklarla korunuyor. Şubat tam zamanı.'},
 b_wrangel:{moltke:'Mareşal cesurdur; plan yapmaz. Onu Avusturya\'yla aynı hizada tutun.',manteuffel:'Seksen yaşında bir kahramanı diplomatlar durduramaz.'},
 b_duppel:{roon:'Bu seferde Majesteleri elle tutulur bir zafer kazanmalı; yoksa içeride de dışarıda da itibarımız kalmaz.',moltke:'Şu anda Prusya ordusunun şanından daha önemli bir hedef yok.',bleich:'Londra\'da herkes bir zafer haberi bekliyor; gelmezse konferans Danimarka\'ya döner.'},
 b_londra:{bucher:'Bütün köpekleri Danimarka\'nın üzerine salın; havlamaları dukalıkları geri vermeyi imkânsız kılar.',bleich:'İngiliz kabinesi bölünmüş. Palmerston bağırır, ama asker göndermez.'},
 b_schonbrunn:{roon:'Rechberg dürüst bir adam; bu onu tehlikesiz yapar.'},
 b_subat:{roon:'Dukalıkların ikisi de alınmazsa en az biri alınmalı. Ordu bunu bekliyor.',moltke:'Kiel limanı ve kanal: gerisi ayrıntı.'},
 b_konsey65:{roon:'Kral ilk kez “hakkım yok” demedi. Fazla zorlamayın.',manteuffel:'Kim yönetiyor: Kral mı, bakanları mı? Konsey toplamayın; emir verin.'},
 b_italya:{moltke:'İtalyanlar savaşı kaybeder; ama yüz bin Avusturyalıyı güneyde tutar. Bana bu yeter.',bleich:'Floransa\'nın parası yok; cesareti var.',manteuffel:'Bir Alman devletine karşı yabancıyla ittifak. Kral bunu sindiremez.'},
 b_konsey66:{moltke:'Avusturya henüz at satın almıyor. Üç hafta öndeyiz; bu avantaj bekledikçe erir.',roon:'Kral ağlayacak, sonra imzalayacak.'},
 b_pariskonf:{bleich:'Viyana gelmez; Venedik konuşulacak diye. Siz “evet” deyin, suç onlarda kalsın.',roon:'Paris\'e giderseniz Kral\'ın yanında kim kalacak?'},
 b_holstein:{moltke:'Manteuffel bir şövalye gibi davrandı. Savaşlar şövalyelikle kazanılmaz.',roon:'Ona emir veremezsiniz. Yazın; okur.'},
 b_ilhak:{roon:'Hannover olmadan Prusya ikiye bölünmüş bir ülkedir.',bleich:'Londra bir hafta surat asar, sonra unutur.',bucher:'Bir krallığı silmek, on kongreden daha çok şey öğretir.'},
 b_af:{roon:'Kazandık. Şimdi özür mü dileyeceğiz?',bucher:'Af isteyen, hakkın meclisten geldiğini kabul eder. Bunu bir kez söylemek, dört yıl kavga etmekten ucuzdur.',heydt:'Af ile krediyi aynı tasarıya koyarım; birini reddeden ötekini de reddetmiş olur.'},
 b_guney:{moltke:'Güney orduları komutama girerse Fransa\'ya karşı elli bin süngü daha.',bleich:'Münih\'in hazinesi boş; hafif bir tazminat çok şey satın alır.'},
 b_frankfurt66:{bleich:'Frankfurt bankerlerin şehridir. Onları ezerseniz Avrupa\'nın bütün gazeteleri yazar.',manteuffel:'Düşmanı alkışlayan şehir bedelini öder.'},
 b_delbruck:{delbruck:'Tek para, tek ölçü, tek posta. Birliği askerler kurdu; bunlar ayakta tutacak.',roon:'Loncaları kaldırmak mı? Babalarımız mezarında döner.'},
 b_welf:{bucher:'Hesabını kimsenin soramayacağı bir kasa. Basın için biçilmiş kaftan.',bleich:'On altı milyonun faizi ciddi paradır.'},
 b_gumrukparl:{delbruck:'Zaman bizden yana. Her yıl güneyin ticareti biraz daha kuzeye akıyor.',moltke:'Zaman Fransa\'dan da yana.'},
 b_ispanya:{bucher:'Madrid\'e ben giderim. Kimse bir şey duymaz.',bleich:'Paris bunu öğrenirse borsa bir günde yüzde beş düşer.'},
 b_istifa69:{roon:'Dün gece sizden ayrıldığımdan beri aklım sizde. Mektubu öyle yazın ki dönüş yolu açık kalsın.'},
 b_baden:{bucher:'Meyveyi ağaçtan ham koparırsanız ekşi olur.',moltke:'Baden\'i alırsanız Fransa yürür. Hazırız; ama saldırgan biz oluruz.'},
 b_cekilme:{roon:'Her şey boşunaymış. Oğluma terfi beklemeyip çalışmasını söyledim.',moltke:'Yolu boşuna geldim.',bucher:'Gramont durmasını bilmez. Bir gün bekleyin.'},
 b_times:{bucher:'El yazısı Benedetti\'nin. Times bunu birinci sayfaya koyar.',bleich:'Londra Belçika için her şeyi yapar. Paris\'e bundan büyük darbe olmaz.'},
 b_karadeniz:{bleich:'Londra bağırır; ama Fransa\'sız Kırım\'a bir daha gitmez.',moltke:'Rusya dost kaldıkça Avusturya kıpırdayamaz.'},
 b_bavyera:{bleich:'Kral Ludwig\'in şatoları bitmiyor; borcu da.',bucher:'Mektubun metnini siz yazın; o yalnızca temize çeksin.',delbruck:'Posta ve demiryolu onlarda kalsın. Önemli olan ordu.'},
 b_unvan:{roon:'Kral eski Prusya\'ya ağlıyor. Yarın geçer.',delbruck:'Bavyera yalnızca “Alman İmparatoru”na imza attı. Bir kelime değişirse antlaşma düşer.'},
 i_luks:{moltke:'Avusturya yanımızdaysa Fransa savaşmaz.',bleich:'Viyana\'nın notaya imza atıp atmayacağı, son aylarda ona nasıl davrandığınıza bağlı.'},
 i_ordu:{roon:'Bir kılıcı on yıl biledim. Kınında paslansın diye değil.',moltke:'Planlar hazır. Planlar hep hazırdır.'},
 i_guney:{moltke:'Güney, kim korursa ona gider.',bleich:'Demiryolu kredisi, on elçiden daha ikna edicidir.'},
 i_taht:{roon:'Ben Kral\'la birlikte giderim. Siz genç bir adamsınız.',bucher:'Veliaht\'ın çevresinde sizi isteyen yok; ama sizsiz yapabileceğine inanan da yok.'}};
for(const id in Q)if(DEC[id])DEC[id].quotes=Object.assign({},Q[id],DEC[id].quotes||{});
/* ---------- tur başındaki kısa sesler: duruma göre bir satır ---------- */
window.deVoice=function(n){const L=[];
  if(S.s<25)L.push(['k1','Kral bu sabah raporunu ayakta dinledi ve sana oturmanı söylemedi.']);
  if(S.saray>=70)L.push(['q1','Kraliçe koridorda yanından geçti; selamını almadı.']);
  if(S.sag<30)L.push(['j1','Johanna yazıyor: “Kendini öldüreceksin. Varzin\'de kestaneler olgunlaştı; seni bekliyorlar.”']);
  if(S.dw)L.push(['w1','Kral her sabah cepheden gelen telgrafları kendi eliyle haritaya işliyor.']);
  if(S.g<15)L.push(['g1','Arabana bir taş atıldı. Sürücü hızlandı; sen arkana bakmadın.']);
  if(S.g>=65)L.push(['g2','Sokakta şapkalar çıkarılıyor. Buna alışkın değilsin.']);
  if(!S.f.af&&S.lt>=90)L.push(['m1','Meclis başkanı sözünü kesti. Çıkarken kapıyı sen kapattın.']);
  if(S.s>=75)L.push(['k2','Kral akşam çayında elini omzuna koydu: “Siz olmasaydınız…” Cümleyi bitirmedi.']);
  if(S.h<15)L.push(['h1','Maliye bakanı kasanın anahtarını masana bıraktı: “İçinde bir şey yok.”']);
  if(S.t>=50)L.push(['t1','Üç elçilik aynı gün açıklama istedi. Notaların dili birbirine fazla benziyor.']);
  if(has('roon')&&S.s<45)L.push(['r1','Roon akşam uğradı: “Dayanın. Kral sizi sever; yalnızca bunu her gün duymak ister.”']);
  if(S.f.kg&&n===18)L.push(['z1','Masandaki büstler çoğaldı; bir kibrit fabrikası senin adını kutusuna basmak için izin istiyor.']);
  if(!L.length){const idle=['Gece üçe kadar çalıştın. Kâtipler senden peygamberden söz eder gibi söz ediyor; yüzüne karşı değil.','Bahçede yürürken bir karatavuk yuvasını izledin; dakikada kaç kez yem getirdiğini saydın.','Sabah puronun külü haritaya düştü; tam Frankfurt\'un üstüne.','Sultan adlı köpeğin bir Fransız diplomatın pantolonunu ısırdı. Özür diledin; içinden gülerek.'];if(chance(.45))L.push(['i'+n%4,idle[n%4]])}
  const pick=L.filter(x=>x[0]!==S.f.voz)[0]||L[0];if(!pick)return '';S.f.voz=pick[0];return pick[1]};
}
