import NavBar from "@/components/navbar";
import ProtectedRoute from "@/components/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <NavBar classname="mb-18" />
      {children}
    </ProtectedRoute>
  );
}
