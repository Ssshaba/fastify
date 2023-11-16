import { FastifyInstance } from 'fastify';
import {GetPlaces} from "../controllers/place/place.controller";
import {GetEvents, CreateEvent } from "../controllers/event/event.controller";
import {CreateUser, GetUsers, RegisterUserForEvent, UpdateUser} from "../controllers/user/user.controller";

const eventRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
    fastify.get('/',  GetUsers);

    fastify.post('/create', CreateUser );

    // Роут для обновления пользователя
    fastify.put('/update/:userId', UpdateUser);

    fastify.post('/register-for-event/:userId/:eventId', RegisterUserForEvent );

    next();
};

export default eventRouter;