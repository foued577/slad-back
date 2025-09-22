export function loadEnvironment() {
    const { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, NODE_ENV, } = process.env;
    if (!MONGODB_URI)
        throw new Error("MONGODB_URI is not set");
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET is not set");
    return {
        port: PORT ? Number(PORT) : 4000,
        mongoUri: MONGODB_URI,
        jwtSecret: JWT_SECRET,
        jwtExpiresIn: JWT_EXPIRES_IN ?? "15m",
        jwtRefreshExpiresIn: JWT_REFRESH_EXPIRES_IN ?? "7d",
        nodeEnv: NODE_ENV ?? "development",
    };
}
