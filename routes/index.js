const express = require('express');
const path = require('path');
const router = express.Router();
const mainController = require('../controllers/mainController');
const extractLinksController = require('../controllers/extractLinksController');
const enhanceScrumController = require('../controllers/enhanceScrumController');

// Rota principal da aplicação
router.get('/', mainController.homePage);

// Rota para a função de extração de links
router.post('/extract-links', extractLinksController.extractLinks);

// Rota para a função de equipe Scrum aprimorada
router.get('/enhanced-scrum-team', enhanceScrumController.getEnhancedScrumTeam);

// Rota para servir arquivos HTML Partials
router.get('/views/partials/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../views/partials', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

module.exports = router;
