// Client Side JavaScript
// main.js

document.getElementById('read-one-plant-button').addEventListener('click', readOnePlant)
document.getElementById('update-plant-button').addEventListener('click', updatePlant)
document.getElementById('delete-plant-button').addEventListener('click', deletePlant)

async function readOnePlant() {
    const textFromInput = document.getElementById('read-one-plant-text-input').value
    console.log(textFromInput)
    try {
        const response = await fetch(`https://pond-plants-api.herokuapp.com/api/${textFromInput}`)
        const data = await response.json()
        console.log(data)
        document.getElementById('read-one-common-name').innerText = data.commonName
        document.getElementById('read-one-scientific-name').innerText = data.scientificName
        document.getElementById('read-one-description').innerText = data.description
        document.getElementById('read-one-image').src = data.image

    } catch (error) {
        console.log(error)
    }
}

async function updatePlant() {
    try {
        const response = await fetch('updatePlant', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                commonName: document.getElementById('update-common-name').value,
                scientificNameName: document.getElementById('update-scientific-name').value,
                description: document.getElementById('update-description').value,
                image: document.getElementById('update-image').value
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}


async function deletePlant() {
    const textFromInput = document.getElementById('delete-plant-text-input').value
    console.log(textFromInput)
    try {
        const response = await fetch('deletePlant', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                commonName: textFromInput
            })
        })
        console.log(response)
        const data = await response.json()
        console.log(data)
        location.reload()
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