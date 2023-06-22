// Import necessary dependencies
const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Store game state in memory
let gameInProgress = false;
let participants = {};
let questions = [
  {
    question: 'How many of the top US Websites can you name?',
    answer: ['amazon', 'bbc', 'msnbc', 'nbc', 'hulu', 'netflix'],
  },
];

// Start game endpoint
app.post('/trivia/start', (req, res) => {
  if (gameInProgress) {
    return res.status(400).json({ message: 'A game is already in progress.' });
  }

  // Reset game state
  gameInProgress = true;
  participants = {};

  // Start the game logic here (e.g., send initial message to Slack channel)
  // ...

  res.json({ message: 'Game started.' });
});

// Answer submission endpoint
app.post('/trivia/answer', (req, res) => {
  if (!gameInProgress) {
    return res.status(400).json({ message: 'No game in progress.' });
  }

  const { user, answer } = req.body;

  // Check if the answer is correct
  const currentQuestion = questions[0]; // Assuming only one question for now
  const correctAnswer = currentQuestion.answer;
  const isCorrect = correctAnswer.includes(answer);

  // Update participant's score
  participants[user] = participants[user] ? participants[user] + (isCorrect ? 1 : 0) : (isCorrect ? 1 : 0);

  // Respond with the result
  const message = isCorrect ? 'Correct answer!' : 'Incorrect answer.';
  res.json({ message });
});

// Get scores endpoint
app.get('/trivia/scores', (req, res) => {
  if (!gameInProgress) {
    return res.status(400).json({ message: 'No game in progress.' });
  }

  res.json({ participants });
});

// Start the server
app.listen(3000, () => {
  console.log('Trivia app API is running on port 3000');
});

