import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS Connection Closed')
    process.exit()
  })

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('orders-service')

  const subscription = stan.subscribe('ticket:created', 'orders-queue', options)

  subscription.on('message', (msg: Message) => {
    const data = msg.getData()

    if (typeof data == 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }
    console.log('Mesage Received')

    msg.ack()
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
