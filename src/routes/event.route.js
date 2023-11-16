"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_controller_1 = require("../controllers/event/event.controller");
const eventRouter = (fastify, opts, next) => {
    fastify.get('/', event_controller_1.GetEvents);
    fastify.get('/get/:eventId', event_controller_1.GetEventById);
    fastify.post('/create', event_controller_1.CreateEvent);
    fastify.get('/user-events/:userId', event_controller_1.getUserEvents);
    next();
};
exports.default = eventRouter;
