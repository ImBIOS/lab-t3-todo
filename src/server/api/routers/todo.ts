import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1), dueDate: z.date().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input.text,
          dueDate: input.dueDate,
          userId: ctx.session.user.id,
        },
      });
    }),

  toggleComplete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.findUnique({
        where: { id: input.id },
      });

      if (!todo || todo.userId !== ctx.session.user.id) {
        throw new Error("Todo not found or unauthorized");
      }

      return ctx.db.todo.update({
        where: { id: input.id },
        data: { completed: !todo.completed },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.findUnique({
        where: { id: input.id },
      });

      if (!todo || todo.userId !== ctx.session.user.id) {
        throw new Error("Todo not found or unauthorized");
      }

      return ctx.db.todo.delete({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      text: z.string().min(1),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.findUnique({
        where: { id: input.id },
      });

      if (!todo || todo.userId !== ctx.session.user.id) {
        throw new Error("Todo not found or unauthorized");
      }

      return ctx.db.todo.update({
        where: { id: input.id },
        data: {
          text: input.text,
          dueDate: input.dueDate,
        },
      });
    }),
});