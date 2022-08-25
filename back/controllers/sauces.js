const sauces = require('../models/sauces');
const fs = require('fs');


// creates a sauce object and saves it to the data-base
exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new sauces({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: req.body.sauce.usersLiked,
    usersDisliked: req.body.sauce.usersDisliked,

  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// retrieves all sauces from data-base and returns them as an array
exports.getAllSauces = (req, res, next) => {
  sauces.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
// gets one item from the data-base by matching it against an id
exports.getOneSauce = (req, res, next) => {
  sauces.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  sauces.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        sauces.deleteOne({
          _id: req.params.id
        }).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

// checks whether user has liked or disliked the product before, and updates the like or dislike number,
//  and adds or removes user Id from the like or dislike list accordingly
exports.setLike = (req, res, next) => {
  let likeState = req.body.like;
  let likeUpdate = 0;
  let dislikeUpdate = 0;
  let likeIdUpdate = [];
  let dislikeIdUpdate = [];
  let sauceUpdate = new sauces;

  sauces.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      likeUpdate = sauce.likes;
      dislikeUpdate = sauce.dislikes;
      likeIdUpdate = sauce.usersLiked;
      dislikeIdUpdate = sauce.usersDisliked;

      if (sauce.usersLiked.includes(req.body.userId)) {
        let likeIndex = sauce.usersLiked.indexOf(req.body.userId);
        if (likeState == 0 || likeState == -1) {
          likeUpdate -= 1;
          likeIdUpdate.splice(likeIndex, 1);
        }
      } else {
        if (sauce.usersDisliked.includes(req.body.userId)) {
          let dislikeIndex = sauce.usersDisliked.indexOf(req.body.userId);
          if (likeState == 0 || likeState == 1) {
            dislikeUpdate -= 1;
            dislikeIdUpdate.splice(dislikeIndex, 1);
          }
        } else {
          if (likeState == 1) {
            likeUpdate += 1;
            likeIdUpdate.push(req.body.userId);
            console.log(likeUpdate);
          }
          if (likeState == -1) {
            dislikeUpdate += 1;
            dislikeIdUpdate.push(req.body.userId);
          }
        }
      }
      sauceUpdate = ({
        likes: likeUpdate,
        dislikes: dislikeUpdate,
        usersLiked: likeIdUpdate,
        usersDisliked: dislikeIdUpdate,
      });

      sauces.updateOne({
        _id: req.params.id
      }, sauceUpdate).then(
        function () {
          console.log(req.params.id);
          res.status(201).json({
            message: 'Like made successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    }
  )
};



exports.updateSauce = (req, res, next) => {

  let sauceUpdate =new sauces;
  if (req.file) {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
     sauceUpdate = ({
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
    })
  } else {

    sauceUpdate = ({
      _id: req.params.id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
    });
  }

  sauces.updateOne({
    _id: req.params.id
  }, sauceUpdate).then(
    () => {

      res.status(201).json({
        message: 'Like made successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};