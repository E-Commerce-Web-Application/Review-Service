const Review = require("../models/Review");


// // ➤ Create Review
// exports.createReview = async (req, res, next) => {
//   try {
//     const { productId, rating, comment } = req.body;

//     const review = await Review.create({
//       productId,
//     //   userId: req.user.id,
//       userId: req.body.userId,
//       rating,
//       comment
//     });

//     res.status(201).json(review);
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({
//         message: "You have already reviewed this product"
//       });
//     }
//     next(err);
//   }
// };
exports.createReview = async (req, res, next) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    const review = await Review.create({
      productId,
      userId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// // ➤ Get Reviews by Product (with pagination)
// exports.getReviewsByProduct = async (req, res, next) => {
//   try {
//     const { productId } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;
//     const skip = (page - 1) * limit;

//     const reviews = await Review.find({ productId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     res.json(reviews);
//   } catch (err) {
//     next(err);
//   }
// };
// ➤ Get Reviews by Product (with pagination)
exports.getReviewsByProduct = async (req, res, next) => {
  try {

    const { productId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(reviews);

  } catch (err) {
    next(err);
  }
};


// // ➤ Update Review
// exports.updateReview = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const review = await Review.findOneAndUpdate(
//       { _id: id, userId: req.user.id },
//       req.body,
//       { new: true }
//     );

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     res.json(review);
//   } catch (err) {
//     next(err);
//   }
// };
// ➤ Update Review
exports.updateReview = async (req, res, next) => {
  try {

    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.json(review);

  } catch (err) {
    next(err);
  }
};


// // ➤ Delete Review
// exports.deleteReview = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const review = await Review.findOneAndDelete({
//       _id: id,
//       userId: req.user.id
//     });

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     res.json({ message: "Review deleted" });
//   } catch (err) {
//     next(err);
//   }
// };

// ➤ Delete Review
exports.deleteReview = async (req, res, next) => {
  try {

    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.json({
      message: "Review deleted"
    });

  } catch (err) {
    next(err);
  }
};


// // ➤ Get Average Rating
// exports.getAverageRating = async (req, res, next) => {
//   try {
//     const { productId } = req.params;

//     const result = await Review.aggregate([
//       { $match: { productId } },
//       {
//         $group: {
//           _id: "$productId",
//           avgRating: { $avg: "$rating" },
//           totalReviews: { $sum: 1 }
//         }
//       }
//     ]);

//     res.json(result[0] || { avgRating: 0, totalReviews: 0 });
//   } catch (err) {
//     next(err);
//   }
// };


// ➤ Get Average Rating
exports.getAverageRating = async (req, res, next) => {
  try {

    const { productId } = req.params;

    const result = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json(
      result[0] || {
        avgRating: 0,
        totalReviews: 0
      }
    );

  } catch (err) {
    next(err);
  }
};
