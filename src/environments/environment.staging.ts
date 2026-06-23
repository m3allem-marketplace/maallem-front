import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://maallem-backend.vercel.app/api/v1',
  pusher: {
    key: '9a5cc772ee86fc417d71',
    cluster: 'ap2',
  }
};
