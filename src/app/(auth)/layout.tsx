import Topbar from "@/components/Topbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="p-4 flex items-center flex-col   overflow-y-auto h-full w-full">{children}</main>;
}
