import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ProjectView from './ProjectView';
import TableEditor from './TableEditor';
import ProjectSettings from './ProjectSettings';
import LoadingSpinner from './LoadingSpinner';

const MainApp: React.FC = () => {
  const { projects, currentProject, setCurrentProject } = useData();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      setSelectedProjectId(projectId);
      setCurrentView('settings');
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setCurrentProject(null);
      setSelectedProjectId(null);
      setSelectedTableId(null);
    }
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setCurrentView('table-editor');
  };

  const handleBackToProject = () => {
    setSelectedTableId(null);
    setCurrentView('tables');
  };

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return <Dashboard onProjectSelect={handleProjectSelect} />;
    }

    if (!currentProject) {
      return <Dashboard onProjectSelect={handleProjectSelect} />;
    }

    switch (currentView) {
      case 'tables':
        return (
          <ProjectView 
            projectId={currentProject.id} 
            onBack={() => setCurrentView('dashboard')}
            onTableSelect={handleTableSelect}
          />
        );
      case 'table-editor':
        if (selectedTableId) {
          return (
            <TableEditor
              projectId={currentProject.id}
              tableId={selectedTableId}
              onBack={handleBackToProject}
            />
          );
        }
        return (
          <ProjectView 
            projectId={currentProject.id} 
            onBack={() => setCurrentView('dashboard')}
            onTableSelect={handleTableSelect}
          />
        );
      case 'settings':
      case 'api':
        return <ProjectSettings project={currentProject} />;
      case 'auth':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <span className="text-4xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Authentication Settings
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Configure user authentication, OAuth providers, and security settings
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  🚧 Coming soon - Full authentication management with OAuth providers, magic links, and user management
                </p>
              </div>
            </div>
          </div>
        );
      case 'storage':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <span className="text-4xl">💾</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                File Storage
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Manage file uploads, buckets, and CDN settings
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  🚧 Coming soon - File storage with buckets, access policies, and CDN integration
                </p>
              </div>
            </div>
          </div>
        );
      case 'edge-functions':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Edge Functions
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Deploy serverless functions for custom business logic
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  🚧 Coming soon - Serverless functions with TypeScript/JavaScript support
                </p>
              </div>
            </div>
          </div>
        );
      case 'realtime':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Realtime
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Configure real-time subscriptions and WebSocket connections
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  🚧 Coming soon - Real-time data synchronization with WebSocket support
                </p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Analytics
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Monitor API usage, performance metrics, and user analytics
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🚧 Coming soon - Comprehensive analytics dashboard with charts and insights
                </p>
              </div>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Logs
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                View application logs, errors, and system events
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  🚧 Coming soon - Real-time logs with filtering and search capabilities
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This feature is under development
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {renderContent()}
    </Layout>
  );
};

export default MainApp;