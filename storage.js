const fs = require("fs");

const restore = async (filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve({});
        } else {
          reject(err);
        }
      } else {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      }
    });
  });
};

const store = async (filePath, data) => {
  const dataString = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, dataString, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  restore,
  store,
};
