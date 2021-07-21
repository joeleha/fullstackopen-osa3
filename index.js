const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require('cors')

morgan.token('contact', function(req, res) { return JSON.stringify(req.body)})

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = persons.find((p) => p.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const NoP = Number(persons.length);
  const date = new Date();
  res.send(`<p>The phonebook has info for ${NoP} people</p><p>${date}</p>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const max = 10000;
  const x = Math.random() * max;
  return parseInt(x);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  } else if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    })
  } else if (persons.some(p => p.number === body.number)) {
    return response.status(400).json({
      error: "number must be unique",
    })
  } else {
  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(contact);
  response.json(contact);
}
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
