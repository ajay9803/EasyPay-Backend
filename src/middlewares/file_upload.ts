import multer, { FileFilterCallback } from "multer";
import { Request, Response } from "express";

/**
 * Filters the uploaded file based on its mimetype.
 *
 * @param {Request} req - The request object.
 * @param {Express.Multer.File} file - The uploaded file.
 * @param {FileFilterCallback} cb - The callback function to be called after the file is filtered.
 * @return {void}
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer upload middleware
const uploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

export default uploader;
