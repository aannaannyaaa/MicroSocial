import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/microsocial",
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpire: process.env.JWT_EXPIRE as string,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:19006"
};
