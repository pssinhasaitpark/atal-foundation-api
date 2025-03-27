const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const imageConversionMiddlewareMultiple = (req, res, next) => {
    const BASE_PATH = path.join(__dirname, "../uploads");

    if (!fs.existsSync(BASE_PATH)) {
        fs.mkdirSync(BASE_PATH, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, BASE_PATH);
        },
        filename: function (req, file, cb) {
            const fileNameWithoutExt = path.parse(file.originalname).name;
            cb(null, fileNameWithoutExt + Date.now() + path.extname(file.originalname));
        },
    });

    const fileFilter = (req, file, cb) => {
        cb(null, true);
    };

    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 1024 * 50 },  
        fileFilter: fileFilter,
    });

    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "image1", maxCount: 10 },
        { name: "image2", maxCount: 10 },
        { name: "cover_image", maxCount: 10 },
        { name: "detailImages", maxCount: 10 },
        { name: "videos", maxCount: 5 },
        { name: "banner", maxCount: 1 },
        { name: "book_images", maxCount: 10 },
        { name: "audio_section_audio", maxCount: 10 },
        { name: "audio_section_images", maxCount: 10 }
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: "File upload failed.", error: err });
        }


        const convertedFiles = {};

        if (!req.files) {
            return next(); 
        }

        const fileKeys = Object.keys(req.files);
        try {
            for (const key of fileKeys) {
                const files = req.files[key];
                const convertedFilePaths = [];

                if (key === "audio_section_audio") {
                    for (const file of files) {
                        const uploadedFilePath = path.join(BASE_PATH, file.filename);
                        const fileUrl = `${process.env.VERCEL_URL}/media/${file.filename}`;
                        convertedFilePaths.push(fileUrl);
                    }
                } else {
                    for (const file of files) {
                        const uploadedFilePath = path.join(BASE_PATH, file.filename);
                        const webpFileName = Date.now() + "-" + file.originalname.split('.')[0] + ".webp";
                        const webpFilePath = path.join(BASE_PATH, webpFileName);

                        await sharp(uploadedFilePath)
                            .webp({ quality: 80 })
                            .toFile(webpFilePath);

                        fs.unlinkSync(uploadedFilePath);

                        const convertedFileUrl = `${process.env.VERCEL_URL}/media/${webpFileName}`;
                        convertedFilePaths.push(convertedFileUrl);
                    }
                }

                convertedFiles[key] = convertedFilePaths;
            }

            req.convertedFiles = convertedFiles;

            next();
        } catch (error) {
            console.error("Error processing files:", error);
            return res.status(500).send({ message: "Failed to process files.", error: error.message });
        }
    });
};

const imageAndVideoUploadMiddleware = (req, res, next) => {
    const BASE_PATH = path.join(__dirname, "../uploads");

    if (!fs.existsSync(BASE_PATH)) {
        fs.mkdirSync(BASE_PATH, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, BASE_PATH);
        },
        filename: function (req, file, cb) {
            const fileNameWithoutExt = path.parse(file.originalname).name;
            cb(null, fileNameWithoutExt + Date.now() + path.extname(file.originalname));
        },
    });

    const fileFilter = (req, file, cb) => {
        cb(null, true);
    };

    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 1024 * 50 }, 
        fileFilter: fileFilter,
    });

    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "image1", maxCount: 10 },
        { name: "image2", maxCount: 10 },
        { name: "cover_image", maxCount: 10 },
        { name: "detailImages", maxCount: 10 },
        { name: "videos", maxCount: 5 }, 
        { name: "banner", maxCount: 1 },
        { name: "book_images", maxCount: 10 },
        { name: "audio_section_audio", maxCount: 10 },
        { name: "audio_section_images", maxCount: 10 },
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: "File upload failed.", error: err });
        }

        if (!req.files) {
            req.convertedFiles = {}; 
            return next();
        }

        const fileKeys = Object.keys(req.files);
        let convertedFiles = {};

        try {
            for (const key of fileKeys) {
                const files = req.files[key];
                const convertedFilePaths = [];

                for (const file of files) {
                    const uploadedFilePath = path.join(BASE_PATH, file.filename);
                    const fileExtension = path.extname(file.originalname).toLowerCase();

                    if ([".mp4", ".mkv", ".avi", ".mov", ".flv"].includes(fileExtension)) {
                        const videoUrl = `${process.env.VERCEL_URL}/media/${file.filename}`;
                        convertedFilePaths.push(videoUrl);
                    }
                    else if (key === "audio_section_audio") {
                        const audioUrl = `${process.env.VERCEL_URL}/media/${file.filename}`;
                        convertedFilePaths.push(audioUrl);
                    }
                    else {
                        const webpFileName = Date.now() + "-" + file.originalname.split(".")[0] + ".webp";
                        const webpFilePath = path.join(BASE_PATH, webpFileName);

                        await sharp(uploadedFilePath)
                            .webp({ quality: 80 })
                            .toFile(webpFilePath);

                        fs.unlinkSync(uploadedFilePath);

                        const convertedFileUrl = `${process.env.VERCEL_URL}/media/${webpFileName}`;
                        convertedFilePaths.push(convertedFileUrl);
                    }
                }

                convertedFiles[key] = convertedFilePaths;
            }

            req.convertedFiles = convertedFiles;

            next();
        } catch (error) {
            console.error("Error processing files:", error);
            return res.status(500).send({ message: "Failed to process files.", error: error.message });
        }
    });
};

module.exports = { imageConversionMiddlewareMultiple ,imageAndVideoUploadMiddleware};
