const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const {CLIENT_ORIGIN} = require('./config');
const {DATABASE_URL, PORT} = require('./config');

const app = express();

const {HighScore} = require('./models');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

mongoose.Promise = global.Promise;

app.get('/', (req, res) => {
  HighScore
    .find()
    .then(highScores => {
      res.json(highScores.map(
        (highScore) => highScore.apiRepr())
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'something went wrong GET'})
    });
});

app.post('/', (req, res) => {
  const requiredFields = ['score', 'name'];
  for (let i = 0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  HighScore
    .create({
      score: req.body.score,
      name: req.body.name
    })
    .then(highScore => res.status(201).json(highScore.apiRepr()))
    .catch(err=> {
      console.error(err);
      res.status(500).json({error: 'Something went wrong adding your high score'});
    });
});

app.use('*', function (req, res) {
	res.status(404).json({message: 'Not found, try again'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
