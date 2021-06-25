import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    // request made to http://ingress-nginx.ingress-nginx.svc.cluster.local
    const { data } = await axios.get(
      'http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser/api/users/currentuser',
      {
        headers: req.headers,
      }
    );

    return data;
  } else {
    // we are on the browser
    // request only to the context path
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }
};

export default LandingPage;
