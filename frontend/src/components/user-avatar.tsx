import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return letters || "?";
}

export function UserAvatar({
  name,
  size = "default",
  className,
}: {
  name: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
