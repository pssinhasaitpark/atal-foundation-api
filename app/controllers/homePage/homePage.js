const HomePage = require('../../models/homePage');
const { handleResponse } = require('../../utils/helper');
const { uploadImageToCloudinary } = require('../../middlewares/cloudinary');
const mongoose = require('mongoose');

exports.createHomePage = async (req, res) => {
  try {
    const { badge, title, description } = req.body;

    let image1Data = [];
    let image2Data = [];

    if (req.convertedFiles && req.convertedFiles.image1) {
      image1Data = req.convertedFiles.image1.map((url) => ({ url }));
    }

    if (req.convertedFiles && req.convertedFiles.image2) {
      image2Data = req.convertedFiles.image2.map((url) => ({ url }));
    }

    // if (req.files) {
    //     if (req.files.image1) {
    //         image1Data = await Promise.all(req.files.image1.map(async (file) => {
    //             const url = await uploadImageToCloudinary(file.buffer);
    //             return { url };
    //         }));
    //     }
    //     if (req.files.image2) {
    //         image2Data = await Promise.all(req.files.image2.map(async (file) => {
    //             const url = await uploadImageToCloudinary(file.buffer);
    //             return { url };
    //         }));
    //     }
    // }

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

    let updatedData = {
      badge: badge || homePageData.badge,
      title: title || homePageData.title,
      description: description || homePageData.description,
      image1: homePageData.image1 || [],
      image2: homePageData.image2 || [],
    };

    let image1Data = [];
    let image2Data = [];

    if (req.convertedFiles && req.convertedFiles.image1) {
      image1Data = req.convertedFiles.image1.map((url) => ({ url }));
    }
    updatedData.image1.push(...image1Data);

    if (req.convertedFiles && req.convertedFiles.image2) {
      image2Data = req.convertedFiles.image2.map((url) => ({ url }));
    }
    updatedData.image2.push(...image2Data);




    // // Handle new images upload if present
    // if (req.files) {
    //   if (req.files.image1) {
    //     const uploadedImages1 = await Promise.all(
    //       req.files.image1.map(async (file) => ({
    //         _id: new mongoose.Types.ObjectId(),
    //         url: await uploadImageToCloudinary(file.buffer),
    //       }))
    //     );
    //     updatedData.image1.push(...uploadedImages1);
    //   }

    //   if (req.files.image2) {
    //     const uploadedImages2 = await Promise.all(
    //       req.files.image2.map(async (file) => ({
    //         _id: new mongoose.Types.ObjectId(),
    //         url: await uploadImageToCloudinary(file.buffer),
    //       }))
    //     );
    //     updatedData.image2.push(...uploadedImages2);
    //   }
    // }


    if (removeImageIds) {
      const removeIds = Array.isArray(removeImageIds)
        ? removeImageIds
        : [removeImageIds];
      updatedData.image1 = updatedData.image1.filter(
        (img) => !removeIds.includes(img._id.toString())
      );
      updatedData.image2 = updatedData.image2.filter(
        (img) => !removeIds.includes(img._id.toString())
      );
    }

    const updatedHomePageData = await HomePage.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedHomePageData) {
      return handleResponse(res, 404, "HomePage section not found");
    }

    return handleResponse(res, 200, "HomePage section updated successfully", {
      homePageData: updatedHomePageData,
    });
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
