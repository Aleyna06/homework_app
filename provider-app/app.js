// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const PORT = 3002;

// Middleware
app.use(bodyParser.json());

// RabbitMQ bağlantı bilgileri
const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE_NAME = 'trigger_queue'; // Kuyruk adı
 
// HTTP endpoint for triggering the message
app.post('/trigger-message', (req, res) => {

  // Gönderilecek mesaj içeriği
  const name  = req.body.name
  const age   = req.body.age



  // RabbitMQ'ya mesaj gönderme
  sendMessageToRabbitMQ(JSON.stringify({name, age}));

  // Başarılı yanıt döndürme
  res.status(200).send('Message sent successfully.');
});

// RabbitMQ'ya mesaj gönderme fonksiyonu
function sendMessageToRabbitMQ(data) {
  amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      if (data !== undefined) {
        channel.sendToQueue(QUEUE_NAME, Buffer.from(data));
        console.log("Message sent to RabbitMQ:", data);
      } else {
        console.error("Message is undefined. Cannot send to RabbitMQ.");
      }
    });
    setTimeout(() => {
      connection.close();
    }, 500);
  });
}

// RabbitMQ'ya bağlanma ve mesajları dinleme
amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        channel.assertQueue(QUEUE_NAME, { durable: false });

        console.log('Provider-app connected to RabbitMQ. Waiting for messages...');

        // Mesajları dinleme
        channel.consume(QUEUE_NAME, (msg) => {
            const message = msg.content.toString();
            console.log('Received message:', message);

            // Mesajı işleme
            // Burada gelen mesajı işleyebilirsiniz

            // Mesajı aldığımızı RabbitMQ'ya bildirme (Opsiyonel)
            channel.ack(msg);
        });
    });
});

// HTTP sunucusunu başlatma
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/* Bu kod, /trigger-message endpoint'ine gelen POST isteklerini dinler.
 Kullanıcı buraya bir JSON objesi gönderir ve bu objenin içinde message anahtarına atanmış bir değer olmalıdır. 
 Gelen mesaj, sendMessageToRabbitMQ fonksiyonu aracılığıyla RabbitMQ'ya gönderilir. */