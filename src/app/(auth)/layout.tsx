import Topbar from "@/components/Topbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="py-8 px-2 flex items-center  overflow-y-auto h-full w-full">{children}</main>;
}
