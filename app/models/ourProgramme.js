const mongoose = require("mongoose");

const ourProgrammeSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: [
      'Education',
      'Healthcare',
      'Livelihood',
      'Girl Child & Women Empowerment',
      'Privileged Children',
      'Civic Driven Change',
      'Social Entrepreneurship',
      'Special Support ourProgramme',
      'Special Interventions'
    ]},
    banner: { type: String }, // Banner image URL

    details: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        images: [
          {
            images: { type: String }, // Image URL
            title: { type: String, trim: true }, // Image Title
            description: { type: String, trim: true } // Image Description
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

const ourProgramme = mongoose.model("ourProgramme", ourProgrammeSchema);
module.exports = ourProgramme;
