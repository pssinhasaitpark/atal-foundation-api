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
        // Accept all files for this scenario
        cb(null, true);
    };

    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 1024 * 5 },  // 5GB limit
        fileFilter: fileFilter,
    });

    // Define multiple fields for files
    upload.fields([
        { name: "images", maxCount: 10 },
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

        if (!req.files) {
            return res.status(400).send({ message: "No files were uploaded." });
        }

        const fileKeys = Object.keys(req.files);
        let convertedFiles = {};

        try {
            for (const key of fileKeys) {
                const files = req.files[key];
                const convertedFilePaths = [];

                // Handle audio files separately as they don't need conversion
                if (key === "audio_section_audio") {
                    for (const file of files) {
                        const uploadedFilePath = path.join(BASE_PATH, file.filename);
                        const fileUrl = `http://192.168.0.14:5050/media/${file.filename}`;
                        convertedFilePaths.push(fileUrl);
                    }
                } else {
                    // Handle image files that need conversion
                    for (const file of files) {
                        const uploadedFilePath = path.join(BASE_PATH, file.filename);
                        const webpFileName = Date.now() + "-" + file.originalname.split('.')[0] + ".webp";
                        const webpFilePath = path.join(BASE_PATH, webpFileName);

                        await sharp(uploadedFilePath)
                            .webp({ quality: 80 })
                            .toFile(webpFilePath);

                        fs.unlinkSync(uploadedFilePath);

                        const convertedFileUrl = `http://192.168.0.14:5050/media/${webpFileName}`;
                        convertedFilePaths.push(convertedFileUrl);
                    }
                }

                convertedFiles[key] = convertedFilePaths;
            }

            // Attach the converted files to the request object for further use
            req.convertedFiles = convertedFiles;

            next();
        } catch (error) {
            console.error("Error processing files:", error);
            return res.status(500).send({ message: "Failed to process files.", error: error.message });
        }
    });
};

module.exports = { imageConversionMiddlewareMultiple };
