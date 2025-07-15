export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  region: string;
  status: 'active' | 'paused' | 'inactive';
  createdAt: string;
  updatedAt: string;
  tables: Table[];
  apiKeys: ApiKey[];
  databaseUrl: string;
  restUrl: string;
  realtimeUrl: string;
  storageUrl: string;
  edgeFunctionsUrl: string;
  authConfig: AuthConfig;
  storageConfig: StorageConfig;
  rlsPolicies: RLSPolicy[];
}

export interface AuthConfig {
  enableEmailAuth: boolean;
  enableMagicLink: boolean;
  enableOAuth: boolean;
  oauthProviders: ('google' | 'github' | 'discord')[];
  jwtSecret: string;
  sessionTimeout: number;
}

export interface StorageConfig {
  buckets: StorageBucket[];
  maxFileSize: string;
  allowedMimeTypes: string[];
}

export interface StorageBucket {
  id: string;
  name: string;
  public: boolean;
  fileSizeLimit: string;
  allowedMimeTypes: string[];
  createdAt: string;
}

export interface RLSPolicy {
  id: string;
  tableName: string;
  name: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  roles: string[];
  using: string;
  withCheck?: string;
  enabled: boolean;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'anon' | 'service_role';
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface Table {
  id: string;
  name: string;
  projectId: string;
  columns: Column[];
  rows: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
  rowCount: number;
  isRealtime: boolean;
  rlsEnabled: boolean;
  policies: RLSPolicy[];
}

export interface Column {
  id: string;
  name: string;
  type: 'varchar' | 'int' | 'bigint' | 'boolean' | 'datetime' | 'text' | 'json' | 'uuid' | 'decimal';
  length?: number;
  required: boolean;
  primaryKey: boolean;
  unique: boolean;
  autoIncrement: boolean;
  defaultValue?: any;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface EdgeFunction {
  id: string;
  name: string;
  code: string;
  runtime: 'nodejs' | 'deno';
  triggers: ('http' | 'database' | 'auth' | 'storage')[];
  isActive: boolean;
  createdAt: string;
  lastDeployed?: string;
}

export interface ApiRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: Record<string, string>;
  body?: any;
  response?: any;
  status?: number;
  timestamp: string;
  duration: number;
  projectId: string;
}

export interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  storageUsed: string;
  apiCalls: number;
  activeConnections: number;
  realtimeConnections: number;
  edgeFunctionInvocations: number;
}

export interface RealtimeSubscription {
  id: string;
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  source: 'api' | 'auth' | 'realtime' | 'storage' | 'edge-functions';
  metadata?: Record<string, any>;
}