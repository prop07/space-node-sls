import { v4 as uuidv4 } from "uuid";
import { db } from "../config/db.js";

export const createSpace = async (req, res) => {
  const space_code = uuidv4();
  const view_code = uuidv4();
  const created_date = new Date();

  try {
    const new_space = await db`
      INSERT INTO "app_space" (code, view_code, created_date)
      VALUES (${space_code}, ${view_code}, ${created_date})
      RETURNING *`;

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
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getSpaceByCode = async (req, res) => {
  const { space_code } = req.body;

  if (!space_code) {
    return res
      .status(400)
      .json({ status: "error", message: "space_code is required" });
  }

  try {
    const space =
      await db`SELECT * FROM "app_space" WHERE code = ${space_code}`;
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
};
