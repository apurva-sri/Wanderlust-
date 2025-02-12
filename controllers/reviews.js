const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  newReview.author = req.user._id; //to save the id of user who added the review
  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success", "New Review Created!");
  // res.send("new review saved");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //reviews array se jo bhi reviewId se match kr jaye use pull kr do
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
