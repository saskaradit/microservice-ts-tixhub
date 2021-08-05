import Link from 'next/link'

const LandingPage = () => {
  return (
    <div>
      <div className='jumbotron mb-4'>
        <img
          src='https://www.monsterenergy.com/media/uploads_image/2017/05/24/1600/800/6667b5e33ecf0270ac29015d09f0558b.jpg?mod=v1_a8a93ca8509709aefa5c593196cdd1a4'
          alt=''
          className='card-img-top mb-3'
        />
        <h1 className='display-4'>Welcome to Tixhub</h1>
        <p className='lead'>
          Tixhub is a marketplace where you can create tickets and create events
          anytime you want without any strings attached
        </p>
        <hr className='my-4' />
        <p>Try Tixhub Now</p>
        <Link href='/tickets'>
          <a className='btn btn-warning' href='#' role='button'>
            Buy Tickets
          </a>
        </Link>
      </div>
    </div>
  )
}

// LandingPage.getInitialProps = async (context, client, currentUser) => {
//   const { data } = await client.get('/api/tickets')
//   return { tickets: data }
// }

export default LandingPage
