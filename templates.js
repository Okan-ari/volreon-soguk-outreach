/**
 * Volreon AI — 20 Sektöre Özel E-Posta Şablon Motoru
 * Her sektörün operasyonel acı noktasına özel hazırlanmış, doğrudan dönüşüm odaklı B2B teklif metinleri.
 */

const { CATEGORIES } = require('./categories');

function getEmailContent(lead) {
  const name = lead.name && lead.name !== 'İşletme Yetkilisi' ? lead.name : 'Değerli İşletme Yöneticisi';
  const sectorKey = (lead.sector || 'genel').toLowerCase();

  let subject = '';
  let painPoint = '';
  let solutionBullets = [];

  switch (sectorKey) {
    case 'dis_klinigi':
      subject = `${lead.name || 'Kliniğiniz'} İçin 7/24 Sesli Çağrı & WhatsApp Randevu Asistanı`;
      painPoint = 'Diş kliniklerinde özellikle mesai dışı saatlerde (akşamları ve hafta sonu) gelen acil hasta aramalarının cevapsız kalması ve WhatsApp randevu taleplerinin gecikmesi ciddi bir hasta kaybına yol açabiliyor.';
      solutionBullets = [
        '<strong>7/24 Sesli Çağrı Karşılama:</strong> Sabit/mobil telefonunuzu anında karşılar, hastanın şikayetini dinler ve takviminize randevuyu işler.',
        '<strong>WhatsApp Otomasyonu:</strong> Tedavi ücretleri, konum ve uygun saatleri saniyeler içinde iletir.',
        '<strong>No-Show Önleme:</strong> Randevudan 24 saat önce otomatik onay mesajı atarak gelmeme oranını %80 azaltır.'
      ];
      break;

    case 'estetik_merkezi':
      subject = `${lead.name || 'Merkeziniz'} İçin Yapay Zeka ile Ön Görüşme ve Randevu Karşılama`;
      painPoint = 'Estetik ve plastik cerrahi kliniklerinde işlem fiyatı ve konsültasyon randevusu için sosyal medya ve telefon üzerinden çok yüksek hacimde talep gelir. Bunlara anında dönülmediğinde danışan diğer kliniklere yönelir.';
      solutionBullets = [
        '<strong>Anlık Fiyat & Bilgi Asistanı:</strong> İşlemler hakkında danışanın merak ettiği detayları ve fiyat aralıklarını 7/24 aktarır.',
        '<strong>Konsültasyon Randevusu:</strong> Doktorunuzun takvimine göre ön muayene saatlerini doldurur.',
        '<strong>Yabancı Hasta Desteği:</strong> İngilizce, Rusça ve Arapça gelen çağrı ve mesajları kendi anadillerinde yanıtlar.'
      ];
      break;

    case 'butik_otel':
      subject = `${lead.name || 'Oteliniz'} İçin 5 Dilde 7/24 Rezervasyon & Resepsiyon Asistanı`;
      painPoint = 'Butik otellerde gece saatlerinde gelen yabancı çağrılar, resepsiyon yoğunluğu ve yüksek OTA (Booking vb.) komisyonları doğrudan kârlılığı düşürmektedir.';
      solutionBullets = [
        '<strong>5 Dilde Sesli Çağrı:</strong> Türkçe, İngilizce, Almanca, Rusça ve Arapça dillerinde telefonları anında açar ve oda detaylarını aktarır.',
        '<strong>Komisyonsuz Doğrudan Satış:</strong> Misafirleri komisyon ödemeden doğrudan kendi web/WhatsApp hattınızdan rezervasyona bağlar.',
        '<strong>7/24 Dijital Concierge:</strong> Transfer, kahvaltı, otopark gibi tekrarlayan soruları resepsiyonu yormadan çözer.'
      ];
      break;

    case 'restoran_kafe':
      subject = `${lead.name || 'İşletmeniz'} İçin Yoğun Saatlerde 7/24 Masa Rezervasyon Asistanı`;
      painPoint = 'Restoranlarda servis yoğunluğunda çalan telefonlara bakılamaması veya WhatsApp masa taleplerinin kaçması, masaların boş kalmasına ve ciro kaybına neden olur.';
      solutionBullets = [
        '<strong>Telefonla Masa Rezervasyonu:</strong> Gelen aramayı saniyeler içinde açar, kişi sayısı ve saati alarak listeye işler.',
        '<strong>WhatsApp Menü & Konum:</strong> Menü, otopark ve canlı müzik sorularına anında otomatik yanıt verir.',
        '<strong>Otomatik SMS/WhatsApp Onayı:</strong> Rezervasyon yapan misafire anında teyit ve konum iletir.'
      ];
      break;

    case 'hukuk_burosu':
      subject = `${lead.name || 'Büronuz'} İçin Duruşma Saatlerinde 7/24 Otonom Santral & Müvekkil Karşılama`;
      painPoint = 'Duruşma, adliye veya müvekkil toplantıları sırasında çalan telefonlara bakılamaması yeni dava ve danışmanlık fırsatlarının kaçmasına sebep olabilir.';
      solutionBullets = [
        '<strong>Kurumsal Santral Asistanı:</strong> Arayan müvekkili saygın bir kurumsal dille karşılar, konusunu not alır ve size özet iletir.',
        '<strong>Randevu Takvimi:</strong> Ofis görüşmesi veya online danışmanlık takviminizi yönetir.',
        '<strong>Gizlilik ve Güvenlik:</strong> KVKK standartlarına tam uyumlu altyapı sunar.'
      ];
      break;

    case 'gayrimenkul_emlak':
      subject = `${lead.name || 'Ofisiniz'} İçin 7/24 İlan Çağrı Karşılama & Yer Gösterme Asistanı`;
      painPoint = 'İlan portallarından gece veya hafta sonu gelen aramalara anında cevap verilmediğinde alıcı başka bir emlak danışmanına geçer.';
      solutionBullets = [
        '<strong>İlan Numarasından Bilgi Verme:</strong> Arayan müşterinin sorduğu portföy hakkında anında fiyat ve konum bilgisi sunar.',
        '<strong>Yer Gösterme Randevusu:</strong> Danışmanınızın takvimine göre yer gösterme saatini planlar.',
        '<strong>WhatsApp Portföy Kartı:</strong> Arayan müşteriye ilgili mülkün fotoğraflarını ve detaylarını WhatsApp’tan otomatik gönderir.'
      ];
      break;

    case 'guzellik_kuafor':
      subject = `${lead.name || 'Merkeziniz'} İçin Seans Randevu Asistanı & No-Show Engelleyici`;
      painPoint = 'Güzellik merkezlerinde işlem sırasında telefon açmak zordur; randevusuna haber vermeden gelmeyen müşteriler ise ciddi zaman ve ciro kaybı yaratır.';
      solutionBullets = [
        '<strong>Telefon & Instagram Randevu:</strong> Uzmanların boş saatlerine göre seans randevularını personelsiz oluşturur.',
        '<strong>Otomatik Hatırlatma:</strong> Randevu öncesi teyit isteyerek boş geçen seansları sıfıra indirir.',
        '<strong>İşlem Bilgilendirmesi:</strong> Fiyat ve seans sürelerini anında yanıtlar.'
      ];
      break;

    case 'ozel_okul_kurs':
      subject = `${lead.name || 'Kurumunuz'} İçin Kayıt Döneminde 7/24 Veli Karşılama Asistanı`;
      painPoint = 'Kayıt dönemlerinde velilerin telefon hatlarını kilitlemesi ve mesai sonrası gelen aramalarda okul hakkında detaylı bilgiye ulaşılamaması kayıt kaybına yol açar.';
      solutionBullets = [
        '<strong>Veli Görüşme Randevusu:</strong> Rehberlik ve kayıt danışmanlığı görüşmelerini takvime planlar.',
        '<strong>Eğitim & Fiyat Bilgilendirmesi:</strong> Müfredat, servis, bursluluk ve kayıt şartlarını akıcı şekilde açıklar.',
        '<strong>WhatsApp Bilgi Paketi:</strong> Arayan veliye broşür ve tanıtım dosyasını otomatik iletir.'
      ];
      break;

    case 'oto_servis_ekspertiz':
      subject = `${lead.name || 'Servisiniz'} İçin Telefonla Periyodik Bakım & Randevu Asistanı`;
      painPoint = 'Atölye ve servis alanının gürültüsünde çalan telefonları duymak ve randevu defterini yönetmek usta ve yöneticilerin işini böler.';
      solutionBullets = [
        '<strong>Servis & Ekspertiz Randevusu:</strong> Araç marka, model ve yapılacak işlemi dinleyerek uygun güne randevu yazar.',
        '<strong>Durum Sorgulama:</strong> "Aracım hazır mı?" diyen müşteriye anlık durum bilgisi verir.',
        '<strong>Konum & Hatırlatma:</strong> Randevu sabahı araç sahibine konum ve hatırlatma SMS/WhatsApp mesajı atar.'
      ];
      break;

    case 'mimarlik_ofisi':
      subject = `${lead.name || 'Ofisiniz'} İçin Proje Keşif Randevusu & Çağrı Yönetim Asistanı`;
      painPoint = 'Şantiyede veya tasarım aşamasındayken gelen yeni proje ve renovasyon taleplerini profesyonelce karşılamak zaman alır.';
      solutionBullets = [
        '<strong>Proje Talebi Alma:</strong> Müşterinin proje tipini (villa, ofis, kafe vb.), metrekaresini ve lokasyonunu öğrenip özetler.',
        '<strong>Keşif & Toplantı Randevusu:</strong> Takviminize online veya ofis tanışma toplantısı ekler.',
        '<strong>Portfolyo İletimi:</strong> WhatsApp üzerinden seçili referans projelerinizi sunar.'
      ];
      break;

    case 'psikolog_klinik':
      subject = `${lead.name || 'Kliniğiniz'} İçin Hassas & Gizlilik Odaklı Seans Randevu Asistanı`;
      painPoint = 'Seanstayken çalan telefonlara bakılamaması, danışanların çekinerek vazgeçmesine sebep olabilir.';
      solutionBullets = [
        '<strong>Empatik & Saygın Ses Tonu:</strong> Arayan danışanı sakin ve profesyonel bir üslupla karşılar.',
        '<strong>Online & Yüz Yüze Randevu:</strong> Takviminizdeki boş seans saatlerini danışana sunarak randevuyu netleştirir.',
        '<strong>Ön Bilgilendirme:</strong> Seans süresi, ücret ve seans iptal kurallarını iletir.'
      ];
      break;

    case 'diyetisyen':
      subject = `${lead.name || 'Merkeziniz'} İçin Danışan Randevu & WhatsApp Bilgi Asistanı`;
      painPoint = 'Sosyal medyadan ve telefonla gelen "Online diyet ücreti nedir?", "Nasıl çalışıyorsunuz?" sorularına tek tek yetişmek vakit alır.';
      solutionBullets = [
        '<strong>Paket Bilgilendirmesi:</strong> Yüz yüze ve online diyet paketlerinizi 7/24 eksiksiz tanıtır.',
        '<strong>İlk Görüşme Randevusu:</strong> Ölçüm ve ilk görüşme saatlerini otomatik planlar.',
        '<strong>Danışan Takibi:</strong> Kontrol günlerinde otomatik hatırlatmalar yapar.'
      ];
      break;

    case 'veteriner_klinigi':
      subject = `${lead.name || 'Kliniğiniz'} İçin 7/24 Acil Çağrı & Aşı Randevu Asistanı`;
      painPoint = 'Gece saatlerinde gelen acil vaka aramaları ve gün içinde aşı/muayene randevuları için personelin sürekli telefon başında beklemesi zordur.';
      solutionBullets = [
        '<strong>7/24 Acil Karşılama:</strong> Gece aramalarında acil durumu tespit edip hekime anında bildirim düşürür.',
        '<strong>Aşı & Muayene Randevusu:</strong> Takvime uygun saatleri hasta sahibine sunar ve randevuyu oluşturur.',
        '<strong>Aşı Takvimi Hatırlatıcı:</strong> Yaklaşan karma/kuduz aşıları için hasta sahiplerine otomatik WhatsApp mesajı atar.'
      ];
      break;

    case 'spor_salonu_fitness':
      subject = `${lead.name || 'Stüdyonuz'} İçin Deneme Dersi & Üyelik Randevu Asistanı`;
      painPoint = 'Instagram ve Google üzerinden gelen fiyat ve ders programı sorularına geç dönüldüğünde potansiyel üyeler rakip salonlara kayar.';
      solutionBullets = [
        '<strong>Deneme Dersi Randevusu:</strong> Pilates, fitness veya fonksiyonel antrenman için ücretsiz deneme dersi planlar.',
        '<strong>Üyelik Paketleri:</strong> 1/3/6/12 aylık paket detaylarını anında iletir.',
        '<strong>Gelmeyen Adayları Geri Kazanma:</strong> Randevusuna gelmeyenlere otomatik hatırlatma gönderir.'
      ];
      break;

    case 'dugun_organizasyon':
      subject = `${lead.name || 'Mekanınız'} İçin Boş Tarih & Davet Teklif Asistanı`;
      painPoint = 'Çiftlerin genellikle mesai sonrası akşam saatlerinde düğün/kına tarihi ve kişi başı fiyat sorması resepsiyonu meşgul eder.';
      solutionBullets = [
        '<strong>Tarih Müsaitliği Sorgulama:</strong> Çiftin istediği ay ve günün boş olup olmadığını takvimden kontrol eder.',
        '<strong>Kişi Sayısına Göre Teklif:</strong> Menü seçenekleri ve ortalama fiyat aralıklarını aktarır.',
        '<strong>Mekan Gezme Randevusu:</strong> Çiftleri mekanı canlı görmeleri için satış sorumlunuzun takvimine randevu olarak yazar.'
      ];
      break;

    case 'rent_a_car':
      subject = `${lead.name || 'Filolarınız'} İçin 7/24 Araç Rezervasyon & Müsaitlik Asistanı`;
      painPoint = 'Özellikle uçak iniş saatlerinde gece gelen araç kiralama aramaları cevapsız kalabilir.';
      solutionBullets = [
        '<strong>Araç Müsaitliği ve Fiyat:</strong> İstenen tarihlerdeki müsait segmentleri (ekonomik, SUV, lüks) anında aktarır.',
        '<strong>Havalimanı Teslimat Randevusu:</strong> Uçuş kodu ve iniş saatini alarak rezervasyonu sisteme işler.',
        '<strong>Evrak & Kiralama Şartları:</strong> Ehliyet yaşı ve depozito kurallarını WhatsApp’tan iletir.'
      ];
      break;

    case 'mali_musavir':
      subject = `${lead.name || 'Ofisiniz'} İçin Mükellef İletişim & Evrak Hatırlatma Asistanı`;
      painPoint = 'KDV ve geçici vergi dönemlerinde evrak toplamak ve mükelleflerin rutin sorularını yanıtlamak asıl denetim işinizi böler.';
      solutionBullets = [
        '<strong>Rutin Soru Karşılama:</strong> Vergi takvimi, çalışma saatleri ve standart evrak listesi sorularını yanıtlar.',
        '<strong>Yeni Mükellef Görüşmesi:</strong> Şirket kuruluşu veya danışmanlık isteyen yeni girişimciler için randevu oluşturur.',
        '<strong>Evrak Hatırlatıcı:</strong> Ay sonlarında mükelleflere otomatik fatura/dekont teslim hatırlatması yapar.'
      ];
      break;

    case 'sigorta_acentesi':
      subject = `${lead.name || 'Acenteniz'} İçin 7/24 Kasko & Trafik Teklif Toplama Asistanı`;
      painPoint = 'Poliçe bitiş tarihine az kalan müşteriler anında fiyat öğrenmek ister; telefonda uzun süre beklemek istemez.';
      solutionBullets = [
        '<strong>Ruhsat ve TC Bilgisi Toplama:</strong> Arayan veya yazan müşterinin plaka/TC bilgisini alıp teklif havuzuna iletir.',
        '<strong>Poliçe Yenileme Hatırlatma:</strong> Vadesi yaklaşan müşterilere WhatsApp’tan otomatik teklif sunar.',
        '<strong>Hasar Anında Rehberlik:</strong> Kaza anında yapılması gereken adımları ve çekici numarasını anında paylaşır.'
      ];
      break;

    case 'turizm_seyahat':
      subject = `${lead.name || 'Acenteniz'} İçin Vize Danışmanlık & Tur Rezervasyon Asistanı`;
      painPoint = 'Vize başvuru evrakları ve tur kontenjanları hakkında gün boyu gelen benzer sorular personelinizi kilitler.';
      solutionBullets = [
        '<strong>Vize Evrak Asistanı:</strong> İlgili ülkenin güncel evrak listesini WhatsApp üzerinden anında müşteriye gönderir.',
        '<strong>Tur Kontenjan Bilgisi:</strong> Tur tarihlerini, dahil olan hizmetleri ve kalan kontenjanı açıklar.',
        '<strong>Randevu Alma:</strong> Dosya teslimi veya ön görüşme için ofis randevusu oluşturur.'
      ];
      break;

    case 'lojistik_nakliyat':
      subject = `${lead.name || 'Firmanız'} İçin 7/24 Nakliye Fiyat Teklifi & Ekspertiz Asistanı`;
      painPoint = 'Müşteriler ev veya ofis taşıtırken oda sayısı, kat bilgisi ve mesafe için hızlıca fiyat teklifi bekler.';
      solutionBullets = [
        '<strong>Fiyat Teklifi Hesaplama:</strong> Nereden nereye, oda sayısı ve asansör durumunu öğrenip anında yaklaşık teklif sunar.',
        '<strong>Ücretsiz Ekspertiz Randevusu:</strong> İnceleme için ekspertiz gün ve saatini belirler.',
        '<strong>Sevkiyat Takibi:</strong> Eşyanın yola çıkış ve varış saatleri hakkında müşteriye bilgi verir.'
      ];
      break;

    default:
      subject = `${lead.name || 'Şirketiniz'} İçin 7/24 Otonom Çağrı & Müşteri İletişim Asistanı`;
      painPoint = 'İşletmelerde mesai dışı veya yoğun saatlerde gelen müşteri aramalarının cevapsız kalması ve WhatsApp mesajlarına geç dönülmesi satış kaybına yol açabiliyor.';
      solutionBullets = [
        '<strong>Sesli Çağrı Asistanı:</strong> Sabit telefonunuzu karşılar, bilgi verir, randevu veya talep oluşturur.',
        '<strong>WhatsApp & Web Sohbet:</strong> Gelen soruları 5 dilde anında yanıtlar.',
        '<strong>Hızlı Entegrasyon:</strong> Mevcut numaranız ve kurumsal yapınız korunarak kısa sürede devreye alınır.'
      ];
  }

  const bodyHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6; font-size: 15px;">
      <p>Merhaba ${name},</p>
      
      <p>${painPoint}</p>
      
      <p><strong>VOLREON AI</strong> olarak sektörünüze özel geliştirdiğimiz yapay zeka santral ve iletişim otomasyonu ile bu süreci sıfır personel eforuyla çözüyoruz:</p>
      
      <ul style="padding-left: 20px; color: #334155;">
        ${solutionBullets.map(b => `<li style="margin-bottom: 8px;">${b}</li>`).join('')}
      </ul>
      
      <p>Sistemimizi mevcut telefon numaranızı ve düzeninizi hiç değiştirmeden 24 saat içinde devreye alabiliyoruz.</p>
      
      <p>Size veya operasyon yöneticinize 5 dakikalık canlı bir sesli asistan demosu sunmaktan memnuniyet duyarız. Bu e-postaya kısaca yanıt vermeniz yeterlidir.</p>
      
      <p style="margin-top: 32px; margin-bottom: 4px; color: #64748b; font-size: 14px;">Saygılarımla,</p>
      
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 18px; margin-bottom: 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <!-- Sol Kolon: Kurumsal Koyu Logo Kutusu -->
          <td style="vertical-align: top; padding-right: 18px; width: 86px;">
            <table cellpadding="0" cellspacing="0" border="0" style="width: 86px; height: 86px; background: #080b11; border-radius: 12px; text-align: center; border: 1px solid #1e293b;">
              <tr>
                <td style="vertical-align: middle; padding: 7px 5px; text-align: center;">
                  <!-- Orijinal V-R Kinetik Master Sembolü -->
                  <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto 6px auto;">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M 16 20
                             H 36
                             L 54 66
                             L 54 20
                             H 84
                             C 101 20, 108 29, 108 43
                             C 108 54, 101 62, 88 64
                             L 108 98
                             H 86
                             L 68 66
                             H 54
                             L 54 98
                             H 36
                             L 16 20
                             Z
                             M 54 36
                             V 52
                             H 80
                             C 87 52, 91 48, 91 43
                             C 91 38, 87 36, 80 36
                             H 54
                             Z" 
                          fill="#ffffff" />
                  </svg>
                  <!-- Sitedeki Orijinal Tipografi: Poppins + Tam Yatay Eşitlenmiş AI Rozeti -->
                  <div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 800; color: #ffffff; letter-spacing: 0.08em; line-height: 14px; text-align: center; white-space: nowrap;">
                    <span style="display: inline-block; vertical-align: middle;">VOLREON</span><span style="font-size: 6.8px; font-weight: 900; background: rgba(99, 102, 241, 0.3); border: 1px solid rgba(99, 102, 241, 0.6); color: #c4b5fd; padding: 1px 3px; border-radius: 2.5px; letter-spacing: 0.04em; display: inline-block; vertical-align: middle; margin-left: 3px; line-height: 1;">AI</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>

          <!-- Dikey İnce Ayrım Çizgisi -->
          <td style="border-left: 2px solid #e2e8f0; width: 1px; padding: 0;"></td>

          <!-- Sağ Kolon: İsim ve Kurumsal İletişim -->
          <td style="vertical-align: top; padding-left: 18px;">
            <div style="font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1.2; letter-spacing: -0.3px;">
              Okan Arı
            </div>
            
            <!-- Unvan: Siyahımsı Koyu Mor (#312e81) & Kalın (800) -->
            <div style="font-size: 11px; font-weight: 800; color: #312e81; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 3px;">
              Kurucu & Yapay Zeka Sistem Mimarı
            </div>
            
            <!-- VOLREON [AI] · Kurumsal İletişim -->
            <div style="font-size: 12.5px; font-weight: 600; color: #475569; margin-top: 3px; margin-bottom: 8px; line-height: 16px;">
              <span style="font-family: 'Poppins', sans-serif; font-weight: 800; color: #0f172a; letter-spacing: 0.04em; display: inline-block; vertical-align: middle;">VOLREON</span><span style="font-size: 7.5px; font-weight: 900; background: rgba(99, 102, 241, 0.18); border: 1px solid rgba(99, 102, 241, 0.45); color: #312e81; padding: 1px 4px; border-radius: 3px; display: inline-block; vertical-align: middle; margin-left: 3px; margin-right: 4px; line-height: 1;">AI</span><span style="display: inline-block; vertical-align: middle;">· Kurumsal İletişim</span>
            </div>

            <!-- İletişim Bilgileri: TEK SATIRDA, SADECE TEL | WEB | E-POSTA (HEPSİ SİYAH / #0f172a) -->
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12.5px; color: #0f172a;">
              <tr>
                <td style="padding-bottom: 4px; white-space: nowrap;">
                  <span style="color: #0f172a; font-weight: 700;">Tel:</span> 
                  <a href="tel:+905073205781" style="color: #0f172a; text-decoration: none; font-weight: 600;">+90 507 320 57 81</a>
                  <span style="color: #cbd5e1; margin: 0 8px;">|</span>
                  <span style="color: #0f172a; font-weight: 700;">Web:</span> 
                  <a href="https://volreonai.com" style="color: #0f172a; text-decoration: none; font-weight: 600;">volreonai.com</a>
                  <span style="color: #cbd5e1; margin: 0 8px;">|</span>
                  <span style="color: #0f172a; font-weight: 700;">E-posta:</span> 
                  <a href="mailto:okan.ari@volreonai.com" style="color: #0f172a; text-decoration: none; font-weight: 600;">okan.ari@volreonai.com</a>
                </td>
              </tr>
            </table>

            <!-- Güven ve Gizlilik İbaresi -->
            <div style="font-size: 10.5px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 6px; margin-top: 4px;">
              🔒 Meta Business API Entegrasyonu · KVKK Uyumlu Otonom Altyapı
            </div>
          </td>
        </tr>
      </table>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 14px 0;">
      <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin: 0;">Bu e-posta, işletmenizin internete açık kurumsal iletişim bilgileri üzerinden B2B bilgilendirme amacıyla iletilmiştir. Tekrar e-posta almak istemiyorsanız lütfen bu e-postayı "İptal" yazarak yanıtlayınız.</p>
    </div>
  `;

  const bodyText = `Merhaba ${name},

${painPoint.replace(/<\/?[^>]+(>|$)/g, "")}

VOLREON AI olarak sektörünüze özel geliştirdiğimiz yapay zeka asistanları ile:
${solutionBullets.map(b => '- ' + b.replace(/<\/?[^>]+(>|$)/g, "")).join('\n')}

Mevcut numaranızı değiştirmeden 24 saatte devreye alabiliyoruz.
Canlı bir demo için bu e-postaya yanıt vermeniz yeterlidir.

Saygılarımla,

Okan Arı
KURUCU & YAPAY ZEKA SİSTEM MİMARI
VOLREON AI · Kurumsal İletişim
Tel: +90 507 320 57 81 | Web: https://volreonai.com | E-posta: okan.ari@volreonai.com`;

  return { subject, bodyHtml, bodyText };
}

module.exports = { getEmailContent };
