import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{ credentialId: string }>;
}

export default async function CredentialIdPage({ params }: Props) {
  const { credentialId } = await params;
  await requireAuth();

  return <div>Credential Id: {credentialId}</div>;
}
