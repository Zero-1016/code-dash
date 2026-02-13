import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">{children}</main>
    </div>
  );
}
