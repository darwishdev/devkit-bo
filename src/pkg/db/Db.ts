// db.ts
import type { Icon } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_icon_pb';
import Dexie, { type Table } from 'dexie';

export class DevkitDB extends Dexie {
  icons!: Table<Icon>
  queryCache!: Table<{ id: string; data: any }, string>
  constructor() {
    super('devkit_db');
    this.version(1).stores({
      icons: '&iconName , iconContent',
      queryCache: '&id,data'
    });
  }
}
export const db = new DevkitDB();

class DexieWrapper {
  async getCache(key: string) {
    const cache = await db.queryCache.get(key);
    return cache ? cache.data : undefined;
  }

  async setCache(key: string, value: any) {
    await db.queryCache.put({ id: key, data: value });
  }

  async removeCache(key: string) {
    await db.queryCache.delete(key);
  }
}

export const dexieWrapper = new DexieWrapper();

