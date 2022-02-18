const templateCard = document.getElementById('item-card').content;
const cards = document.getElementById('cardsHome');
const fragment = document.createDocumentFragment()

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount)
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount

        const negativeSign = amount < 0 ? "-" : ""

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
        let j = (i.length > 3) ? i.length % 3 : 0

        return "$ " + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "")
    } catch (e) {
        console.log(e)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})

const fetchData = async () => {
    try {
        const res = await fetch('http://localhost:3000/lista')
        const data = await res.json()
        console.log(data);
        showList(data)
    } catch (error) {
        console.log(error)
    }
}

const showList = (data) => {
    data.forEach(element => {
        templateCard.querySelector("h5").textContent = element.title;
        templateCard.querySelector("p").textContent = element.descripcion;
        templateCard.querySelector("span").textContent = formatMoney(element.precio);
        templateCard.querySelector("img").setAttribute("src", element.image)
        templateCard.querySelector('.btn-primary').dataset.id = element.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const setCarrito = objeto => {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    const price = objeto.querySelector('span').textContent
    const producto = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: Number(price.replace(/[^0-9\.]+/g,"")),
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

cards.addEventListener('click', e => {
    addCarrito(e);
})