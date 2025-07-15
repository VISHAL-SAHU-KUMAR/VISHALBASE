import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Database, 
  Settings, 
  LogOut, 
  Key, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Home,
  BarChart3,
  Code,
  Shield,
  Zap,
  Bell,
  HardDrive,
  Users,
  FileText,
  Activity
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView = 'dashboard', onViewChange }) => {
  const { user, logout } = useAuth();
  const { currentProject, stats } = useData();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'tables', label: 'Table Editor', icon: Database, badge: currentProject?.tables.length || 0 },
    { id: 'auth', label: 'Authentication', icon: Shield, badge: null },
    { id: 'storage', label: 'Storage', icon: HardDrive, badge: null },
    { id: 'edge-functions', label: 'Edge Functions', icon: Code, badge: null },
    { id: 'realtime', label: 'Realtime', icon: Zap, badge: null },
    { id: 'api', label: 'API Keys', icon: Key, badge: currentProject?.apiKeys.filter(k => k.isActive).length || 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'logs', label: 'Logs', icon: FileText, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-bold text-white">DataBox</span>
                {currentProject && (
                  <p className="text-xs text-blue-100 truncate max-w-32">{currentProject.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/20 lg:hidden transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Project Status */}
          {currentProject && (
            <div className="p-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Project Status</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
                      {currentProject.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Region</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentProject.region}</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{currentProject.tables.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tables</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {currentProject.tables.reduce((sum, table) => sum + table.rows.length, 0)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rows</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {currentProject.apiKeys.filter(k => k.isActive).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Keys</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                    {item.label}
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Global Stats Summary */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Activity className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.activeConnections}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="h-4 w-4 text-purple-500 mr-1" />
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.realtimeConnections}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Realtime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/95 dark:bg-gray-800/95 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="ml-2 lg:ml-0">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentProject ? currentProject.name : 'DataBox Dashboard'}
                  </h1>
                  {currentProject && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentProject.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
                      />
                    )}
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;