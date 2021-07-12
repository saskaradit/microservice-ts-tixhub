import nats from 'node-nats-streaming'

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Publisher Connected to NATS')

  const data = JSON.stringify({
    id: '123',
    title: 'Jengjet',
    price: 9090,
  })

  stan.publish('ticket:created', data, () => {
    console.log('Event Published')
  })
})

// kubectl port-forward <pods-name> <host-port / (4222)>:4222
