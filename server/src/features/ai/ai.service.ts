import { generateEmbedding } from "./ai.client";
import { aiRepository } from "./ai.repository";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";

export const aiService = {
  async embedResource(resourceId: string, userId: string) {
    const resource = await prisma.resource.findFirst({
      where: {
        id: resourceId,
        uploadedById: userId,
      },
    });

    if (!resource) {
      throw new AppError(`Resource with id ${resourceId} not found`, 404);
    }

    const text = `${resource.title} ${resource.subject ?? ""}`.trim();
    const vector = await generateEmbedding(text);

    await aiRepository.deleteEmbeddingsByResourceId(resourceId);

    return aiRepository.insertEmbedding({
      resourceId,
      chunkText: text,
      vector,
    });
  },

  async embedNote(noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!note) {
      throw new AppError(`Note with id ${noteId} not found`, 404);
    }

    const vector = await generateEmbedding(note.content);

    await aiRepository.deleteEmbeddingsByNoteId(noteId);

    return aiRepository.insertEmbedding({
      noteId,
      chunkText: note.content,
      vector,
    });
  },

  async search(query: string, userId: string, limit = 5) {
    const queryVector = await generateEmbedding(query);
    const matches = await aiRepository.searchSimilar(queryVector, limit);

    const noteIds = matches
      .filter((match) => match.noteId)
      .map((match) => match.noteId!);

    const resourceIds = matches
      .filter((match) => match.resourceId)
      .map((match) => match.resourceId!);

    const [notes, resources] = await Promise.all([
      noteIds.length
        ? prisma.note.findMany({
            where: {
              id: { in: noteIds },
              userId,
            },
          })
        : [],

      resourceIds.length
        ? prisma.resource.findMany({
            where: {
              id: { in: resourceIds },
              uploadedById: userId,
            },
          })
        : [],
    ]);

    return matches
      .map((match) => {
        const note = notes.find((item) => item.id === match.noteId);
        const resource = resources.find(
          (item) => item.id === match.resourceId,
        );

        if (!note && !resource) {
          return null;
        }

        return {
          distance: match.distance,
          chunkText: match.chunkText,
          entityType: note ? "NOTE" : "RESOURCE",

          note: note
            ? {
                id: note.id,
                content: note.content,
                createdAt: note.createdAt,
              }
            : null,

          resource: resource
            ? {
                id: resource.id,
                title: resource.title,
                type: resource.type,
                subject: resource.subject,
                fileUrl: resource.fileUrl,
                createdAt: resource.createdAt,
              }
            : null,
        };
      })
      .filter((result) => result !== null);
  },
};