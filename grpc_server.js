'use strict';
const connectDB = require("./src/config/db");
const grpc = require('@grpc/grpc-js');
const { ReviewServiceService } = require('./generated/review/review_grpc_pb');
const reviewHandlers = require('./review.handler');

function startServer() {
  const server = new grpc.Server();

  server.addService(ReviewServiceService, {
    createReview: reviewHandlers.createReview,
    getReviewsByProduct: reviewHandlers.getReviewsByProduct,
    getAverageRating: reviewHandlers.getAverageRating,
    updateReview: reviewHandlers.updateReview,
    deleteReview: reviewHandlers.deleteReview,
  });

  const PORT = process.env.GRPC_PORT || '50051';
  const address = `0.0.0.0:${PORT}`;

  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind gRPC server:', err);
        process.exit(1);
      }

      console.log(`gRPC ReviewService running on ${address}`);
      connectDB();
      server.start();
    }
  );
}

startServer();