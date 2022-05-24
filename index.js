const express = require('express')
const morgan = require("morgan")
const app = express()


app.use(express.json())
app.use(express.static('build'))

morgan.token("body", (req) => JSON.stringify(req.body))

let persons = [
    
          { 
            "name": "Arto Hellas", 
            "number": "040-123456",
            "id": 1
          },
          { 
            "name": "Ada Lovelace", 
            "number": "39-44-5323523",
            "id": 2
          },
          { 
            "name": "Dan Abramov", 
            "number": "12-43-234345",
            "id": 3
          },
          { 
            "name": "Mary Poppendieck", 
            "number": "39-23-6423122",
            "id": 4
          }
        
      
]

app.get('/', morgan("tiny"), (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', morgan("tiny"), (req, res) => {
  res.json(persons)
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
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  console.log(person)
  persons= persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})