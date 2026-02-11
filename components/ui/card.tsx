import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return <div className={cn("rounded-2xl bg-panel shadow-soft", className)}>{children}</div>;
}
