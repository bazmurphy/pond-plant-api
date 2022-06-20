// Client Side JavaScript
// main.js

document.getElementById('get-plant-button').addEventListener('click', getAPlant)

async function getAPlant() {
    const plantName = document.getElementById('get-plant-text-input').value
    console.log(plantName)
    try {
        const response = await fetch(`https://pond-plants-api.herokuapp.com/api/${plantName}`)
        const data = await response.json()
        console.log(data)

        document.getElementById('commonName').innerText = data.commonName
        document.getElementById('scientificName').innerText = data.scientificName
        document.getElementById('plantDescription').innerText = data.plantDescription
        document.getElementById('plantImage').src = data.plantImage

    } catch (error) {
        console.log(error)
    }
}

// function capitalise(word) {
//     return word
//         .split(" ")
//         .map(element => element.charAt(0).toUpperCase() + element.substring(1).toLowerCase())
//         .join(" ")
// }