import { AdminProvider } from "@/components/admin-check-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
