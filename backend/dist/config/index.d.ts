interface CorsOptions {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
}
interface Config {
    port: number;
    databaseUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    nodeEnv: string;
    cors: CorsOptions;
}
export declare const config: Config;
export default config;
//# sourceMappingURL=index.d.ts.map