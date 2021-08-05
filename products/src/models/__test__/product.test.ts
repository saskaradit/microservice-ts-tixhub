import { Product } from '../products'

it('implements OCC', async () => {
  // Create a product
  const prod = Product.build({
    title: 'Album',
    price: 200,
    userId: '200',
    desc: 'its album',
  })

  await prod.save()

  // fetch product twice
  const firstProd = await Product.findById(prod.id)
  const secondProd = await Product.findById(prod.id)

  // make two changes to the products
  firstProd!.set({ price: 50 })
  secondProd!.set({ price: 50 })

  // save the first
  await firstProd!.save()

  // save the second and expect an error
  try {
    await secondProd!.save()
  } catch (err) {
    return console.log('Test Success')
  }

  throw new Error('Should not reach this point')
})

it('increments the version on multiple saves', async () => {
  const product = Product.build({
    title: 'Album',
    price: 200,
    userId: '200',
    desc: 'its album',
  })

  await product.save()
  expect(product.version).toEqual(0)
  await product.save()
  expect(product.version).toEqual(1)
  await product.save()
  expect(product.version).toEqual(2)
})
