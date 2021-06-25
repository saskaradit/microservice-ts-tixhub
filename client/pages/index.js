import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) =>
  currentUser ? <h1>You are signed in</h1> : <h1>Please sign in</h1>

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')

  return data
}

export default LandingPage
