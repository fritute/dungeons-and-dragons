'use strict'
function baixarArquivo(nomeArquivo) {
    // Cria um link temporário para fazer o download do arquivo
    const link = document.createElement('a');
    link.href = nomeArquivo; 
    link.download = nomeArquivo.split('/').pop(); 

    // Dispara o click para fazer o download
    link.click();
  }
