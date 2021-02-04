const showMenu = document.querySelector('#menu-toggle')
const menu = document.querySelector('.main-nav')

showMenu.addEventListener('click', (e) => {
    menu.classList.toggle('main-nav--show')
})

// window.scrollTo(0,document.querySelector("body").scrollHeight)
