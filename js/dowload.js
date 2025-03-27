'use strict'
function baixarArquivo(nomeArquivo) {
   
    const link = document.createElement('a')
    link.href = nomeArquivo;
    link.download = nomeArquivo.split('/').pop()

   
    link.click()
  }
