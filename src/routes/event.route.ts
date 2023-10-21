import { FastifyInstance } from 'fastify';
import {GetEvents, CreateEvent, GetEventById } from "../controllers/event/event.controller";


const eventRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {

    fastify.get('/',  GetEvents);

    fastify.get('/get/:eventId',  GetEventById);

    fastify.post('/create', CreateEvent );

    next();
};

export default eventRouter;