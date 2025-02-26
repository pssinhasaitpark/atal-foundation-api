const OurProgramme = require("../../models/ourProgrammes");
const Category = require("../../models/categories");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const mongoose = require("mongoose");
/*
const createProgramme = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found." });
    }

    const bannerImage = req.files?.banner ? req.files.banner[0] : null;
    const images = req.files?.images || [];

    const uploadBannerImage = bannerImage
      ? new Promise((resolve, reject) => {
          sharp(bannerImage.buffer)
            .webp()
            .toBuffer()
            .then((webpBuffer) => {
              cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }).end(webpBuffer);
            })
            .catch(reject);
        })
      : Promise.resolve("");

    const uploadImages = images.map((image) =>
      new Promise((resolve, reject) => {
        sharp(image.buffer)
          .webp()
          .toBuffer()
          .then((webpBuffer) => {
            cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }).end(webpBuffer);
          })
          .catch(reject);
      })
    );

    const uploadResults = await Promise.allSettled([uploadBannerImage, ...uploadImages]);

    const bannerUrl = uploadResults[0].status === "fulfilled" ? uploadResults[0].value : "";
    const imageUrls = uploadResults.slice(1).map((result) => (result.status === "fulfilled" ? result.value : ""));

    const sectionsData = JSON.parse(req.body.sections || "[]").map((section, index) => ({
      title: section.title,
      description: section.description,
      images: imageUrls[index] ? [imageUrls[index]] : [],
    }));

    const newProgramme = new OurProgramme({
      category: categoryId,
      banner: bannerUrl,
      sections: sectionsData,
    });

    await newProgramme.save();
    res.status(201).json({ message: "Programme created successfully!", newProgramme });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the programme." });
  }
};
*/
/*
const createProgramme = async (req, res) => {
    try {
      const { categoryId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID." });
      }
  
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found." });
      }
  
      // Process banner image
      const bannerImage = req.files?.banner ? req.files.banner[0] : null;
      const images = req.files?.images || [];
  
      // Upload banner image to Cloudinary
      const uploadBannerImage = bannerImage
        ? new Promise((resolve, reject) => {
            sharp(bannerImage.buffer)
              .webp()
              .toBuffer()
              .then((webpBuffer) => {
                cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }).end(webpBuffer);
              })
              .catch(reject);
          })
        : Promise.resolve("");
  
      // Upload other images
      const uploadImages = images.map((image) =>
        new Promise((resolve, reject) => {
          sharp(image.buffer)
            .webp()
            .toBuffer()
            .then((webpBuffer) => {
              cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }).end(webpBuffer);
            })
            .catch(reject);
        })
      );
  
      const uploadResults = await Promise.allSettled([uploadBannerImage, ...uploadImages]);
  
      const bannerUrl = uploadResults[0].status === "fulfilled" ? uploadResults[0].value : "";
      const imageUrls = uploadResults.slice(1).map((result) => (result.status === "fulfilled" ? result.value : ""));
  
      // Sections Data
      const sectionsData = [
        {
          title: req.body.title,
          description: req.body.description,
          images: imageUrls,
        }
      ];
  
      // Create new programme entry
      const newProgramme = new OurProgramme({
        category: categoryId,
        banner: bannerUrl,
        sections: sectionsData,
      });
  
      await newProgramme.save();
      res.status(201).json({ message: "Programme created successfully!", newProgramme });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while creating the programme." });
    }
  };
  */

  const createProgramme = async (req, res) => {
    try {
      const { categoryId, programmeId } = req.body; // Add programmeId to find the existing programme
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID." });
      }
  
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found." });
      }
  
      // Check if programmeId exists, if so, we're updating an existing programme
      let programme;
      if (programmeId) {
        // Find the existing programme by its ID
        programme = await OurProgramme.findById(programmeId);
        if (!programme) {
          return res.status(404).json({ message: "Programme not found." });
        }
      } else {
        // If no programmeId provided, create a new programme (for first-time creation)
        programme = new OurProgramme({
          category: categoryId,
          banner: "",  // Placeholder, will be updated later
          sections: [],
        });
      }
  
      const bannerImage = req.files?.banner ? req.files.banner[0] : null;
      const images = req.files?.images || [];
  
      // Upload banner image to Cloudinary
      const uploadBannerImage = bannerImage
        ? new Promise((resolve, reject) => {
            sharp(bannerImage.buffer)
              .webp()
              .toBuffer()
              .then((webpBuffer) => {
                cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }).end(webpBuffer);
              })
              .catch(reject);
          })
        : Promise.resolve("");
  
      // Upload images
      const uploadImages = images.map((image) =>
        new Promise((resolve, reject) => {
          sharp(image.buffer)
            .webp()
            .toBuffer()
            .then((webpBuffer) => {
              cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }).end(webpBuffer);
            })
            .catch(reject);
        })
      );
  
      const uploadResults = await Promise.allSettled([uploadBannerImage, ...uploadImages]);
  
      const bannerUrl = uploadResults[0].status === "fulfilled" ? uploadResults[0].value : "";
      const imageUrls = uploadResults.slice(1).map((result) => (result.status === "fulfilled" ? result.value : ""));
  
      // Prepare new sections data
      const sectionsData = [];
      
      // The form-data will include multiple entries for title, description, and images
      for (let i = 0; i < req.body.title.length; i++) {
        sectionsData.push({
          title: req.body.title[i],
          description: req.body.description[i],
          images: imageUrls[i] ? [imageUrls[i]] : [],
        });
      }
  
      // Update the existing programme by adding new sections
      programme.sections.push(...sectionsData); // Append new sections to the existing ones
      if (bannerUrl) programme.banner = bannerUrl; // If there's a new banner, update it
  
      await programme.save();
      res.status(200).json({ message: "Programme updated successfully!", programme });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the programme." });
    }
  };

  
const getProgrammes = async (req, res) => {
  try {
    const programmes = await OurProgramme.find().populate("category");
    res.status(200).json(programmes);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching programmes." });
  }
};

module.exports = {
  createProgramme,
  getProgrammes,
};
