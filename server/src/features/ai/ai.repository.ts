import { randomUUID } from "crypto";
import { prisma } from "../../config/prisma";

type EmbeddingSearchRow = {
  id: string;
  chunkText: string;
  resourceId: string | null;
  noteId: string | null;
  distance: number;
};

function toVectorLiteral(vector: number[]): string {
  if (vector.length !== 768) {
    throw new Error(
      `Expected a 768-dimensional embedding, received ${vector.length}`,
    );
  }

  if (!vector.every(Number.isFinite)) {
    throw new Error("Embedding contains a non-finite value");
  }

  return `[${vector.join(",")}]`;
}

export const aiRepository = {
  async insertEmbedding(data: {
    resourceId?: string;
    noteId?: string;
    chunkText: string;
    vector: number[];
  }) {
    const id = randomUUID();
    const vectorLiteral = toVectorLiteral(data.vector);

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO "Embeddings"
          (id, "resourceId", "noteId", "chunkText", vector, "createdAt")
        VALUES
          ($1, $2, $3, $4, $5::vector, now())
      `,
      id,
      data.resourceId ?? null,
      data.noteId ?? null,
      data.chunkText,
      vectorLiteral,
    );

    return { id };
  },
  async deleteEmbeddingsByResourceId(resourceId: string) {
  await prisma.$executeRawUnsafe(
    `DELETE FROM "Embeddings" WHERE "resourceId" = $1`,
    resourceId,
  );
},

async deleteEmbeddingsByNoteId(noteId: string) {
  await prisma.$executeRawUnsafe(
    `DELETE FROM "Embeddings" WHERE "noteId" = $1`,
    noteId,
  );
},

  async searchSimilar(queryVector: number[], limit = 5) {
    const vectorLiteral = toVectorLiteral(queryVector);

    return prisma.$queryRawUnsafe<EmbeddingSearchRow[]>(
      `
        SELECT
          id,
          "chunkText",
          "resourceId",
          "noteId",
          vector <=> $1::vector AS distance
        FROM "Embeddings"
        ORDER BY vector <=> $1::vector
        LIMIT $2
      `,
      vectorLiteral,
      limit,
    );
  },
};