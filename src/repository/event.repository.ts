import {Event} from '@prisma/client'
import { PrismaClient } from '@prisma/client';
import {FastifyReply, FastifyRequest} from "fastify"; // Правильный импорт PrismaClient
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient


export const getEventById = async (id: number): Promise<Event | null> => {
    return prisma.event.findUnique({
        where: {
            id,
        },
    });
};



