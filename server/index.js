const express = require("express");
const app = express();
const bodyParser = require("body-parser").urlencoded({extended: false});
const session = require("express-session");
const PORT = 1337;

app
	.set("view engine", "ejs")
	.use(bodyParser)
	.use(session({
		secret: "Geheimpie!",
		cookie: {secure: false}, //set to true op production
		resave: false,
		saveUninitialized: true}))
	.use(express.static("server/static"));

app
	.get("/", (req, res) => {
		const { ingredients } = req.session;
		res.render("index", {ingredients})})
	.post("/add", (req, res) => {
		const { body } = req;
		req.session.ingredients = (req.session.ingredients || new Array())
			.concat(...Object.values(body));
		res.redirect("/")})
	.listen(PORT, () => {
		console.log(`Yeeting at ${PORT}, boye!`)});

//RENDER SERVER SIDE CSS TO STACK INGREDIENTS HEIGHTWISE