import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";

export function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  return (
    <Button size="lg" onClick={() => {}} disabled={false}>
      Execute workflow
      <FlaskConicalIcon className="size-4" />
    </Button>
  );
}
