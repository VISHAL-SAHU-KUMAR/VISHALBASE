import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Plus, 
  Database, 
  Trash2, 
  Settings, 
  Globe, 
  Activity,
  Users,
  BarChart3,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  HardDrive,
  Code,
  Key,
  FileText
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface DashboardProps {
  onProjectSelect?: (projectId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProjectSelect }) => {
  const { user } = useAuth();
  const { projects, createProject, deleteProject, stats, isLoading } = useData();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');
  const [isCreating, setIsCreating] = useState(false);

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)', flag: '🇺🇸' },
    { id: 'us-west-2', name: 'US West (Oregon)', flag: '🇺🇸' },
    { id: 'eu-west-1', name: 'Europe (Ireland)', flag: '🇪🇺' },
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', flag: '🇮🇳' },
  ];

  const handleCreateProject = async () => {
    if (projectName.trim()) {
      setIsCreating(true);
      try {
        await createProject(projectName, projectDescription, selectedRegion);
        setProjectName('');
        setProjectDescription('');
        setShowCreateProject(false);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const statsCards = [
    { 
      title: 'Total Projects', 
      value: projects.length, 
      icon: Database, 
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      description: 'Active database projects'
    },
    { 
      title: 'Database Tables', 
      value: stats.totalTables, 
      icon: BarChart3, 
      color: 'from-green-500 to-green-600',
      change: '+8%',
      description: 'Across all projects'
    },
    { 
      title: 'Total Records', 
      value: stats.totalRows, 
      icon: TrendingUp, 
      color: 'from-purple-500 to-purple-600',
      change: '+23%',
      description: 'Data rows stored'
    },
    { 
      title: 'API Requests', 
      value: stats.apiCalls, 
      icon: Zap, 
      color: 'from-orange-500 to-orange-600',
      change: '+15%',
      description: 'This month'
    },
    { 
      title: 'Storage Used', 
      value: stats.storageUsed, 
      icon: HardDrive, 
      color: 'from-pink-500 to-pink-600',
      change: '+5%',
      description: 'Files and data'
    },
    { 
      title: 'Active Connections', 
      value: stats.activeConnections, 
      icon: Activity, 
      color: 'from-indigo-500 to-indigo-600',
      change: '+18%',
      description: 'Real-time connections'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Welcome back, {user?.name}! 👋</h1>
              <p className="text-blue-100 text-xl mb-4">
                Manage your databases and build amazing applications
              </p>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  <span>{projects.length} Projects</span>
                </div>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  <span>{stats.activeConnections} Active</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  <span>{stats.realtimeConnections} Realtime</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-6 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Database className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-purple-400/20 rounded-full animate-bounce"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Projects</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your database projects and applications
              </p>
            </div>
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <Database className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mt-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No projects yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Create your first project to start building amazing applications with DataBox's powerful backend services
              </p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg"
              >
                <Plus className="h-6 w-6 mr-3" />
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Database className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 min-h-[3rem]">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>{project.region}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{project.tables.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tables</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {project.tables.reduce((sum, table) => sum + table.rows.length, 0)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Rows</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {project.apiKeys.filter(k => k.isActive).length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">API Keys</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onProjectSelect?.(project.id)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    Open Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Project</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up a new database project with API access and authentication
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
                  placeholder="My Awesome Project"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.flag} {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 p-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreateProject(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !projectName.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                {isCreating ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="text-white" />
                    <span className="ml-3">Creating...</span>
                  </div>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;