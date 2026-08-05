import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { useState } from "react";

const Layout = ({ children, tickets = [] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar — left side */}
      <Sidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Main Content — right side */}
      <div className="ml-0 flex-1 overflow-auto md:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm text-gray-600">Welcome back! 👋</h2>
            <div className="flex items-center gap-2">
              <NotificationBell tickets={tickets} />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="hidden text-xs text-gray-500 sm:inline">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
