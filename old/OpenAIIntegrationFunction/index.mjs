import https from 'https';

export const handler = async (event) => {
    const body = JSON.stringify({
        model: "gpt-4", // Certifique-se de que este modelo esteja disponível para você
        messages: [
            {
                role: "user",
                content: "Identifique e extraia da tag article presente no código html os dados de todas as licitações ou pregões presentes."
            }
        ],
        max_tokens: 1000,
        temperature: 0.7,
    });

    const { OPENAI_API_KEY } = require('./config');
    
    const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: data,
                });
            });
        });

        req.on('error', (e) => {
            reject({
                statusCode: 500,
                body: JSON.stringify(e),
            });
        });

        req.write(body);
        req.end();
    });
};
