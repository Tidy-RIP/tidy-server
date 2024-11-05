import dotenv from 'dotenv';

dotenv.config();
//CORS
export const CORS_ORIGIN = process.env.CORS_ORIGIN;

//Databases
export const DB_HOST = process.env.DB_HOST || 3000;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_USER = process.env.DB_USER;

//SecretKey
export const SECRET_KEY = process.env.SECRET_KEY;

//PORT
export const PORT = process.env.PORT;

//RESEND
export const API_KEY_RESEND = process.env.API_KEY_RESEND;
