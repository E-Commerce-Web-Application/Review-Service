// grpc_server.js
require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const { ReviewServiceService } = require('./app/generated/review/review_grpc_pb');
const reviewHandlers = require('./review.handler');

function startGRPCServer() {
  const server = new grpc.Server();

  server.addService(ReviewServiceService, {
    createReview: reviewHandlers.createReview,
    createShopReview: reviewHandlers.createShopReview,
    getReviewsByProduct: reviewHandlers.getReviewsByProduct,
    getReviewsByShopId: reviewHandlers.getReviewsByShopId,
    getAverageRating: reviewHandlers.getAverageRating,
    getAverageRatingByShopId: reviewHandlers.getAverageRatingByShopId,
    updateReview: reviewHandlers.updateReview,
    deleteReview: reviewHandlers.deleteReview,
  });

  const address = `0.0.0.0:${process.env.GRPC_PORT || 50051}`;

  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind gRPC server:', err);
      process.exit(1);
    }
    console.log(`gRPC server running on ${address}`);
  });
}

module.exports = startGRPCServer;