const grpc = require('@grpc/grpc-js');
const reviewPb = require('./app/generated/review/review_pb.js');
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb.js');
const Review = require('./src/models/Review.js'); // Mongoose model

// Convert JS Date to protobuf Timestamp
function toTimestamp(date = new Date()) {
  const ts = new Timestamp();
  const millis = date.getTime();
  ts.setSeconds(Math.floor(millis / 1000));
  ts.setNanos((millis % 1000) * 1e6);
  return ts;
}

// Build protobuf Review message from Mongoose doc
function buildReviewMessage(doc) {
  const review = new reviewPb.Review();
  review.setId(doc._id.toString());
  review.setProductId(doc.productId);
  if (doc.shopId) {
    review.setShopId(doc.shopId);
  }
  review.setUserId(doc.userId);
  review.setRating(doc.rating);
  review.setComment(doc.comment || '');
  review.setCreatedAt(toTimestamp(doc.createdAt));
  review.setUpdatedAt(toTimestamp(doc.updatedAt));
  return review;
}

// Validate rating
function validateRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

// RPC: CreateReview
async function createReview(call, callback) {
  try {
    const { productId, userId, rating, comment } = call.request.toObject();

    if (!productId || !userId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'product_id and user_id are required',
      });
    }

    if (!validateRating(rating)) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'rating must be an integer between 1 and 5',
      });
    }

    const review = await Review.create({ productId, userId, rating, comment });
    callback(null, buildReviewMessage(review));
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to create review',
    });
  }
}

// RPC: CreateShopReview
async function createShopReview(call, callback) {
  try {
    const { shopId, userId, rating, comment } = call.request.toObject();

    if (!shopId || !userId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'shop_id and user_id are required',
      });
    }

    if (!validateRating(rating)) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'rating must be an integer between 1 and 5',
      });
    }

    const review = await Review.create({ shopId, userId, rating, comment });
    callback(null, buildReviewMessage(review));
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to create shop review',
    });
  }
}

// RPC: GetReviewsByProduct
async function getReviewsByProduct(call, callback) {
  try {
    const { productId, page } = call.request.toObject();

    if (!productId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'product_id is required',
      });
    }

    const p = page > 0 ? page : 1;
    const limit = 5; // match REST controller
    const skip = (p - 1) * limit;

    const docs = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const response = new reviewPb.GetReviewsResponse();
    response.setReviewsList(docs.map(buildReviewMessage));

    callback(null, response);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to fetch reviews',
    });
  }
}

// RPC: GetReviewsByShopId
async function getReviewsByShopId(call, callback) {
  try {
    const { shopId, page, limit } = call.request.toObject();

    if (!shopId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'shop_id is required',
      });
    }

    const p = page > 0 ? page : 1;
    const pageLimit = limit > 0 ? limit : 5;
    const skip = (p - 1) * pageLimit;

    const docs = await Review.find({ shopId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    const response = new reviewPb.GetReviewsResponse();
    response.setReviewsList(docs.map(buildReviewMessage));

    callback(null, response);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to fetch shop reviews',
    });
  }
}

// RPC: GetAverageRating
async function getAverageRating(call, callback) {
  try {
    const { productId } = call.request.toObject();

    if (!productId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'product_id is required',
      });
    }

    const result = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const data = result[0] || { avgRating: 0, totalReviews: 0 };

    const response = new reviewPb.AverageRatingResponse();
    response.setProductId(productId);
    response.setAvgRating(data.avgRating);
    response.setTotalReviews(data.totalReviews);

    callback(null, response);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to calculate average rating',
    });
  }
}

// RPC: GetAverageRatingByShopId
async function getAverageRatingByShopId(call, callback) {
  try {
    const { shopId } = call.request.toObject();

    if (!shopId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'shop_id is required',
      });
    }

    const result = await Review.aggregate([
      { $match: { shopId } },
      {
        $group: {
          _id: '$shopId',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const data = result[0] || { avgRating: 0, totalReviews: 0 };

    const response = new reviewPb.AverageRatingResponse();
    response.setShopId(shopId);
    response.setAvgRating(data.avgRating);
    response.setTotalReviews(data.totalReviews);

    callback(null, response);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to calculate shop average rating',
    });
  }
}

// RPC: UpdateReview (no ownership check)
async function updateReview(call, callback) {
  try {
    const { id, rating, comment } = call.request.toObject();

    if (!id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'id is required',
      });
    }

    if (rating && !validateRating(rating)) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'rating must be an integer between 1 and 5',
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { ...(rating && { rating }), ...(comment && { comment }), updatedAt: new Date() },
      { new: true }
    );

    if (!review) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Review not found',
      });
    }

    callback(null, buildReviewMessage(review));
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to update review',
    });
  }
}

// RPC: DeleteReview (no ownership check)
async function deleteReview(call, callback) {
  try {
    const { id } = call.request.toObject();

    if (!id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'id is required',
      });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Review not found',
      });
    }

    const response = new reviewPb.DeleteReviewResponse();
    response.setMessage('review_deleted');
    callback(null, response);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message || 'Failed to delete review',
    });
  }
}

module.exports = {
  createReview,
  createShopReview,
  getReviewsByProduct,
  getReviewsByShopId,
  getAverageRating,
  getAverageRatingByShopId,
  updateReview,
  deleteReview,
};