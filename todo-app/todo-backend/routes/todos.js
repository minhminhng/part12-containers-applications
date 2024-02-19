const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (req.todo) {
    res.json(req.todo);
  }
  else {
    res.status(404).end()
  }
});

/* PUT todo. */
singleRouter.put('/', async (req, res, next) => {
  if (req.todo) {
    if (req.body.done) {
      req.todo.done = req.body.done
    }
    await req.todo.save()
    res.json(req.todo)
  } else {
    next(new Error('Todo does not exist'))
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
