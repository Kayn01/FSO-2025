const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (request, response) => {
    if(request.method === 'POST'){
        return JSON.stringify(request.body);
    }
    return '';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let person = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(person);
});

app.get("/info", (request, response) => {
  const totalP = person.length;
  const requestReceivedTime = new Date();
  response.send(`<p>Phonebook has info for ${totalP} people</p>
        <p>${requestReceivedTime}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const personA = person.find(person => person.id === id);

    if(personA){
        response.json(personA);
    }else{
        response.status(404).end();
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    person = person.filter(p => p.id !== id);

    response.status(204).end();
})

const generateId = () => {
    return Math.floor(Math.random() * 999).toString();
}

app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log(body);
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

    if(person.find(p => p.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const per = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    person = person.concat(per);
    response.status(201).json(person);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
