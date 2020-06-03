function populateUFs () {
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then( res => res.json() )
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
 
    })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")
    
    const ufValue = event.target.value 

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`


    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
 
        citySelect.disabled = false

    })
}

// ouvidor de eventos ao Uf / mudei
document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

    // items de coleta
    // pegar todos os li's
    const itemsToCollect = document.querySelectorAll(".items-grid li")
    // add o ouvidor de eventos / click
    for (const item of itemsToCollect) {
        item.addEventListener("click", handleSelectItem)
    }

    const collectedItems = document.querySelector("input[name=items]")

    // quais são os itens selecionados, coleção = aray
    let selectedItems = []

    // criando a função
    // sabendo que quando o evento é disparado ele passa pra dentro da função um evento
    function handleSelectItem(event) {
   
    //target é cada um do li que está criando
    const itemLi = event.target

   // adicionar ou remover uma classe com javascript
    //toggle = adicionar ou remover 
   itemLi.classList.toggle("selected")
   
    //dataset.id coloca só os numeros
    const itemId = itemLi.dataset.id


    // verificar se existem itens selecionados, se sim
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( item =>  {
        const itemFound = item == itemId // isso sera true ou false
        return itemFound
    //fica rodando até que ache o item verdadeiro
    //findIndex pega o item(1) e verifica colocando de um lado o item 1 e o outro itemId, == significa que tá comparando valor
    })

    // se já estiver selecionado
    if( alreadySelected >= 0 ) { // se o already for maior ou igual a 0 verdadeiro
    // tirar da seleção
    const filteredItems = selectedItems.filter ( item => {
        const itemIsDifferent = item != itemId // false
        return itemIsDifferent // quando o retorno for false vai ser retirado do aray
    })

    selectedItems = filteredItems

    }


    //se não estiver selecionado
    else {
    // adicionar a seleção
    selectedItems.push(itemId)
    }

    // atualizar o campo escondido com os itens selecionados
    // código de atualizar , mas está la em cima const collectedItems = document.querySelector("input[name=items]")

    collectedItems.value = selectedItems //sempre atualizar
        
    }


  