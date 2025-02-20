const userRoutes = require("../routes/user");
const visionRoutes = require('./vision');
const homeRoutes = require("./home");
const missionRoutes= require("./mission");
const eventRoutes= require("./event");
const contactRoutes= require("./contact");
const messageRoutes= require("./message");
const galleryRoutes= require("./gallery");

module.exports = (app) => {
  app.use("/api", userRoutes);
  app.use('/api/vision', visionRoutes);
  app.use("/api/home", homeRoutes);
  app.use("/api/mission", missionRoutes);
  app.use("/api/event", eventRoutes);
  app.use("/api/contact",contactRoutes);
  app.use("/api/message", messageRoutes);
  app.use("/api/gallery", galleryRoutes);
};
