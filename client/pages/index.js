import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  axios.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    // we are on the server
    // request made to http://ingress-nginx.ingress-nginx.svc.cluster.local
  } else {
    // we are on the browser
    // request only to the context path
  }
  const response = await axios.get(
    'http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser'
  );

  console.log('Im on the landing page');

  return response.data;
};

export default LandingPage;
