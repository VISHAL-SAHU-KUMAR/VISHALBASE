import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Table, Column, ApiKey, DatabaseStats, AuthConfig, StorageConfig, RLSPolicy, EdgeFunction } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  projects: Project[];
  currentProject: Project | null;
  stats: DatabaseStats;
  createProject: (name: string, description: string, region: string) => Promise<Project>;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, data: Partial<Project>) => void;
  setCurrentProject: (project: Project | null) => void;
  createTable: (projectId: string, tableName: string, columns: Column[]) => void;
  deleteTable: (projectId: string, tableId: string) => void;
  addRow: (projectId: string, tableId: string, row: Record<string, any>) => void;
  updateRow: (projectId: string, tableId: string, rowIndex: number, row: Record<string, any>) => void;
  deleteRow: (projectId: string, tableId: string, rowIndex: number) => void;
  generateApiKey: (projectId: string, name: string, type: 'anon' | 'service_role') => ApiKey;
  revokeApiKey: (projectId: string, keyId: string) => void;
  updateAuthConfig: (projectId: string, config: Partial<AuthConfig>) => void;
  updateStorageConfig: (projectId: string, config: Partial<StorageConfig>) => void;
  createRLSPolicy: (projectId: string, tableId: string, policy: Omit<RLSPolicy, 'id' | 'createdAt'>) => void;
  toggleRLS: (projectId: string, tableId: string, enabled: boolean) => void;
  createEdgeFunction: (projectId: string, func: Omit<EdgeFunction, 'id' | 'createdAt'>) => void;
  getProjectById: (projectId: string) => Project | undefined;
  getTableById: (projectId: string, tableId: string) => Table | undefined;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1'];

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<DatabaseStats>({
    totalTables: 0,
    totalRows: 0,
    storageUsed: '0 MB',
    apiCalls: 0,
    activeConnections: 0,
    realtimeConnections: 0,
    edgeFunctionInvocations: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  useEffect(() => {
    updateStats();
  }, [projects]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedProjects = localStorage.getItem(`databox_projects_${user?.id}`);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    if (user) {
      localStorage.setItem(`databox_projects_${user.id}`, JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    }
  };

  const generateProjectId = () => `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateApiKeyString = (type: string) => `${type}_${Math.random().toString(36).substr(2, 32)}_${Date.now().toString(36)}`;
  const generateJWTSecret = () => `jwt_${Math.random().toString(36).substr(2, 64)}`;

  const createProject = async (name: string, description: string, region: string): Promise<Project> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const projectId = generateProjectId();
      
      const anonKey: ApiKey = {
        id: `key_${Date.now()}_1`,
        name: 'Anonymous Key',
        key: generateApiKeyString('anon'),
        type: 'anon',
        permissions: ['read'],
        createdAt: new Date().toISOString(),
        isActive: true
      };

      const serviceKey: ApiKey = {
        id: `key_${Date.now()}_2`,
        name: 'Service Role Key',
        key: generateApiKeyString('service_role'),
        type: 'service_role',
        permissions: ['read', 'write', 'delete', 'admin'],
        createdAt: new Date().toISOString(),
        isActive: true
      };

      const authConfig: AuthConfig = {
        enableEmailAuth: true,
        enableMagicLink: false,
        enableOAuth: false,
        oauthProviders: [],
        jwtSecret: generateJWTSecret(),
        sessionTimeout: 3600
      };

      const storageConfig: StorageConfig = {
        buckets: [
          {
            id: 'default',
            name: 'default',
            public: true,
            fileSizeLimit: '50MB',
            allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
            createdAt: new Date().toISOString()
          }
        ],
        maxFileSize: '50MB',
        allowedMimeTypes: ['*']
      };
      
      const newProject: Project = {
        id: projectId,
        name,
        description,
        userId: user.id,
        region,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tables: [],
        apiKeys: [anonKey, serviceKey],
        authConfig,
        storageConfig,
        rlsPolicies: [],
        databaseUrl: `mysql://root:[password]@db-${projectId}.databox.co:3306/${projectId}`,
        restUrl: `https://${projectId}.databox.co/rest/v1/`,
        realtimeUrl: `wss://${projectId}.databox.co/realtime/v1/websocket`,
        storageUrl: `https://${projectId}.databox.co/storage/v1/`,
        edgeFunctionsUrl: `https://${projectId}.databox.co/functions/v1/`
      };
      
      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      
      return newProject;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  const updateProject = (projectId: string, data: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { ...project, ...data, updatedAt: new Date().toISOString() }
        : project
    );
    saveProjects(updatedProjects);
    
    if (currentProject?.id === projectId) {
      setCurrentProject({ ...currentProject, ...data });
    }
  };

  const createTable = (projectId: string, tableName: string, columns: Column[]) => {
    const newTable: Table = {
      id: `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: tableName,
      projectId,
      columns,
      rows: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowCount: 0,
      isRealtime: false,
      rlsEnabled: false,
      policies: []
    };
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return { 
          ...project, 
          tables: [...project.tables, newTable],
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });
    
    saveProjects(updatedProjects);
  };

  const deleteTable = (projectId: string, tableId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return { 
          ...project, 
          tables: project.tables.filter(t => t.id !== tableId),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });
    
    saveProjects(updatedProjects);
  };

  const addRow = (projectId: string, tableId: string, row: Record<string, any>) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tables: project.tables.map(table => {
            if (table.id === tableId) {
              const newRows = [...table.rows, row];
              return { 
                ...table, 
                rows: newRows,
                rowCount: newRows.length,
                updatedAt: new Date().toISOString()
              };
            }
            return table;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });
    
    saveProjects(updatedProjects);
  };

  const updateRow = (projectId: string, tableId: string, rowIndex: number, row: Record<string, any>) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tables: project.tables.map(table => {
            if (table.id === tableId) {
              const updatedRows = [...table.rows];
              updatedRows[rowIndex] = row;
              return { 
                ...table, 
                rows: updatedRows,
                updatedAt: new Date().toISOString()
              };
            }
            return table;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });
    
    saveProjects(updatedProjects);
  };

  const deleteRow = (projectId: string, tableId: string, rowIndex: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tables: project.tables.map(table => {
            if (table.id === tableId) {
              const updatedRows = table.rows.filter((_, index) => index !== rowIndex);
              return { 
                ...table, 
                rows: updatedRows,
                rowCount: updatedRows.length,
                updatedAt: new Date().toISOString()
              };
            }
            return table;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });
    
    saveProjects(updatedProjects);
  };

  const generateApiKey = (projectId: string, name: string, type: 'anon' | 'service_role'): ApiKey => {
    const newKey: ApiKey = {
      id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      key: generateApiKeyString(type),
      type,
      permissions: type === 'anon' ? ['read'] : ['read', 'write', 'delete', 'admin'],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          apiKeys: [...project.apiKeys, newKey],
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
    return newKey;
  };

  const revokeApiKey = (projectId: string, keyId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          apiKeys: project.apiKeys.map(key => 
            key.id === keyId ? { ...key, isActive: false } : key
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
  };

  const updateAuthConfig = (projectId: string, config: Partial<AuthConfig>) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          authConfig: { ...project.authConfig, ...config },
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
  };

  const updateStorageConfig = (projectId: string, config: Partial<StorageConfig>) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          storageConfig: { ...project.storageConfig, ...config },
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
  };

  const createRLSPolicy = (projectId: string, tableId: string, policy: Omit<RLSPolicy, 'id' | 'createdAt'>) => {
    const newPolicy: RLSPolicy = {
      ...policy,
      id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tables: project.tables.map(table => {
            if (table.id === tableId) {
              return {
                ...table,
                policies: [...table.policies, newPolicy],
                updatedAt: new Date().toISOString()
              };
            }
            return table;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
  };

  const toggleRLS = (projectId: string, tableId: string, enabled: boolean) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tables: project.tables.map(table => {
            if (table.id === tableId) {
              return {
                ...table,
                rlsEnabled: enabled,
                updatedAt: new Date().toISOString()
              };
            }
            return table;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
  };

  const createEdgeFunction = (projectId: string, func: Omit<EdgeFunction, 'id' | 'createdAt'>) => {
    // This would be implemented when adding edge functions support
    console.log('Creating edge function:', func);
  };

  const updateStats = () => {
    const totalTables = projects.reduce((sum, project) => sum + project.tables.length, 0);
    const totalRows = projects.reduce((sum, project) => 
      sum + project.tables.reduce((tableSum, table) => tableSum + table.rows.length, 0), 0
    );
    
    setStats({
      totalTables,
      totalRows,
      storageUsed: `${Math.round(totalRows * 0.1)} MB`,
      apiCalls: Math.floor(Math.random() * 10000),
      activeConnections: Math.floor(Math.random() * 50),
      realtimeConnections: Math.floor(Math.random() * 25),
      edgeFunctionInvocations: Math.floor(Math.random() * 1000)
    });
  };

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const getTableById = (projectId: string, tableId: string) => {
    const project = getProjectById(projectId);
    return project?.tables.find(t => t.id === tableId);
  };

  return (
    <DataContext.Provider value={{
      projects,
      currentProject,
      stats,
      createProject,
      deleteProject,
      updateProject,
      setCurrentProject,
      createTable,
      deleteTable,
      addRow,
      updateRow,
      deleteRow,
      generateApiKey,
      revokeApiKey,
      updateAuthConfig,
      updateStorageConfig,
      createRLSPolicy,
      toggleRLS,
      createEdgeFunction,
      getProjectById,
      getTableById,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};