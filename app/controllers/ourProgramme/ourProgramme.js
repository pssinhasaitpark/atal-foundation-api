const ourProgramme = require("../../models/ourProgramme");
const cloudinary = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper");

// const createOurProgramme = async (req, res) => {
//   try {
//     const { category, details } = req.body;
//     // const parsedDetails = Array.isArray(details) ? details : JSON.parse(details || "[]");

//     // const banner = req.files?.banner ? req.files.banner[0] : null;
//     // const images = req.files?.images || [];
//     // const detailImages = req.files?.detailImages || [];



//     let uploadedBanner = [];
//     if (req.convertedFiles && req.convertedFiles.banner) {
//       uploadedBanner = [...uploadedBanner, ...req.convertedFiles.banner];
//     }


//     // let detailsFormatted = [];
//     // if (req.convertedFiles && req.convertedFiles.detailImages) {
//     //   detailsFormatted = req.convertedFiles.detailImages.map((url) => ({ url }));
//     // }

//     let detailsFormatted = [];
//     if (req.convertedFiles && req.convertedFiles.detailImages) {
//       detailsFormatted = req.convertedFiles.detailImages.map((url) => ({ url }));
//     }
//     console.log("detailsFormatted===",detailsFormatted);





//     // const uploadedBanner = banner ? await cloudinary.uploadImageToCloudinary(banner.buffer) : null;

//     // const uploadedImages = await Promise.all(
//     //   images.map(async (image) => {
//     //     try {
//     //       const url = await cloudinary.uploadImageToCloudinary(image.buffer);
//     //       return { url };
//     //     } catch (err) {
//     //       console.error("Error uploading image:", err);
//     //       return null;
//     //     }
//     //   })
//     // ).then((results) => results.filter((image) => image !== null)); 

//     // const detailsFormatted = await Promise.all(
//     //   parsedDetails.map(async (detail, index) => {
//     //     let detailImageUrls = [];

//     //     if (detailImages[index] && Array.isArray(detailImages[index])) {
//     //       detailImageUrls = await Promise.all(
//     //         detailImages[index].map(async (image) => {
//     //           try {
//     //             const url = await cloudinary.uploadImageToCloudinary(image.buffer);
//     //             return { url };
//     //           } catch (error) {
//     //             console.error(`Error uploading detail image for detail ${index + 1}:`, error);
//     //             return null;
//     //           }
//     //         })
//     //       ).then((results) => results.filter((img) => img !== null)); 
//     //     } else if (detailImages[index] && detailImages[index].buffer) {
//     //       try {
//     //         const url = await cloudinary.uploadImageToCloudinary(detailImages[index].buffer);
//     //         detailImageUrls.push({ url });
//     //       } catch (error) {
//     //         console.error(`Error uploading single detail image for detail ${index + 1}:`, error);
//     //       }
//     //     }

//     //     return {
//     //       title: detail.title,
//     //       description: detail.description,
//     //       images: detailImageUrls, 
//     //     };
//     //   })
//     // );


//     const newOurProgramme = new ourProgramme({
//       category,
//       banner: uploadedBanner,
//       details: detailsFormatted,
//     });

//     await newOurProgramme.save();

//     return res.status(201).json({
//       status: 201,
//       message: "Our Programme created successfully!",
//       ourProgramme: newOurProgramme,
//     });
//   } catch (error) {
//     console.error("Error creating ourProgramme:", error);
//     return res.status(500).json({
//       status: 500,
//       message: "Error creating ourProgramme",
//       error: error.message,
//     });
//   }
// };

const createOurProgramme = async (req, res) => {
  try {
    const { category, details } = req.body;
    
    const parsedDetails = Array.isArray(details) ? details : JSON.parse(details || "[]");

    let uploadedBanner = [];
    if (req.convertedFiles && req.convertedFiles.banner) {
      uploadedBanner = [...uploadedBanner, ...req.convertedFiles.banner];
    }

    let detailsFormatted = [];
    if (parsedDetails.length > 0) {
      detailsFormatted = parsedDetails.map((detail, index) => ({
        title: detail.title,
        description: detail.description,
        images: req.convertedFiles?.detailImages
          ? req.convertedFiles.detailImages
              .filter((_, imgIndex) => imgIndex === index)
              .map((url) => ({ url }))
          : [],
      }));
    }


    const newOurProgramme = new ourProgramme({
      category,
      banner: uploadedBanner,
      details: detailsFormatted,
    });

    await newOurProgramme.save();

    return res.status(201).json({
      status: 201,
      message: "Our Programme created successfully!",
      ourProgramme: newOurProgramme,
    });
  } catch (error) {
    console.error("Error creating ourProgramme:", error);
    return res.status(500).json({
      status: 500,
      message: "Error creating ourProgramme",
      error: error.message,
    });
  }
};

const getourProgrammes = async (req, res) => {
  try {
    // Define the predefined category order
    const categoryOrder = [
      'Education',
      'Healthcare',
      'Livelihood',
      'Girl Child & Women Empowerment',
      'Privileged Children',
      'Civic Driven Change',
      'Social Entrepreneurship',
      'Special Support ourProgramme',
      'Special Interventions'
    ];

    // Fetch the programmes and sort them based on the categoryOrder
    const ourProgrammes = await ourProgramme.find().sort({ createdAt: -1 });

    // Sort the programmes according to the predefined category order
    const sortedProgrammes = ourProgrammes.sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });

    return handleResponse(res, 200, "ourProgrammes fetched successfully", {
      ourProgrammes: sortedProgrammes,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching ourProgrammes", {
      error: error.message,
    });
  }
};

const getByCategory = async (req, res) => {
  try {
    // Extract the category from query parameters (or params depending on your route structure)
    const { category } = req.params;

    // Find ourProgrammes that match the category
    const ourProgrammes = await ourProgramme.find({ category }).sort({ createdAt: -1 });

    if (ourProgrammes.length === 0) {
      return handleResponse(res, 404, `No programmes found for category: ${category}`, {
        ourProgrammes,
      });
    }

    return handleResponse(res, 200, `${category} programmes fetched successfully`, {
      ourProgrammes,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching ourProgrammes by category", {
      error: error.message,
    });
  }
};

const updateOurProgramme = async (req, res) => {
  try {
    const { category } = req.params;
    let { details } = req.body;

    const parsedDetails = Array.isArray(details) ? details : JSON.parse(details || "[]");

    const existingProgramme = await ourProgramme.findOne({ category });
    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme not found",
      });
    }

    if (req.body.category) {
      return res.status(400).json({
        status: 400,
        message: "The category field is immutable and cannot be updated.",
      });
    }

    let uploadedBannerUrl = existingProgramme.banner;
    if (req.convertedFiles?.banner && req.convertedFiles.banner.length > 0) {
      uploadedBannerUrl = req.convertedFiles.banner[0]; 
    }

    const detailImages = req.convertedFiles?.detailImages || [];

    if (parsedDetails && Array.isArray(parsedDetails)) {
      for (let i = 0; i < parsedDetails.length; i++) {
        const detail = parsedDetails[i];

        if (detail._id) {

          const index = existingProgramme.details.findIndex(
            (d) => d._id.toString() === detail._id
          );
          if (index !== -1) {
            existingProgramme.details[index].title = detail.title || existingProgramme.details[index].title;
            existingProgramme.details[index].description = detail.description || existingProgramme.details[index].description;


            if (!existingProgramme.details[index].images) {
              existingProgramme.details[index].images = [];
            }

            let newDetailImages = [];
            if (detailImages[i]) {
              if (Array.isArray(detailImages[i])) {
                newDetailImages = detailImages[i].map((imageUrl) => ({ url: imageUrl }));
              } else {
                newDetailImages.push({ url: detailImages[i] });
              }

              existingProgramme.details[index].images = [
                ...existingProgramme.details[index].images,
                ...newDetailImages,
              ];
            }
          }
        } else {
          let newDetailImages = [];
          if (detailImages[i]) {
            if (Array.isArray(detailImages[i])) {
              newDetailImages = detailImages[i].map((imageUrl) => ({ url: imageUrl }));
            } else {
              newDetailImages.push({ url: detailImages[i] });
            }
          }

          const newDetail = {
            title: detail.title,
            description: detail.description,
            images: newDetailImages,
          };
          existingProgramme.details.push(newDetail);
        }
      }
    }

    existingProgramme.banner = uploadedBannerUrl;
    await existingProgramme.save();

    return res.status(200).json({
      status: 200,
      message: "Our Programme updated successfully",
      ourProgramme: existingProgramme,
    });
  } catch (error) {
    console.error("Error updating Our Programme:", error);
    return res.status(500).json({
      status: 500,
      message: "Error updating Our Programme",
      error: error.message,
    });
  }
};

//cloudinary
// const updateOurProgramme = async (req, res) => {
//   try {
//     const { category } = req.params;
//     let { details } = req.body;

  

//     const parsedDetails = Array.isArray(details) ? details : JSON.parse(details || "[]");

//     const existingProgramme = await ourProgramme.findOne({ category });

//     if (!existingProgramme) {
//       return res.status(404).json({
//         status: 404,
//         message: "Our Programme not found",
//       });
//     }

//     if (req.body.category) {
//       return res.status(400).json({
//         status: 400,
//         message: "The category field is immutable and cannot be updated.",
//       });
//     }

//     let uploadedBannerUrl = existingProgramme.banner;
//     if (req.files?.banner) {
//       console.log("Uploading banner image...");
//       try {
//         uploadedBannerUrl = await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer);
//         console.log("Uploaded Banner:", uploadedBannerUrl);
//       } catch (error) {
//         console.error("Banner Upload Failed:", error);
//       }
//     }

//     const detailImages = req.files?.detailImages || [];
//     console.log("Uploaded Detail Images:", detailImages);

//     if (parsedDetails && Array.isArray(parsedDetails)) {
//       for (let i = 0; i < parsedDetails.length; i++) {
//         const detail = parsedDetails[i];

//         if (detail._id) {
//           const index = existingProgramme.details.findIndex(
//             (d) => d._id.toString() === detail._id
//           );
//           if (index !== -1) {
//             existingProgramme.details[index].title = detail.title || existingProgramme.details[index].title;
//             existingProgramme.details[index].description = detail.description || existingProgramme.details[index].description;

//             console.log("Processing images for detail:", detail._id);

//             if (!existingProgramme.details[index].images) {
//               existingProgramme.details[index].images = [];
//             }

//             let newDetailImages = [];
//             if (detailImages[i]) {
//               if (Array.isArray(detailImages[i])) {
//                 newDetailImages = await Promise.all(
//                   detailImages[i].map(async (image) => {
//                     try {
//                       const url = await cloudinary.uploadImageToCloudinary(image.buffer);
//                       return { url };
//                     } catch (err) {
//                       console.error("Error uploading detail image:", err);
//                       return null;
//                     }
//                   })
//                 );
//               } else if (detailImages[i].buffer) {
//                 try {
//                   const url = await cloudinary.uploadImageToCloudinary(detailImages[i].buffer);
//                   newDetailImages.push({ url });
//                 } catch (err) {
//                   console.error("Error uploading single detail image:", err);
//                 }
//               }

//               newDetailImages = newDetailImages.filter((img) => img !== null);
//               existingProgramme.details[index].images = [
//                 ...existingProgramme.details[index].images,
//                 ...newDetailImages,
//               ];
//             }
//           }
//         } else {
//           let newDetailImages = [];
//           if (detailImages[i]) {
//             if (Array.isArray(detailImages[i])) {
//               newDetailImages = await Promise.all(
//                 detailImages[i].map(async (image) => {
//                   try {
//                     const url = await cloudinary.uploadImageToCloudinary(image.buffer);
//                     return { url };
//                   } catch (err) {
//                     console.error("Error uploading detail image:", err);
//                     return null;
//                   }
//                 })
//               );
//             } else if (detailImages[i].buffer) {
//               try {
//                 const url = await cloudinary.uploadImageToCloudinary(detailImages[i].buffer);
//                 newDetailImages.push({ url });
//               } catch (err) {
//                 console.error("Error uploading single detail image:", err);
//               }
//             }
//           }

//           const newDetail = {
//             title: detail.title,
//             description: detail.description,
//             images: newDetailImages.filter((img) => img !== null),
//           };
//           existingProgramme.details.push(newDetail);
//         }
//       }
//     }

//     existingProgramme.banner = uploadedBannerUrl;
//     await existingProgramme.save();

//     return res.status(200).json({
//       status: 200,
//       message: "Our Programme updated successfully",
//       ourProgramme: existingProgramme,
//     });
//   } catch (error) {
//     console.error("Error updating ourProgramme:", error);
//     return res.status(500).json({
//       status: 500,
//       message: "Error updating ourProgramme",
//       error: error.message,
//     });
//   }
// };


// const updateOurProgrammeById = async (req, res) => {
//   try {
//     const { category, detailId } = req.params;
//     const { title, description, removeImages } = req.body;


//     const imagesToRemove = removeImages ? JSON.parse(removeImages) : [];

//     const existingProgramme = await ourProgramme.findOne({ category });

//     if (!existingProgramme) {
//       return res.status(404).json({
//         status: 404,
//         message: "Our Programme not found",
//       });
//     }

//     const detailIndex = existingProgramme.details.findIndex(
//       (d) => d._id.toString() === detailId
//     );

//     if (detailIndex === -1) {
//       return res.status(404).json({
//         status: 404,
//         message: "Detail section not found",
//       });
//     }

//     const detailSection = existingProgramme.details[detailIndex];

//     if (title) detailSection.title = title;
//     if (description) detailSection.description = description;

//     if (imagesToRemove.length > 0) {
//       detailSection.images = detailSection.images.filter(
//         (img) => !imagesToRemove.includes(img.url)
//       );
//     }

//     let newDetailImages = [];
    
//     if (req.files?.detailImages) {
//       const detailImages = req.files.detailImages;

//       if (Array.isArray(detailImages)) {
//         newDetailImages = await Promise.all(
//           detailImages.map(async (image) => {
//             try {
//               return { url: await cloudinary.uploadImageToCloudinary(image.buffer) };
//             } catch (err) {
//               console.error("Error uploading detail image:", err);
//               return null;
//             }
//           })
//         );
//       } else if (detailImages.buffer) {
//         try {
//           newDetailImages.push({ url: await cloudinary.uploadImageToCloudinary(detailImages.buffer) });
//         } catch (err) {
//           console.error("Error uploading single detail image:", err);
//         }
//       }

//       newDetailImages = newDetailImages.filter((img) => img !== null);
//       detailSection.images = [...detailSection.images, ...newDetailImages];
//     }

//     await existingProgramme.save();

//     return res.status(200).json({
//       status: 200,
//       message: "Detail section updated successfully",
//       updatedDetail: detailSection,
//     });
//   } catch (error) {
//     console.error("Error updating detail section:", error);
//     return res.status(500).json({
//       status: 500,
//       message: "Error updating detail section",
//       error: error.message,
//     });
//   }
// };

/*
const updateOurProgrammeById = async (req, res) => {
  try {
    const { category, detailId } = req.params;
    const { title, description, removeImages } = req.body;

    const imagesToRemove = removeImages ? JSON.parse(removeImages) : [];

    // Prepare update for the specific detail
    const updateDetail = {};
    if (title) updateDetail["details.$.title"] = title;
    if (description) updateDetail["details.$.description"] = description;

    let newDetailImages = [];

    if (req.files?.detailImages) {
      const detailImages = req.files.detailImages;

      if (Array.isArray(detailImages)) {
        newDetailImages = await Promise.all(
          detailImages.map(async (image) => {
            try {
              return { url: await cloudinary.uploadImageToCloudinary(image.buffer) };
            } catch (err) {
              console.error("Error uploading detail image:", err);
              return null;
            }
          })
        );
      } else if (detailImages.buffer) {
        try {
          newDetailImages.push({ url: await cloudinary.uploadImageToCloudinary(detailImages.buffer) });
        } catch (err) {
          console.error("Error uploading single detail image:", err);
        }
      }

      newDetailImages = newDetailImages.filter((img) => img !== null);
    }

    // Handle image removal if necessary
    if (imagesToRemove.length > 0 || newDetailImages.length > 0) {
      const existingProgramme = await ourProgramme.findOne({ category });

      if (!existingProgramme) {
        return res.status(404).json({
          status: 404,
          message: "Our Programme not found",
        });
      }

      const detailSection = existingProgramme.details.id(detailId);

      if (!detailSection) {
        return res.status(404).json({
          status: 404,
          message: "Detail section not found",
        });
      }

      if (imagesToRemove.length > 0) {
        detailSection.images = detailSection.images.filter(
          (img) => !imagesToRemove.includes(img.url)
        );
      }

      if (newDetailImages.length > 0) {
        detailSection.images = [...detailSection.images, ...newDetailImages];
      }

      updateDetail["details.$.images"] = detailSection.images;
    }

    const updatedProgramme = await ourProgramme.findOneAndUpdate(
      {
        category,
        "details._id": detailId,
      },
      { $set: updateDetail },
      { new: true }
    );

    if (!updatedProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme or Detail section not found",
      });
    }

    const updatedDetail = updatedProgramme.details.id(detailId);

    return res.status(200).json({
      status: 200,
      message: "Detail section updated successfully",
      updatedDetail,
    });
  } catch (error) {
    console.error("Error updating detail section:", error);
    return res.status(500).json({
      status: 500,
      message: "Error updating detail section",
      error: error.message,
    });
  }
};
*/

const updateOurProgrammeById = async (req, res) => {
  try {
    const { category, detailId } = req.params;
    const { title, description, removeImages } = req.body;

    const imagesToRemove = removeImages ? JSON.parse(removeImages) : [];

    // Prepare update for the specific detail
    const updateDetail = {};
    if (title) updateDetail["details.$.title"] = title;
    if (description) updateDetail["details.$.description"] = description;

    let newDetailImages = [];

    // Handle new images from converted files
    if (req.convertedFiles?.detailImages) {
      newDetailImages = req.convertedFiles.detailImages.map((url) => ({
        url,
      }));
    }

    // Handle image removal or addition if needed
    if (imagesToRemove.length > 0 || newDetailImages.length > 0) {
      const existingProgramme = await ourProgramme.findOne({ category });

      if (!existingProgramme) {
        return res.status(404).json({
          status: 404,
          message: "Our Programme not found",
        });
      }

      const detailSection = existingProgramme.details.id(detailId);

      if (!detailSection) {
        return res.status(404).json({
          status: 404,
          message: "Detail section not found",
        });
      }

      // Remove selected images
      if (imagesToRemove.length > 0) {
        detailSection.images = detailSection.images.filter(
          (img) => !imagesToRemove.includes(img.url)
        );
      }

      // Add new images if uploaded
      if (newDetailImages.length > 0) {
        detailSection.images = [...detailSection.images, ...newDetailImages];
      }

      // Update images in the detail section
      updateDetail["details.$.images"] = detailSection.images;
    }

    // Update the programme with new data
    const updatedProgramme = await ourProgramme.findOneAndUpdate(
      {
        category,
        "details._id": detailId,
      },
      { $set: updateDetail },
      { new: true }
    );

    if (!updatedProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme or Detail section not found",
      });
    }

    const updatedDetail = updatedProgramme.details.id(detailId);

    return res.status(200).json({
      status: 200,
      message: "Detail section updated successfully",
      updatedDetail,
    });
  } catch (error) {
    console.error("Error updating detail section:", error);
    return res.status(500).json({
      status: 500,
      message: "Error updating detail section",
      error: error.message,
    });
  }
};


const deleteOurProgrammeSectionByID = async (req, res) => {
  try {
    const { category, detailId } = req.params;

    console.log("Deleting Detail Section:", { category, detailId });

    // Find existing programme by category
    const existingProgramme = await ourProgramme.findOne({ category });

    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme not found",
      });
    }

    // Find index of the details section to delete
    const detailIndex = existingProgramme.details.findIndex(
      (d) => d._id.toString() === detailId
    );

    if (detailIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: "Detail section not found",
      });
    }

    // Remove the detail section from the array
    existingProgramme.details.splice(detailIndex, 1);

    // Save the updated programme document
    await existingProgramme.save();

    return res.status(200).json({
      status: 200,
      message: "Detail section deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting detail section:", error);
    return res.status(500).json({
      status: 500,
      message: "Error deleting detail section",
      error: error.message,
    });
  }
};

const deleteOurProgrammeCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    console.log("Deleting Programme Category:", { categoryId });

    // Find the category by ObjectId
    const existingProgramme = await ourProgramme.findById(categoryId);

    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Programme category not found",
      });
    }

    // Remove banner image from Cloudinary if it exists
    if (existingProgramme.banner) {
      try {
        await cloudinary.deleteImageFromCloudinary(existingProgramme.banner);
        console.log("Deleted Banner Image:", existingProgramme.banner);
      } catch (err) {
        console.error("Error deleting banner image from Cloudinary:", err);
      }
    }

    // Remove all detail images from Cloudinary
    for (const detail of existingProgramme.details) {
      if (detail.images && detail.images.length > 0) {
        await Promise.all(
          detail.images.map(async (image) => {
            try {
              await cloudinary.deleteImageFromCloudinary(image.url);
            } catch (err) {
              console.error("Error deleting detail image from Cloudinary:", err);
            }
          })
        );
      }
    }

    // Delete the category from the database
    await ourProgramme.findByIdAndDelete(categoryId);

    return res.status(200).json({
      status: 200,
      message: "Programme category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting programme category:", error);
    return res.status(500).json({
      status: 500,
      message: "Error deleting programme category",
      error: error.message,
    });
  }
};

module.exports = {
  createOurProgramme,
  getourProgrammes,
  getByCategory,
  updateOurProgramme,
  updateOurProgrammeById,
  deleteOurProgrammeSectionByID,
  deleteOurProgrammeCategory
};
