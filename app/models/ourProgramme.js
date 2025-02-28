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
    banner: { type: String }, 

    details: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        images: [{ url: { type: String } }]
      }
    ]
  },
  { timestamps: true }
);

const ourProgramme = mongoose.model("ourProgramme", ourProgrammeSchema);
module.exports = ourProgramme;
