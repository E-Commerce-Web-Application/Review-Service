'use strict';

const grpc = require('@grpc/grpc-js');
const reviewPb = require('./generated/review/review_pb');
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb.js');

// Simple in-memory store for testing
const reviews = [];

/**
 * Create protobuf Timestamp from JS Date
 */
function toTimestamp(date = new Date()) {
  const ts = new Timestamp();
  const millis = date.getTime();
  ts.setSeconds(Math.floor(millis / 1000));
  ts.setNanos((millis % 1000) * 1e6);
  return ts;
}

/**
 * Build Review protobuf message from plain JS object
 */
function buildReviewMessage(data) {
  const review = new reviewPb.Review();
  review.setId(data.id);
  review.setProductId(data.productId);
  review.setUserId(data.userId);
  review.setRating(data.rating);
  review.setComment(data.comment || '');
  review.setCreatedAt(toTimestamp(data.createdAt));
  review.setUpdatedAt(toTimestamp(data.updatedAt));
  return review;
}

/**
 * Basic validation helpers
 */
function validateRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function generateId() {
  return `rev_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

/**
 * RPC: CreateReview
 */
function createReview(call, callback) {
  try {
    const request = call.request;

    const productId = request.getProductId();
    const userId = request.getUserId();
    const rating = request.getRating();
    const comment = request.getComment();

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

    const now = new Date();

    const newReview = {
      id: generateId(),
      productId,
      userId,
      rating,
      comment,
      createdAt: now,
      updatedAt: now,
    };

    reviews.push(newReview);

    return callback(null, buildReviewMessage(newReview));
  } catch (error) {
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Failed to create review',
    });
  }
}

/**
 * RPC: GetReviewsByProduct
 */
function getReviewsByProduct(call, callback) {
  try {
    const request = call.request;

    const productId = request.getProductId();
    let page = request.getPage();
    let limit = request.getLimit();

    if (!productId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'product_id is required',
      });
    }

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const filtered = reviews.filter((r) => r.productId === productId);

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    const response = new reviewPb.GetReviewsResponse();
    response.setReviewsList(paginated.map(buildReviewMessage));

    return callback(null, response);
  } catch (error) {
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Failed to fetch reviews',
    });
  }
}

/**
 * RPC: GetAverageRating
 */
function getAverageRating(call, callback) {
  try {
    const request = call.request;
    const productId = request.getProductId();

    if (!productId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'product_id is required',
      });
    }

    const filtered = reviews.filter((r) => r.productId === productId);
    const totalReviews = filtered.length;

    const avgRating =
      totalReviews === 0
        ? 0
        : filtered.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    const response = new reviewPb.AverageRatingResponse();
    response.setProductId(productId);
    response.setAvgRating(avgRating);
    response.setTotalReviews(totalReviews);

    return callback(null, response);
  } catch (error) {
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Failed to calculate average rating',
    });
  }
}

/**
 * RPC: UpdateReview
 */
function updateReview(call, callback) {
  try {
    const request = call.request;

    const id = request.getId();
    const userId = request.getUserId();
    const rating = request.getRating();
    const comment = request.getComment();

    if (!id || !userId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'id and user_id are required',
      });
    }

    if (!validateRating(rating)) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'rating must be an integer between 1 and 5',
      });
    }

    const review = reviews.find((r) => r.id === id);

    if (!review) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Review not found',
      });
    }

    if (review.userId !== userId) {
      return callback({
        code: grpc.status.PERMISSION_DENIED,
        message: 'You can only update your own review',
      });
    }

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = new Date();

    return callback(null, buildReviewMessage(review));
  } catch (error) {
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Failed to update review',
    });
  }
}

/**
 * RPC: DeleteReview
 */
function deleteReview(call, callback) {
  try {
    const request = call.request;

    const id = request.getId();
    const userId = request.getUserId();

    if (!id || !userId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'id and user_id are required',
      });
    }

    const index = reviews.findIndex((r) => r.id === id);

    if (index === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Review not found',
      });
    }

    if (reviews[index].userId !== userId) {
      return callback({
        code: grpc.status.PERMISSION_DENIED,
        message: 'You can only delete your own review',
      });
    }

    reviews.splice(index, 1);

    const response = new reviewPb.DeleteReviewResponse();
    response.setMessage('Review deleted successfully');

    return callback(null, response);
  } catch (error) {
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Failed to delete review',
    });
  }
}

module.exports = {
  createReview,
  getReviewsByProduct,
  getAverageRating,
  updateReview,
  deleteReview,
};