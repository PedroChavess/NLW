

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => {return res.json() })
    .then( states => {

        for( const state of states) {
            ufSelect.innerHTML +=  `<option value="${state.id}">${state.nome}</option>`
        }

    } )
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]") 

    const ufValue = (event.target.value)

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url= `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( (res) => {return res.json() })
    .then( cities => {
        
        for( const city of cities) {
            citySelect.innerHTML +=  `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false;

    } )    

}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//itens de coleta
// pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = [] //foi deixado como let pois precisa sobrescrever esse valor. o const é uma constante e n pode mudar.


function handleSelectedItem(event) {

    const itemLi = event.target

    //adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected") //ele adiciona ou remove. faz os dois ao mesmo tempo. Se tiver a class selected ele remove e se n tiver ele adiciona.
    
    const itemId = itemLi.dataset.id //consegue pegar o id das li's
    
    //console.log('ITEM ID: ', itemId)

    //verificar se existem itens selecionados, se sim
    //pegar os itens selecionados

    const alredySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId //isso será true ou false
        return itemFound
    })



    //se já estiver selecionado, 

    if ( alredySelected >= 0 ) {
        // tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId //vai retornar false  evai tirar do novo arrays
            return itemIsDifferent
        })

        selectedItems = filteredItems
    }   else {
            //se não estiver selecionado,
            //adicionar à seleção
            selectedItems.push(itemId)
    }

    //console.log('selectedItems: ', selectedItems)
 
    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
    
}

//sempre que tiver uma dúvida sobre a lógica do código, é só usar o console.log pra poder ver como os objetos estao se comportando