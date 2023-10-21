import fastify from 'fastify'
import fastifyCors from '@fastify/cors';
import {fastifyMultipart} from '@fastify/multipart';
import fs from "fs";
import placeRouter from "./src/routes/place.route";
import eventRouter from "./src/routes/event.route";
import userRouter from "./src/routes/user.route";
const server = fastify()


// server.register(fastifyMultipart)
//server.register(require('fastifyMultipart'), { attachFieldsToBody: 'keyValues'});

async function start() {

    // Включите плагин fastify-cors
    await server.register(fastifyCors, {
        origin: '*',
    });

    await server.register(placeRouter, {
        prefix: '/api/place',
    });

    await server.register(userRouter, {
        prefix: '/api/user',
    });

    await server.register(eventRouter, {
        prefix: '/api/event',
    });



    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}

start();

