const enhanceScrumTeamFunction = require('../lambda/enhanceScrumTeamFunction');

// Controlador para chamar a função Lambda
exports.getEnhancedScrumTeam = async (req, res) => {
    const result = await enhanceScrumTeamFunction.enhanceScrumTeam();
    res.status(result.statusCode).send(JSON.parse(result.body));
};
