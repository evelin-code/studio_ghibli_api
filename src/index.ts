import './components/index';
import styles from './index.css';
import FilmCard, { Attribute } from './components/Film/Film';
import PeopleCard from './components/People/People';
import { getFilms } from './data/dataFetchFilms';
import { getPeople } from './data/dataFetchPeople';

declare global {
	interface HTMLElementEventMap {
			'show-people': CustomEvent;
	}
}

class AppContainer extends HTMLElement {
	cards?: FilmCard[] = [];
	peopleList?: PeopleCard[] = [];
	favoriteCards?: FilmCard[] = [];

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		console.log("items al inicio ==>",localStorage.getItem("favoritos"));
	}

	async connectedCallback() {
		this.render();
		const films = await getFilms();
		const productContainer = this.shadowRoot?.querySelector('.container-app');
		const promises = films.map(async (film: any) => {
				const filmCard = this.ownerDocument.createElement('single-card-film') as FilmCard;
				filmCard.setAttribute(Attribute.name, film.title);
				filmCard.setAttribute(Attribute.original_title, film.original_title);
				filmCard.setAttribute(Attribute.release_date, film.release_date);
				filmCard.setAttribute(Attribute.description, film.description);
				filmCard.setAttribute(Attribute.director, film.director);
				filmCard.setAttribute(Attribute.people, JSON.stringify(film.people));
				productContainer?.appendChild(filmCard);
		});

		await Promise.all(promises);


    const verFavoritosBtn = this.shadowRoot?.querySelector('#ver-favoritos');
    if (verFavoritosBtn) {
        verFavoritosBtn.addEventListener('click', () => {
            this.mostrarFavoritos();
        });
    }


		this.addEventListener('show-people', async (event: CustomEvent) => {
			const peopleUrls = event.detail.people;
			console.log(peopleUrls);
			const peopleContainer = this.shadowRoot?.querySelector('.people-container');
			
			if (peopleContainer) {
					peopleContainer.innerHTML = '';
					for (const url of peopleUrls) {
							const personData = await getPeople(url);
							const peopleCard = this.ownerDocument.createElement('single-card-people') as PeopleCard;
							peopleCard.setAttribute('name', personData.name);
							peopleCard.setAttribute('gender', personData.gender);
							peopleContainer.appendChild(peopleCard);
					}
				}
		});
	}

	mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || '[]');
    const contenedorFavoritos = this.shadowRoot?.querySelector('.favoritos-container');

    if (contenedorFavoritos) {
        contenedorFavoritos.innerHTML = '';

        favoritos.forEach((favorito: any) => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-favorito';
            tarjeta.innerHTML = `
                <h3>${favorito.name}</h3>
                <p>${favorito.original_title}</p>
                <p>${favorito.release_date}</p>
                <p>${favorito.description}</p>
                <p>${favorito.director}</p>
            `;
            contenedorFavoritos.appendChild(tarjeta);
        });
    }
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
        <style>${styles}</style>
				<button id="ver-favoritos">Favoritos</button>
        <div class="flex-container">
					<div class="container-app"></div>
					<div class="people-container"></div>
					<div class="favoritos-container"></div>
				</div>
      `;
		}
	}
}

customElements.define('app-container', AppContainer);
