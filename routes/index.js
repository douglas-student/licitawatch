const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Rota principal da aplicação
router.get('/', mainController.homePage);

module.exports = router;
