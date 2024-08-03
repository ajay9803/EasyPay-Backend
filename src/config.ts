import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

// Configurations for port, jwt-secret and tokens, database, email-service and firebase
const config = {
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    accesstoken_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshtoken_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  },
  database: {
    DB_CLIENT: process.env.DB_CLIENT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PW: process.env.DB_PW,
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME,
  },
  emailService: {
    USER_EMAIL: process.env.USER_EMAIL,
    USER_EMAIL_PASS: process.env.USER_EMAIL_PASS,
  },
  firebase: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
};

export default config;
