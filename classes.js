'use strict';

// Função para pesquisar classe
function getClassInfo(className) {
    console.log('Buscando informações da classe:', className);
    
    const apiUrl = `https://www.dnd5eapi.co/api/classes/${className}`;
    
    fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        console.log('Dados retornados da API:', data);
        const dataContainer = document.getElementById('data-container');
        
        // Garantindo que o data-container foi encontrado
        if (dataContainer) {
          // Exibindo dados de uma forma mais legível
          let textContent = `
            <h2>Classe: ${data.name}</h2>
            <p><strong>Descrição:</strong> ${data.description}</p>
            <p><strong>Características:</strong> 
            ${data.features && data.features.length > 0 ? data.features.map(feature => feature.name).join(', ') : 'Nenhuma encontrada'}
            </p>
          `;

          // Colocando o conteúdo no elemento data-container
          dataContainer.innerHTML = textContent; // Usando innerHTML para renderizar HTML
        } else {
          console.error('Elemento dataContainer não encontrado');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
}

// Chamada da função para testar com o nome da classe
getClassInfo('barbarian'); // Exemplo com o nome da classe 'barbarian'
