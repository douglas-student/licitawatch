exports.handler = async (event) => {
    const htmlContent = event.htmlContent || '';

    // Remover todo o conteúdo entre as tags <script> e </script>
    const cleanedHTML = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '')
                                   .replace(/\n/g, '')  // Remover quebras de linha
                                   .replace(/\t/g, ''); // Remover tabulações

    return {
        statusCode: 200,
        body: cleanedHTML,
    };
};
