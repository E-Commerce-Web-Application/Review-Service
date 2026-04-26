// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */

'use strict';
var grpc = require('@grpc/grpc-js');
var app_generated_cart_cart_pb = require('../../../app/generated/cart/cart_pb.js');

function serialize_cart_AddItemRequest(arg) {
  if (!(arg instanceof app_generated_cart_cart_pb.AddItemRequest)) {
    throw new Error('Expected argument of type cart.AddItemRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cart_AddItemRequest(buffer_arg) {
  return app_generated_cart_cart_pb.AddItemRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cart_CartResponse(arg) {
  if (!(arg instanceof app_generated_cart_cart_pb.CartResponse)) {
    throw new Error('Expected argument of type cart.CartResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cart_CartResponse(buffer_arg) {
  return app_generated_cart_cart_pb.CartResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cart_ClearCartRequest(arg) {
  if (!(arg instanceof app_generated_cart_cart_pb.ClearCartRequest)) {
    throw new Error('Expected argument of type cart.ClearCartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cart_ClearCartRequest(buffer_arg) {
  return app_generated_cart_cart_pb.ClearCartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cart_ClearCartResponse(arg) {
  if (!(arg instanceof app_generated_cart_cart_pb.ClearCartResponse)) {
    throw new Error('Expected argument of type cart.ClearCartResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cart_ClearCartResponse(buffer_arg) {
  return app_generated_cart_cart_pb.ClearCartResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cart_GetCartRequest(arg) {
  if (!(arg instanceof app_generated_cart_cart_pb.GetCartRequest)) {
    throw new Error('Expected argument of type cart.GetCartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cart_GetCartRequest(buffer_arg) {
  return app_generated_cart_cart_pb.GetCartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cart_RemoveItemRequest(arg) {
  if (!(arg instanceof app_generated_cart_cart_pb.RemoveItemRequest)) {
    throw new Error('Expected argument of type cart.RemoveItemRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cart_RemoveItemRequest(buffer_arg) {
  return app_generated_cart_cart_pb.RemoveItemRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var CartServiceService = exports.CartServiceService = {
  getCart: {
    path: '/cart.CartService/GetCart',
    requestStream: false,
    responseStream: false,
    requestType: app_generated_cart_cart_pb.GetCartRequest,
    responseType: app_generated_cart_cart_pb.CartResponse,
    requestSerialize: serialize_cart_GetCartRequest,
    requestDeserialize: deserialize_cart_GetCartRequest,
    responseSerialize: serialize_cart_CartResponse,
    responseDeserialize: deserialize_cart_CartResponse,
  },
  addItem: {
    path: '/cart.CartService/AddItem',
    requestStream: false,
    responseStream: false,
    requestType: app_generated_cart_cart_pb.AddItemRequest,
    responseType: app_generated_cart_cart_pb.CartResponse,
    requestSerialize: serialize_cart_AddItemRequest,
    requestDeserialize: deserialize_cart_AddItemRequest,
    responseSerialize: serialize_cart_CartResponse,
    responseDeserialize: deserialize_cart_CartResponse,
  },
  removeItem: {
    path: '/cart.CartService/RemoveItem',
    requestStream: false,
    responseStream: false,
    requestType: app_generated_cart_cart_pb.RemoveItemRequest,
    responseType: app_generated_cart_cart_pb.CartResponse,
    requestSerialize: serialize_cart_RemoveItemRequest,
    requestDeserialize: deserialize_cart_RemoveItemRequest,
    responseSerialize: serialize_cart_CartResponse,
    responseDeserialize: deserialize_cart_CartResponse,
  },
  clearCart: {
    path: '/cart.CartService/ClearCart',
    requestStream: false,
    responseStream: false,
    requestType: app_generated_cart_cart_pb.ClearCartRequest,
    responseType: app_generated_cart_cart_pb.ClearCartResponse,
    requestSerialize: serialize_cart_ClearCartRequest,
    requestDeserialize: deserialize_cart_ClearCartRequest,
    responseSerialize: serialize_cart_ClearCartResponse,
    responseDeserialize: deserialize_cart_ClearCartResponse,
  },
};

exports.CartServiceClient = grpc.makeGenericClientConstructor(CartServiceService, 'CartService');
