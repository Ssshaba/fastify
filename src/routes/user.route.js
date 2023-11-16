"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user/user.controller");
const eventRouter = (fastify, opts, next) => {
    fastify.get('/', user_controller_1.GetUsers);
    fastify.post('/create', user_controller_1.CreateUser);
    // Роут для обновления пользователя
    fastify.put('/update/:userId', user_controller_1.UpdateUser);
    // Роут для увеличения количества баллов пользователя
    fastify.put('/plus-points/:userId', user_controller_1.PlusPoints);
    fastify.post('/register-for-event/:userId/:eventId', user_controller_1.RegisterUserForEvent);
    next();
};
exports.default = eventRouter;
