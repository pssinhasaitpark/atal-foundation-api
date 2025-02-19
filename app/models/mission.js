const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    images:[String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", MissionSchema);
