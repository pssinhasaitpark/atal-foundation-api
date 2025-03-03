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


const upload = multer({
  storage,
      // fileFilter,
      limits: { fieldSize: 50 * 1024 * 1024 }
}).fields([
  { name: "images", maxCount: 10 }, 
  { name: "detailImages", maxCount: 10 }, 
  { name: "videos", maxCount: 5 },  
  { name: "banner", maxCount: 1 },
]);

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


const convertImagesToWebPMultiple = async (req, res, next) => {
  try {


    if (!req.files || req.files.length === 0) {
      return handleResponse(res, 400, "No files were uploaded.");
    }


    const promises = Object.keys(req.files).map(async (field) => {

      const files = req.files[field];

      for (const file of files) {
        const webpBuffer = await sharp(file.buffer)
          .webp()
          .toBuffer();

        file.buffer = webpBuffer;
        file.mimetype = "image/webp";
        file.originalname = path.parse(file.originalname).name + ".webp";
      }
    });




    await Promise.all(promises);

    next();
  }
  catch (err) {
    console.error(err);
    next(err);
  }
};


module.exports = { upload, convertImagesToWebP ,convertImagesToWebPMultiple};


// const upload =   multer({
//     storage,
//     fileFilter,
//     limits: { fieldSize: 50 * 1024 * 1024 }
// }).array("images", 10);


// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 }, 
// }).fields([
//   { name: "banner", maxCount: 1 },
//   { name: "images", maxCount: 10 },
// ]);