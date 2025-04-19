import { v2 as cloudinary } from "cloudinary";

import multer from "multer";

import { Readable } from "stream";

//this is cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const imageUploadUtils = async (file) => {
  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  const result = await streamUpload();
  return result;
};
