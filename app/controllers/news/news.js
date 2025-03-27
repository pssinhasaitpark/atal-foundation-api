
const News = require('../../models/news');
const { uploadImageToCloudinary } = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper");

exports.createNews = async (req, res) => {
    try {
        const { headline, description } = req.body;

        if (!headline || !description || !req.files || !req.files.images || req.files.images.length === 0) {
            return handleResponse(res, 400, 'Images, headline, and description are required');
        }

        // const imagesUrls = [];
        // for (const file of req.files.images) {
        //     const uploadedImageUrl = await uploadImageToCloudinary(file.buffer);
        //     imagesUrls.push(uploadedImageUrl);
        // }

        let imagesUrls = [];
        if (req.convertedFiles && req.convertedFiles.images) {
            imagesUrls = [...imagesUrls, ...req.convertedFiles.images];
        }


        const ourNews = new News({
            images: imagesUrls,
            headline,
            description,
        });

        await ourNews.save();

        handleResponse(res, 201, 'News section created successfully', { ourNews });
    } catch (error) {
        handleResponse(res, 500, error.message);
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const allNews = await News.find();

        if (allNews.length === 0) {
            // Send a 200 OK response with a message saying "empty"
            // return res.status(204).json({ message: 'empty' });
            return handleResponse(res, 204, 'No news found');
        }

        // Send 200 OK with the actual news data
        handleResponse(res, 200, 'All news fetched successfully', { allNews });
    } catch (error) {
        handleResponse(res, 500, error.message);
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;

        const newsSection = await News.findById(newsId);

        if (!newsSection) {
            return handleResponse(res, 404, 'News section not found');
        }

        handleResponse(res, 200, 'News section fetched successfully', { newsSection });
    } catch (error) {
        handleResponse(res, 500, error.message);
    }
};

/*
exports.updateNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        const { headline, description } = req.body;  // No need for removeImages

        const newsSection = await News.findById(newsId);
        if (!newsSection) {
            return handleResponse(res, 404, 'News section not found');
        }

        // Update headline and description if provided
        if (headline) {
            newsSection.headline = headline;
        }

        if (description) {
            newsSection.description = description;
        }

        // If new images are uploaded, replace the existing ones
        if (req.files && req.files.images && req.files.images.length > 0) {
            const imagesUrls = [];
            for (const file of req.files.images) {
                const uploadedImageUrl = await uploadImageToCloudinary(file.buffer);
                imagesUrls.push(uploadedImageUrl);
            }

            // Replace existing images with the new ones
            newsSection.images = imagesUrls;
        }

        // Save the updated news section
        await newsSection.save();

        handleResponse(res, 200, 'News section updated successfully', { newsSection });
    } catch (error) {
        handleResponse(res, 500, error.message);
    }
};
*/

exports.updateNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        const { headline, description } = req.body;

        if (!req.user || (req.user.user_role !== "admin" && req.user.user_role !== "super-admin")) {
            return handleResponse(res, 403, "Access denied: Admins only.");
        }

        const updatedData = {};
        if (headline) {
            updatedData.headline = headline;
        }
        if (description) {
            updatedData.description = description;
        }

        //   // If new images are uploaded, replace the existing ones
        //   if (req.files && req.files.images && req.files.images.length > 0) {
        //     const imagesUrls = [];
        //     for (const file of req.files.images) {
        //       const uploadedImageUrl = await uploadImageToCloudinary(file.buffer);
        //       imagesUrls.push(uploadedImageUrl);
        //     }
        //     updatedData.images = imagesUrls; // Replace existing images with new ones
        //   }


        let imagesUrls = [];
        if (req.convertedFiles && req.convertedFiles.images) {
            imagesUrls = [...imagesUrls, ...req.convertedFiles.images];
        }

        updatedData.images = imagesUrls;

        const updatedNews = await News.findByIdAndUpdate(
            newsId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedNews) {
            return handleResponse(res, 404, "News section not found");
        }

        handleResponse(res, 200, "News section updated successfully", {
            newsSection: updatedNews,
        });
    } catch (error) {
        handleResponse(res, 500, error.message);
    }
};

exports.deleteNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;

        const deletedNews = await News.findByIdAndDelete(newsId);

        if (!deletedNews) {
            return handleResponse(res, 404, 'News section not found');
        }

        handleResponse(res, 200, 'News section deleted successfully');
    } catch (error) {
        handleResponse(res, 500, error.message);
    }
};

