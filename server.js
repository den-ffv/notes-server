import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/router.js";
import dotenv from "dotenv";
import cron from "node-cron"
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

dotenv.config();

app.use("/api", router);

const databaseUrl = process.env.DATABASE_URL;

cron.schedule('0 0 * * *', async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deletedNotes = await Note.find({
      isDeleted: true,
      deleteAt: null,
      updatedAt: { $lt: sevenDaysAgo },
    });

    for (const note of deletedNotes) {
      await note.remove();
    }

    console.log('Outdated notes were removed');
  } catch (err) {
    console.error('Error while deleting outdated notes', err);
  }
})

const start = async () => {
  try {
    await mongoose.connect(databaseUrl);
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
