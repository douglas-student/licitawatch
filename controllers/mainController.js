const path = require('path');
const extractLinksController = require('./extractLinksController');

exports.homePage = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/home.html'));
};

exports.extractLinks = extractLinksController.extractLinks;
