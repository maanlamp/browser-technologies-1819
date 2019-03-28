const express = require("express");
const app = express();
const bodyParser = require("body-parser").urlencoded({extended: false});
const session = require("express-session");
const fs = require("fs");
const PORT = 3000;

app
	.set("view engine", "ejs")
	.use(bodyParser)
	.use(session({
		secret: "Geheimpie!",
		cookie: {secure: false}, //set to true op production, vergt https
		resave: false,
		saveUninitialized: true}))
	.use(express.static("static"));

app
	.get("/", (req, res) => {
		const { ingredients } = req.session;
		res.render("index", {ingredients: ingredients || new Array()})})
	.post("/add", (req, res) => {
		const { body } = req;
		req.session.ingredients = (req.session.ingredients || new Array())
			.concat(...Object.values(body));
		res.redirect("/")})
	.get("/clear", (req, res) => {
		req.session.ingredients = [];
		res.redirect("/")})
	.get("/ingredient/:type", (req, res) => {
		const { type } = req.params;
		fs.readFile(`${__dirname}/static/images/${type}.svg`, (err, data) => {
			if (err) res.end(`<?xml version="1.0" encoding="utf-8"?><error>${error}</error>`);
			res.end(data)})})
	.post("/done", (req, res) => res.end("Toegevoegd aan je winkelmandje!"))
	.listen(PORT, () => {
		console.log(`Listening on ${PORT}`)});