import serverless from "serverless-http";
import express from "express";
import spaceRoutes from "./src/routes/spaceRoutes.js";
const app = express();
app.use(express.json());

// Use routes
app.use(spaceRoutes);

app.get("/", async (req, res) => {
  res.send(`
      <html>
          <head>
              <title>Server Start Time</title>
          </head>
          <body>
              <p>Running</p>
          </body>
      </html>
  `);
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, () => console.log("Running app on\nhttp://localhost:3000"));

export const handler = serverless(app);
