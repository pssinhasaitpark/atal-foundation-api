const userRoutes = require("../routes/user");
const visionRoutes = require('./vision');
const homeRoutes = require("./home");

module.exports = (app) => {
  app.use("/api", userRoutes);
  app.use('/api/vision', visionRoutes);
  app.use("/api/home", homeRoutes);
};
