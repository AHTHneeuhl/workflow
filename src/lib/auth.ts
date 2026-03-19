import { betterAuth } from "better-auth";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "b76e8da7-d4fd-4ff1-b4fe-d3c975a97d08",
              slug: "pro",
            },
          ],
          // "/success?checkout_id={CHECKOUT_ID}"
          successUrl: "http://localhost:3000/",
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
