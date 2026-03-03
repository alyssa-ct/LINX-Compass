import { SessionStore, UserStore, AssignmentStore } from '../types';
import { LocalStore } from './local-store';
import { LocalUserStore } from './local-user-store';
import { LocalAssignmentStore } from './local-assignment-store';

/**
 * Factory function that returns the appropriate storage implementation
 * based on the STORAGE_PROVIDER environment variable.
 *
 * - "local" (default): JSON file storage for development
 * - "azure": Azure Cosmos DB for production
 */
export function getStore(): SessionStore {
  const provider = process.env.STORAGE_PROVIDER || 'local';

  if (provider === 'azure') {
    // Dynamically import to avoid requiring Azure SDK in dev
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AzureStore } = require('./azure-store');
    return new AzureStore();
  }

  return new LocalStore();
}

export function getUserStore(): UserStore {
  return new LocalUserStore();
}

export function getAssignmentStore(): AssignmentStore {
  return new LocalAssignmentStore();
}
