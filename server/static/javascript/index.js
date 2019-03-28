function select (selector) {
	if ("querySelector" in document) return document.querySelector(selector);
	console.warn("Using DOMElementSelector polyfill.");
	function $ (selector, root) {
		root = root || document;
		if (/^[-\w]+/.test(selector)) return root.getElementsByTagName(selector)[0];
		if (/^#[-\w]+/.test(selector)) return document.getElementById(selector.substring(1)); //Always document bc dom implementation sucks
		if (/^\.[-\w]+/.test(selector)) return root.getElementsByClassName(selector.substring(1))[0];
		throw new Error("Unknow/unsupported selector " + selector + ".");
	}
	var parentSelectors = /([ >+~]+|:{1,2})/;
	var chunks = selector.split(parentSelectors);
	var root = $(chunks.shift());

	while (chunks.length) {
		if (!root) break;
		var chunk = chunks.shift();
		if (parentSelectors.test(chunk)) switch (chunk) {
			case ">": {root = $(chunks.shift(), root); break;}
			case " ": {root = $(chunks.shift(), root); console.warn("Treating \" \" as \">\""); break;}
			default: throw new Error("Unsupported selector " + chunk + ".");
		}
	}

	return root || null;
}

var sessionStorage = window.sessionStorage || {
	cache: new Map(),
	setItem: function (k, v) {return this.cache.set(k, v);},
	getItem: function (k) {return this.cache.get(k);},
	clear: function () {return this.cache.clear();}
};

function clearTosto () {
	fetch("/clear");
	Array.from(select("#ingredients").children)
		.forEach(function (child) {child.remove();});
}

void function addIngredientClientside () {
	function txtToHTML (txt) {
		var div = document.createElement("div");

		div.innerHTML = txt;

		return div.firstElementChild;
	}

	function addToSandwich (txt, type) {
		var svg = txtToHTML(txt);
		var ingredients = select("#ingredients");
		var count = ingredients.children.length;

		svg.style = "transform:"
			+ "translateY(-"
			+ String((count + 1) * 15)
			+ "px)rotate("
			+ String(Math.floor(Math.random() * 90) - 45)
			+ "deg);transform-origin: center center;";
		ingredients.appendChild(svg);
		if (type) sessionStorage
			.setItem("ingredient" + String(count + 1), type);
	}

	Array.from(select("form").children)
		.forEach(function (button) {
			button.addEventListener("click", function (event) {
				event.preventDefault();
				fetch("/ingredient/" + button.value)
					.then(function (response) {return response.text();})
					.then(function (txt) {return addToSandwich(txt, button.value);})
					.catch(console.error);
			});});

	void function syncIngredientsOnPageload () {
		var queue = Promise.resolve();

		clearTosto();
		for (var key in sessionStorage) {
			if (!sessionStorage.hasOwnProperty(key)) break;
			var value = sessionStorage.getItem(key);
			queue.then(function () {return fetch("/ingredient/" + value)
				.then(function (response) {return response.text();})
				.then(function (txt) {return addToSandwich(txt, value);});});
		}
		queue.catch(console.error);
	}();
}();

void function syncTostoClientside () {
	var clear = select("#clear");
	clear.href = "#";
	clear.addEventListener("click", function (event) {
		event.preventDefault();
		sessionStorage.clear();
		clearTosto();
	});
}();