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

app.get('/api/persons', morgan("tiny"), (req, res, next) => {
    Person.find({}).then(pers => {
      res.json(pers)
    })
    .catch(error => next(error))
})

app.get('/info', morgan("tiny"), (req, res) => {
  const time = new Date()
    Person.find({}).then(pers => {
      res.json(`This list has ${pers.length} persons and the time was ${time}`)
    })
})

app.get('/api/persons/:id', morgan("tiny"), (request, response, next) => {
    Person.findById(request.params.id)
    .then(pers => {
      if (pers) {
        response.json(pers)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', morgan(":body"), (request, response, next) => {
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
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})