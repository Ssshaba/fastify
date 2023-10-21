import { FastifyInstance } from 'fastify';
import {GetPlaces} from "../controllers/place/place.controller";
const placeRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
    fastify.get('/',  GetPlaces);

    next();
};

export default placeRouter;