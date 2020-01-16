import r, { Operation } from 'rethinkdb';

import { dbLog } from './utils/logger';

const DB_NAME = 'count_bot';

export let connection: r.Connection;

/** Connects to the database and sets everything up. */
export async function connectToDatabase() {
  connection = await r.connect({ host: 'localhost', port: 28015 });

  // Check if the database exists. If not, create it.
  if(!(await r.dbList().run(connection)).includes(DB_NAME)) {
    await r.dbCreate(DB_NAME).run(connection);
    dbLog(`Created database "${DB_NAME}".`);
  }

  /**
   * Creates a table in the database/
   * @param name The name of the table.
   * @param options Additional options.
   * @param secondaryIndexes Secondary indexes.
   */
  async function createTable(name: string, options: r.TableOptions, secondaryIndexes: string[]) {
    const existingTables = await r.db(DB_NAME).tableList().run(connection);

    if(!existingTables.includes(name)) {
      const tableQuery = r.db(DB_NAME).tableCreate(name, ...[options].filter((x) => x));
      await tableQuery.run(connection);
      dbLog(`Created table "${name}".`);

      if(secondaryIndexes) {
        await Promise.all(
          secondaryIndexes.map((index: string) => {
            return r.db(DB_NAME).table(name).indexCreate(index).run(connection);
          })
        );
      }
    }
  }

  await createTable('numbers', {}, []);

  dbLog('Database setup.');
}
/** Selects the database. */
export function db() {
  return r.db(DB_NAME);
}
/**
 * Runs an operation on the database with error handling.
 * @param operation The database operation to run.
 */
export async function runDb<T>(operation: Operation<T>): Promise<T> {
  if (!connection) {
    throw new Error('Connection not established. Please Wait.');
  }
  return operation.run(connection);
}
