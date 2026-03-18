import Image from "next/image";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium italic"
        >
          <Image alt="workflow" src="/logos/logo.svg" width={32} height={32} />
          Workflow
        </Link>
        {children}
      </div>
    </div>
  );
}
