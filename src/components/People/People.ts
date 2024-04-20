import styles from './People.css';

export enum Attribute {
	'name' = 'name',
	'gender' = 'gender',
}

class PeopleCard extends HTMLElement {
	name?: string;
	gender?: string;

	static get observedAttributes() {
		const classAttribute: Record<Attribute, null> = {
			name: null,
			gender: null,
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
		this[propName] = newValue;
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
			<style>${styles}</style>
				<figure>
					<div class="container-info">
						<p><b>Nombre: </b>${this.name}</p>
						<p><b>Género: </b>${this.gender}</p>
					</div>
				</figure>
      `;
		}
	}
}

customElements.define('single-card-people', PeopleCard);
export default PeopleCard;
