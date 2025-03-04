import { configDotenv } from "dotenv";

configDotenv();

export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ??
  "780217101047-ekiiri3kkmbk991nlcpmniqeusi80tuv.apps.googleusercontent.com";
