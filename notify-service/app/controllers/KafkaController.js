const {Kafka} = require('kafkajs')
const kafkaPort = process.env.KAFKA_PORT || 9092;
const Host = process.env.KAFKA_HOST || 'localhost';
const kafkaToken = process.env.KAFKA_TOKEN || 'token';
const kafka = new Kafka(
    {
        clientId: 'question-service',
        brokers: [`${Host}:${kafkaPort}`],
        ssl: true
    }
)


class KafkaController {
    producer(topic, key, value) {
        const producer = kafka.producer()
        async function sendMessage() {
            await producer.connect()
            await producer.send({
                topic: topic,
                messages: [{
                    key: key, 
                    value: value,
                    headers: {
                        'kafka-token': kafkaToken,
                    }
                }]
            })
            await producer.disconnect();
        }
        return sendMessage;
    }

    consumer(topic) {
        const consumer = kafka.consumer();
        async function receiveMessage() {
            var receive
            await consumer.connect({groupId: 'chat-service'});
            await consumer.subcribe({topic: topic})
            await consumer.run({
                eachMessage: async ({topic, partition, message}) => {
                    if (message.headers['kafka-token'] === kafkaToken) {
                        receive = message;
                    }
                }
            })
            return receive;
        }
        return receiveMessage
    }
}

module.exports = new KafkaController;