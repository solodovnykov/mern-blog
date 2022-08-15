import fs from "fs";
import sharp from "sharp";
import path from "path";

export const deleteImage = async (req, res) => {
  try {
    const url = req.params.imageUrl;

    fs.access(`./uploads/resized/${url}`, (error) => {
      if (error) {
        console.warn(error);
      } else {
        fs.unlinkSync(`./uploads/resized/${url}`);
      }
    });

    res.status(200).send("Image was deleted.");
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { filename: image } = req.file;

    await sharp(req.file.path)
      .resize({
        width: 1920,
        fit: sharp.fit.contain,
      })
      .webp({ quality: 80 })
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);

    res.json({
      url: `/uploads/resized/${image}`,
    });
  } catch (error) {
    console.log(error);
  }
};
