const socket = io()

let products = []

socket.on('newProduct', data => {
    let log = document.createElementById('productsLog')
    products.push(data)
    log.innerHTML = products
})