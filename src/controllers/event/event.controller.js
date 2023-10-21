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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventById = exports.CreateEvent = exports.GetEvents = void 0;
const client_1 = require("@prisma/client"); // Правильный импорт PrismaClient
const prisma = new client_1.PrismaClient(); // Создайте экземпляр PrismaClient
const event_repository_1 = require("../../repository/event.repository");
const GetEvents = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany(); // Используйте Prisma для получения всех мероприятий
        reply.send(events); // Отправьте данные в ответ
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.GetEvents = GetEvents;
const CreateEvent = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventData = req.body;
        const newEvent = yield prisma.event.create({
            data: {
                name: eventData.name,
                date: eventData.date,
                startTime: eventData.startTime,
                description: eventData.description,
                pointValue: eventData.pointValue,
                location: eventData.location,
                image: eventData.image, // Сохраняем URL изображения
            },
        });
        reply.code(201).send(newEvent);
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.CreateEvent = CreateEvent;
const GetEventById = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = Number(req.params.eventId);
        const event = yield (0, event_repository_1.getEventById)(eventId);
        if (event) {
            reply.send(event);
        }
        else {
            // Если мероприятие не найдено, отправьте статус 404 (Not Found)
            reply.status(404).send({ error: 'Event not found' });
        }
    }
    catch (error) {
        console.error(error);
        // Если произошла ошибка, отправьте статус 500 (Internal Server Error)
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.GetEventById = GetEventById;
