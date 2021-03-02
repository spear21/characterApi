const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const booksRouter = require("./routes/books");
const classRouter = require("./routes/classController");
const raceRouter = require("./routes/raceController");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ books: [] }).write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "D and D Character API",
			version: "1.0.0",
			description: "A simple Express API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/books", booksRouter);
app.use("/race", raceRouter);
app.use("/classes", classRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));