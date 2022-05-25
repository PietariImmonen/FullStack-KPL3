require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const app = express()
const Person = require('./modules/person')


app.use(express.json())
app.use(express.static('build'))

morgan.token("body", (req) => JSON.stringify(req.body))


app.get('/', morgan("tiny"), (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', morgan("tiny"), (req, res) => {
    Person.find({}).then(pers => {
      res.json(pers)
    })
})

app.get('/info', morgan("tiny"), (req, res) => {
    const length = persons.length
    const time = new Date()
    res.json(`This list has ${length} persons and the time was ${time}`)
})

app.get('/api/persons/:id', morgan("tiny"), (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', morgan("tiny"), (request, response) => {
    Person.findById(request.params.id).then(pers => {
      response.json(pers)
    })
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
}

app.post('/api/persons', morgan(":body"), (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log(person)

    person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})