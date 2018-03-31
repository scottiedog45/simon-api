const mongoose = require('mongoose');
const moment = require('moment');

const HighScoreSchema = mongoose.Schema({
  score: {
    type: Number,
    required: true
  },
  name: {
    type:String,
    required: true
  }
});

HighScoreSchema.methods.apiRepr = function() {
  return {
    score: this.score,
    name: this.name
  };
}

const HighScore = mongoose.model('simonhighscores', HighScoreSchema, 'highscores');

module.exports = {HighScore};
