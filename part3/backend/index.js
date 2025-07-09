require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => {
  if(request.method === 'POST'){
    return JSON.stringify(request.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response, next) => {
  // const totalP = person.length;
  // const requestReceivedTime = new Date();
  // response.send(`<p>Phonebook has info for ${totalP} people</p>
  //       <p>${requestReceivedTime}</p>`);
  const requestReceivedTime = new Date()
  Person.find({})
    .then(persons => {
      const totalP = persons.length
      response.send(`<p>Phonebook has info for ${totalP} people</p>
         <p>${requestReceivedTime}</p>`)
    })
    .catch(error => next(error)
    )

})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = request.params.id;
  // const personA = person.find(person => person.id === id);

  // if(personA){
  //     response.json(personA);
  // }else{
  //     response.status(404).end();
  // }
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = request.params.id;
  // person = person.filter(p => p.id !== id);

  // response.status(204).end();
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//     return Math.floor(Math.random() * 999).toString();
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)
  if(!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if(!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const per = new Person({
    name: body.name,
    number: body.number,
  })

  per.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if(!person){
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
