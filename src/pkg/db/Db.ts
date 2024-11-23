// db.ts
import type { Icon } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_icon_pb';
import Dexie, { type Table } from 'dexie';

export class DevkitDB extends Dexie {
  private static instance: DevkitDB | null = null;
  icons!: Table<Icon>
  queryCache!: Table<{ id: string; data: any }, string>
  constructor() {
    super('devkit_db');
    this.version(1).stores({
      icons: '&iconName , iconContent',
    });
  }
  public static getInstance(): DevkitDB {
    if (!DevkitDB.instance) {
      DevkitDB.instance = new DevkitDB();
    }
    return DevkitDB.instance;
  }
}
export const db = DevkitDB.getInstance();

