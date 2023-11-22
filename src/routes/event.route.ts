import { FastifyInstance } from 'fastify';
import {GetEvents, CreateEvent, GetEventById, getUserEvents, DeleteEvent} from "../controllers/event/event.controller";


const eventRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {

    fastify.get('/',  GetEvents);

    fastify.get('/get/:eventId',  GetEventById);

    fastify.post('/create', CreateEvent );

    fastify.delete('/delete/:eventId', DeleteEvent);

    fastify.get('/user-events/:userId', getUserEvents);

    next();
};

export default eventRouter;