import {User} from '@prisma/client'
import { PrismaClient } from '@prisma/client';
import {FastifyReply, FastifyRequest} from "fastify"; // Правильный импорт PrismaClient
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient


export const getUserById = async (vkId: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            vkId,
        },
    });
};



