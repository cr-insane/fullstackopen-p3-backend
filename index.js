const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
        {
            "id": "1",
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": "2",
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": "3",
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": "4",
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (req, res) => {
    const body = req.body
    const exists = persons.filter(person => person.name === body.name)
    morgan.token('body', function (req, res) { return JSON.stringify(body)})
    if (!body.name || !body.number ) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } else if(exists.length > 0) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 999).toString()
    }
    persons = persons.concat(person)
    res.json(person)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === request.params.id)
    console.log(person)
    if (person){
        response.json(person)
    } else
    {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)
        response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})