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
      
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; margin-bottom: 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td style="border-left: 3px solid #6366f1; padding: 10px 0 10px 18px;">
            <div style="font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.3; letter-spacing: -0.3px;">Okan Arı</div>
            <div style="font-size: 12px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; margin-bottom: 12px;">Kurucu | VOLREON AI</div>
            <div style="font-size: 13px; color: #64748b; line-height: 2;">
              <div>🌐 <a href="https://volreonai.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">volreonai.com</a></div>
              <div>📞 <a href="tel:+905073205781" style="color: #475569; text-decoration: none;">+90 507 320 57 81</a></div>
              <div>✉️ <a href="mailto:okan.ari@volreonai.com" style="color: #475569; text-decoration: none;">okan.ari@volreonai.com</a></div>
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
Kurucu | VOLREON AI
Web: https://volreonai.com | Tel: +90 507 320 57 81`;

  return { subject, bodyHtml, bodyText };
}

module.exports = { getEmailContent };
