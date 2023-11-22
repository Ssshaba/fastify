import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client'; // Правильный импорт PrismaClient
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient
import { getEventById } from '../../repository/event.repository';

export const GetEvents = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const events = await prisma.event.findMany(); // Используйте Prisma для получения всех мероприятий

        reply.send(events); // Отправьте данные в ответ
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};
interface EventData {
    name: string;
    date: string;
    startTime: string;
    description: string;
    pointValue?: number; // Поле pointValue теперь необязательное
    location: string;
    image: string;
    adminVkId: number;
}

export const CreateEvent = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const eventData = req.body as EventData;

        const newEvent = await prisma.event.create({
            data: {
                name: eventData.name,
                date: eventData.date,
                startTime: eventData.startTime,
                description: eventData.description,
                pointValue: eventData.pointValue,
                location: eventData.location,
                image: eventData.image, // Сохраняем URL изображения
                adminVkId: eventData.adminVkId

            },
        });

        reply.code(201).send(newEvent);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};

export const DeleteEvent = async (req: FastifyRequest<{ Params: { eventId: string } }>, reply: FastifyReply) => {
    const eventId = req.params.eventId;

    try {
        // Проверьте, существует ли мероприятие с указанным eventId
        const existingEvent = await prisma.event.findUnique({ where: { id: Number(eventId) } });

        if (!existingEvent) {
            reply.status(404).send({ error: 'Event not found' });
            return;
        }

        // Удалите мероприятие
        await prisma.event.delete({ where: { id: Number(eventId) } });

        reply.code(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};


export const GetEventById = async (req: FastifyRequest<{ Params: { eventId: number } }>, reply: FastifyReply) => {
    try {
        const eventId = Number(req.params.eventId);

        const event = await getEventById(eventId);

        if (event) {
            reply.send(event);
        } else {
            // Если мероприятие не найдено, отправьте статус 404 (Not Found)
            reply.status(404).send({ error: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        // Если произошла ошибка, отправьте статус 500 (Internal Server Error)
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};


export const getUserEvents = async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    const { userId } = req.params;
    const prisma = new PrismaClient();

    try {
        const userEvents = await prisma.userEvent.findMany({
            where: { vkId: Number(userId) }, // Преобразование `userId` в числовой тип
            include: {
                Event: true
            }
        });

        reply.code(200).send(userEvents);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Произошла ошибка' });
    } finally {
        await prisma.$disconnect();
    }
};


