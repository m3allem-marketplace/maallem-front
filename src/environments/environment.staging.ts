import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://maallem-backend.vercel.app/api/v1',
  storeApiUrl: 'https://m3allem-store-dashboard.vercel.app/api',
  pusher: {
    key: '9a5cc772ee86fc417d71',
    cluster: 'ap2',
  }
};
