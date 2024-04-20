import styles from './Film.css';

export enum Attribute {
	'name' = 'name',
	'original_title' = 'original_title',
	'release_date' = 'release_date',
	'description' = 'description',
	'director' = 'director',
	'people' = 'people',
}

class FilmCard extends HTMLElement {

	name?: string;
	original_title?: string;
	release_date?: string;
	description?: string;
	director?: string;
	people?: string[];

	static get observedAttributes() {
		const classAttribute: Record<Attribute, null> = {
			name: null,
			original_title: null,
			release_date: null,
			description: null,
			director: null,
			people: null,
		};

		return Object.keys(classAttribute);
	}

	constructor() {
		super();
		this.attachShadow({
			mode: 'open',
		});
	}

	attributeChangedCallback(propName: Attribute, oldValue: string | undefined, newValue: string | undefined) {
		if (propName === Attribute.people) {
			this[propName] = JSON.parse(newValue || '[]');
		} else {
			this[propName] = newValue;
		}
		this.render();
	}

	connectedCallback() {
		this.render();
    this.shadowRoot?.querySelector('.agregar-favorito')?.addEventListener('click', this.addToCart.bind(this));
	}

	addToCart() {
		const personInfo = {
			name: this.name,
			original_title: this.original_title,
			release_date: this.release_date,
			description: this.description,
			director: this.director,
		};

		// Recuperar el array de favoritos del localStorage, o inicializar un nuevo array si no existe
		let favoritos = JSON.parse(localStorage.getItem("favoritos") || '[]');

		// Ahora, favoritos siempre es un array, por lo que puedes usar push sin problemas
		favoritos.push(personInfo);

		// Guardar el array actualizado en el localStorage
		localStorage.setItem("favoritos", JSON.stringify(favoritos));

		console.log(localStorage.getItem("favoritos"));
	} 

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
				<style>${styles}</style>
				<figure class="cont-figure">
				<div class="container-info">
					<p class="name">${this.name}</p>
					<p>${this.original_title}</p>
					<p>${this.release_date}</p>
					<p>${this.description}</p>
					<p>${this.director}</p>
					<button class="btns ver-personas">Ver Personas</button>
					<button class="btns agregar-favorito">Añadir Favorito</button>
				</div>
				</figure>
			`;

			const button = this.shadowRoot.querySelector('.ver-personas');
      if (button) {
        button.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('show-people', {
            detail: { people: this.people },
            bubbles: true,
            composed: true
          }));
        });
      }
		}
	}
}

customElements.define('single-card-film', FilmCard);
export default FilmCard;
