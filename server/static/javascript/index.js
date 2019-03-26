import select from "./select.js";

const sessionStorage = window.sessionStorage || {
	cache: new Map(),
	setItem: function (k, v) {return this.cache.set(k, v)},
	getItem: function () {return this.cache.get(k)},
	clear: function () {return this.cache.clear()}
}

function clearTosto () {
	fetch("/clear");
	Array.from(select("#ingredients").children)
		.forEach(child => child.remove());
}

void function addIngredientClientside () {
	function txtToHTML (txt) {
		const div = document.createElement("div");

		div.innerHTML = txt;

		return div.firstElementChild;
	}

	function addToSandwich (txt, type) {
		const svg = txtToHTML(txt);
		const ingredients = select("#ingredients");
		const count = ingredients.children.length;

		svg.style = `
			transform:
				translateY(-${(count + 1) * 15}px)
				rotate(${Math.floor(Math.random() * 90) - 45}deg);
			transform-origin: center center;
		`.trim();
		ingredients.appendChild(svg);
		if (type) sessionStorage
			.setItem(`ingredient${count + 1}`, type);
	}

	Array.from(select("form").children)
		.forEach(button => {
			button.addEventListener("click", event => {
				event.preventDefault();
				fetch(`/ingredient/${button.value}`)
					.then(response => response.text())
					.then(txt => addToSandwich(txt, button.value))
					.catch(console.error);
			})});

	void function syncIngredientsOnPageload () {
		const queue = Promise.resolve();

		clearTosto();
		for (const key in sessionStorage) {
			const value = sessionStorage.getItem(key);
			if (sessionStorage.hasOwnProperty(key)) {
				queue.then(() => fetch(`/ingredient/${value}`)
					.then(response => response.text())
					.then(txt => addToSandwich(txt, value))
					.catch(console.error));
			}
		}
	}();
}();

void function syncTostoClientside () {
	const clear = select("#clear");
	clear.href = "#";
	clear.addEventListener("click", event => {
		event.preventDefault();
		sessionStorage.clear();
		clearTosto();
	});
}();