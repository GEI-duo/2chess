import '@/i18n';
import '@/main.css';

import ReactDOM from 'react-dom/client';

import App from '@/App.tsx';
import { appPath } from '@/basePath';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(appPath('/sw.js'));
    });
  } else {
    navigator.serviceWorker
      .getRegistrations()
      .then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      })
      .catch(() => {
        // Ignore SW cleanup errors in development.
      });
  }
}
