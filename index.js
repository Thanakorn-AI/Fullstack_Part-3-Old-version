// phonebook-backend/index.js
const express = require('express');
const app = express();

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


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
