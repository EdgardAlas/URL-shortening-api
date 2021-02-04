const showMenu = document.querySelector('#menu-toggle')
const menu = document.querySelector('.main-nav')
const form = document.querySelector('.url-section__form')
const linksList = document.querySelector('.links-list')
const input = document.querySelector('.url-section__input')
const error_span = document.querySelector('.url-section__error')

const errorCode = (error_code, remove = false) => {

    let error = "An error has ocurred";
    if (error_code === 1) {
        error = 'No URL specified'

    } else if (error_code === 2) {
        error = 'Invalid URL submitted'

    }

    if (error_code > 0) {
        input.classList.add('url-section__input--error')
        error_span.textContent = error
        error_span.classList.add('url-section__error--show')
    }

    if (remove) {
        input.classList.remove('url-section__input--error')
        error_span.textContent = ""
        error_span.classList.remove('url-section__error--show')
    }

}

const createItem = (link) => {
    const template = `
    
        <li class="links-list__item">
            <a href="${link.url}" class="links-list__link" target="_blank">${link.url}</a>
        </li>
        <li class="links-list__item">
            <a href="${link.short}" class="links-list__link links-list__link--short" target="_blank">${link.short}</a>
        </li>
        <li class="links-list__item">
            <button class="links-list__copy" type="button" data-copy=${link.short}>Copy</button>
        </li>
    
    `;
    const ul = document.createElement('UL')
    ul.innerHTML = template
    ul.classList.add('links-list__links')
    return ul
}

const shortingAPI = async (url) => {
    try {
        const api = `https://api.shrtco.de/v2/shorten?url=${url}`
        const { data } = await axios.get(api)
        return data
    } catch (error) {
        if (error.response) {
            errorCode(error.response.data.error_code);
        }
    }
}

const addLink = async (url, storage) => {

    try {
        Swal.showLoading()

        const response = await shortingAPI(url);

        if (!response.ok) {


            if (response.error_code === 1) {
                alert('No URL specified ')
                return false
            }

            if (response.error_code === 2) {
                alert('Invalid URL submitted')
                return false
            }


            return false
        }

        const link = {
            url,
            short: response.result.full_short_link
        }

        storage.push(link)

        localStorage.setItem('links', JSON.stringify(storage))

        linksList.appendChild(createItem(link))

    } catch (error) {

    } finally {
        Swal.close()
    }

}

const initLinkList = (list) => {

    const fragment = document.createDocumentFragment();
    const clear = document.createElement('BUTTON')

    if (list.length > 0) {

        clear.classList.add('links-list__clear')
        clear.textContent = "Clear"
    }

    fragment.appendChild(clear)

    for (const key in list) {
        const link = list[key]
        fragment.appendChild(createItem(link))
    }
    linksList.appendChild(fragment)


}

const init = () => {
    const links = localStorage.getItem('links')

    if (links === null) {
        while (linksList.firstChild && !linksList.firstChild.remove());
        localStorage.setItem('links', JSON.stringify([]))
        return false
    }

    initLinkList(JSON.parse(links))
}


showMenu.addEventListener('click', (e) => {
    menu.classList.toggle('main-nav--show')
})

linksList.addEventListener('click', (e) => {
    const target = e.target
    if (target.classList.contains("links-list__copy")) {
        target.blur()
        target.textContent = "Copied!"

        target.classList.add('links-list__copy--copied')


        const copy = target.dataset.copy


        const input = document.createElement('input');
        input.value = copy
        input.id = 'input-copy';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);


        setTimeout(() => {
            target.classList.remove('links-list__copy--copied')
            target.textContent = "Copy"
        }, 1000)
    } else if (target.classList.contains("links-list__clear")) {
        target.blur()
        localStorage.clear()
        init()
    }
})

input.addEventListener('keyup', (e) => {
    errorCode(0, true)
    if (!e.currentTarget.value.length) {
        errorCode(1)
    }

})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    errorCode(0, true)

    e.currentTarget.elements['add-item'].blur()

    const url = e.currentTarget.elements['url'].value

    let storage = localStorage.getItem('links');

    if (storage === null)
        init()

    storage = localStorage.getItem('links');

    const links = JSON.parse(storage)

    addLink(url, links)

})

addEventListener('DOMContentLoaded', () => {
    init()
})
