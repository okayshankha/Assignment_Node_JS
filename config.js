module.exports = {
    PORT: parseInt(process.env.PORT),

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRY: process.env.JWT_EXPIRY,

    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,

    DATABASE_NAME: process.env.DATABASE_NAME,

    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),

    ALPHAVANTAGE_API_KEY: process.env.ALPHAVANTAGE_API_KEY,
}