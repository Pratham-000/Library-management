import {AppError} from "../../utils/appError"

import {sessionsRepository} from "./sessions.repository"

export const sessionsService = {
    start(userId: string, resourceId?: string) {
        return sessionsRepository.create({
            userId,
            resourceId,
        });
    },
    list(userId: string) {
        return sessionsRepository.findAllByUserId(userId);
    },

    async getbyId(id: string, userId: string) {
        const session = await sessionsRepository.findByIdAndUserId(id, userId);
        if (!session) {
            throw new AppError(`Study session with id ${id} not found`, 404);
        }
        return session;
    },

    async finish(
        id: string,
        userId: string,
        status: "COMPLETED" | "CANCELLED",
    ) {
        const session = await this.getbyId(id, userId);

        if (session.status !== "ACTIVE") {
            throw new AppError(
                `Study session with id ${id} is not active and cannot be finished`,
                400,);
        }

        const endTime = new Date();
        const durationMinutes = Math.floor(
            (endTime.getTime() - session.startTime.getTime()) / 60000
        );

        return sessionsRepository.update(id, {  
            endTime,
            durationMinutes,
            status
        });
    },

    async delete(id: string, userId: string) {
        const session = await this.getbyId(id, userId);

        if (session.status === "ACTIVE") {
            throw new AppError(
                `Study session with id ${id} is active and cannot be deleted`,
                400,
            );
        }

        return sessionsRepository.delete(id);
    }
};
