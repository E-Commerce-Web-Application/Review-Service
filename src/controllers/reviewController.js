const Review = require("../models/Review");

/**
 * POST /reviews
 * Body: { product_id, user_id, rating, comment }
 */
exports.createReview = async (req, res, next) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    if (!product_id || !user_id) {
      return res.status(400).json({
        message: "product_id and user_id are required",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      productId: product_id,
      userId: user_id,
      rating,
      comment,
    });

    res.status(201).json({
      id: review._id,
      product_id: review.productId,
      user_id: review.userId,
      rating: review.rating,
      comment: review.comment,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reviews/:product_id?page=1
 */
exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({
        message: "product_id is required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId: product_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formatted = reviews.map((r) => ({
      id: r._id,
      product_id: r.productId,
      user_id: r.userId,
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /reviews/:id
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "rating must be between 1 and 5",
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        ...(rating && { rating }),
        ...(comment && { comment }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.json({
      id: review._id,
      product_id: review.productId,
      user_id: review.userId,
      rating: review.rating,
      comment: review.comment,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /reviews/:id
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.json({
      message: "review_deleted",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reviews/average/:product_id
 */
exports.getAverageRating = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({
        message: "product_id is required",
      });
    }

    const result = await Review.aggregate([
      { $match: { productId: product_id } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const data = result[0];

    res.json({
      product_id,
      avg_rating: data ? data.avgRating : 0,
      total_reviews: data ? data.totalReviews : 0,
    });
  } catch (err) {
    next(err);
  }
};