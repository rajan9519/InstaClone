const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const mongoURI = require("../keys").MONGO_URL;

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        req.filename = filename;
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

module.exports = upload;
