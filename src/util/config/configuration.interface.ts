export interface Configuration {
  node_env: string;

  port: number;

  database: {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    connectionLimit: number;
  };
}
