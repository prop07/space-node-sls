import * as dotenv from 'dotenv';
dotenv.config();
import serverless from 'serverless-http';
import express from "express"
import { v4 as uuidv4 } from 'uuid';
const app = express();
app.use(express.json());

import http from "http";
import {neon } from"@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const serverStartTime = new Date();

app.get("/", async (req, res) => {
  const startDate = serverStartTime.toISOString().split("T")[0]; // YYYY-MM-DD
  const startTime = serverStartTime.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS

  const currentTime = new Date();
  const runTimeInMs = currentTime - serverStartTime; // runtime in milliseconds
  const runTimeInSec = Math.floor(runTimeInMs / 1000); // convert to seconds
  const runTimeInMin = Math.floor(runTimeInSec / 60); // convert to minutes
  const runTimeInHours = Math.floor(runTimeInMin / 60); // convert to hours
  const runTimeInDays = Math.floor(runTimeInHours / 24); // convert to days

  res.send(`
      <html>
          <head>
              <title>Server Start Time</title>
          </head>
          <body>
              <h1>Server Start Details</h1>
              <p><strong>Start Date:</strong> ${startDate}</p>
              <p><strong>Server Runtime:</strong> ${runTimeInDays} days, ${runTimeInHours % 24} hours, ${runTimeInMin % 60} minutes, ${runTimeInSec % 60} seconds</p>
          </body>
      </html>
  `);
});
app.get("/spaceList", async (req, res, next) => {
  try {
    const users = await sql`SELECT * FROM "app_space" `; // Replace 'users' with your actual table name
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Database query failed", details: error.message });
  }
});

app.get('/home', (req, res) => {
  res.send('GET request to the homepage')
})

app.route('/space')
  .get(async (req, res) => {
    console.log("hello");
    try {
      const space_code = uuidv4();
      const view_code = uuidv4();
      const created_date = new Date();
      console.log(created_date);
      
      const new_space = await sql`
        INSERT INTO "app_space" (code, view_code, created_date)
        VALUES (${space_code}, ${view_code}, ${created_date})
        RETURNING *`;
      
      console.log(new_space);
      res.status(201).json({
        status: "success",
        data: {
          space_code: new_space[0].code,
          view_code: new_space[0].view_code,
          date: new_space[0].created_date,
        },
        message: "Space successfully created.",
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  })
  .post(async (req, res) => {
    const { space_code } = req.body || {};
    console.log(req.body);

    if (!space_code) {
      return res.status(400).json({ status: "error", message: "space_code is required" });
    }

    try {
      const space = await sql`SELECT * FROM "app_space" WHERE code = ${space_code}`;
      if (space.length > 0) {
        return res.status(200).json({
          status: "success",
          message: "Space found.",
          data: { space_code },
        });
      }
      res.status(404).json({ status: "error", message: "Invalid space." });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  })
  .all((req, res) => {
    res.status(405).json({ status: "error", message: "Method not allowed" });
  });

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, () => console.log("http://localhost:3000"));


export const handler = serverless(app);
