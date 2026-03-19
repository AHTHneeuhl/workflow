import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionIdPage({ params }: Props) {
  const { executionId } = await params;
  await requireAuth();

  return <div>Execution Id: {executionId}</div>;
}
