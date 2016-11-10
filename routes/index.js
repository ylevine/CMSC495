var express = require('express');
var router = express.Router();
var models = require('../models');

var errorMessage = function (error) {
    return 'Something unexpected happened: \n'+ JSON.stringify(error);
};
/* Create a DB entry for a new score */
router.post('/api', function (req, res) {
    if (req.body === undefined){
      return res.status(400).send('Bad Request Params');
    }
    return models.Score.create(req.body).then(function (score) {
       return res.status(200).send(score.get({plain: true})); //always explicitly setting the status for clarity
    }).catch(function (error) {
        console.log();
        return res.status(500).send({
            error: errorMessage(error)
        });
    });
});
/**
 * retrieve the top then scores
 */
router.get('/api', function (req, res) {
  return models.Score.findAll({
    limit: 10,
    order: 'score DESC'
  }).then(function (scores) {
    var data = scores.map(function (score) {
      var middleValue = score.get({
        plain:true
      });
        middleValue.creationDate = middleValue.creationDate.toLocaleDateString();
        delete middleValue.id;
        return middleValue;
    });
    return res.status(200).send(data);
  }).catch(function (error) {
    console.log('Something unexpected happened: \n'+ JSON.stringify(error));
    return res.status(500).send({
        error: errorMessage(error)
    });
  });
});

module.exports = router;
