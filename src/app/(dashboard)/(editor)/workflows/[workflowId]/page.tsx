import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowIdPage({ params }: Props) {
  const { workflowId } = await params;
  await requireAuth();

  return <div>Workflow Id: {workflowId}</div>;
}
