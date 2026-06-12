import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar — left side */}
      <Sidebar />

      {/* Main Content — right side */}
      <div className="ml-64 flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-600 text-sm">Welcome back! 👋</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">System Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
