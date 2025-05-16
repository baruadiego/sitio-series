export default class Serie {
    /**
     * @param {number} id
     * @param {string} url
     * @param {string} name
     * @param {string} language
     * @param {string[]} genres
     * @param {string} image
     */

    constructor(id, url, name, language, genres, image) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.language = language;
        this.genres = genres;
        this.image = image;
    }



    toJsonString() {
        return JSON.stringify(this, null, 2);
    }

    static createFromJsonString(json) {
        const data = JSON.parse(json);
        return new Serie(
            data.id,
            data.url,
            data.name,
            data.language,
            data.genres,
            data.image,
        );
    }

    /**
     * @param {string} name
     */
    #createDisplay(name, value) {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = `${name}: `;
        p.classList.add(name);
        p.append(span, document.createTextNode(value));

        return p;
    }

    createHtmlElement(isFavorite = false) {
        const serieCard = document.createElement('div');
        serieCard.id = this.id;
        serieCard.classList.add('serie-card');

        const img = document.createElement('img');
        img.classList.add('portada');
        img.src = this.image;
        img.alt = `Portada ${this.name}`;

        const imageLink = document.createElement('a');
        imageLink.classList.add('serie-link');
        imageLink.href = this.url;
        imageLink.target = '_blank';
        imageLink.appendChild(img);

        const datos = document.createElement('div');
        datos.classList.add('datos');
        const titulo = document.createElement('p');
        titulo.classList.add('titulo');
        titulo.innerText = this.name;
        const lenguaje = this.#createDisplay('lenguaje', this.language);
        const generos = this.#createDisplay('generos', this.genres.join(', '));
        datos.append(titulo, lenguaje, generos);

        const boton = document.createElement('button');
        boton.classList.add('boton-favoritos');
        if (isFavorite) {
            boton.innerText = 'Quitar de favoritos';
            boton.style.backgroundColor = 'var(--color-principal)';
        }else{
            boton.innerText = 'Agregar a favoritos';
            boton.style.backgroundColor = 'var(--color-terciario)';
        }
        boton.id = this.id;

        const contenidoPrincipal = document.createElement('div')
        contenidoPrincipal.classList.add('contenido-principal');
        contenidoPrincipal.append(datos, boton);

        serieCard.append(imageLink, contenidoPrincipal);

        return serieCard;
    }
}
