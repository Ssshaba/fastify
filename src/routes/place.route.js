"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const place_controller_1 = require("../controllers/place/place.controller");
const placeRouter = (fastify, opts, next) => {
    fastify.get('/', place_controller_1.GetPlaces);
    next();
};
exports.default = placeRouter;
