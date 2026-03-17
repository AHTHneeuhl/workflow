import { caller } from "@/trpc/server";

export default async function Home() {
  const users = await caller.getUsers();

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center">
      {JSON.stringify(users)}
    </div>
  );
}
