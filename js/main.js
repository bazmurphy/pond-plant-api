// Client Side JavaScript
// main.js

document.getElementById('getPlantButton').addEventListener('click', getAPlant)

async function getAPlant() {
    const plantName = document.getElementById('getPlantTextInput').value
    // console.log(plantName)
    try {
        const response = await fetch(`https://pond-plants-api.herokuapp.com/api/${plantName}`)
        const data = await response.json()
        // console.log(data)

        document.getElementById('commonName').innerText = capitalise(data.commonName)
        document.getElementById('scientificName').innerText = data.scientificName
        document.getElementById('description').innerText = data.description
        document.getElementById('plantImage').src = data.image

    } catch (error) {
        console.log(error)
    }
}

function capitalise(word) {
    return word
        .split(" ")
        .map(element => element.charAt(0).toUpperCase() + element.substring(1).toLowerCase())
        .join(" ")
}