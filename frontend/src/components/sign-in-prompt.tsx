import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignInPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-muted-foreground">{children}</p>
      <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>
        Sign in
      </Link>
    </div>
  );
}
