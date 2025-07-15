import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Plus, Table, Trash2, Edit, Eye, Database, Zap, Shield } from 'lucide-react';
import { Column } from '../types';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
  onTableSelect?: (tableId: string) => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ projectId, onBack, onTableSelect }) => {
  const { getProjectById, createTable, deleteTable, toggleRLS } = useData();
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    { 
      id: '1', 
      name: 'id', 
      type: 'int', 
      required: true, 
      primaryKey: true, 
      unique: true,
      autoIncrement: true,
      length: 11
    }
  ]);

  const project = getProjectById(projectId);

  const addColumn = () => {
    setColumns([...columns, {
      id: Date.now().toString(),
      name: '',
      type: 'varchar',
      length: 255,
      required: false,
      primaryKey: false,
      unique: false,
      autoIncrement: false
    }]);
  };

  const updateColumn = (id: string, field: string, value: any) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  const handleCreateTable = () => {
    if (tableName.trim() && columns.length > 0) {
      const validColumns = columns.filter(col => col.name.trim());
      if (validColumns.length > 0) {
        createTable(projectId, tableName, validColumns);
        setTableName('');
        setColumns([{ 
          id: '1', 
          name: 'id', 
          type: 'int', 
          required: true, 
          primaryKey: true, 
          unique: true,
          autoIncrement: true,
          length: 11
        }]);
        setShowCreateTable(false);
      }
    }
  };

  const handleToggleRLS = (tableId: string, enabled: boolean) => {
    toggleRLS(projectId, tableId, enabled);
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Project not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl mr-4 transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateTable(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Table
        </button>
      </div>

      {/* Tables */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-4">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Database Tables</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your database schema and data</p>
          </div>
        </div>
        
        {project.tables.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl w-24 h-24 mx-auto mb-6">
              <Table className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mt-3" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No tables yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Create your first table to get started with your database.</p>
            <button
              onClick={() => setShowCreateTable(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Table
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.tables.map((table) => (
              <div key={table.id} className="group border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-3">
                      <Table className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {table.name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-2">
                        {table.rlsEnabled && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <Shield className="h-3 w-3 mr-1" />
                            RLS
                          </span>
                        )}
                        {table.isRealtime && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                            <Zap className="h-3 w-3 mr-1" />
                            Realtime
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTable(projectId, table.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{table.columns.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Columns</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{table.rows.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rows</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Created {new Date(table.createdAt).toLocaleDateString()}
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => onTableSelect?.(table.id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    Open Table
                  </button>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Row Level Security</span>
                    <button
                      onClick={() => handleToggleRLS(table.id, !table.rlsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        table.rlsEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          table.rlsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Table Modal */}
      {showCreateTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Table</h3>
              <p className="text-gray-600 dark:text-gray-400">Design your table schema with columns and constraints</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Table Name *
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
                  placeholder="users, posts, products..."
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Columns
                  </label>
                  <button
                    onClick={addColumn}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Add Column
                  </button>
                </div>
                
                <div className="space-y-4">
                  {columns.map((column) => (
                    <div key={column.id} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <input
                        type="text"
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                        placeholder="Column name"
                      />
                      <select
                        value={column.type}
                        onChange={(e) => updateColumn(column.id, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                      >
                        <option value="varchar">VARCHAR</option>
                        <option value="int">INT</option>
                        <option value="bigint">BIGINT</option>
                        <option value="boolean">BOOLEAN</option>
                        <option value="datetime">DATETIME</option>
                        <option value="text">TEXT</option>
                        <option value="json">JSON</option>
                        <option value="decimal">DECIMAL</option>
                      </select>
                      {(column.type === 'varchar' || column.type === 'int') && (
                        <input
                          type="number"
                          value={column.length || ''}
                          onChange={(e) => updateColumn(column.id, 'length', parseInt(e.target.value))}
                          className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                          placeholder="Length"
                        />
                      )}
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={column.required}
                          onChange={(e) => updateColumn(column.id, 'required', e.target.checked)}
                          className="mr-1"
                        />
                        Required
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={column.primaryKey}
                          onChange={(e) => updateColumn(column.id, 'primaryKey', e.target.checked)}
                          className="mr-1"
                        />
                        Primary
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={column.unique}
                          onChange={(e) => updateColumn(column.id, 'unique', e.target.checked)}
                          className="mr-1"
                        />
                        Unique
                      </label>
                      {column.type === 'int' && (
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={column.autoIncrement}
                            onChange={(e) => updateColumn(column.id, 'autoIncrement', e.target.checked)}
                            className="mr-1"
                          />
                          Auto Inc
                        </label>
                      )}
                      <button
                        onClick={() => removeColumn(column.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 p-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreateTable(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTable}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;