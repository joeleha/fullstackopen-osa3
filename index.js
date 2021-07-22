const express = require("express");
const morgan = require("morgan");
const app = express();
require('dotenv').config()
const Person = require('./models/contact')
const cors = require('cors')

morgan.token('contact', function(req, res) { return JSON.stringify(req.body)})

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.find({}).then(persons => {
    console.log(persons.length)
    console.log(typeof persons.length)
    res.send(`<p>The phonebook has info for ${persons.length} people</p><p>${date}</p>`);
  })
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  } else {
  const contact = new Person({
    name: body.name,
    number: body.number,
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
}
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
