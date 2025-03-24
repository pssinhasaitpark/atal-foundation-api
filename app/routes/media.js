// var router = require('express').Router()
// const path = require("path")

// module.exports = app => {
//     router.get('/media/:name', (req, res) => {
//         const { type, name } = req.params
//         res.sendFile(path.join(__dirname, `../uploads/${name}`,))
//     })

//     app.use('/', router)
// };

var router = require('express').Router()
const path = require("path")
const fs= require('fs')

module.exports = app => {
    router.get('/media/:name', (req, res) => {
        const { type, name } = req.params
        console.log("req.params===",req.params);
        res.sendFile(path.join(__dirname, `../uploads/${name}`,))
    })

    
    app.use('/', router)
};

module.exports = app => {
    router.get('/media/videos/:name', (req, res) => {
      const { name } = req.params;
      const filePath = path.join(__dirname, `../uploads/videos/${name}`);
  
      // Check if the video file exists
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send({ message: 'Video not found' });
      }
    });
  
    app.use('/', router);
};