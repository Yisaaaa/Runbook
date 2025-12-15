import AuthRedirect from "@/components/auth-redirect";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRedirect>{children}</AuthRedirect>;
}
