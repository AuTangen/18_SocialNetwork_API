const router = require('express').Router();
const { User, Thought } = require('../models');

// get all users
router.get('/', async (req, res) => {
    User.find()
    .select('-__v')
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));

});

// get one user by id
router.get('/:userId', async (req, res) => {
    User.findOne({ _id: req.params.userId })
    .select('-__v')
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
})



// post (create) new user
router.post('/', async (req, res) => {
User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
});
    //   json format:
    //  "username": "somename",
    //  "email": "example@example.com",
   



// put (update) user by id
router.put('/:userId', async (req, res) => {
User.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete user by id
router.delete('/:userId', async (req, res) => {
User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated posts deleted!' }))
      .catch((err) => res.status(500).json(err));
});
// post /api/users/:userId/friends/:friendId
router.put('/:userId/friends/:friendId', async (req, res) => {
User.findOneAndUpdate(
    { _id: req.body.userId },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
  )
  .then((user) =>
        !user
          ? res.status(404).json({
              message: 'no user with that ID',
            })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
});
module.exports = router;