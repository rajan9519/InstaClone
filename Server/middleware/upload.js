const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path = require("path");
const multer = require("multer");

const key = require("../config/key");

const storage = multer.memoryStorage();
const formParser = multer({ storage });

cloudinary.config({
  cloud_name: key.CLOUDINARY_CLOUD_NAME,
  api_key: key.CLOUDINARY_API_KEY,
  api_secret: key.CLOUDINARY_API_SECRET,
});

const removeImage = (name) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources([name], (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (result.deleted[name] == "deleted") {
          resolve({ result: "deleted successfully" });
        } else {
          reject({ error: "unable to delete" });
        }
      }
    });
  });
};

const uploadImage = (req) => {
  return new Promise((resolve, reject) => {
    const extension = path.extname(req.file.originalname);

    if ([".jpeg", ".jpg", ".png"].includes(extension)) {
      const file = parser.format(
        path.extname(req.file.originalname).toString(),
        req.file.buffer
      ).content;

      cloudinary.uploader
        .upload(file, { folder: "insta" })
        .then((result) => resolve(result))
        .catch((err) => {
          reject(err);
        });
    } else {
      reject({ error: "File type not allowed" });
    }
  });
};
module.exports = { uploadImage, removeImage, formParser };
