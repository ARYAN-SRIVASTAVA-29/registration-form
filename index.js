const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect('mongodb://0.0.0.0:27017/registration', { useNewUrlParser: true, useUnifiedTopology: true })

// Define a schema for the registration data
const registrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mothersName: String,
  fathersName: String,
  address: String,
  gender: String,
  state: String,
  city: String,
  dob: String,
  pincode: String,
  course: String,
  email: String,
});

// Create a model based on the schema
const Registration = mongoose.model('Registration', registrationSchema);

// Serve the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Serve the registration form with success message
app.get('/registration', (req, res) => {
  const success = req.query.success;
  if (success === 'true') {
    return res.redirect('/?success=true');
  }
  res.sendFile(__dirname + '/index.html');
});

// Retrieve all registrations
app.get('/registrations', (req, res) => {
  Registration.find()
    .then(registrations => {
      res.json(registrations);
    })
    .catch(err => {
      console.error('Failed to retrieve registrations:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Retrieve a single registration by ID
app.get('/registrations/:id', (req, res) => {
  const id = req.params.id;
  Registration.findById(id)
    .then(registration => {
      if (!registration) {
        return res.status(404).send('Registration not found');
      }
      res.json(registration);
    })
    .catch(err => {
      console.error('Failed to retrieve registration:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Update a registration by ID
app.put('/registrations/:id', (req, res) => {
  const id = req.params.id;
  const formData = req.body;
  Registration.findByIdAndUpdate(id, formData, { new: true })
    .then(registration => {
      if (!registration) {
        return res.status(404).send('Registration not found');
      }
      res.json(registration);
    })
    .catch(err => {
      console.error('Failed to update registration:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Delete a registration by ID
app.delete('/registrations/:id', (req, res) => {
  const id = req.params.id;
  Registration.findByIdAndDelete(id)
    .then(registration => {
      if (!registration) {
        return res.status(404).send('Registration not found');
      }
      res.json(registration);
    })
    .catch(err => {
      console.error('Failed to delete registration:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Handle form submission 
app.post('/registration', (req, res) => {
  const formData = req.body;

  // Create a new registration document
  const registration = new Registration(formData);

  // Save the registration to the database
  registration.save()
    .then(() => {
      res.redirect('/registration?success=true');
    })
    .catch(err => {
      console.error('Failed to save registration:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

