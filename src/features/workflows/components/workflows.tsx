"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import type { Workflow } from "@/generated/prisma/client";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

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
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
      emptyView={<WorkflowEmpty />}
    />
  );
}

export function WorkflowItem({ workflow }: { workflow: Workflow }) {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemoveWorkflow = () => {
    removeWorkflow.mutate({ id: workflow.id });
  };

  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemoveWorkflow}
      isRemoving={removeWorkflow.isPending}
    />
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

export function WorkflowsLoading() {
  return <LoadingView message="loading workflows..." />;
}

export function WorkflowsError() {
  return <ErrorView message="Error loading workflows" />;
}

export function WorkflowEmpty() {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { modal, handleError } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => handleError(error),
      onSuccess: (workflow) => router.push(`/workflows/${workflow.id}`),
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        onNew={handleCreateWorkflow}
        message="You haven't created any workflows yet. Get started by creating your first workflow"
      />
    </>
  );
}
