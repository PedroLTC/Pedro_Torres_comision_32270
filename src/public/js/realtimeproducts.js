const socket = io(`http://localhost:8080`)

console.log(`Estoy conectado al server`)

function enviaData(e) {
    let producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value
    }

    socket.emit(`newProduct`, producto)
    return false
}

socket.on('productsLogs', data => {
    let log = document.getElementById('productsLogs')
    let products = ''
    data.forEach(element => {
    products = products + `<li>Title: ${element.title} || Description:${element.description} || Price:${element.price} || Thumbnail:${element.thumbnail} || Code:${element.code} || Stock:${element.stock}</li><br>`
    });
    log.innerHTML = products
})
