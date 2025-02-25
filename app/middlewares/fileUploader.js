const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."),
      false
    );
  }
  cb(null, true);
};

// const upload =   multer({
//     storage,
//     fileFilter,
//     limits: { fieldSize: 50 * 1024 * 1024 }
// }).array("images", 10);

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
}).fields([
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 10MB
//   }).fields([
//     { name: "images", maxCount: 10 }, // Accept up to 10 images
//     { name: "videos", maxCount: 5 }   // Accept up to 5 videos
//   ]);

const convertImagesToWebP = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      const promises = req.files.map(async (file) => {
        const webpBuffer = await sharp(file.buffer).webp().toBuffer();
        file.buffer = webpBuffer;
        file.mimetype = "image/webp";
        file.originalname = path.parse(file.originalname).name + ".webp";
      });

      await Promise.all(promises);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, convertImagesToWebP };

