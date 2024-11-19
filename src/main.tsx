import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-g3qtue2ymqd1uqxf.us.auth0.com"
      clientId="gNwDzMsg3yr0qug7ycpYDSLYVdIzUX9z"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-g3qtue2ymqd1uqxf.us.auth0.com/api/v2/",
        scope: "openid profile email read:clients create:users"
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);