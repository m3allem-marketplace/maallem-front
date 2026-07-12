export interface Environment {
  production: boolean;
  apiUrl: string;
  storeApiUrl: string;
  pusher?: {
    key: string;
    cluster: string;
  };
}
