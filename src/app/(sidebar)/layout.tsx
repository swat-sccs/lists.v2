
import SideBar from "@/app/components/SideBar";


export default async function SideBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div className="h-full grid grid-cols-6 gap-5">
      <div className="col-span-1">
        <SideBar />
      </div>
      <div className="h-full col-span-5">{children}</div>
    </div>
  );
}
