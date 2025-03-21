const About = require("../../models/about");
const sharp = require('sharp');
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

const createAboutSection = async (req, res) => {
  try {
    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages);
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");      
      }
    }

    const bannerImage = req.files?.banner ? req.files.banner[0] : null;
    const images = req.files?.images || [];

    const uploadBannerImage = bannerImage
      ? new Promise((resolve, reject) => {
          sharp(bannerImage.buffer)
            .webp()
            .toBuffer()
            .then((webpBuffer) => {
              cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result.secure_url);
                  }
                }
              ).end(webpBuffer);
            })
            .catch((error) => reject(error));
        })
      : Promise.resolve("");

    const uploadImages = images.map((image) =>
      new Promise((resolve, reject) => {
        sharp(image.buffer)
          .webp()
          .toBuffer()
          .then((webpBuffer) => {
            cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.secure_url);
                }
              }
            ).end(webpBuffer);
          })
          .catch((error) => reject(error));
      })
    );

    const uploadResults = await Promise.allSettled([uploadBannerImage, ...uploadImages]);

    const bannerUrl = uploadResults[0].status === "fulfilled" ? uploadResults[0].value : "";
    const imageUrls = uploadResults.slice(1).map((result) => (result.status === "fulfilled" ? result.value : ""));

    let existingAbout = await About.findOne({});

    if (!req.body.data && bannerUrl) {
      if (!existingAbout) {
        existingAbout = new About({ banner: bannerUrl, sections: [] });
      } else {
        existingAbout.banner = bannerUrl;
      }

      await existingAbout.save();
      return handleResponse(res, 200, "Banner updated successfully!", { existingAbout });
    }

    const sectionsData = (req.body.data || []).map((section, index) => ({
      title: section.title,
      description: section.description,
      image: imageUrls[index] || imageUrls[0] || "",
    }));

    if (removeImages.length > 0) {
      sectionsData.forEach((section) => {
        if (removeImages.includes(section.image)) {
          section.image = "";
        }
      });
    }

    if (existingAbout) {
      existingAbout.sections.push(...sectionsData);
      if (bannerUrl) {
        existingAbout.banner = bannerUrl;
      }
      await existingAbout.save();
      return handleResponse(res, 200, "About section updated successfully!", { existingAbout });
    } else {
      const newAbout = new About({
        banner: bannerUrl,
        sections: sectionsData,
      });
      await newAbout.save();
      return res.status(201).json({ message: "About section created successfully!", newAbout });
    }
  } catch (error) {
    console.error("Error updating About section:", error);
    res.status(500).json({ error: "An error occurred while creating or updating the About section." });
  }
};

const getAllAboutSections = async (req, res) => {
    try {
      const aboutSections = await About.find();
      if (!aboutSections.length) {
        return res.status(404).json({ message: "No About sections found." });
      }
      res.status(200).json(aboutSections);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching About sections." });
    }
  };
  
const getAboutSection = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ error: "About section not found" });
    }
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching About section." });
  }
};

const updateAboutSection = async (req, res) => {
  try {
      const { aboutId, sectionId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(aboutId) || !mongoose.Types.ObjectId.isValid(sectionId)) {
          return res.status(400).json({ message: "Invalid ID format." });
      }

      const about = await About.findById(aboutId);
      if (!about) {
          return res.status(404).json({ message: "About section not found." });
      }

      const section = about.sections.id(sectionId);
      if (!section) {
          return res.status(404).json({ message: "Section not found." });
      }


      let uploadedImageUrls = [];
      if (req.files?.images) { 
          const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

          for (const imageFile of imageFiles) {
              const imageBuffer = await sharp(imageFile.buffer).webp().toBuffer();

              const uploadedImageUrl = await new Promise((resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                      if (error) reject(error);
                      else resolve(result.secure_url);
                  });
                  stream.end(imageBuffer);
              });

              uploadedImageUrls.push(uploadedImageUrl);
          }
      }


      section.title = req.body.title || section.title;
      section.description = req.body.description || section.description;
      if (uploadedImageUrls.length > 0) {
          section.image = uploadedImageUrls[0];  
      }

      about.markModified("sections"); 
      await about.save();


      res.status(200).json({
          message: "Section updated successfully!",
          updatedSection: about.sections.id(sectionId),
      });
  } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({ error: "An error occurred while updating the section." });
  }
};

const deleteAboutSection = async (req, res) => {
  try {
    const { aboutId, sectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aboutId) || !mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const updatedAbout = await About.findByIdAndUpdate(
      aboutId,
      { $pull: { sections: { _id: sectionId } } },
      { new: true } 
    );

    if (!updatedAbout) {
      return res.status(404).json({ error: "About document not found." });
    }

    res.status(200).json({
      message: "Section deleted successfully!",
      updatedAbout, 
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the section." });
  }
};

const removeImageFromAboutSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    const about = await About.findById(id);
    if (!about) {
      return res.status(404).json({ error: "About section not found" });
    }

    about.sections = about.sections.filter((section) => section.image !== imageUrl);


    await about.save();
    res.status(200).json({ message: "Image removed successfully from About section" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while removing image" });
  }
};

module.exports = {
  createAboutSection,
  getAllAboutSections,
  getAboutSection,
  updateAboutSection,
  deleteAboutSection,
  removeImageFromAboutSection
};
