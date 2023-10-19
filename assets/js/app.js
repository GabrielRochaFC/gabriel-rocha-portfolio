// Pegando os elementos
let botaoHamburguer = document.getElementById("header__menu-hamburguer--botao")
let botaoFechar = document.getElementById("botaoFechar")
let navbar = document.getElementById("header__menu-hamburguer--nav")

// Função para mostrar o menu
function mostraMenuHamburguer() {
    // Verificando se o navbar está ativo ou inativo e trocando as classes
    if (navbar.classList.contains("header__menu-hamburguer--inactive")) {
        navbar.classList.remove("header__menu-hamburguer--inactive")
        navbar.classList.add("header__menu-hamburguer--active")
    } else if (navbar.classList.contains("header__menu-hamburguer--active")) {
        navbar.classList.remove("header__menu-hamburguer--active")
        navbar.classList.add("header__menu-hamburguer--inactive")
    }
}

botaoFechar.addEventListener('click', mostraMenuHamburguer)
botaoHamburguer.addEventListener('click', mostraMenuHamburguer)