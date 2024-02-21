const express = require('express');
const redis = require('../redis');
const router = express.Router();

const configs = require('../util/config');

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET statistics data. */
router.get('/statistics', async (req, res) => {
  try {
    const addedTodos = await redis.getAsync('added_todos') || 0;
    res.json({
      added_todos: parseInt(addedTodos)
    });
  } catch(error) {
    console.error('Error retrieving statistics:', error);
    res.status(500).end();
  }
  
});

module.exports = router;
