const express = require("express");
const router = express.Router(); //creates new router object   // Router is a method allready present in express
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatedListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  // INDEX.ejs
  .get(wrapAsync(listingController.index))
  // Create, post req from New.ejs
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validatedListing,
    wrapAsync(listingController.createListing)
  );

// Create, Get req from index.ejs      //New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", wrapAsync(listingController.showSearchedListing));

router
  .route("/:id")
  // SHOW Show.ejs
  .get(wrapAsync(listingController.showListing))
  //EDIT, req from edit.ejs
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatedListing,
    wrapAsync(listingController.updateListing)
  )
  // DELETE , req frpm show.ejs
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//EDIT, req from show.ejs
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
