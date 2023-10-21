"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const place_route_1 = __importDefault(require("./src/routes/place.route"));
const event_route_1 = __importDefault(require("./src/routes/event.route"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
const server = (0, fastify_1.default)();
// server.register(fastifyMultipart)
//server.register(require('fastifyMultipart'), { attachFieldsToBody: 'keyValues'});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.register(place_route_1.default, {
            prefix: '/api/place',
        });
        yield server.register(user_route_1.default, {
            prefix: '/api/user',
        });
        yield server.register(event_route_1.default, {
            prefix: '/api/event',
        });
        server.listen({ port: 8080 }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening at ${address}`);
        });
    });
}
start();
