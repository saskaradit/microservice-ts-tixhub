import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher Connected to NATS')
  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'Jengjet',
      price: 9090,
    })
  } catch (error) {
    console.error(error)
  }
})

// kubectl port-forward <pods-name> <host-port / (4222)>:4222
