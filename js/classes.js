'use strict';

// Lista de classes válidas
const VALID_CLASSES = [
    'barbarian', 'bard', 'cleric', 'druid', 'fighter',
    'monk', 'paladin', 'ranger', 'rogue', 'sorcerer',
    'warlock', 'wizard'
];


async function safeFetch(url, options = {}, timeout = 15000) {
    const controller = new AbortController()
    const { signal } = controller
    
   
    const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Request timeout após', timeout, 'ms')
    }, timeout)

    try {
        const response = await fetch(url, { ...options, signal })
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`A requisição excedeu o tempo limite de ${timeout/1000} segundos`);
        }
        throw error
    }
}


window.getClassInfo = async function(className) {
    const dataContainer = document.getElementById('data-container')
    className = className.toLowerCase().trim()

    if (!VALID_CLASSES.includes(className)) {
        dataContainer.textContent = `Classe inválida! Use uma dessas:\n${VALID_CLASSES.join(', ')}`
        return;
    }

    dataContainer.textContent = `Buscando dados para ${className}...`;

    try {
        const data = await safeFetch(`https://api.codetabs.com/v1/proxy/?quest=https://www.dnd5eapi.co/api/classes/${className}`);
        displayClassData(data);
    } catch (error) {
        console.error('Erro detalhado:', error);
        dataContainer.textContent = `Erro ao buscar ${className}:\n${error.message}\n\nPor favor, tente novamente.`
    }
}


function displayClassData(classData) {
    const container = document.getElementById('data-container')
    
    let output = `\n`
    output += `  ${classData.name.toUpperCase()}\n`
    output += `\n\n`;
    output += `• Dado de Vida: d${classData.hit_die}\n\n`
    output += `• Proficiências:\n`
    
    classData.proficiencies.forEach(prof => {
        output += `  - ${prof.name}\n`;
    });
    
    output += `\n• Salvamentos:\n`;
    classData.saving_throws.forEach(st => {
        output += `  - ${st.name}\n`;
    });
    
    if (classData.starting_equipment?.length > 0) {
        output += `\n• Equipamento Inicial:\n`;
        classData.starting_equipment.forEach(item => {
            output += `  - ${item.equipment.name} (${item.quantity})\n`
        })
    }
    
    container.textContent = output
}


document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-button')
    const searchInput = document.getElementById('pesquisa')
    
  
    searchBtn.addEventListener('click', () => {
        const className = searchInput.value.trim()
        if (className) getClassInfo(className)
    })
    
   
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            getClassInfo(searchInput.value.trim())
        }
    })
})