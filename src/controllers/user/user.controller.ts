import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client'; // Правильный импорт PrismaClient
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient

export const GetUsers = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const users = await prisma.user.findMany(); // Используйте Prisma для получения всех пользователей

        reply.send(users); // Отправьте список пользователей в ответ
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};



interface UserData {
    email: string;
    name?: string;
    group?: string;
    phone?: string;
    points?: number;
    faculty?: string;
    photo100?: string;
    vkId?: number; // Приводим к числу, чтобы соответствовать изменению в схеме
}

export const CreateUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = req.body as UserData;

        const newUser = await prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                group: userData.group,
                phone: userData.phone,
                points: userData.points,
                faculty: userData.faculty,
                photo100: userData.photo100,
                vkId: userData.vkId, // vkId теперь ожидает число
            },
        });

        reply.code(201).send(newUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};


// запись на мероприятия
// Определите интерфейс для параметров запроса
interface RequestParams {
    userId: number;
    eventId: number;
}

export const RegisterUserForEvent = async (req: FastifyRequest<{ Params: RequestParams }>, reply: FastifyReply) => {
    const { userId, eventId } = req.params; // Получите значения параметров из запроса
    const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient

    try {
        // Проверьте, что пользователь и мероприятие существуют
        const user = await prisma.user.findUnique({ where: { vkId: Number(userId) } });
        const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });

        if (user && event) {
            const pointsEarned = event.pointValue || 0; // Получите количество баллов из мероприятия
            //const adminVkIdEvent = event.adminVkId || 0; // Получите из мероприятия

            // Создайте запись в таблице "UserEvent" с данными пользователя, мероприятия и баллами
            await prisma.userEvent.create({
                data: {
                    vkId: Number(userId),
                    eventId: Number(eventId),
                    pointsEarned: pointsEarned,
                },
            });

            // Обновите количество баллов у пользователя
            await prisma.user.update({
                where: { vkId: Number(userId) },
                data: {
                    points: {
                        increment: pointsEarned,
                    },
                },
            });

            reply.code(201).send({ message: 'User registered for the event and points earned.' });
        } else {
            reply.status(400).send({ error: 'Registration failed. User or event not found.' });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};
