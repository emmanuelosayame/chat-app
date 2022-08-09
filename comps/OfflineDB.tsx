import Dexie, { Table } from "dexie";

export interface Stickers {
  id: string;
  tag: string;
  date: Date;
  stickerURL: string;
}

export class MySubClassedDexie extends Dexie {
  stickers!: Table<Stickers>;

  constructor() {
    super("chatDB");
    this.version(1).stores({
      stickers: "id,tag,date,stickerURL",
    });
  }
}

export const odb = new MySubClassedDexie();
