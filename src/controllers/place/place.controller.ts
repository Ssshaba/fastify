import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client'; // Правильный импорт PrismaClient
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient

export const GetPlaces = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        // Используйте Prisma Client для выполнения запроса к базе данных
        const places = await prisma.place.findMany({
            include: {
                Photo: true, // Включите фотографии для каждого места
            },
        });

        // Отправьте данные в ответ
        reply.send(places);
    } catch (error) {
        // Обработайте ошибки
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        // Важно закрыть соединение с базой данных после использования
        await prisma.$disconnect();
    }
};
