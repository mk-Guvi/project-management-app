import Topbar from "@/components/Topbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <main className=" pt-[75px] px-8 overflow-y-auto h-full w-full">
        {children}
      </main>
      
    </>
  );
}
