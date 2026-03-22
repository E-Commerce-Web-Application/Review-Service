// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var review_review_pb = require('../review/review_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_review_AverageRatingResponse(arg) {
  if (!(arg instanceof review_review_pb.AverageRatingResponse)) {
    throw new Error('Expected argument of type review.AverageRatingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_AverageRatingResponse(buffer_arg) {
  return review_review_pb.AverageRatingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_CreateReviewRequest(arg) {
  if (!(arg instanceof review_review_pb.CreateReviewRequest)) {
    throw new Error('Expected argument of type review.CreateReviewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_CreateReviewRequest(buffer_arg) {
  return review_review_pb.CreateReviewRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_DeleteReviewRequest(arg) {
  if (!(arg instanceof review_review_pb.DeleteReviewRequest)) {
    throw new Error('Expected argument of type review.DeleteReviewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_DeleteReviewRequest(buffer_arg) {
  return review_review_pb.DeleteReviewRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_DeleteReviewResponse(arg) {
  if (!(arg instanceof review_review_pb.DeleteReviewResponse)) {
    throw new Error('Expected argument of type review.DeleteReviewResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_DeleteReviewResponse(buffer_arg) {
  return review_review_pb.DeleteReviewResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_GetAverageRatingRequest(arg) {
  if (!(arg instanceof review_review_pb.GetAverageRatingRequest)) {
    throw new Error('Expected argument of type review.GetAverageRatingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_GetAverageRatingRequest(buffer_arg) {
  return review_review_pb.GetAverageRatingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_GetReviewsRequest(arg) {
  if (!(arg instanceof review_review_pb.GetReviewsRequest)) {
    throw new Error('Expected argument of type review.GetReviewsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_GetReviewsRequest(buffer_arg) {
  return review_review_pb.GetReviewsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_GetReviewsResponse(arg) {
  if (!(arg instanceof review_review_pb.GetReviewsResponse)) {
    throw new Error('Expected argument of type review.GetReviewsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_GetReviewsResponse(buffer_arg) {
  return review_review_pb.GetReviewsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_Review(arg) {
  if (!(arg instanceof review_review_pb.Review)) {
    throw new Error('Expected argument of type review.Review');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_Review(buffer_arg) {
  return review_review_pb.Review.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_review_UpdateReviewRequest(arg) {
  if (!(arg instanceof review_review_pb.UpdateReviewRequest)) {
    throw new Error('Expected argument of type review.UpdateReviewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_review_UpdateReviewRequest(buffer_arg) {
  return review_review_pb.UpdateReviewRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The Review Service definition
var ReviewServiceService = exports.ReviewServiceService = {
  // ➤ Create Review
createReview: {
    path: '/review.ReviewService/CreateReview',
    requestStream: false,
    responseStream: false,
    requestType: review_review_pb.CreateReviewRequest,
    responseType: review_review_pb.Review,
    requestSerialize: serialize_review_CreateReviewRequest,
    requestDeserialize: deserialize_review_CreateReviewRequest,
    responseSerialize: serialize_review_Review,
    responseDeserialize: deserialize_review_Review,
  },
  // ➤ Get Reviews by Product (with pagination)
getReviewsByProduct: {
    path: '/review.ReviewService/GetReviewsByProduct',
    requestStream: false,
    responseStream: false,
    requestType: review_review_pb.GetReviewsRequest,
    responseType: review_review_pb.GetReviewsResponse,
    requestSerialize: serialize_review_GetReviewsRequest,
    requestDeserialize: deserialize_review_GetReviewsRequest,
    responseSerialize: serialize_review_GetReviewsResponse,
    responseDeserialize: deserialize_review_GetReviewsResponse,
  },
  // ➤ Get Average Rating
getAverageRating: {
    path: '/review.ReviewService/GetAverageRating',
    requestStream: false,
    responseStream: false,
    requestType: review_review_pb.GetAverageRatingRequest,
    responseType: review_review_pb.AverageRatingResponse,
    requestSerialize: serialize_review_GetAverageRatingRequest,
    requestDeserialize: deserialize_review_GetAverageRatingRequest,
    responseSerialize: serialize_review_AverageRatingResponse,
    responseDeserialize: deserialize_review_AverageRatingResponse,
  },
  // ➤ Update Review
updateReview: {
    path: '/review.ReviewService/UpdateReview',
    requestStream: false,
    responseStream: false,
    requestType: review_review_pb.UpdateReviewRequest,
    responseType: review_review_pb.Review,
    requestSerialize: serialize_review_UpdateReviewRequest,
    requestDeserialize: deserialize_review_UpdateReviewRequest,
    responseSerialize: serialize_review_Review,
    responseDeserialize: deserialize_review_Review,
  },
  // ➤ Delete Review
deleteReview: {
    path: '/review.ReviewService/DeleteReview',
    requestStream: false,
    responseStream: false,
    requestType: review_review_pb.DeleteReviewRequest,
    responseType: review_review_pb.DeleteReviewResponse,
    requestSerialize: serialize_review_DeleteReviewRequest,
    requestDeserialize: deserialize_review_DeleteReviewRequest,
    responseSerialize: serialize_review_DeleteReviewResponse,
    responseDeserialize: deserialize_review_DeleteReviewResponse,
  },
};

exports.ReviewServiceClient = grpc.makeGenericClientConstructor(ReviewServiceService, 'ReviewService');
