const HomePage = require('../../models/homePage');
const { handleResponse } = require('../../utils/helper');
const { uploadImageToCloudinary } = require('../../middlewares/cloudinary');
const mongoose = require('mongoose');

exports.createHomePage = async (req, res) => {
    try {
        const { badge, title, description } = req.body;

        let image1Data = [];
        let image2Data = [];

        if (req.files) {
            if (req.files.image1) {
                image1Data = await Promise.all(req.files.image1.map(async (file) => {
                    const url = await uploadImageToCloudinary(file.buffer);
                    return { url };
                }));
            }
            if (req.files.image2) {
                image2Data = await Promise.all(req.files.image2.map(async (file) => {
                    const url = await uploadImageToCloudinary(file.buffer);
                    return { url };
                }));
            }
        }

        const homePageData = new HomePage({
            badge,
            title,
            description,
            image1: image1Data,
            image2: image2Data
        });

        await homePageData.save();
        return handleResponse(res, 201, 'HomePage section created successfully', { homePageData });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

exports.getHomePage = async (req, res) => {
    try {
        const homePageData = await HomePage.findOne();
        if (!homePageData) {
            return handleResponse(res, 404, 'No homePage data found');
        }
        return handleResponse(res, 200, 'HomePage data retrieved successfully', { homePageData });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

exports.updateHomePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { badge, title, description, removeImageIds } = req.body;

        const homePageData = await HomePage.findById(id);
        if (!homePageData) {
            return handleResponse(res, 404, "HomePage section not found");
        }

        if (badge) homePageData.badge = badge;
        if (title) homePageData.title = title;
        if (description) homePageData.description = description;

        if (req.files) {
            if (req.files.image1) {
                const uploadedImages = await Promise.all(
                    req.files.image1.map(async (file) => ({
                        _id: new mongoose.Types.ObjectId(),
                        url: await uploadImageToCloudinary(file.buffer),
                    }))
                );
                homePageData.image1.push(...uploadedImages);
            }
            if (req.files.image2) {
                const uploadedImages = await Promise.all(
                    req.files.image2.map(async (file) => ({
                        _id: new mongoose.Types.ObjectId(),
                        url: await uploadImageToCloudinary(file.buffer),
                    }))
                );
                homePageData.image2.push(...uploadedImages);
            }
        }

        if (removeImageIds) {
            const removeIds = Array.isArray(removeImageIds) ? removeImageIds : [removeImageIds];
            homePageData.image1 = homePageData.image1.filter(img => !removeIds.includes(img._id.toString()));
            homePageData.image2 = homePageData.image2.filter(img => !removeIds.includes(img._id.toString()));
        }

        await homePageData.save();
        return handleResponse(res, 200, "HomePage section updated successfully", { homePageData });

    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

exports.deleteHomePage = async (req, res) => {
    try {
        const { id } = req.params;

        const homePage = await HomePage.findById(id);
        if (!homePage) {
            return handleResponse(res, 404, "HomePage not found");
        }

        const deleteFromCloudinary = async (imageUrls) => {
            if (Array.isArray(imageUrls)) {
                for (const imageUrl of imageUrls) {
                    if (typeof imageUrl === "string") {
                        const publicId = imageUrl.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(`atal-foundation/${publicId}`);
                    }
                }
            }
        };

        await deleteFromCloudinary(homePage.image1);
        await deleteFromCloudinary(homePage.image2);

        await HomePage.findByIdAndDelete(id);

        return handleResponse(res, 200, "HomePage deleted successfully");
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
