// db.ts
import type { Icon } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_icon_pb';
import Dexie, { type Table } from 'dexie';
import type { SUPPORTE_LOCALES_TYPE } from '../plugins/i18n.config';

export class DevkitDB extends Dexie {
  private static instance: DevkitDB | null = null;
  icon!: Table<Icon>
  translation!: Table<{ localeKey: SUPPORTE_LOCALES_TYPE, translations: Record<string, any> }>
  constructor() {
    super('devkit_db');
    this.version(1).stores({
      icon: '&iconName , iconContent',
      translation: '&localeKey , messages',
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

