import Serie from './serie.js';

//La funcion realiza el fetch de series, apartir de un ID y una cantidad recibida por parametro
async function getSeries(id, cantidad) {
    const series = [];
    let i = id + 1;

    while (series.length < cantidad) {
        const promise = await fetch(`https://api.tvmaze.com/shows/${i}`);

        if (promise.status === 200) {
            const data = await promise.json();
            const serie = new Serie(
                data.id,
                data.url,
                data.name,
                data.language,
                data.genres,
                data.image.medium,
            );
            series.push(serie);
        }

        i++;
    }

    return series;
}

//La funcion renderiza todos las series que se obtienen del fetch (getSeries()).
async function renderSeries(id, cantidad) {
    const seriesContenedor = document.getElementById('series');
    const loader = document.getElementById('loader');
    const contenido = document.getElementById('contenido');

    //habilitamos el spinner de carga
    contenido.classList = 'd-none'
    loader.classList = 'd-flex justify-content-center'

    const series = await getSeries(id, cantidad);

    //mostramos el contenido
    loader.classList = 'd-none'
    contenido.classList = ''

    seriesContenedor.innerHTML = '';
    let favoritos = JSON.parse(localStorage.getItem('series')) || [];
    for (const serie of series) {
        const isFavorite = favoritos.find((favorito) => favorito.id == serie.id)? true : false; 
        seriesContenedor.appendChild(serie.createHtmlElement(isFavorite));
    }

    handleBotonFavoritos(series);
    return series;
}

//La función trae las 6 series anteriores de la api.
async function paginaAnterior() {
    lastId -= 6;
    
    if (paginaActual === 2) {
        anterior.disabled = true;
        lastId = 0;
    }
    
    series = await renderSeries(lastId, CANTIDAD_SERIES);
    paginaActual--;
}

//La funcion trae las 6 series siguientes de la api.
async function paginaSiguiente() {
    lastId = series[series.length - 1].id;
    if (anterior.disabled) {
        anterior.disabled = false;
    }
    series = await renderSeries(lastId, CANTIDAD_SERIES);
    paginaActual++;
}

//La funcion guarda una serie del localStorage
function guardarSerie(serie) {
    let favoritos = JSON.parse(localStorage.getItem('series')) || [];
    favoritos.push(serie);
    localStorage.setItem('series', JSON.stringify(favoritos));
}

//La funcion elimina una serie del localStorage
function borrarSerie(serie) {
    let favoritos = JSON.parse(localStorage.getItem('series')) || [];
    localStorage.setItem(
        'series',
        JSON.stringify(
            favoritos.filter((favorito) => favorito.id !== serie.id),
        ),
    );
}

//La funcion verifica si la serie ya se encuntra agregada como favorita para cambiar el texto del boton
function cambiarEstado(boton) {
    if (boton.innerText === 'Agregar a favoritos') {
        boton.innerText = 'Quitar de favoritos';
        boton.style.backgroundColor = 'var(--color-principal)';
    }else{
        boton.innerText = 'Agregar a favoritos';
        boton.style.backgroundColor = 'var(--color-terciario)';
    }
}

//La funcion maneja los botones para agregar o eliminar series a favortitos
function handleBotonFavoritos(series) {
    const botonFavoritos = document.querySelectorAll('.boton-favoritos');
    
    botonFavoritos.forEach((boton) => {
        boton.addEventListener('click', () => {
            const serie = series.find((serie) => serie.id == boton.id);
            
            if (boton.innerText === 'Quitar de favoritos') {
                borrarSerie(serie);
            } else {
                guardarSerie(serie);
            }
            
            cambiarEstado(boton)
        });
    });
}

const CANTIDAD_SERIES = 6;
let lastId = 0;
let paginaActual = 1;

let series = await renderSeries(lastId, CANTIDAD_SERIES);

const anterior = document.getElementById('anterior');
const siguiente = document.getElementById('siguiente');


anterior.addEventListener('click', await paginaAnterior);
siguiente.addEventListener('click', await paginaSiguiente);
