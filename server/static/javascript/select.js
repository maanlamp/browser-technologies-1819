export default function select (selector) {
	if ("querySelector" in document) return document.querySelector(selector);
	console.warn("Using DOMElementSelector polyfill.");
	function $ (selector, root) {
		root = root || document;
		if (/^[-\w]+/.test(selector)) return root.getElementsByTagName(selector)[0]
		if (/^#[-\w]+/.test(selector)) return document.getElementById(selector.substring(1)); //Always document bc dom implementation sucks
		if (/^\.[-\w]+/.test(selector)) return root.getElementsByClassName(selector.substring(1))[0];
		throw new Error(`Unknow/unsupported selector "${selector}".`);
	}
	const parentSelectors = /([ >+~]+|:{1,2})/;
	const chunks = selector.split(parentSelectors);
	let root = $(chunks.shift());

	while (chunks.length) {
		if (!root) break;
		const chunk = chunks.shift();
		if (parentSelectors.test(chunk)) switch (chunk) {
			case ">": {root = $(chunks.shift(), root); break;}
			case " ": {root = $(chunks.shift(), root); console.warn("Treating \" \" as \">\""); break;}
			default: throw new Error(`Unsupported selector "${chunk}".`);
		}
	}

	return root || null;
}