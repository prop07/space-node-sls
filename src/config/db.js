import * as dotenv from "dotenv";
dotenv.config();
import { neon } from "@neondatabase/serverless";

export const db = neon(process.env.DATABASE_URL);
