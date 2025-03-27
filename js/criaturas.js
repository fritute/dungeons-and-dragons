'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button')
    const showAllButton = document.getElementById('show-all-button')
    
    getAllMonsters()
    
    searchButton.addEventListener('click', () => {
        const monsterName = document.getElementById('pesquisa').value.trim()
        if(monsterName) {
            getMonsterInfo(monsterName)
        }
    })
    
    showAllButton.addEventListener('click', getAllMonsters)
})

async function getAllMonsters() {
    try {
        const response = await fetch('https://api.codetabs.com/v1/proxy/?quest=https://www.dnd5eapi.co/api/monsters')
        const data = await response.json()
        displayMonsters(data.results)
    } catch (error) {
        console.error('Erro ao buscar criaturas:', error)
        displayError('Erro ao carregar criaturas')
    }
}

async function getMonsterInfo(monsterName) {
    try {
        const response = await fetch(`https://api.codetabs.com/v1/proxy/?quest=https://www.dnd5eapi.co/api/monsters/${monsterName.toLowerCase()}`)
        if (!response.ok) throw new Error('Criatura não encontrada')
        const data = await response.json()
        displayMonsterDetails(data)
    } catch (error) {
        console.error('Erro ao buscar criatura:', error)
        displayError(`Criatura "${monsterName}" não encontrada`)
    }
}

function displayMonsters(monsters) {
    const container = document.getElementById('data-container')
    container.innerHTML = ''
    
    const title = document.createElement('h2')
    title.textContent = 'Lista de Criaturas'
    container.appendChild(title)
    
    const list = document.createElement('ul')
    monsters.forEach(monster => {
        const item = document.createElement('li')
        item.textContent = monster.name
        item.addEventListener('click', () => getMonsterInfo(monster.index))
        list.appendChild(item)
    })
    container.appendChild(list)
}

function displayMonsterDetails(monster) {
    const container = document.getElementById('data-container')
    container.innerHTML = ''
    
    const card = document.createElement('div')
    card.className = 'monster-card'
    

    if (monster.image) {
        const imageContainer = document.createElement('div')
        imageContainer.className = 'monster-image'
        
        const img = document.createElement('img')
        img.src = `https://api.codetabs.com/v1/proxy/?quest=https://www.dnd5eapi.co${monster.image}`
        img.alt = monster.name
        img.onerror = () => imageContainer.remove()
        
        imageContainer.appendChild(img)
        card.appendChild(imageContainer)
    }
    
 
    const infoContainer = document.createElement('div')
    infoContainer.className = 'monster-info'
    
    const title = document.createElement('h2')
    title.textContent = monster.name
    infoContainer.appendChild(title)
    

    const basicInfo = document.createElement('div')
    basicInfo.innerHTML = `
        <p><strong>Tipo:</strong> ${monster.type}, ${monster.size}</p>
        <p><strong>Alinhamento:</strong> ${monster.alignment}</p>
        <p><strong>Classe de Armadura:</strong> ${monster.armor_class[0].value} (${monster.armor_class[0].type})</p>
        <p><strong>Pontos de Vida:</strong> ${monster.hit_points} (${monster.hit_points_roll})</p>
        <p><strong>Desafio:</strong> ${monster.challenge_rating} (${monster.xp} XP)</p>
        <p><strong>Deslocamento:</strong> ${Object.entries(monster.speed).map(([k,v]) => `${k} ${v}`).join(', ')}</p>
    `
    infoContainer.appendChild(basicInfo)
    
    // Atributos
    const attributes = document.createElement('div')
    attributes.innerHTML = `
        <h3>Atributos</h3>
        <p><strong>Força:</strong> ${monster.strength} (${Math.floor((monster.strength-10)/2)})</p>
        <p><strong>Destreza:</strong> ${monster.dexterity} (${Math.floor((monster.dexterity-10)/2)})</p>
        <p><strong>Constituição:</strong> ${monster.constitution} (${Math.floor((monster.constitution-10)/2)})</p>
        <p><strong>Inteligência:</strong> ${monster.intelligence} (${Math.floor((monster.intelligence-10)/2)})</p>
        <p><strong>Sabedoria:</strong> ${monster.wisdom} (${Math.floor((monster.wisdom-10)/2)})</p>
        <p><strong>Carisma:</strong> ${monster.charisma} (${Math.floor((monster.charisma-10)/2)})</p>
    `
    infoContainer.appendChild(attributes)
    
    // Habilidades especiais
    if (monster.special_abilities && monster.special_abilities.length > 0) {
        const abilitiesContainer = document.createElement('div')
        abilitiesContainer.className = 'monster-abilities'
        
        const abilitiesTitle = document.createElement('h3')
        abilitiesTitle.textContent = 'Habilidades Especiais'
        abilitiesContainer.appendChild(abilitiesTitle)
        
        monster.special_abilities.forEach(ability => {
            const abilityDiv = document.createElement('div')
            abilityDiv.className = 'ability'
            
            const abilityName = document.createElement('h4')
            abilityName.textContent = ability.name
            abilityDiv.appendChild(abilityName)
            
            const abilityDesc = document.createElement('p')
            abilityDesc.textContent = ability.desc
            abilityDiv.appendChild(abilityDesc)
            
            abilitiesContainer.appendChild(abilityDiv)
        })
        
        infoContainer.appendChild(abilitiesContainer)
    }
    
    // Ações
    if (monster.actions && monster.actions.length > 0) {
        const actionsContainer = document.createElement('div')
        actionsContainer.className = 'monster-actions'
        
        const actionsTitle = document.createElement('h3')
        actionsTitle.textContent = 'Ações'
        actionsContainer.appendChild(actionsTitle)
        
        monster.actions.forEach(action => {
            const actionDiv = document.createElement('div')
            actionDiv.className = 'action'
            
            const actionName = document.createElement('h4')
            actionName.textContent = action.name
            actionDiv.appendChild(actionName)
            
            const actionDesc = document.createElement('p')
            actionDesc.textContent = action.desc
            actionDiv.appendChild(actionDesc)
            
            if (action.attack_bonus) {
                const attackBonus = document.createElement('p')
                attackBonus.innerHTML = `<strong>Bônus de Ataque:</strong> +${action.attack_bonus}`
                actionDiv.appendChild(attackBonus)
            }
            
            if (action.damage) {
                const damageInfo = document.createElement('p')
                damageInfo.innerHTML = `<strong>Dano:</strong> ${action.damage.map(d => `${d.damage_dice} ${d.damage_type.name}`).join(', ')}`
                actionDiv.appendChild(damageInfo)
            }
            
            actionsContainer.appendChild(actionDiv)
        })
        
        infoContainer.appendChild(actionsContainer)
    }
    
    card.appendChild(infoContainer)
    container.appendChild(card)
    

    const backButton = document.createElement('button')
    backButton.className = 'back-button'
    backButton.textContent = 'Voltar para lista'
    backButton.addEventListener('click', getAllMonsters)
    container.appendChild(backButton)
}

function displayError(message) {
    const container = document.getElementById('data-container')
    container.textContent = message
}