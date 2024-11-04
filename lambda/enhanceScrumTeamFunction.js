const fs = require('fs');
const path = require('path');

// Função Lambda para adicionar habilidades à equipe Scrum
exports.enhanceScrumTeam = async () => {
    try {
        // Lê o arquivo JSON
        const filePath = path.join(__dirname, '../public/data/scrum-team.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const team = JSON.parse(rawData);

        // Habilidades fictícias para cada cargo
        const skills = {
            "Scrum Master": "Facilita sprints, gerencia progresso da equipe.",
            "Product Owner": "Define backlog, prioriza funcionalidades.",
            "Developer": "Escreve e mantém código.",
            "Tester": "Garante a qualidade do produto.",
            "UX Designer": "Desenha interfaces amigáveis."
        };

        // Acrescenta as habilidades
        const enhancedTeam = team.map(member => ({
            ...member,
            skills: skills[member.role] || "Habilidades gerais para o cargo."
        }));

        // Retorna o novo JSON
        return { statusCode: 200, body: JSON.stringify(enhancedTeam) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao processar equipe Scrum' }) };
    }
};
