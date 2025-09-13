const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Allow both http and https frontend during development
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true
}));

// Sample student data
const students = [
  { id: 1, name: 'Alice Johnson', course: 'Computer Science' },
  { id: 2, name: 'Bob Smith', course: 'Information Technology' },
  { id: 3, name: 'Carol Davis', course: 'Software Engineering' },
  { id: 4, name: 'David Wilson', course: 'Cybersecurity' },
  { id: 5, name: 'Emma Brown', course: 'Data Science' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello Secure MERN Students' });
});

app.get('/students', (req, res) => {
  res.json({
    success: true,
    data: students,
    count: students.length
  });
});

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, email, message) are required'
    });
  }

  console.log('Received form data:', { name, email, message });

  res.json({
    success: true,
    message: `Thank you ${name}! Your message has been received securely via HTTPS.`,
    data: {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// SSL Certificate 
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'))
};

//  HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔒 Secure MERN Backend running on https://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  https://localhost:3001/');
  console.log('  GET  https://localhost:3001/students');
  console.log('  POST https://localhost:3001/submit');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server!'
  });
});
