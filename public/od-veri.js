/* ---------- Açık Dünya · veri ----------
   Ülkeler, birlik türleri ve başlangıç kuvvetleri. Rakamlar 2025–26 kamuya açık tahminlerinden (IISS Military Balance, SIPRI, IMF)
   oyun ölçeğine indirilmiştir: 1 tümen ≈ 10–15 bin asker, 1 filo ≈ 20 uçak. Kesin envanter değildir. */
const ODV = {};
/* ülkeler: ad, renk, nüfus (milyon), GSYH (milyar $), savunma payı, sanayi (1–5), hava savunması (0–5), istikrar, savaş desteği, rejim, füze stoğu, eğitim (birlik niteliği) */
ODV.C = {
  TUR: { n: 'Türkiye', s: 'Türk', col: '#c0392b', pop: 86, gdp: 1320, mil: .022, ind: 4, ad: 3, stab: 62, ws: 45, gov: 'Cumhurbaşkanlığı sistemi', mis: 40, q: 1.05 },
  IRN: { n: 'İran', s: 'İran', col: '#2e8b6f', pop: 90, gdp: 400, mil: .03, ind: 3, ad: 3, stab: 48, ws: 55, gov: 'İslam cumhuriyeti', mis: 160, q: .85 },
  EGY: { n: 'Mısır', s: 'Mısır', col: '#d4b061', pop: 110, gdp: 380, mil: .013, ind: 2, ad: 3, stab: 55, ws: 35, gov: 'Başkanlık sistemi', mis: 0, q: .85 },
  SAU: { n: 'Suudi Arabistan', s: 'Suudi', col: '#3f8f45', pop: 35, gdp: 1100, mil: .065, ind: 1, ad: 4, stab: 68, ws: 35, gov: 'Mutlak monarşi', mis: 12, q: .85 },
  ISR: { n: 'İsrail', s: 'İsrail', col: '#4f80c4', pop: 10, gdp: 540, mil: .06, ind: 5, ad: 5, stab: 50, ws: 60, gov: 'Parlamenter demokrasi', mis: 20, q: 1.25 },
  IRQ: { n: 'Irak', s: 'Irak', col: '#8b6fb3', pop: 46, gdp: 270, mil: .04, ind: 1, ad: 1, stab: 45, ws: 30, gov: 'Federal parlamenter cumhuriyet', mis: 0, q: .75 },
  SYR: { n: 'Suriye', s: 'Suriye', col: '#a8704b', pop: 24, gdp: 22, mil: .06, ind: 1, ad: 0, stab: 35, ws: 40, gov: 'Geçiş hükûmeti', mis: 0, q: .7 },
  JOR: { n: 'Ürdün', s: 'Ürdün', col: '#d08f4a', pop: 11.5, gdp: 53, mil: .045, ind: 1, ad: 2, stab: 62, ws: 30, gov: 'Anayasal monarşi', mis: 0, q: .95 },
  LBN: { n: 'Lübnan', s: 'Lübnan', col: '#d56d8f', pop: 5.5, gdp: 20, mil: .03, ind: 0, ad: 0, stab: 35, ws: 30, gov: 'Mezhepsel parlamenter cumhuriyet', mis: 0, q: .7 },
  PSE: { n: 'Filistin', s: 'Filistin', col: '#6aa56a', pop: 5.5, gdp: 13, mil: .02, ind: 0, ad: 0, stab: 25, ws: 70, gov: 'Filistin Yönetimi', mis: 0, q: .55 },
  KWT: { n: 'Kuveyt', s: 'Kuveyt', col: '#5aa3a8', pop: 4.9, gdp: 160, mil: .05, ind: 0, ad: 4, stab: 70, ws: 25, gov: 'Anayasal emirlik', mis: 0, q: .8 },
  QAT: { n: 'Katar', s: 'Katar', col: '#8a2f45', pop: 3, gdp: 220, mil: .045, ind: 0, ad: 3, stab: 78, ws: 25, gov: 'Mutlak monarşi', mis: 0, q: .85 },
  BHR: { n: 'Bahreyn', s: 'Bahreyn', col: '#e05d64', pop: 1.6, gdp: 47, mil: .04, ind: 0, ad: 3, stab: 55, ws: 25, gov: 'Anayasal monarşi', mis: 0, q: .8 },
  ARE: { n: 'Birleşik Arap Emirlikleri', s: 'BAE', col: '#c7b54e', pop: 10, gdp: 540, mil: .05, ind: 2, ad: 4, stab: 75, ws: 35, gov: 'Federal monarşi', mis: 0, q: 1.0 },
  OMN: { n: 'Umman', s: 'Umman', col: '#b9674b', pop: 5.2, gdp: 105, mil: .08, ind: 0, ad: 2, stab: 70, ws: 25, gov: 'Mutlak monarşi', mis: 0, q: .85 },
  YEM: { n: 'Yemen', s: 'Yemen', col: '#93924c', pop: 35, gdp: 17, mil: .06, ind: 0, ad: 0, stab: 20, ws: 55, gov: 'Başkanlık Yönetim Konseyi', mis: 25, q: .6 },
  CYP: { n: 'Güney Kıbrıs Rum Yönetimi', s: 'Rum', col: '#e3d39a', pop: .95, gdp: 34, mil: .02, ind: 0, ad: 1, stab: 70, ws: 30, gov: 'Başkanlık sistemi', mis: 0, q: .8 },
  KKTC: { n: 'Kuzey Kıbrıs Türk Cumhuriyeti', s: 'Kıbrıs Türk', col: '#d9806e', pop: .4, gdp: 5, mil: .02, ind: 0, ad: 0, stab: 65, ws: 40, gov: 'Parlamenter cumhuriyet', mis: 0, q: .8 }
};
ODV.ORDER = ['TUR', 'IRN', 'EGY', 'SAU', 'ISR', 'IRQ', 'SYR', 'JOR', 'LBN', 'PSE', 'KWT', 'QAT', 'BHR', 'ARE', 'OMN', 'YEM', 'CYP', 'KKTC'];
/* başkentler (şehir adı) */
ODV.CAP = { TUR: 'Ankara', IRN: 'Tahran', EGY: 'Kahire', SAU: 'Riyad', ISR: 'Tel Aviv', IRQ: 'Bağdat', SYR: 'Şam', JOR: 'Amman', LBN: 'Beyrut', PSE: 'Ramallah', KWT: 'Kuveyt', QAT: 'Doha', BHR: 'Manama', ARE: 'Abu Dabi', OMN: 'Maskat', YEM: 'San\'a', CYP: 'Lefkoşa (Güney)', KKTC: 'Lefkoşa' };

/* ---------- kara birlikleri ----------
   sa: saldırı · sv: savunma · sert: zırh payı · hz: km/sa · mal: milyar $ · ins: insan gücü (bin) · sure: üretim (saat) */
ODV.U = {
  pi: { n: 'Piyade tümeni', k: 'Piyade', sa: 1.0, sv: 1.4, sert: .1, hz: 4, mal: .6, ins: 12, sure: 720, ic: 'pi' },
  mk: { n: 'Mekanize tümen', k: 'Mekanize', sa: 1.6, sv: 1.6, sert: .5, hz: 8, mal: 1.2, ins: 12, sure: 1080, ic: 'mk' },
  zh: { n: 'Zırhlı tümen', k: 'Zırhlı', sa: 2.4, sv: 1.3, sert: .85, hz: 8, mal: 2.0, ins: 10, sure: 1440, ic: 'zh' },
  ok: { n: 'Özel kuvvet tugayı', k: 'Komando', sa: 1.4, sv: 1.1, sert: .05, hz: 5, mal: .8, ins: 5, sure: 900, ic: 'ok', para: 1, dag: 1.3 },
  dp: { n: 'Deniz piyade tugayı', k: 'Deniz piyade', sa: 1.3, sv: 1.2, sert: .2, hz: 5, mal: 1.0, ins: 6, sure: 1080, ic: 'dp', amf: 1 },
  mi: { n: 'Milis / gönüllü', k: 'Milis', sa: .5, sv: .9, sert: 0, hz: 4, mal: .15, ins: 8, sure: 240, ic: 'mi' }
};
/* ---------- hava birlikleri (filo ≈ 20 uçak) ----------
   hv: hava muharebesi · yer: kara saldırısı · bom: stratejik vuruş · men: menzil (km) */
ODV.A = {
  av: { n: 'Avcı filosu', k: 'Avcı', hv: 1.3, yer: .2, bom: .1, men: 900, mal: 1.8, sure: 1800, ucak: 20 },
  cr: { n: 'Çok rollü filo', k: 'Çok rollü', hv: 1.0, yer: .8, bom: .5, men: 1100, mal: 1.6, sure: 1800, ucak: 20 },
  bb: { n: 'Taarruz / bombardıman filosu', k: 'Bombardıman', hv: .3, yer: 1.0, bom: 1.3, men: 1600, mal: 1.8, sure: 2160, ucak: 18 },
  ih: { n: 'SİHA filosu', k: 'SİHA', hv: 0, yer: .7, bom: .4, men: 900, mal: .35, sure: 600, ucak: 24 },
  nk: { n: 'Nakliye filosu', k: 'Nakliye', hv: 0, yer: 0, bom: 0, men: 2400, mal: .8, sure: 1440, ucak: 12, tasir: 1 }
};
/* ---------- deniz birlikleri (gemi başına) ----------
   at: su üstü ateş · dz: denizaltı savaşı · hs: hava savunma · can: dayanıklılık · tas: taşınan tümen */
ODV.S = {
  uc: { n: 'Uçak gemisi / LHD', k: 'LHD', at: 2, dz: 1, hs: 3, can: 12, tas: 2, mal: 1.5, sure: 8760 },
  fk: { n: 'Fırkateyn / muhrip', k: 'Fırkateyn', at: 4, dz: 3, hs: 4, can: 8, tas: 0, mal: .8, sure: 4320 },
  kv: { n: 'Korvet', k: 'Korvet', at: 2.5, dz: 2, hs: 1.5, can: 4, tas: 0, mal: .3, sure: 2160 },
  dz: { n: 'Denizaltı', k: 'Denizaltı', at: 5, dz: 1, hs: 0, can: 5, tas: 0, mal: .6, sure: 4320, gizli: 1 },
  cg: { n: 'Çıkarma gemisi', k: 'Çıkarma', at: .5, dz: 0, hs: .5, can: 4, tas: .5, mal: .3, sure: 2160 },
  hb: { n: 'Hücumbot', k: 'Hücumbot', at: 1, dz: 0, hs: .2, can: 1, tas: 0, mal: .05, sure: 480 }
};
/* arazi: saldırana çarpan, hareket çarpanı */
ODV.T = { ova: { n: 'Ova', sa: 1, mv: 1, zh: 1 }, tepe: { n: 'Tepelik', sa: .85, mv: .8, zh: .85 }, dag: { n: 'Dağlık', sa: .6, mv: .55, zh: .6 }, col: { n: 'Çöl', sa: .95, mv: .9, zh: 1.05 }, bat: { n: 'Bataklık', sa: .7, mv: .6, zh: .6 } };

/* ---------- başlangıç kuvvetleri: [şehir, tür, adet] ---------- */
ODV.KARA = {
  TUR: [['İstanbul', 'pi', 2], ['Edirne', 'mk', 1], ['Edirne', 'zh', 1], ['Çanakkale', 'pi', 1], ['Ankara', 'pi', 1], ['Ankara', 'zh', 1], ['İzmir', 'dp', 1], ['Antakya', 'mk', 1], ['Gaziantep', 'zh', 1], ['Gaziantep', 'pi', 1],
    ['Şanlıurfa', 'mk', 1], ['Mardin', 'pi', 1], ['Hakkâri', 'ok', 2], ['Van', 'pi', 1], ['Erzurum', 'pi', 1], ['Kars', 'mk', 1], ['Diyarbakır', 'pi', 1], ['Malatya', 'pi', 1], ['Kayseri', 'ok', 1], ['Lefkoşa', 'mk', 1], ['Girne', 'pi', 1]],
  IRN: [['Tahran', 'pi', 2], ['Tahran', 'zh', 1], ['Tebriz', 'pi', 2], ['Tebriz', 'mk', 1], ['Urmiye', 'pi', 1], ['Kirmanşah', 'pi', 2], ['Kirmanşah', 'zh', 1], ['İlam', 'pi', 1], ['Ahvaz', 'zh', 1], ['Ahvaz', 'mk', 1], ['Ahvaz', 'pi', 1],
    ['Abadan', 'pi', 1], ['Buşehr', 'pi', 1], ['Bender Abbas', 'pi', 1], ['Bender Abbas', 'dp', 1], ['Şiraz', 'pi', 1], ['İsfahan', 'zh', 1], ['İsfahan', 'pi', 1], ['Meşhed', 'pi', 2], ['Zahidan', 'pi', 1], ['Çabahar', 'pi', 1],
    ['Hemedan', 'pi', 1], ['Kum', 'mi', 2], ['Senendec', 'pi', 1], ['Erdebil', 'pi', 1], ['Dezful', 'ok', 1]],
  EGY: [['Kahire', 'pi', 2], ['Kahire', 'zh', 1], ['İskenderiye', 'mk', 1], ['Mersa Matruh', 'mk', 1], ['Mersa Matruh', 'zh', 1], ['Sellum', 'pi', 1], ['İsmailiye', 'zh', 1], ['İsmailiye', 'mk', 1], ['Süveyş', 'mk', 1],
    ['Ariş', 'pi', 1], ['Ariş', 'mk', 1], ['Şarm el-Şeyh', 'pi', 1], ['Hurgada', 'pi', 1], ['Asvan', 'pi', 1], ['Luksor', 'pi', 1], ['Port Said', 'dp', 1], ['Halayib', 'pi', 1], ['Asyut', 'pi', 1], ['Kahire', 'ok', 1]],
  SAU: [['Riyad', 'mk', 1], ['Riyad', 'zh', 1], ['Dammam', 'mk', 1], ['Hufuf', 'pi', 1], ['Hafrülbatın', 'zh', 1], ['Hafrülbatın', 'mk', 1], ['Tebük', 'mk', 1], ['Cizan', 'pi', 1], ['Necran', 'pi', 1], ['Ebha', 'pi', 1],
    ['Cidde', 'pi', 1], ['Arar', 'pi', 1], ['Mekke', 'ok', 1]],
  ISR: [['Hayfa', 'zh', 1], ['Hayfa', 'mk', 1], ['Hayfa', 'ok', 1], ['Tel Aviv', 'pi', 1], ['Tel Aviv', 'zh', 1], ['Kudüs', 'ok', 1], ['Beerşeba', 'zh', 1], ['Beerşeba', 'mk', 1], ['Eilat', 'pi', 1], ['Aşdod', 'pi', 1]],
  IRQ: [['Bağdat', 'pi', 2], ['Bağdat', 'zh', 1], ['Basra', 'pi', 1], ['Basra', 'mk', 1], ['Musul', 'pi', 1], ['Ramadi', 'pi', 1], ['Kerkük', 'pi', 1], ['Necef', 'mi', 1], ['Kerbela', 'mi', 1], ['Tikrit', 'mi', 1],
    ['Rutba', 'pi', 1], ['Kaim', 'pi', 1], ['Erbil', 'pi', 1], ['Süleymaniye', 'pi', 1], ['Duhok', 'pi', 1], ['Amara', 'mi', 1], ['Bakuba', 'mi', 1]],
  SYR: [['Şam', 'pi', 2], ['Halep', 'pi', 1], ['Humus', 'pi', 1], ['Lazkiye', 'pi', 1], ['Deyrizor', 'mi', 1], ['Haseke', 'mi', 1], ['Dera', 'mi', 1], ['İdlib', 'mi', 1]],
  JOR: [['Amman', 'mk', 1], ['Amman', 'zh', 1], ['İrbid', 'pi', 1], ['Zerka', 'mk', 1], ['Akabe', 'pi', 1], ['Ruveyşid', 'pi', 1], ['Maan', 'pi', 1]],
  LBN: [['Beyrut', 'pi', 1], ['Trablus', 'pi', 1], ['Sur', 'pi', 1], ['Baalbek', 'mi', 1]],
  PSE: [['Ramallah', 'mi', 1], ['Gazze', 'mi', 1]],
  KWT: [['Kuveyt', 'mk', 1], ['Cehra', 'pi', 1]],
  QAT: [['Doha', 'mk', 1]],
  BHR: [['Manama', 'pi', 1]],
  ARE: [['Abu Dabi', 'zh', 1], ['Abu Dabi', 'mk', 1], ['Dubai', 'pi', 1], ['Ayn', 'mk', 1], ['Fuceyre', 'pi', 1]],
  OMN: [['Maskat', 'pi', 1], ['Salala', 'pi', 1], ['Sohar', 'pi', 1]],
  YEM: [['San\'a', 'mi', 2], ['San\'a', 'pi', 1], ['Aden', 'pi', 1], ['Aden', 'mi', 1], ['Hudeyde', 'mi', 1], ['Taiz', 'mi', 1], ['Marib', 'pi', 1], ['Mükella', 'pi', 1], ['Sada', 'mi', 1]],
  CYP: [['Lefkoşa (Güney)', 'pi', 1], ['Limasol', 'pi', 1]],
  KKTC: [['Gazimağusa', 'mi', 1]]
};
/* hava: [üs şehri, tür, filo] */
ODV.HAVA = {
  TUR: [['Ankara', 'cr', 2], ['Eskişehir', 'cr', 2], ['Konya', 'cr', 2], ['Diyarbakır', 'cr', 2], ['Balıkesir', 'cr', 1], ['Malatya', 'cr', 1], ['Eskişehir', 'bb', 1], ['Şanlıurfa', 'ih', 1], ['Malatya', 'ih', 1], ['Gazimağusa', 'ih', 1], ['Kayseri', 'nk', 2]],
  ISR: [['Tel Aviv', 'cr', 4], ['Beerşeba', 'cr', 5], ['Hayfa', 'cr', 3], ['Beerşeba', 'av', 2], ['Beerşeba', 'bb', 2], ['Tel Aviv', 'ih', 2], ['Tel Aviv', 'nk', 1]],
  EGY: [['Kahire', 'cr', 4], ['İskenderiye', 'cr', 2], ['Asyut', 'cr', 2], ['İsmailiye', 'cr', 2], ['Luksor', 'cr', 2], ['Mersa Matruh', 'cr', 2], ['Kahire', 'av', 2], ['Asvan', 'bb', 1], ['Kahire', 'nk', 2], ['Kahire', 'ih', 1]],
  SAU: [['Dammam', 'cr', 3], ['Riyad', 'cr', 2], ['Taif', 'cr', 2], ['Tebük', 'cr', 2], ['Ebha', 'cr', 2], ['Hufuf', 'cr', 1], ['Dammam', 'bb', 2], ['Tebük', 'bb', 1], ['Riyad', 'nk', 2], ['Riyad', 'ih', 1]],
  IRN: [['İsfahan', 'av', 2], ['Tahran', 'cr', 1], ['Tebriz', 'cr', 1], ['Şiraz', 'cr', 1], ['Hemedan', 'bb', 1], ['Buşehr', 'bb', 1], ['Kirmanşah', 'ih', 1], ['Ahvaz', 'ih', 1], ['Bender Abbas', 'ih', 1], ['Tahran', 'ih', 1], ['Kirman', 'ih', 1], ['Tahran', 'nk', 1]],
  ARE: [['Abu Dabi', 'cr', 3], ['Ayn', 'cr', 2], ['Dubai', 'cr', 1], ['Abu Dabi', 'ih', 1], ['Abu Dabi', 'nk', 1]],
  QAT: [['Doha', 'cr', 4], ['Doha', 'nk', 1]],
  KWT: [['Kuveyt', 'cr', 2]],
  JOR: [['Zerka', 'cr', 2]],
  IRQ: [['Bağdat', 'cr', 1], ['Bağdat', 'bb', 1]],
  OMN: [['Tumreyt', 'cr', 1], ['Maskat', 'cr', 1]],
  BHR: [['Manama', 'cr', 1]]
};
/* deniz: [deniz bölgesi, liman şehri, {gemi: adet}, ad] */
ODV.DENIZ = {
  TUR: [['Marmara Denizi', 'İstanbul', { uc: 1, fk: 6, dz: 4, kv: 2, cg: 3 }, 'Kuzey Görev Grubu'], ['Ege Denizi', 'İzmir', { fk: 5, dz: 4, kv: 4, hb: 6 }, 'Ege Filosu'],
    ['Kıbrıs Havzası', 'Mersin', { fk: 5, dz: 2, kv: 2, cg: 2 }, 'Güney Görev Grubu'], ['Batı Karadeniz', 'Zonguldak', { kv: 2, dz: 2, hb: 4 }, 'Karadeniz Filosu']],
  EGY: [['Mısır Kıyısı', 'İskenderiye', { uc: 1, fk: 6, dz: 4, kv: 2, hb: 6 }, 'Akdeniz Filosu'], ['Kuzey Kızıldeniz', 'Süveyş', { uc: 1, fk: 4, dz: 4, kv: 2, hb: 4, cg: 2 }, 'Güney Filosu']],
  ISR: [['Levant Kıyısı', 'Hayfa', { kv: 7, dz: 5, hb: 8 }, 'Akdeniz Filosu'], ['Akabe Körfezi', 'Eilat', { hb: 2 }, 'Kızıldeniz Filosu']],
  IRN: [['Hürmüz Boğazı', 'Bender Abbas', { fk: 4, kv: 3, dz: 3, hb: 25 }, 'Hürmüz Filosu'], ['Umman Körfezi', 'Cask', { fk: 2, dz: 1, hb: 6 }, 'Umman Körfezi Filosu'], ['Güney Hazar', 'Reşt', { fk: 1, hb: 4 }, 'Hazar Filosu']],
  SAU: [['Kuzey Basra Körfezi', 'Cübeyl', { fk: 4, kv: 4, hb: 6 }, 'Doğu Filosu'], ['Orta Kızıldeniz', 'Cidde', { fk: 3, kv: 2, hb: 4, cg: 2 }, 'Batı Filosu']],
  ARE: [['Güney Basra Körfezi', 'Abu Dabi', { kv: 8, hb: 8, cg: 2 }, 'Emirlik Donanması']],
  QAT: [['Güney Basra Körfezi', 'Doha', { kv: 4, hb: 3, cg: 1 }, 'Katar Donanması']],
  OMN: [['Umman Körfezi', 'Maskat', { kv: 3, hb: 4 }, 'Kraliyet Donanması'], ['Arap Denizi', 'Salala', { hb: 2 }, 'Güney Filosu']],
  KWT: [['Kuzey Basra Körfezi', 'Kuveyt', { hb: 6 }, 'Kuveyt Donanması']],
  BHR: [['Güney Basra Körfezi', 'Manama', { fk: 1, hb: 2 }, 'Bahreyn Donanması']],
  JOR: [['Akabe Körfezi', 'Akabe', { hb: 2 }, 'Kraliyet Deniz Kuvvetleri']],
  IRQ: [['Kuzey Basra Körfezi', 'Basra', { hb: 3 }, 'Irak Donanması']],
  CYP: [['Kıbrıs Havzası', 'Limasol', { hb: 2 }, 'Deniz Komutanlığı']]
};
/* boğazlar ve kanallar: [deniz A, deniz B, geçişi kontrol eden şehir] */
ODV.BOGAZ = [['Marmara Denizi', 'Batı Karadeniz', 'İstanbul', 'İstanbul Boğazı'], ['Mısır Kıyısı', 'Süveyş Körfezi', 'İsmailiye', 'Süveyş Kanalı']];

/* başlangıç ilişkileri (−100 düşman · +100 dost) ve ittifaklar */
ODV.REL = [
  ['TUR', 'KKTC', 95], ['TUR', 'CYP', -55], ['TUR', 'ISR', -60], ['TUR', 'SYR', 45], ['TUR', 'QAT', 60], ['TUR', 'IRQ', 10], ['TUR', 'IRN', -5], ['TUR', 'ARE', 25], ['TUR', 'SAU', 25], ['TUR', 'EGY', 20], ['TUR', 'AZE', 0], ['TUR', 'PSE', 40],
  ['ISR', 'IRN', -95], ['ISR', 'PSE', -85], ['ISR', 'LBN', -60], ['ISR', 'YEM', -85], ['ISR', 'SYR', -40], ['ISR', 'IRQ', -50], ['ISR', 'ARE', 30], ['ISR', 'BHR', 20], ['ISR', 'EGY', 5], ['ISR', 'JOR', 0], ['ISR', 'CYP', 45], ['ISR', 'SAU', -10], ['ISR', 'QAT', -40],
  ['IRN', 'SAU', -20], ['IRN', 'ARE', -25], ['IRN', 'BHR', -50], ['IRN', 'IRQ', 50], ['IRN', 'YEM', 10], ['IRN', 'SYR', -45], ['IRN', 'LBN', 15], ['IRN', 'QAT', 25], ['IRN', 'OMN', 30], ['IRN', 'KWT', -10], ['IRN', 'JOR', -20], ['IRN', 'EGY', -10],
  ['SAU', 'ARE', 55], ['SAU', 'BHR', 80], ['SAU', 'KWT', 65], ['SAU', 'QAT', 35], ['SAU', 'OMN', 45], ['SAU', 'EGY', 55], ['SAU', 'JOR', 50], ['SAU', 'YEM', -10], ['SAU', 'SYR', 40], ['SAU', 'IRQ', 10],
  ['ARE', 'BHR', 70], ['ARE', 'KWT', 50], ['ARE', 'QAT', 15], ['ARE', 'OMN', 35], ['ARE', 'EGY', 60], ['ARE', 'YEM', -20], ['KWT', 'IRQ', -15], ['KWT', 'BHR', 60], ['QAT', 'BHR', 10], ['OMN', 'YEM', 15],
  ['EGY', 'JOR', 50], ['EGY', 'PSE', 30], ['EGY', 'CYP', 50], ['JOR', 'PSE', 40], ['JOR', 'SYR', 20], ['JOR', 'IRQ', 25], ['SYR', 'LBN', 10], ['SYR', 'IRQ', -10], ['LBN', 'PSE', 20], ['CYP', 'KKTC', -50], ['IRQ', 'YEM', 5]
];
/* başlangıç ittifakları: [ad, üyeler] */
ODV.ITT = [['Garanti Antlaşması', ['TUR', 'KKTC']], ['Körfez Ortak Savunması', ['SAU', 'ARE', 'BHR', 'KWT']]];
/* yapay zekâ tavrı: saldırganlık (0–1) */
ODV.AGR = { TUR: .35, IRN: .45, EGY: .25, SAU: .3, ISR: .5, IRQ: .2, SYR: .15, JOR: .1, LBN: .05, PSE: .05, KWT: .05, QAT: .05, BHR: .05, ARE: .25, OMN: .05, YEM: .35, CYP: .05, KKTC: .05 };
