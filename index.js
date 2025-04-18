// phonebook-backend/index.js
const express = require('express');
const morgan = require('morgan');  
const app = express();

// Custom Morgan token for logging request bodies
morgan.token('body', (req) => {
    // Only stringify the body if it's not empty to avoid logging empty objects on GET requests
    return Object.keys(req.body).length ? JSON.stringify(req.body) : '';
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const numberOfPeople = persons.length;
    const date = new Date();
    res.send(`Phonebook has info for ${numberOfPeople} people<br/>${date}`);
});

// Route to get a single person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id; // Extract ID from URL
    const person = persons.find(p => p.id === id); // Find person by ID

    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
});


// Route to delete a single person by ID
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = persons.length;
    // Filter the persons array to remove the person with the matching id
    persons = persons.filter(person => person.id !== id);

    if (persons.length < initialLength) {
        res.status(204).end(); // Send a 204 No Content response if the deletion was successful
    } else {
        res.status(404).json({ error: 'Person not found' }); // Send a 404 Not Found if no person with this id existed
    }
});

// Route to add a new person
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'The name or number is missing' });
    }

    // Check for existing person with the same name
    if (persons.some(person => person.name === name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    // Generate a new ID
    const id = Math.floor(Math.random() * 1000000).toString();

    const newPerson = {
        id,
        name,
        number
    };

    persons.push(newPerson);
    res.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
