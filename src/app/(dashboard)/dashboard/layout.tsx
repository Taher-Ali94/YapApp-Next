import { ReactNode } from "react";
import SideBar from "@/components/SideBar";



interface LayoutProps {
    children: ReactNode
}
  
const Layout = async ({ children }: LayoutProps) => {
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <SideBar />
                        {children}
                    </div>
                </div>
            </div>
        </div>
      )
}

export default Layout