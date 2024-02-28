import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { uploadToS3 } from "./aws";
import { createClient } from "redis";

import { generate, getAllFilesInDirectory } from "./utils";

import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();

  // get absolute pathname
  const outputDir = path.join(__dirname, `output/${id}`);

  // create output directory and clone github project
  //   await simpleGit().clone(repoUrl, outputDir);

  // you can't upload directories to S3 so you have to upload files one by one
  //   const files = getAllFilesInDirectory(outputDir);

  //   try {
  //     files.forEach(
  //       async (file) => await uploadToS3(file.slice(__dirname.length + 1), file)
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   publisher.lPush("build-queue", id);
  //   publisher.hSet("status", id, "uploaded");
  publisher.lPush("build-queue", "c4trj");
  publisher.hSet("status", "c4trj", "uploaded");

  res.json({ id });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
