import { DemoProvider } from "@/lib/demo/store";

/** The marketplace shares the demo's sample data, so orders and seller changes show in the office demo too. */
export default function MarketplaceLayout({ children }: LayoutProps<"/marketplace">) {
  return <DemoProvider>{children}</DemoProvider>;
}
