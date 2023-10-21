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
exports.RegisterUserForEvent = exports.CreateUser = exports.GetUsers = void 0;
const client_1 = require("@prisma/client"); // Правильный импорт PrismaClient
const prisma = new client_1.PrismaClient(); // Создайте экземпляр PrismaClient
const GetUsers = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany(); // Используйте Prisma для получения всех пользователей
        reply.send(users); // Отправьте список пользователей в ответ
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.GetUsers = GetUsers;
const CreateUser = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const newUser = yield prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                group: userData.group,
                phone: userData.phone,
                points: userData.points,
                faculty: userData.faculty,
            },
        });
        reply.code(201).send(newUser);
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.CreateUser = CreateUser;
const RegisterUserForEvent = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, eventId } = req.params; // Получите значения параметров из запроса
    const prisma = new client_1.PrismaClient(); // Создайте экземпляр PrismaClient
    try {
        // Проверьте, что пользователь и мероприятие существуют
        const user = yield prisma.user.findUnique({ where: { id: Number(userId) } });
        const event = yield prisma.event.findUnique({ where: { id: Number(eventId) } });
        if (user && event) {
            const pointsEarned = event.pointValue || 0; // Получите количество баллов из мероприятия
            // Создайте запись в таблице "UserEvent" с данными пользователя, мероприятия и баллами
            yield prisma.userEvent.create({
                data: {
                    userId: Number(userId),
                    eventId: Number(eventId),
                    pointsEarned: pointsEarned,
                },
            });
            // Обновите количество баллов у пользователя
            yield prisma.user.update({
                where: { id: Number(userId) },
                data: {
                    points: {
                        increment: pointsEarned,
                    },
                },
            });
            reply.code(201).send({ message: 'User registered for the event and points earned.' });
        }
        else {
            reply.status(400).send({ error: 'Registration failed. User or event not found.' });
        }
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.RegisterUserForEvent = RegisterUserForEvent;
