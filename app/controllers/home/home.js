const  Home  = require("../../models/home");
const cloudinary = require("../../middlewares/cloudinary");
const { validationResult } = require("express-validator");

// const createHomeSection = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//   }

//   if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ errors: [{ msg: 'At least one image is required', param: 'images' }] });
//   }

//   try {
//       const { text, link } = req.body;
//       const images = req.files;

//       const imageUrls = [];

//       const uploadPromises = images.map((file) => 
//           cloudinary.uploadImageToCloudinary(file.buffer) 
//       );

//       imageUrls.push(...await Promise.all(uploadPromises));

//       const newHomeSection = new Home({
//           text,
//           images: imageUrls,
//           link,
//       });

//       await newHomeSection.save();

//       res.status(201).json({ message: "Home section created successfully", home: newHomeSection });
//   } catch (error) {
//       res.status(500).json({ message: "Error creating Home section", error: error.message });
//   }
// };

const createOrUpdateHomeSection = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { text, link } = req.body;
      const { id } = req.query; 

      let existingHomeSection = null;
      if (id) {
          existingHomeSection = await Home.findById(id);
      }

      let imageUrls = existingHomeSection ? existingHomeSection.images : []; 
      if (req.files && req.files.length > 0) {
          const uploadPromises = req.files.map((file) =>
              cloudinary.uploadImageToCloudinary(file.buffer)
          );
          imageUrls = await Promise.all(uploadPromises);
      } else if (!existingHomeSection) {
          return res.status(400).json({ errors: [{ msg: "At least one image is required", param: "images" }] });
      }

      if (existingHomeSection) {
          existingHomeSection.set({
              text: text || existingHomeSection.text,
              link: link || existingHomeSection.link,
              images: imageUrls,
          });

          await existingHomeSection.save();
          return res.status(200).json({ message: "Home section updated successfully!", home: existingHomeSection.toObject() });
      } else {
          const newHomeSection = new Home({
              text,
              link,
              images: imageUrls,
          });

          await newHomeSection.save();
          return res.status(201).json({ message: "Home section created successfully!", home: newHomeSection.toObject() });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error creating or updating Home section", error: error.message });
  }
};

const getAllHomeSections = async (req, res) => {
  try {
    const homeSections = await Home.find();
    res.status(200).json({ homeSections });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Home sections", error: error.message });
  }
};

const getHomeSectionById = async (req, res) => {
  const { id } = req.params;

  try {
    const homeSection = await Home.findById(id);
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }
    res.status(200).json({ homeSection });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Home section", error: error.message });
  }
};

const updateHomeSection = async (req, res) => {
    const { id } = req.params;
    const { text, link } = req.body;
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ errors: [{ msg: 'At least one image is required', param: 'images' }] });
    }
  
    try {
      const homeSection = await Home.findById(id);
      if (!homeSection) {
        return res.status(404).json({ message: "Home section not found" });
      }
  
      if (req.files && req.files.length > 0) {
        const imageUrls = [];
        for (let file of req.files) {
          const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
          imageUrls.push(imageUrl);
        }
        homeSection.images = imageUrls;
      }
  
      homeSection.text = text || homeSection.text;
      homeSection.link = link || homeSection.link;
      
      await homeSection.save();
  
      res.status(200).json({ message: "Home section updated successfully", homeSection });
    } catch (error) {
      res.status(500).json({ message: "Error updating Home section", error: error.message });
    }
  };

const deleteHomeSection = async (req, res) => {
  const { id } = req.params;

  try {
    const homeSection = await Home.findByIdAndDelete(id);
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }
    res.status(200).json({ message: "Home section deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Home section", error: error.message });
  }
};

module.exports = {
  createOrUpdateHomeSection,
  getAllHomeSections,
  getHomeSectionById,
  updateHomeSection,
  deleteHomeSection,
};
