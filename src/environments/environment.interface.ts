export interface Environment {
  production: boolean;
  apiUrl: string;
  pusher?: {
    key: string;
    cluster: string;
  };
}
