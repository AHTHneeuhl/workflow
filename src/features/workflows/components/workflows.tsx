"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export function WorkflowsSearch() {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
}

export function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <p>{JSON.stringify(workflows.data, null, 2)}</p>
    </div>
  );
}

export function WorkflowsHeader({ disabled }: { disabled?: boolean }) {
  const createWorkflow = useCreateWorkflow();
  const { modal, handleError } = useUpgradeModal();
  const router = useRouter();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => handleError(error),
      onSuccess: (workflow) => {
        router.push(`/workflows/${workflow.id}`);
      },
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        disabled={disabled}
        newButtonLabel="New Workflow"
        onNew={handleCreateWorkflow}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
}

export function WorkflowsPagination() {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
}

export function WorkflowsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
}
