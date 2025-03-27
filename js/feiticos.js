'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button')
    const showAllButton = document.getElementById('show-all-button')
    
    // Carrega todos os feitiços ao iniciar
    getAllSpells();
    
    // Configura o botão de pesquisa
    searchButton.addEventListener('click', () => {
        const spellName = document.getElementById('pesquisa').value.trim()
        if(spellName) {
            getSpellInfo(spellName)
        }
    });
    
    // Configura o botão Mostrar Todos
    showAllButton.addEventListener('click', getAllSpells)
});

async function getAllSpells() {
    try {
        const response = await fetch('https://api.codetabs.com/v1/proxy/?quest=https://www.dnd5eapi.co/api/spells');
        const data = await response.json();
        displaySpells(data.results);
    } catch (error) {
        console.error('Erro ao buscar feitiços:', error)
        displayError('Erro ao carregar feitiços')
    }
}

async function getSpellInfo(spellName) {
    try {
        const response = await fetch(`https://api.codetabs.com/v1/proxy/?quest=https://www.dnd5eapi.co/api/spells/${spellName.toLowerCase()}`);
        if (!response.ok) throw new Error('Feitiço não encontrado')
        const data = await response.json();
        displaySpellDetails(data);
    } catch (error) {
        console.error('Erro ao buscar feitiço:', error)
        displayError(`Feitiço "${spellName}" não encontrado`)
    }
}

function displaySpells(spells) {
    const container = document.getElementById('data-container')
    container.innerHTML = '';
    
    const title = document.createElement('h2')
    title.textContent = 'Lista de Feitiços'
    container.appendChild(title);
    
    const list = document.createElement('ul')
    spells.forEach(spell => {
        const item = document.createElement('li')
        item.textContent = spell.name
        item.style.cursor = 'pointer'
        item.style.padding = '8px'
        item.style.margin = '5px 0'
        item.style.borderRadius = '4px'
        item.style.backgroundColor = '#3a2a2a'
        item.addEventListener('click', () => getSpellInfo(spell.index))
        list.appendChild(item)
    });
    container.appendChild(list)
}

function displaySpellDetails(spell) {
    const container = document.getElementById('data-container')
    container.innerHTML = ''
    
    const title = document.createElement('h2')
    title.textContent = spell.name;
    container.appendChild(title);
    
    const details = document.createElement('div')
    details.innerHTML = `
        <p><strong>Nível:</strong> ${spell.level}</p>
        <p><strong>Escola:</strong> ${spell.school.name}</p>
        <p><strong>Tempo de Conjuração:</strong> ${spell.casting_time}</p>
        <p><strong>Alcance:</strong> ${spell.range}</p>
        <p><strong>Componentes:</strong> ${spell.components.join(', ')}${spell.material ? ` (${spell.material})` : ''}</p>
        <p><strong>Duração:</strong> ${spell.duration}</p>
        <p><strong>Descrição:</strong> ${spell.desc.join(' ')}</p>
    `
    container.appendChild(details);
    
    const backButton = document.createElement('button')
    backButton.textContent = 'Voltar para lista'
    backButton.style.marginTop = '20px'
    backButton.style.backgroundColor = '#6c5ce7'
    backButton.addEventListener('click', getAllSpells)
    container.appendChild(backButton)
}

function displayError(message) {
    const container = document.getElementById('data-container')
    container.innerHTML = `<p class="error">${message}</p>`
}