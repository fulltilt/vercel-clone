import { exec } from "child_process";
import path from "path";
import fs from "fs";

export function buildProject(id: string) {
  return new Promise((resolve, reject) => {
    console.log(
      `cd ${path.join(
        __dirname,
        `output/${id}`
      )} && npm install && npm run build`
    );
    const child = exec(
      `cd ${path.join(
        __dirname,
        `output/${id}`
      )} && npm install && npm run build`
    );

    child.stdout?.on("data", function (data) {
      console.log(`stdout: ${data}`);
    });

    child.stderr?.on("data", function (data) {
      console.log(`stderr: ${data}`);
      reject(data);
    });

    child.on("close", function (code) {
      resolve(code);
    });
  });
}

export function getAllFilesInDirectory(dirPath: string) {
  let files: string[] = [];

  // Read contents of the directory
  const fileNames = fs.readdirSync(dirPath);

  fileNames.forEach((fileName: string) => {
    // Get the full path of the file
    const filePath = path.join(dirPath, fileName);

    // Get the stats of the file
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      // If it's a file, add it to the list
      files.push(filePath);
    } else if (stats.isDirectory()) {
      // If it's a directory, recursively call this function
      // and merge the result with the current list of files
      files = files.concat(getAllFilesInDirectory(filePath));
    }
  });

  return files;
}
