// routes/licitacoes.js
const express = require('express');
const router = express.Router();
const { processPDF } = require('../controllers/extractLicitationDataController');

// Rota para processar o PDF e extrair os dados
router.post('/extrair-dados', async (req, res) => {
  const pdfPath = req.body.pdfPath;  // Caminho do arquivo PDF enviado
  try {
    const extractedData = await processPDF(pdfPath);
    res.json(extractedData);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar o PDF', error });
  }
});

module.exports = router;
