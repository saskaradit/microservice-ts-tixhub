const LandingPage = ({ currentUser }) =>
  currentUser ? <h1>You are signed in</h1> : <h1>Please sign in</h1>

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {}
}

export default LandingPage
