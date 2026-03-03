import { AssessmentSession, SessionStore } from '../types';

/**
 * Azure Cosmos DB storage implementation.
 * Stubbed for now — will be wired up when Azure credentials are configured.
 *
 * To enable:
 * 1. npm install @azure/cosmos
 * 2. Set environment variables: AZURE_COSMOS_ENDPOINT, AZURE_COSMOS_KEY,
 *    AZURE_COSMOS_DATABASE, AZURE_COSMOS_CONTAINER
 * 3. Set STORAGE_PROVIDER=azure in .env.local
 */
export class AzureStore implements SessionStore {
  constructor() {
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;

    if (!endpoint || !key) {
      throw new Error(
        'Azure Cosmos DB is not configured. Set AZURE_COSMOS_ENDPOINT and AZURE_COSMOS_KEY environment variables.'
      );
    }

    // TODO: Initialize CosmosClient when @azure/cosmos is installed
    // const client = new CosmosClient({ endpoint, key });
    // this.container = client.database(process.env.AZURE_COSMOS_DATABASE!).container(process.env.AZURE_COSMOS_CONTAINER!);
  }

  async create(session: AssessmentSession): Promise<void> {
    // TODO: await this.container.items.create({ ...session, id: session.id });
    throw new Error('Azure store not yet implemented. Install @azure/cosmos and configure credentials.');
  }

  async read(id: string): Promise<AssessmentSession | null> {
    // TODO: const { resource } = await this.container.item(id, id).read();
    // return resource ?? null;
    throw new Error('Azure store not yet implemented. Install @azure/cosmos and configure credentials.');
  }

  async readAll(): Promise<AssessmentSession[]> {
    // TODO: const { resources } = await this.container.items.readAll().fetchAll();
    // return resources as AssessmentSession[];
    throw new Error('Azure store not yet implemented. Install @azure/cosmos and configure credentials.');
  }

  async update(id: string, updates: Partial<AssessmentSession>): Promise<void> {
    // TODO: const existing = await this.read(id);
    // if (!existing) throw new Error(`Session not found: ${id}`);
    // await this.container.item(id, id).replace({ ...existing, ...updates, updatedAt: new Date().toISOString() });
    throw new Error('Azure store not yet implemented. Install @azure/cosmos and configure credentials.');
  }
}
