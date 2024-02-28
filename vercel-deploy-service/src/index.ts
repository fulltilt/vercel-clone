import { createClient, commandOptions } from "redis";
import path from "path";
import { downloadS3Folder, uploadToS3 } from "./aws";
import { buildProject, getAllFilesInDirectory } from "./utils";

import "dotenv/config";

const subscriber = createClient();
subscriber.connect();
const publisher = createClient();
publisher.connect();

async function main() {
  while (true) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );

    // @ts-ignore
    const id = res.element;

    // await downloadS3Folder(`output/${id}`);

    // try {
    //   const res2 = await buildProject(id);
    //   console.log("Project built", res2);
    // } catch (err) {
    //   console.log(err);
    // }

    const outputDir = path.join(__dirname, `output/${id}/dist`);
    const files = getAllFilesInDirectory(outputDir);

    // try {
    //   files.forEach(
    //     async (file) =>
    //       await uploadToS3(
    //         `dist/${id}/${file.slice(outputDir.length + 1)}`,
    //         file
    //       )
    //   );
    // } catch (err) {
    //   console.log(err);
    // }

    publisher.hSet("status", id, "deployed");

    console.log("Uploaded dist files to s3");
  }
}

main();
