"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Client() {
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());

  return (
    <div className="min-h-screen flex items-center justify-center">
      {JSON.stringify(users)}
    </div>
  );
}
