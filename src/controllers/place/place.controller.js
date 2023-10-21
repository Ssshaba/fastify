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
exports.GetPlaces = void 0;
const client_1 = require("@prisma/client"); // Правильный импорт PrismaClient
const prisma = new client_1.PrismaClient(); // Создайте экземпляр PrismaClient
const GetPlaces = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Используйте Prisma Client для выполнения запроса к базе данных
        const places = yield prisma.place.findMany({
            include: {
                Photo: true, // Включите фотографии для каждого места
            },
        });
        // Отправьте данные в ответ
        reply.send(places);
    }
    catch (error) {
        // Обработайте ошибки
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    }
    finally {
        // Важно закрыть соединение с базой данных после использования
        yield prisma.$disconnect();
    }
});
exports.GetPlaces = GetPlaces;
