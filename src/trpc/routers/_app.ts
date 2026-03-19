import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "test@example.com",
      },
    });

    return { success: true, message: "Job queued" };
  }),

  testAi: protectedProcedure.mutation(async () => {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Write a vegetarian lasagna recipe for 4 people.",
    });

    return text;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
