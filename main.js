// Настройки
const apiKey = 'bf9dac0d-a6d0-4178-9f75-1bd488d17d4a';
const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
};

// DOM элементы
const filmsWrapper = document.querySelector('.films')
const loader = document.querySelector('.loader-wrapper');
const btnShowMore = document.querySelector('.show-more');
btnShowMore.onclick = fetchAndRenderFilms;

let page = 1;

// Получение и вывод ТОП 250 фильмов
async function fetchAndRenderFilms() {
    // Show preloader
    loader.classList.remove('none')

    // Fetch films data
    const data = await fetchData(url + `top?page=${page}`, options);
    if (data.pagesCount > 1) page++;

    // Отображаем кнопку "Следующие 20 фильмов" если страниц больче чем 1
    if (data.pagesCount > 1) btnShowMore.classList.remove('none');


    // Hide preloader
    loader.classList.add('none');

    // Render films on page
    renderFilms(data.films)

    // Скрыть кнопку, если следующей страницы не существует
    if (page > data.pagesCount) btnShowMore.classList.add('none');
}

async function fetchData(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

function renderFilms(films) {
    for (film of films) {

        const card = document.createElement('div');
        card.classList.add('card');
        card.id = film.filmId;

        card.onclick = openFilmDetails;

        const html = `
                    <img src=${film.posterUrlPreview} alt="Cover" class="card__img">
                    <h3 class="card__title">${film.nameRu}</h3>
                    <p class="card__year">${film.year}</p>
                    <p class="card__rate">Рейтинг: ${film.rating}</p>
                `;

        card.insertAdjacentHTML('afterbegin', html);

        // filmsWrapper.insertAdjacentHTML('beforeend', html);
        filmsWrapper.insertAdjacentElement('beforeend', card);
    }
}

async function openFilmDetails(e) {

    // Достаем Id фильма
    const id = e.currentTarget.id;

    // Получаем данные фильма
    const data = await fetchData(url + id, options);

    // Отобразить детали фильма на странице
    renderFilmData(data);
}

function renderFilmData(film) {

    // 0. Проверка на открытый фильм, и его удаление
    if (document.querySelector('.container-right')) document.querySelector('.container-right').remove()

    // 1. Отрендерить container-rigt
    const containerRight = document.createElement('div')
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    // 2. Кнопка закрытия
    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', btnClose);


    // 2.1 Кнопка закрытия по клику - удаление контейнера со страницы
    btnClose.onclick = () => { containerRight.remove() }


    // 3. Детали фильма
    const html = `<div class="film">

    <div class="film__title">${film.nameRu}</div>

    <div class="film__img">
        <img src=${film.posterUrl} alt="Cover">
    </div>

    <div class="film__desc">
        <p class="film__details">Год: ${film.year}</p>
        <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
        <p class="film__details">Продолжительность: ${formatFilmLength(film.filmLength)}</p>
        <p class="film__details">Страна: ${formatCountry(film.countries)}</p>
        <p class="film_text">${film.description}</p>
    </div>

</div>`;
    containerRight.insertAdjacentHTML('beforeend', html);
}

function formatFilmLength(value) {
    let length = '';
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours > 0) length += hours + ' ч. ';
    if (minutes > 0) length += minutes + ' мин.';

    return length;
}

function formatCountry(countriesArray) {
    let countriesString = '';

    for (country of countriesArray) {
        countriesString += country.country;
        if (countriesArray.indexOf(country) + 1 < countriesArray.length) countriesString += ', ';
    }

    return countriesString;

}

fetchAndRenderFilms().catch((err) => console.log(err));
