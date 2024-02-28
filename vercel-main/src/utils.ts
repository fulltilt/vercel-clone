const fs = require("fs");
const path = require("path");

const MAX_LEN = 5;
export function generate() {
  let ans = "";
  const subset = "1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < MAX_LEN; ++i) {
    ans += subset[Math.floor(Math.random() * subset.length)];
  }

  return ans;
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
