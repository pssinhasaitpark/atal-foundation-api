const userRoutes = require("../routes/user");
const visionRoutes = require('./vision');
const homeRoutes = require("./home");
const missionRoutes= require("./mission");
const eventRoutes= require("./event");
const contactRoutes= require("./contact");
const messageRoutes= require("./message");
const galleryRoutes= require("./gallery");
const subscribeRoutes= require("./subscribe");
const aboutRoutes= require("./about");
const socialMediaRoutes= require("./socialMedia");
const ourProgrammeRoutes= require("./ourProgramme");
const eventVideoRoutes= require("./eventVideo");
const newsRoutes= require("./news")
const homePageRoutes= require("./homePage")

module.exports = (app) => {
  app.use("/api", userRoutes);
  app.use('/api/vision', visionRoutes);
  app.use("/api/home", homeRoutes);
  app.use("/api/mission", missionRoutes);
  app.use("/api/event", eventRoutes);
  app.use("/api/contact",contactRoutes);
  app.use("/api/message", messageRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/subscribers", subscribeRoutes);
  app.use("/api/about", aboutRoutes);
  app.use("/api/social-media", socialMediaRoutes);
  app.use("/api/our-programme", ourProgrammeRoutes);
  app.use("/api/event-videos", eventVideoRoutes);
  app.use("/api/news", newsRoutes);
  app.use("/api/homePage", homePageRoutes)
};
