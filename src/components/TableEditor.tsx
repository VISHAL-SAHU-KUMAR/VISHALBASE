import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Database, Filter, Search } from 'lucide-react';

interface TableEditorProps {
  projectId: string;
  tableId: string;
  onBack: () => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ projectId, tableId, onBack }) => {
  const { getTableById, addRow, updateRow, deleteRow } = useData();
  const [showAddRow, setShowAddRow] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  const [editRowData, setEditRowData] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const table = getTableById(projectId, tableId);

  const handleAddRow = () => {
    if (table) {
      const rowData: Record<string, any> = {};
      table.columns.forEach(column => {
        if (column.autoIncrement && column.primaryKey) {
          // Skip auto-increment primary keys
          return;
        }
        rowData[column.name] = newRowData[column.name] || (column.defaultValue ?? '');
      });
      addRow(projectId, tableId, rowData);
      setNewRowData({});
      setShowAddRow(false);
    }
  };

  const handleUpdateRow = (index: number) => {
    if (table) {
      const rowData: Record<string, any> = {};
      table.columns.forEach(column => {
        rowData[column.name] = editRowData[column.name] !== undefined 
          ? editRowData[column.name] 
          : table.rows[index][column.name];
      });
      updateRow(projectId, tableId, index, rowData);
      setEditingRow(null);
      setEditRowData({});
    }
  };

  const handleDeleteRow = (index: number) => {
    if (confirm('Are you sure you want to delete this row?')) {
      deleteRow(projectId, tableId, index);
    }
  };

  const startEditing = (index: number) => {
    setEditingRow(index);
    setEditRowData(table?.rows[index] || {});
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setEditRowData({});
  };

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  const getFilteredAndSortedRows = () => {
    if (!table) return [];
    
    let filteredRows = table.rows.filter((row, index) => {
      if (!searchTerm) return true;
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (sortColumn) {
      filteredRows.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredRows.map((row, filteredIndex) => ({
      ...row,
      originalIndex: table.rows.indexOf(row)
    }));
  };

  const renderCellInput = (columnName: string, columnType: string, value: any, onChange: (value: any) => void) => {
    switch (columnType) {
      case 'boolean':
        return (
          <select
            value={value ? 'true' : 'false'}
            onChange={(e) => onChange(e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'int':
      case 'bigint':
      case 'decimal':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          />
        );
      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          />
        );
      case 'text':
      case 'json':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          />
        );
    }
  };

  if (!table) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Table not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const filteredRows = getFilteredAndSortedRows();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl mr-4 transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-4">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{table.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{table.rows.length} rows • {table.columns.length} columns</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddRow(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Row
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in table..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20">
              <tr>
                {table.columns.map((column) => (
                  <th 
                    key={column.id} 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort(column.name)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.name}</span>
                      {column.primaryKey && <span className="text-blue-500">🔑</span>}
                      {column.required && <span className="text-red-500">*</span>}
                      {column.unique && <span className="text-purple-500">U</span>}
                      {sortColumn === column.name && (
                        <span className="text-blue-500">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 normal-case">
                      {column.type}{column.length ? `(${column.length})` : ''}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {table.columns.map((column) => (
                    <td key={column.id} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {editingRow === row.originalIndex ? (
                        renderCellInput(
                          column.name,
                          column.type,
                          editRowData[column.name],
                          (value) => setEditRowData({ ...editRowData, [column.name]: value })
                        )
                      ) : (
                        <div className="max-w-xs truncate">
                          {column.type === 'boolean' 
                            ? (row[column.name] ? 'True' : 'False')
                            : column.type === 'json'
                            ? JSON.stringify(row[column.name])
                            : row[column.name]?.toString() || ''}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm">
                    {editingRow === row.originalIndex ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateRow(row.originalIndex)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditing(row.originalIndex)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRow(row.originalIndex)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No rows match your search' : 'No data in this table'}
            </p>
          </div>
        )}
      </div>

      {/* Add Row Modal */}
      {showAddRow && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add New Row</h3>
              <p className="text-gray-600 dark:text-gray-400">Enter data for the new row</p>
            </div>
            
            <div className="p-8 space-y-6">
              {table.columns.map((column) => {
                if (column.autoIncrement && column.primaryKey) {
                  return null; // Skip auto-increment primary keys
                }
                
                return (
                  <div key={column.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {column.name}
                      {column.required && <span className="text-red-500 ml-1">*</span>}
                      {column.primaryKey && <span className="text-blue-500 ml-1">🔑</span>}
                      {column.unique && <span className="text-purple-500 ml-1">U</span>}
                    </label>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {column.type}{column.length ? `(${column.length})` : ''}
                    </div>
                    {renderCellInput(
                      column.name,
                      column.type,
                      newRowData[column.name],
                      (value) => setNewRowData({ ...newRowData, [column.name]: value })
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end space-x-4 p-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddRow(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRow}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                Add Row
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableEditor;