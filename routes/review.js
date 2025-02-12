const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams : merges the parent route and child route
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {
  validatedReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

//  REVIEWS
router.post(
  "/",
  isLoggedIn,
  validatedReview,
  wrapAsync(reviewControllers.createReview)
);

//Delete route  ....for reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;
