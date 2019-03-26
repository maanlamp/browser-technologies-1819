import select from "./select.js";

void function addIngredientClientside () {
	function txtToHTML (txt) {
		const div = document.createElement("div");
		div.innerHTML = txt;

		return div.firstElementChild;
	}

	function addToSandwich (txt) {
		const svg = txtToHTML(txt);
		const ingredients = select("#ingredients");
		const count = ingredients.children.length;
		svg.style = `
			transform:
				translateY(-${(count + 1) * 10}px)
				rotate(${Math.floor(Math.random() * 90) - 45}deg);
			transform-origin: center center;
		`.trim();
		ingredients.appendChild(svg);
	}

	Array.from(select("form").children)
		.forEach(button => {
			button.addEventListener("click", event => {
				event.preventDefault();
				fetch(`/ingredient/${button.value}`)
					.then(response => response.text())
					.then(addToSandwich)
					.catch(console.error);
			})});
}();

void function syncTostoClientside () {
	const clear = select("#clear");
	clear.href = "#";
	clear.addEventListener("click", event => {
		event.preventDefault();
		sessionStorage.clear();
		Array.from(select("#ingredients").children)
			.forEach(child => child.remove());
	});
}();