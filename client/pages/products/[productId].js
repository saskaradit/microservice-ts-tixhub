import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import Link from 'next/link'

const ProductShow = ({ product, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: 'post',
    body: {
      productId: product.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  const getActions = () => {
    if (!currentUser) {
      return (
        <Link href='/auth/signup'>
          <button className='btn btn-primary'>Sign Up</button>
        </Link>
      )
    } else if (product.userId == currentUser.id) {
      return (
        <Link
          href='/products/update/[productId]'
          as={`/products/update/${product.id}`}
        >
          <button className='btn btn-primary'>Edit</button>
        </Link>
      )
    } else if (currentUser) {
      return (
        <button onClick={() => doRequest()} className='btn btn-primary'>
          Purchase
        </button>
      )
    }
  }

  return (
    <div>
      <img src={product.image} alt='' className='card-img-top' />
      <h1>{product.title}</h1>
      <h6>{product.schedule}</h6>
      <p>{product.desc}</p>
      <p>Price: {product.price}</p>
      {errors}
      <div>{getActions()}</div>
    </div>
  )
}

ProductShow.getInitialProps = async (context, client, currentUser) => {
  const { productId } = context.query
  const { data } = await client.get(`api/products/${productId}`)

  return { product: data }
}

export default ProductShow
