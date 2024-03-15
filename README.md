# homework_app
![WhatsApp Image 2024-03-09 at 13 44 47](https://github.com/Aleyna06/homework_app/assets/77541289/8055e3f6-b2b3-4376-9fd8-c8dd0747acd2)

Proje, üç farklı Docker konteyneri üzerinde çalışan bir mikrohizmet mimarisini içeriyor: client-app, provider-app ve db-app.



client-app: Bu uygulama, HTTP isteklerini dinleyerek bir mesaj gönderir. Bu mesaj, RabbitMQ kuyruğuna gönderilir. Bir HTTP isteği alındığında, RabbitMQ'ya bir mesaj gönderme işlemi gerçekleştirilir.



provider-app: Bu uygulama, RabbitMQ kuyruğundan mesajları dinler. Bir mesaj alındığında, işlenir ve RabbitMQ'ya aldığı mesajın işlendiğini bildirir.



db-app: Bu uygulama, PostgreSQL veritabanı ile etkileşimde bulunur. Veritabanında öğrenci bilgilerini saklar, günceller ve siler.



Bu üç uygulama, birlikte çalışmak için Docker kullanılarak konteynerize edilmiştir. Docker Compose kullanılarak bu üç konteyner bir araya getirilir ve birlikte çalıştırılır. Projenin Docker Compose dosyası, her bir uygulamanın Docker imajlarını oluşturur ve bu 
konteynerlerin birbirleriyle iletişim kurmasını sağlar. Her uygulama, kendi Dockerfile'ına sahiptir ve kendi bağımsız konteynerinde çalışır.



Bu şekilde, her bir uygulama kendi işlevselliğini sağlar ve birbiriyle bağımsız olarak ölçeklendirilebilir. Ayrıca, Docker konteynerleri aracılığıyla uygulamaları taşımak ve dağıtmak kolaydır, çünkü her uygulama kendi bağımsız ortamında çalışır.

Projeye ait ekran görüntüleri 

![WhatsApp Image 2024-03-15 at 17 34 17](https://github.com/Aleyna06/homework_app/assets/77541289/115f5c4c-edab-4aba-8804-37092b2074e3)


![WhatsApp Image 2024-03-15 at 20 01 31](https://github.com/Aleyna06/homework_app/assets/77541289/c05f992d-ea8d-4d8c-857d-8d4da80c0329)


![WhatsApp Image 2024-03-15 at 20 01 00](https://github.com/Aleyna06/homework_app/assets/77541289/248bff7b-583f-4e19-a083-b4cb6947d262)
