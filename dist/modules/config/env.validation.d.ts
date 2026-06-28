export declare enum Environment {
    Development = "development",
    Staging = "staging",
    Production = "production",
    Test = "test"
}
export declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    REFRESH_TOKEN_SECRET?: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    COOKIE_SECRET?: string;
    SWAGGER_ENABLED: boolean;
    LOG_LEVEL: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
