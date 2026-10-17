// Oyun düz HTML ve klasik <script> dosyalarıyla yazılmıştır; Vite yalnızca geliştirme sunucusu ve
// yayın kopyası (dist/) için kullanılır. Oyun dosyaları public/ klasöründen olduğu gibi sunulur.
// base: './' sayesinde dist/ klasörü herhangi bir alt adreste (ör. GitHub Pages) de çalışır.
export default {
  base: './',
  server: { port: 5173 },
  preview: { port: 4173 }
};
