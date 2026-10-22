import type { Metadata } from "next";
import { DemoProvider } from "@/lib/demo/store";
import { DemoShell } from "@/components/demo/shell";

export const metadata: Metadata = {
  title: "Platform demo",
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return (
    <DemoProvider>
      <DemoShell>{children}</DemoShell>
    </DemoProvider>
  );
}
