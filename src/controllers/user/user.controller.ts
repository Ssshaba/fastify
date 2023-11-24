import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import {getEventById} from "../../repository/event.repository";
import {getUserById} from "../../repository/user.repository"; // Правильный импорт PrismaClient
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

export const GetUserById = async (req: FastifyRequest<{ Params: { userId: number } }>, reply: FastifyReply) => {
    try {
    const userId = Number(req.params.userId);

    const user = await getUserById(userId);

    if (user) {
        reply.send(user);
    } else {
        // Если мероприятие не найдено, отправьте статус 404 (Not Found)
        reply.status(404).send({ error: 'User not found' });
    }
} catch (error) {
    console.error(error);
    // Если произошла ошибка, отправьте статус 500 (Internal Server Error)
    reply.status(500).send({ error: 'An error occurred' });
} finally {
    await prisma.$disconnect();
}
};

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

// Метод для обновления пользователя
export const UpdateUser = async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
        const userId = parseInt(req.params.userId, 10); // Получаем ID пользователя из параметра URL
        const userData = req.body as UserData;

        // Обновляем пользователя по его ID
        const updatedUser = await prisma.user.update({
            where: { vkId: userId },
            data: {
                name: userData.name,
                group: userData.group,
                phone: userData.phone,
                points: userData.points,
                faculty: userData.faculty,
                photo100: userData.photo100,
            },
        });

        reply.send(updatedUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};


// Интерфейс для данных запроса PlusPoints
interface PlusPointsRequestData {
    pointsToAdd: number;
}

// Метод для увеличения количества баллов пользователя
export const PlusPoints = async (req: FastifyRequest<{ Params: { userId: string }; Body: PlusPointsRequestData }>, reply: FastifyReply) => {
    try {
        const userId = parseInt(req.params.userId, 10); // Получаем vkId пользователя из параметра URL
        const { pointsToAdd } = req.body; // Теперь TypeScript знает о свойстве pointsToAdd

        // Проверяем, существует ли пользователь и устанавливаем points в 0, если он равен null
        const user = await prisma.user.findUnique({
            where: { vkId: userId },
        });

        if (user) {
            if (user.points === null) {
                await prisma.user.update({
                    where: { vkId: userId },
                    data: { points: 0 },
                });
            }

            // Увеличиваем количество баллов пользователя
            const updatedUser = await prisma.user.update({
                where: { vkId: userId },
                data: {
                    points: {
                        increment: pointsToAdd,
                    },
                },
            });

            reply.send(updatedUser);
        } else {
            reply.status(404).send({ error: 'User not found' });
        }
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
    const { userId, eventId } = req.params;
    const prisma = new PrismaClient();

    try {
        // Проверьте, что пользователь и мероприятие существуют
        const user = await prisma.user.findUnique({ where: { vkId: Number(userId) } });
        const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });

        if (user && event) {
            // Проверьте, не зарегистрирован ли пользователь уже на это мероприятие
            const existingRegistration = await prisma.userEvent.findFirst({
                where: {
                    AND: [
                        { vkId: Number(userId) },
                        { eventId: Number(eventId) },
                    ],
                },
            });

            if (existingRegistration) {
                reply.status(400).send({ error: 'User is already registered for the event.' });
                return;
            }

            const pointsEarned = event.pointValue || 0;

            // Создайте запись в таблице "UserEvent" с данными пользователя, мероприятия и баллами
            await prisma.userEvent.create({
                data: {
                    vkId: Number(userId),
                    eventId: Number(eventId),
                    pointsEarned: pointsEarned,
                },
            });

            // // Обновите количество баллов у пользователя
            // await prisma.user.update({
            //     where: { vkId: Number(userId) },
            //     data: {
            //         points: {
            //             increment: pointsEarned,
            //         },
            //     },
            // });

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
