import Link from 'next/link'

const IndexProduct = ({ currentUser, products }) => {
  const ticketList = products.map((product) => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>
          <Link href='/products/[productId]' as={`/products/${product.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

IndexProduct.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products')
  return { products: data }
}

export default IndexProduct
