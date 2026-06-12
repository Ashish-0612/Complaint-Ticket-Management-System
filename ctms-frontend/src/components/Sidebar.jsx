import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  LogOut,
} from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Role ke hisaab se menu items
  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Ticket, label: 'All Tickets', path: '/admin' },
        { icon: Users, label: 'Agents', path: '/admin' },
      ]
    }
    if (user?.role === 'agent') {
      return [
        { icon: LayoutDashboard, label: 'My Panel', path: '/agent' },
        { icon: Ticket, label: 'Assigned Tickets', path: '/agent' },
      ]
    }
    return [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: PlusCircle, label: 'New Ticket', path: '/create-ticket' },
      { icon: Ticket, label: 'My Tickets', path: '/dashboard' },
    ]
  }

  const menuItems = getMenuItems()

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">CTMS</h1>
        <p className="text-gray-400 text-xs mt-1">Ticket Management</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              user?.role === 'admin' ? 'bg-red-500' :
              user?.role === 'agent' ? 'bg-green-500' :
              'bg-blue-500'
            } text-white`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </div>
  )
}

export default Sidebar