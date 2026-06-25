interface CorsOptions {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

interface DatabaseConfig {
  type: 'postgres' | 'mssql' | 'mysql' | 'sqlite';
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

interface Config {
  port: number;
  database: DatabaseConfig;
  jwtSecret: string;
  jwtExpiresIn: string;
  nodeEnv: string;
  cors: CorsOptions;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    type: (process.env.DB_TYPE as DatabaseConfig['type']) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    name: process.env.DB_NAME || 'bar_pos',
  },
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
};

export default config;
