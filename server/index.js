const express = require('express');
const mongoose = require('mongoose');
const Event = require('./models/Event');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");
app.use(express.json());
app.use(cors({
  origin: 'https://www.section.io'
}));
// Create an event
app.post('/events', async (req, res) => {
  try {
    const events = req.body; // Assuming req.body is an array of event objects
    const createdEvents = [];

    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
      createdEvents.push(event);
    }

    console.log(`${events.length} events created`);
    res.status(201).json(createdEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/events/:id', async (req, res) => {
  try {
    const Id = req.params.id;
    const updatedEventData = req.body; // The new event data to update
console.log("Id----->",Id)
    // Find the existing event by its ID and update it with the new data
    const updatedEvent = await Event.findOneAndUpdate({ "Id": Id }, updatedEventData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete('/events/:id', async (req, res) => {
  try {
    const Id = req.params.id;
    console.log("Id------->", Id);
    const deletedEvent = await Event.deleteOne({ "Id": Id });

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add other CRUD endpoints for updating and deleting events

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
