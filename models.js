const mongoose = require('mongoose');

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

const HighScore = mongoose.model('simonhighscore', HighScoreSchema, 'highscores');

module.exports = {HighScore};
