const extractLinksFunction = require('../lambda/extractLinksFunction');

exports.extractLinks = async (req, res) => {
    try {
        const response = await extractLinksFunction.handler();
        res.status(response.statusCode).json(JSON.parse(response.body));
    } catch (error) {
        res.status(500).json({ message: 'Erro ao chamar a função de extração de links' });
    }
};
