Genel Bakış
Bu doküman, Financial House ödeme sistemine entegrasyon için gerekli teknik detayları içermektedir. Entegrasyon süreci aşağıdaki adımları içerir:
1. Ödeme başlatma (Checkout Initialize)

2. Ödeme sayfasına yönlendirme (Redirect URL)
3. İşlem sonucu bildirimi (IPN - Instant Payment Notification)

1. Ödeme Başlatma (Checkout Initialize)

Endpoint
POST https://sandbox-wallet.financialhouse.io/v2/checkout/initialize
Request Format
Aşağıdaki JSON formatında istek gönderilmelidir:
{
"apiKey": "1947d5b4950e4a6ba27c1ddd8cf9b5f1",
"amount": 100.10,
"currency": "GBP",
"country": "GB",
"dateOfBirth": "1986-05-22",
"defaultPaymentMethod": "CARD",
"email": "test@gmail.com",
"failRedirectUrl": "https://google.com.tr",
"firstName": "John",
"lastName": "Doe",
"referenceNo": "12345test234324231",
"successRedirectUrl": "https://msn.com.tr",
"address": "80 Neal Street Covent Garden",
"city": "London",
"postCode": "WC2E 8DD",
"language": "EN"
}
Parametre Detayları
Parametre Tür Açıklama Statik/Dinamik

apiKey String API anahtarı Statik
(1947d5b4950e4a6ba27c1ddd8cf9b5f1)
amount Decimal İşlem tutarı Dinamik (formdan alınacak)
currency String Para birimi Statik (GBP)
country String Ülke kodu Statik (GB)
dateOfBirth String Doğum tarihi (YYYY-MM-DD) Statik (1986-05-22)
defaultPaymentMethod String Varsayılan ödeme yöntemi Statik (CARD)
email String Müşteri e-posta adresi Dinamik (formdan alınacak)

failRedirectUrl String Başarısız işlem yönlendirme URL'i Statik (https://google.com.tr)
firstName String Müşteri adı Dinamik (formdan alınacak)
lastName String Müşteri soyadı Dinamik (formdan alınacak)

referenceNo String Benzersiz işlem referans
numarası Dinamik (random trx ID oluşturulacak)
successRedirectUrl String Başarılı işlem yönlendirme URL'i Statik (https://msn.com.tr)
address String Adres Statik (80 Neal Street Covent Garden)
city String Şehir Statik (London)
postCode String Posta kodu Statik (WC2E 8DD)
language String Dil Statik (EN)
Parametre Tür Açıklama Statik/Dinamik

Örnek cURL İsteği
curl --location 'https://sandbox-wallet.financialhouse.io/v2/checkout/initialize' \
--header 'Content-Type: application/json' \
--data-raw '{
"apiKey": "1947d5b4950e4a6ba27c1ddd8cf9b5f1",
"amount": 100.10,
"currency": "GBP",
"country": "GB",
"dateOfBirth": "1986-05-22",
"defaultPaymentMethod": "CARD",
"email": "test@gmail.com",
"failRedirectUrl": "https://google.com.tr",
"firstName": "John",
"lastName": "Doe",
"referenceNo": "12345test234324231",
"successRedirectUrl": "https://msn.com.tr",
"address": "80 Neal Street Covent Garden",
"city": "London",
"postCode": "WC2E 8DD",
"language": "EN"
}'
Response Format
{
"token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlNmNkNjVkZjFiZjg0NWNmYmM1YjcwMTlmYzczNzZkMyIsImF1ZCI6IndhbGxldCIsIm5iZiI6MTc0NzA0MzUzMCwicmVzb3VyY2UiOiJBUFAiLCJyb2x"redirectUrl": "https://sandbox-checkout.financialhouse.io/init-payment?token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlNmNkNjVkZjFiZjg0NWNmYmM1YjcwMTlmYzczNzZkMyIsImF1ZCI6IndhbGxldCIsIm5iZiI6MTc0NzA0MzUzMCwicmVzb3VyY2UiOiJBUFAiLCJyb2x"transactionId": "0dc334a49cc74af0a86a703c647239bc",
"code": "00000",
"message": "APPROVED",
"status": "APPROVED"
}

2. Ödeme Sayfasına Yönlendirme
Başarılı bir initialize isteği sonrası, müşteri response içerisindeki redirectUrl adresine yönlendirilmelidir. Bu URL, ödeme sayfasını gösterecektir.
Ödeme işlemi tamamlandıktan sonra, işlem sonucuna göre müşteri:

Başarılı işlemde: successRedirectUrl adresine yönlendirilir
Başarısız işlemde: failRedirectUrl adresine yönlendirilir

3. IPN (Instant Payment Notification)

Genel Bilgi
IPN, işlem sonucunun otomatik olarak sisteminize bildirilmesini sağlar. Financial House, ödeme işlemi tamamlandığında sizin belirlediğiniz bir URL'e HTTP POST
isteği gönderir.
IPN Yapılandırması
Sisteminize entegrasyon sırasında, Financial House'a bir IPN URL'i sağlamalısınız. Bu URL'e ödeme işlemi sonuçları POST edilecektir.
IP Adresleri (Whitelist)
Güvenlik amacıyla, aşağıdaki IP adreslerini whitelist'e eklemeniz gerekmektedir:

Sandbox:
54.217.102.135
108.129.35.181
52.48.248.88
54.78.9.129
Production:
54.78.9.129
63.35.98.151
54.72.34.239
IPN Bildirimi Format
{
"code": "00000",
"status": "APPROVED",
"message": "APPROVED",
"transactionId": "d8597fdaa86349db8c4c9c771e98146f",
"referenceNo": "1589793156",
"paymentMethod": "CARD",
"timestamp": "1589793197",
"amount": "50.00",
"currency": "GBP",
"email": "integration@mail.com",
"token": "c1bd66a82723c665743f8c7a4adbdb93",
"tokenExtended": "1e4c4872e30ec7443ff92345030272c5",
"creditCardPreAuth": null,
"refundUrl": null
}
IPN Statü Değerleri
IPN bildirimlerinde iki farklı statü değeri bulunur:

APPROVED : İşlem başarıyla tamamlandı
DECLINED : İşlem reddedildi

IPN İşleme Adımları
1. IPN URL'inize gelen POST isteğini alın
2. transactionId ve referenceNo değerlerini kullanarak işlemi kendi sisteminizde eşleştirin
3. status değerine göre işlemi başarılı veya başarısız olarak işaretleyin
4. Sisteminizdeki ilgili kayıtları güncelleyin (sipariş durumu, ödeme kaydı vb.)
5. İsteğe başarılı bir HTTP yanıtı döndürün (200 OK)
Önemli Notlar
1. Tüm isteklerde Content-Type header'ı 'application/json' olarak ayarlanmalıdır.

2. referenceNo her işlem için benzersiz olmalıdır.
3. Test işlemleri için sandbox ortamını kullanınız.
4. Canlı ortama geçmeden önce tüm senaryoları test ettiğinizden emin olunuz.

Entegrasyon Kontrol Listesi
Initialize endpoint'ine istek gönderebilme
Yönlendirme URL'ine müşteriyi yönlendirebilme

IPN URL'ini oluşturma ve Financial House'a bildirme
IPN bildirimlerini işleyebilme
IP whitelist'ini yapılandırma