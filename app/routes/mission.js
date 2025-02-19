const express = require("express");
const router = express.Router();
const { mission } = require("../controllers");
const { upload , convertImagesToWebP} = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

// Routes
router.post("/create", verifyUser, verifyAdmin, upload, convertImagesToWebP, mission.createMission);
router.get("/", mission.getAllMissions);
router.get("/:id", mission.getMissionById);
router.put("/:id", verifyUser, verifyAdmin, upload, convertImagesToWebP, mission.updateMission);
router.delete("/:id", verifyUser, verifyAdmin, mission.deleteMission);

module.exports = router;
