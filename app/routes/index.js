const userRoutes = require("../routes/user");
const visionRoutes = require('./vision');
const homeRoutes = require("./home");
const missionRoutes= require("./mission");
module.exports = (app) => {
  app.use("/api", userRoutes);
  app.use('/api/vision', visionRoutes);
  app.use("/api/home", homeRoutes);
  app.use("/api/mission", missionRoutes);
};
