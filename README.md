# Realpolitik

Tarayıcıda oynanan jeopolitik strateji oyunu. Hikâye bölümleri ve **Açık Dünya** modu (Orta Doğu'da 18 devlet,
gerçek sınırlar, ordu, ekonomi, diplomasi, hava ve deniz harekâtı) içerir.

Oyun düz HTML ve JavaScript ile yazılmıştır; derleme ya da çerçeve (React vb.) gerektirmez.

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç. Yayına hazır kopya için `npm run build` (çıktı `dist/` klasörüne yazılır).

## Klasör yapısı

- `index.html`: oyunun ana dosyası (arayüz, hikâyeler ve oyun döngüsü)
- `public/`: oyunun diğer bütün dosyaları
  - `od-*.js`: Açık Dünya modu (harita, veri, sınırlar, arazi, oyun kodu)
  - `de62*.js`: 1962 krizi hikâyesi
  - `od-arazi/`: yakınlaştırınca yüklenen ayrıntılı arazi karoları
  - görseller ve kütüphaneler (three.js, topojson, datamaps)

## Kaynaklar

İl sınırları: geoBoundaries (CC BY 4.0). Kıyılar ve arazi rengi: Natural Earth. Yükseklik: Mapzen/AWS Terrain Tiles
(SRTM, ETOPO1, GMTED2010). Bu atıflar oyunun içinde de yer alır ve korunmalıdır.
