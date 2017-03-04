var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
  console.log(req.user);
  Campground.find({}, function(err, campgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampy = {name: name, image: image, description: desc, author: author};
  Campground.create(newCampy, function(err, camp) {
    if(err) {
      console.log(err);
    } else {
      console.log("The new campground has been added..");
      console.log(camp);
    }
  });
  res.redirect("/campgrounds");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: foundCampGround});
    }
    
  });
});

router.get("/:id/edit", function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {campground: campground});
    }
  });
});

router.put("/:id", function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });  
});

router.delete("/:id", function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
  
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;