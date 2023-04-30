const router = require('express').Router();
const { User, Thought, Reaction } = require('../models');


// get all thoughts
router.get('/', async (req, res) => {
    Thought.find()
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));

});


// get thought by id
router.get('/:thoughtId', async (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
})




// post (create) new thought and push id into users thoughts array

router.post('/', async (req, res) => {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
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
  })

// put (update) a thought by id

router.put('/:thoughtId', async (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    });
    

// delete a thought by id
router.delete('/:thoughtId', async (req, res) => {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'No user with this id!',
            })
          : res.json({ message: 'Thought successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  });


//   ---------------REACTIONS----------------

// post (create) new reaction and add to thought.reactions

router.post('/:thoughtId/reactions', async (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
        .then((application) =>
          !application
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(application)
        )
        .catch((err) => res.status(500).json(err));

})

// delete reaction by id
router.delete('/:thoughtId/reactions/reaction:id', async (req, res) => {
Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router;