const SocialMedia = require("../../models/socialMedia");


const createSocialMedia = async (req, res) => {
    try {
      const { whatsapp, facebook, instagram, youtube, linkedIn, snapchat, thread, pinterest, x } = req.body;
  
      const existingSocialMedia = await SocialMedia.findOne();
      if (existingSocialMedia) {
        return res.status(400).json({ message: "Social media links already exist. Use update instead." });
      }
  
      const socialMedia = new SocialMedia({
        whatsapp: { link: whatsapp},
        facebook: { link: facebook },
        instagram: { link: instagram },
        youtube: { link: youtube },
        linkedIn: { link: linkedIn },
        snapchat: { link: snapchat},
        thread: { link: thread },
        pinterest: { link: pinterest },
        x: { link: x }
      });
  
      await socialMedia.save();
      return res.status(201).json({ message: "Social media links created successfully!", socialMedia });
  
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "An error occurred while creating social media links." });
    }
};
  
// const updateSocialMedia = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     const { whatsapp, facebook, instagram, youtube, linkedIn, snapchat, thread, pinterest, x } = req.body;

//     const socialMedia = await SocialMedia.findById(id);
//     if (!socialMedia) {
//       return res.status(404).json({ message: "Social media record not found." });
//     }

//       socialMedia.set({
//         whatsapp: whatsapp ? { link: whatsapp } : socialMedia.whatsapp,
//         facebook: facebook ? { link: facebook } : socialMedia.facebook,
//         instagram: instagram ? { link: instagram } : socialMedia.instagram,
//         youtube: youtube ? { link: youtube } : socialMedia.youtube,
//         linkedIn: linkedIn ? { link: linkedIn } : socialMedia.linkedIn,
//         snapchat: snapchat ? { link: snapchat } : socialMedia.snapchat,
//         thread: thread ? { link: thread } : socialMedia.thread,
//         pinterest: pinterest ? { link: pinterest } : socialMedia.pinterest,
//         x: x ? { link: x } : socialMedia.x,
//       });
  

//     await socialMedia.save();
//     return res.status(200).json({ message: "Social media links updated successfully!", socialMedia });

//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({ error: "An error occurred while updating social media links." });
//   }
// };

const updateSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      whatsapp,
      facebook,
      instagram,
      youtube,
      linkedIn,
      snapchat,
      thread,
      pinterest,
      x,
    } = req.body;

    const updatedData = {
      whatsapp: whatsapp ? { link: whatsapp } : undefined,
      facebook: facebook ? { link: facebook } : undefined,
      instagram: instagram ? { link: instagram } : undefined,
      youtube: youtube ? { link: youtube } : undefined,
      linkedIn: linkedIn ? { link: linkedIn } : undefined,
      snapchat: snapchat ? { link: snapchat } : undefined,
      thread: thread ? { link: thread } : undefined,
      pinterest: pinterest ? { link: pinterest } : undefined,
      x: x ? { link: x } : undefined,
    };

    // Remove undefined values from the object
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    const socialMedia = await SocialMedia.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!socialMedia) {
      return res.status(404).json({ message: "Social media record not found." });
    }

    return res
      .status(200)
      .json({ message: "Social media links updated successfully!", socialMedia });
  } catch (error) {
    console.error("❌ Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating social media links." });
  }
};

const getSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findOne();
    if (!socialMedia) {
      return res.status(404).json({ error: "No social media links found" });
    }
    res.status(200).json(socialMedia);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "An error occurred while fetching social media links." });
  }
};

const deleteSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findOneAndDelete();
    if (!socialMedia) {
      return res.status(404).json({ error: "No social media links found to delete" });
    }
    res.status(200).json({ message: "Social media links deleted successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "An error occurred while deleting social media links." });
  }
};

module.exports = { createSocialMedia, getSocialMedia, updateSocialMedia, deleteSocialMedia };

