import Serie from './serie.js';

//La funcion Renderiza los favoritos almacenados en LocalStorage
function renderFavoritos(favoritos) {
    const favoritosContenedor = document.getElementById('series-favoritas');

    favoritosContenedor.innerHTML = '';
    for (const serie of favoritos) {
        let a = new Serie(
            serie.id,
            serie.url,
            serie.name,
            serie.language,
            serie.genres,
            serie.image,
        );
        favoritosContenedor.appendChild(a.createHtmlElement(true));
    }

    handleBotonFavoritos();
    return favoritos;
}

//La funcion maneja el estado de los botones y su comportamiento
function handleBotonFavoritos() {
    const botonFavoritos = document.querySelectorAll('.boton-favoritos');

    botonFavoritos.forEach((boton) => {
        boton.addEventListener('click', () => {
            const serie = favoritos.find((serie) => serie.id == boton.id);
            borrarSerie(serie);
            favoritos = JSON.parse(localStorage.getItem('series')) || [];
            renderFavoritos(favoritos);
        });
    });
}

function borrarSerie(serie) {
    //consultar
    const favoritos = JSON.parse(localStorage.getItem('series')) || [];
    localStorage.setItem(
        'series',
        JSON.stringify(
            favoritos.filter((favorito) => favorito.id !== serie.id),
        ),
    );
}

function cambiarTema() {
    if (tema === 'oscuro') {
        localStorage.setItem('tema', JSON.stringify('claro'));
    } else {
        localStorage.setItem('tema', JSON.stringify('oscuro'));
    }

    tema = cargarTema();
}

function cargarTema() {
    const root = document.documentElement;
    const tema = JSON.parse(localStorage.getItem('tema'));
    const iconoTema = document.getElementById('icono-tema');

    if (tema === 'oscuro') {
        iconoTema.classList.replace('bi-brightness-high-fill', 'bi-moon-fill');
        root.style.setProperty('--color-principal', '#070707');
        root.style.setProperty('--color-secundario', '#0f0f0f');
        root.style.setProperty('--color-secundario-claro', '#181818');
        root.style.setProperty('--color-texto', '#F2F2F2');
    } else {
        iconoTema.classList.replace('bi-moon-fill', 'bi-brightness-high-fill');
        root.style.setProperty('--color-principal', '#ffffff');
        root.style.setProperty('--color-secundario', '#adadad');
        root.style.setProperty('--color-secundario-claro', '#c5c5c5');
        root.style.setProperty('--color-texto', '#000000');
    }

    return tema;
}

let favoritos = JSON.parse(localStorage.getItem('series')) || [];
renderFavoritos(favoritos);

const ordenarPorNombre = document.getElementById('ordenarNombre');
const ordenarPorId = document.getElementById('ordenarId');
const botonTema = document.getElementById('boton-tema');

let tema = cargarTema();

ordenarPorNombre.addEventListener('click', () => {
    favoritos.sort((a, b) => a.name.localeCompare(b.name));
    renderFavoritos(favoritos);
});

ordenarPorId.addEventListener('click', () => {
    favoritos.sort((a, b) => a.id - b.id);
    renderFavoritos(favoritos);
});

botonTema.addEventListener('click', () => cambiarTema());
