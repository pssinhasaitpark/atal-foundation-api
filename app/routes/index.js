const userRoutes = require("../routes/user");
const visionRoutes = require('./vision');

module.exports = (app) => {
  app.use("/api", userRoutes);
  app.use('/api/vision', visionRoutes);
};
