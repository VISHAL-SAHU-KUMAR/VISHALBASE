import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Key, 
  Plus, 
  Trash2, 
  RefreshCw,
  Database,
  Globe,
  Code,
  Shield,
  Zap,
  HardDrive,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Project, ApiKey } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ProjectSettingsProps {
  project: Project;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project }) => {
  const { generateApiKey, revokeApiKey, updateAuthConfig, updateStorageConfig } = useData();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'anon' | 'service_role'>('anon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyId?: string) => {
    navigator.clipboard.writeText(text);
    if (keyId) {
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      generateApiKey(project.id, newKeyName, newKeyType);
      setNewKeyName('');
      setShowNewKeyModal(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const connectionDetails = [
    {
      title: 'Database URL',
      value: project.databaseUrl,
      icon: Database,
      description: 'Direct MySQL connection string for your application',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'REST API URL',
      value: project.restUrl,
      icon: Globe,
      description: 'RESTful API endpoint for CRUD operations',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Realtime URL',
      value: project.realtimeUrl,
      icon: Zap,
      description: 'WebSocket endpoint for real-time subscriptions',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Storage URL',
      value: project.storageUrl,
      icon: HardDrive,
      description: 'File storage endpoint for uploads and downloads',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Edge Functions URL',
      value: project.edgeFunctionsUrl,
      icon: Code,
      description: 'Serverless functions endpoint for custom logic',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Project Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Information</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your project settings and configuration</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <p className="text-gray-600 dark:text-gray-400">{project.description || 'No description provided'}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Region
              </label>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">{project.region}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                {project.status.toUpperCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Created
              </label>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-4">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connection Details</h2>
            <p className="text-gray-600 dark:text-gray-400">Use these URLs to connect your applications</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {connectionDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${detail.color} mr-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{detail.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{detail.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border overflow-x-auto">
                    {detail.value}
                  </div>
                  <button
                    onClick={() => copyToClipboard(detail.value)}
                    className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-4">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your project's API keys for authentication</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Key
          </button>
        </div>

        <div className="space-y-6">
          {project.apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    apiKey.type === 'anon' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    {apiKey.type === 'anon' ? (
                      <Key className="h-5 w-5 text-white" />
                    ) : (
                      <Shield className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{apiKey.name}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        apiKey.type === 'anon'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {apiKey.type === 'anon' ? 'Anonymous Key' : 'Service Role Key'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        apiKey.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {apiKey.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Revoked
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    className={`p-3 rounded-xl transition-colors ${
                      copiedKey === apiKey.id
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {copiedKey === apiKey.id ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                  {apiKey.isActive && (
                    <button
                      onClick={() => revokeApiKey(project.id, apiKey.id)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border overflow-x-auto mb-4">
                {showKeys[apiKey.id] ? apiKey.key : '•'.repeat(Math.min(apiKey.key.length, 50))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                {apiKey.lastUsed && (
                  <span>Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
            <Code className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Usage Examples</h3>
            <p className="text-blue-700 dark:text-blue-300">Get started with these code examples</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">JavaScript/TypeScript</h4>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`// Fetch data from your table
const response = await fetch('${project.restUrl}users', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const users = await response.json();`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">cURL</h4>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`# GET request
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     "${project.restUrl}users"

# POST request
curl -X POST \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"name":"John","email":"john@example.com"}' \\
     "${project.restUrl}users"`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Generate New API Key</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create a new API key for your project
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                  placeholder="My API Key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Key Type
                </label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as 'anon' | 'service_role')}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="anon">Anonymous Key (Read-only access)</option>
                  <option value="service_role">Service Role Key (Full access)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 p-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNewKeyModal(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateKey}
                disabled={isGenerating || !newKeyName.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="text-white" />
                    <span className="ml-3">Generating...</span>
                  </div>
                ) : (
                  'Generate Key'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;