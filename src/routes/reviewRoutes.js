const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

// Create review
router.post("/", reviewController.createReview);

// Get reviews by product
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Get average rating
router.get("/product/:productId/average", reviewController.getAverageRating);

// Update review
router.put("/:id",  reviewController.updateReview);

// Delete review
router.delete("/:id",  reviewController.deleteReview);

module.exports = router;