const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 3001;

// PostgreSQL bağlantı bilgileri
const PG_CONFIG = {
    user: 'user',
    host: 'db',
    database: 'app',
    password: 'password',
    port: 5432,
};

// Middleware
app.use(bodyParser.json());

// PostgreSQL veritabanı bağlantısı
const pool = new Pool(PG_CONFIG);

// Yeni öğrenci ekleme
app.post('/students', async (req, res) => {
    try {
        const { name, age } = req.body;
        // Veritabanına yeni öğrenci ekleme
        const query = 'INSERT INTO students (name, age) VALUES ($1, $2)';
        await pool.query(query, [name, age]);
        res.status(201).json({
            status: 'success',
            message: 'Student added successfully'
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add student'
        });
    }
});

// Tüm öğrencileri getirme
app.get('/students', async (req, res) => {
    try {
        // Veritabanından tüm öğrencileri getirme
        const query = 'SELECT * FROM students';
        const result = await pool.query(query);
        res.status(200).json({
            status: 'success',
            students: result.rows
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch students'
        });
    }
});

// RabbitMQ'ya bağlanma ve mesajları dinleme
const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE_NAME = 'trigger_queue';

amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        channel.assertQueue(QUEUE_NAME, { durable: false });

        console.log('Client-app connected to RabbitMQ. Listening for messages...');

        // Mesajları dinleme
        channel.consume(QUEUE_NAME, async (msg) => {
            const message = msg.content.toString();
            console.log('Received message from RabbitMQ:', message);

            // Mesajı işleme
            // Burada gelen mesajı işleyebilir ve veritabanı işlemlerini gerçekleştirebilirsiniz

            // Örneğin, gelen mesajı parse edip veritabanına eklemek
            try {
                const data = JSON.parse(message);
                await addToDatabase(data);
            } catch (error) {
                console.error('Error processing message:', error);
            }

            // Mesajı aldığımızı RabbitMQ'ya bildirme (Opsiyonel)
            channel.ack(msg);
        });
    });
});

// Veritabanına ekleme işlemi
async function addToDatabase(data) {
    const { name, age } = data;
    const query = 'INSERT INTO students (name, age) VALUES ($1, $2)';
    await pool.query(query, [name, age]);
    console.log('Data added to PostgreSQL:', data);
}

// HTTP sunucusunu başlatma
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// RabbitMQ'ya bağlanma.
// İlgili kuyruğu dinleme.
// Alınan her mesajı işleme.
// Mesajın işlendiğini RabbitMQ'ya bildirme.