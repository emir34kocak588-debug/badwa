# Emrissx Yönetim Botu

50 komutlu, Türkçe Discord yönetim + müzik botu. Sadece belirttiğin Discord ID
(`1518024737551417587`) bu botu kullanabilir — başka hiç kimse komutları çalıştıramaz.

Bu sürümde **hiç alt klasör yok** — tüm dosyalar tek klasörde, düz halde duruyor.
Katabump'ın klasörleri düzgün extract etmemesi sorununu tamamen ortadan kaldırmak için
böyle yapıldı. Dosya adlarındaki önekler ne olduklarını gösteriyor:
- `cmd-...js` → komut grupları (her biri birden fazla slash komutu içerir)
- `evt-...js` → Discord olayları (mesaj geldi, üye katıldı, vs.)
- `util-...js` → yardımcı fonksiyonlar (veri kaydetme, küfür filtresi, vs.)

## ⚠️ ÖNEMLİ - İLK YAPMAN GEREKEN ŞEY

Bot token'ını sohbette paylaştın, o token artık güvenli sayılmaz. Kuruluma başlamadan önce:

1. https://discord.com/developers/applications adresine git
2. Botunu seç → **Bot** sekmesi → **Reset Token**
3. Çıkan yeni token'ı kopyala, sadece `.env` dosyasına yapıştır, başka hiçbir yere yazma/paylaşma.

## Kurulum (Katabump)

1. Katabump dosya yöneticisinde `/home/container` içindeki **her şeyi sil** (eski dosyalar
   karışmasın).
2. Bu zip'i yükle ve **extract et**. Extract sonrası dosyaların hepsinin doğrudan
   `/home/container` içinde olduğundan emin ol (örn. `/home/container/index.js`,
   `/home/container/cmd-moderation.js` gibi — `/home/container/discordbot/index.js` gibi
   iç içe bir klasör OLMAMALI, öyleyse dosyaları bir üst klasöre taşı).
3. `.env.example` dosyasının adını **tam olarak** `.env` yap (`.env.txt` ya da `env.example`
   değil) ve içini doldur:
   ```
   DISCORD_TOKEN=yeni_aldigin_token
   CLIENT_ID=1518885820247965756
   OWNER_ID=1518024737551417587
   ```
4. Panelde "Install/Dependencies" adımını çalıştır (`npm install`).
   - Node.js sürümü: **18 veya üzeri** (Katabump'ta v24 görünüyor, o da çalışır).
5. Başlatma (start) komutu: `npm start` (bu `node index.js` çalıştırır).
6. **Ayrıca bir şey yapmana gerek yok** — bot artık her açıldığında komutları kendi kendine
   Discord'a kaydediyor (otomatik `npm run deploy`). Konsolda sırasıyla şunları görmelisin:
   ```
   50 komut yuklendi.
   Komutlar Discord a kaydediliyor...
   50 komut ... kaydedildi ...
   [botun_ismi] olarak giris yapildi. Bot aktif!
   ```
   `npm run deploy` komutu da hâlâ elle çalıştırılabilir ama artık zorunlu değil.

## Discord Developer Portal Ayarları (Zorunlu)

Bot Portal'da şu izinler/intent'ler açık olmalı (Bot sekmesi → Privileged Gateway Intents):
- ✅ SERVER MEMBERS INTENT
- ✅ MESSAGE CONTENT INTENT

Bu ikisi açık değilse hoşgeldin mesajları, küfür filtresi ve `sa`/`selamünaleyküm` gibi
mesaj bazlı özellikler çalışmaz.

Botu sunucuna eklerken (OAuth2 → URL Generator) şu izinleri seç: `bot`, `applications.commands`
ve yönetici (Administrator) ya da en azından: Ban Members, Kick Members, Moderate Members,
Manage Channels, Manage Roles, Manage Messages, Connect, Speak, Move Members.

## Önemli Notlar

- **Sadece owner ID kullanabilir**: `botsettings.js` içindeki `OWNER_ID` değeri ile eşleşmeyen
  hiç kimse hiçbir komutu çalıştıramaz (`evt-interactionCreate.js` içinde global kontrol var).
- **Uyarı sistemi**: `/uyarı` komutuyla verilen uyarılar bot ilk çalıştığında otomatik oluşan
  `data/warnings.json` dosyasında saklanır. 3. uyarıda kullanıcı otomatik atılır (kick).
- **Küfür filtresi**: mesajlar otomatik taranır, küfür bulunursa silinir + uyarı verilir.
  3 küfür uyarısında kullanıcı 3 saat susturulur (timeout). Allah/Atatürk'e küfür tespit
  edilirse direkt banlanır.
- **Hoşgeldin/Görüşürüz kanalları**: `/hosayarla` ve `/gorayarla` komutlarıyla ayarlanan kanallar
  otomatik kilitlenir (sadece bot mesaj atabilir).
- **Duyuru kanalı**: `/dukanalı` ile ayarlanan kanal kilitlenir; eğer sunucunda "Owner" isimli
  bir rol varsa o rol de yazabilir. `/du <mesaj>` ile o kanala duyuru gönderilir.
- **Müzik**: `/cal <youtube linki>` ses kanalına katılır, şarkıyı çalar, bitince otomatik çıkar.
  `/dur` çalmayı durdurup sesten çıkar. YouTube tarafı sürekli değiştiği için stream/bilgi çekme
  arada arıza yapabilir — böyle bir durumda önce `npm update @distube/ytdl-core` çalıştır (bu
  kütüphane sık güncellenip YouTube'daki değişikliklere karşı yamalanıyor).
- **Kilit sistemi**: `/lock`, `/unlock`, `/lockall`, `/unlockall` — hepsi "Owner" rolü olan
  kişilerin yazmasına izin verir (rol yoksa sadece bot yazabilir). `/lockall` ve `/unlockall`,
  hoşgeldin/görüşürüz/duyuru kanallarına dokunmaz.

## Komut Listesi (50 komut, `/yardım` ile de görebilirsin)

- **Moderasyon (8):** `/ban`, `/unban`, `/kick`, `/mute`, `/unmute`, `/uyarı`, `/uyarılar`, `/uyarısil`
- **Ayarlar (8):** `/hosayarla`, `/gorayarla`, `/dukanalı`, `/du`, `/lock`, `/unlock`, `/lockall`, `/unlockall`
- **Müzik (2):** `/cal`, `/dur`
- **Eğlence (6):** `/yazitura`, `/zar`, `/sekiztop`, `/anket`, `/sec`, `/taskagitmakas`
- **Utility (26):** `/botasöylet`, `/ping`, `/avatar`, `/kullaniciinfo`, `/sunucuinfo`, `/uyesayisi`,
  `/rolinfo`, `/kanalinfo`, `/botinfo`, `/uptime`, `/rollistesi`, `/kanallistesi`, `/rolver`,
  `/rolal`, `/isimdegistir`, `/temizle`, `/yavaslat`, `/kanalac`, `/kanalsil`, `/rololustur`,
  `/rolsil`, `/yetkilerim`, `/sunucusahibi`, `/yardım`, `/kanalgizle`, `/kanalgoster`

## Sorun Giderme

- **`ENOENT ... scandir '/home/container/commands'` gibi bir hata alırsan** → bu artık imkansız,
  çünkü hiç alt klasör kalmadı. Böyle bir hata alıyorsan hâlâ eski (klasörlü) sürümü kullanıyorsun
  demektir, bu zip'i tekrar indirip yükle.
- Bot açılmıyor / hemen kapanıyor → `.env` dosyasının adını ve içeriğini kontrol et.
- **Komutlar Discord'da (yazınca "/" listesinde) görünmüyor** → şu sırayla kontrol et:
  1. `npm run deploy` çalıştırdın mı? Konsolda "Komutlar basariyla kaydedildi!" yazısını görmelisin.
  2. Botu sunucuya eklerken URL Generator'da `applications.commands` kutucuğunu işaretlemiş miydin?
     İşaretlemediysen botu sunucudan atıp OAuth2 linkini `applications.commands` işaretli halde
     tekrar oluşturup yeniden davet etmen gerekir.
  3. **En hızlı çözüm:** `.env` dosyana `GUILD_ID=sunucu_id_in` satırını ekle (sunucu ID'sini almak
     için Discord'da Ayarlar > Gelişmiş > Geliştirici Modu'nu aç, sonra sunucu ismine sağ tıkla >
     "ID'yi Kopyala"), sonra `npm run deploy` komutunu tekrar çalıştır. Bu şekilde komutlar global
     yerine sadece o sunucuya kaydedilir ve **anında** görünür (global kayıt Discord tarafında
     yayılması normalde 5 dakika ile 1 saat arası sürebilir).
  4. Discord uygulamasını tamamen kapatıp aç (masaüstünde Ctrl+R yeterli olabilir).
- Ses çalmıyor → Sunucuda bir ses kanalına gir, botun o kanala "Connect" ve "Speak" izni olduğundan
  emin ol.
- "Bu botu kullanma yetkin yok" mesajı alıyorsan → bu normal, bot sadece `OWNER_ID` ile eşleşen
  hesap tarafından kullanılabiliyor (senin isteğin üzerine).
