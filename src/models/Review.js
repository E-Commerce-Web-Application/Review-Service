const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: false,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  shopId: {
    type: String,
    required: false,
    index: true
  }
}, { timestamps: true });

reviewSchema.pre("validate", function (next) {
  const hasProductId = Boolean(this.productId);
  const hasShopId = Boolean(this.shopId);

  if (hasProductId === hasShopId) {
    if (!hasProductId) {
      this.invalidate("productId", "Either productId or shopId is required");
      this.invalidate("shopId", "Either productId or shopId is required");
    } else {
      this.invalidate("productId", "Review can belong to either a product or a shop, not both");
      this.invalidate("shopId", "Review can belong to either a product or a shop, not both");
    }
  }

  next();
});

// Prevent duplicate review per user for product reviews
reviewSchema.index(
  { productId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      productId: { $exists: true, $type: "string" },
      shopId: { $exists: false },
    },
  }
);

// Prevent duplicate review per user for shop reviews
reviewSchema.index(
  { shopId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      shopId: { $exists: true, $type: "string" },
      productId: { $exists: false },
    },
  }
);

module.exports = mongoose.model("Review", reviewSchema);