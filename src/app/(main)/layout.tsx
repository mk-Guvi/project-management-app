import Topbar from "@/components/Topbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" pt-[60px] h-full w-full">
      {children}

      <Topbar />
    </main>
  );
}
