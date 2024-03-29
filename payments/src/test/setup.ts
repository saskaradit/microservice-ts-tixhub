import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

declare global {
  var signin: (id?: string) => string[]
}

jest.mock('../nats-wrapper')
process.env.STRIPE_KEY =
  'k_test_51Hp4eGErCpQSuQA2UjLd1wZkyFKOQQyryZBDwCNK70WZFhWNm2UsXsrOTSGKmm85dNM7PMhxrmAV7DkDfMcmITgA00JCRTTLwi'

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'jengjetsz'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection
})

global.signin = (id?: string) => {
  // Build JWT Payload {id,email,username}
  id = id || new mongoose.Types.ObjectId().toHexString()
  const payload = {
    id,
    email: 'rad@rad.com',
    username: 'saskarad',
  }

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build Session {jwt: MY_JWT}
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a encoded cookie string
  return [`express:sess=${base64}`]
}
