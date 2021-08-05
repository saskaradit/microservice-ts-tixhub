import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { ExpirationCompleteSubscriber } from './events/subscribers/expiration-complete-subscriber'
import { TicketCreatedSubscriber } from './events/subscribers/ticket/ticket-created-subscriber'
import { TicketUpdatedSubscriber } from './events/subscribers/ticket/ticket-updated-subscriber'
import { ProductCreatedSubscriber } from './events/subscribers/product/product-created-subscriber'
import { ProductUpdatedSubscriber } from './events/subscribers/product/product-updated-subscriber'

const init = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new TicketCreatedSubscriber(natsWrapper.client).listen()
    new TicketUpdatedSubscriber(natsWrapper.client).listen()
    new ProductCreatedSubscriber(natsWrapper.client).listen()
    new ProductUpdatedSubscriber(natsWrapper.client).listen()
    new ExpirationCompleteSubscriber(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected')
  } catch (error) {
    console.error(error)
  }

  app.listen(3000, () => console.log('---ORDERS---,Listening on port 3000'))
}

init()

// kubectl create secret generic jwt-secret --from-literal=JWT_KEY=radrad
