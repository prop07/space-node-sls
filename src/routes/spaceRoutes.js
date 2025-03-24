import express from "express";
import { createSpace, getSpaceByCode } from "../controllers/spaceController.js";

const router = express.Router();

// Define routes
router
  .route("/space")
  .get(createSpace)
  .post(getSpaceByCode)
  .all((req, res) => {
    res.status(405).json({ status: "error", message: "Method not allowed" });
  });

export default router;
