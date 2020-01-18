/** Accounts stored by the bot. */
interface BotAccount {
  /** The ID handled my me. */
  id: string;
  /** User ID. */
  user: string;
  /** Server ID. */
  guild: string;
  /** The amount of cash this account as for a server. */
  cash: number;
   /** Is the account private to block viewing and stealing. */
  private: boolean;
  /** How many dalies in a row the user has collected. */
  dailyStreak: number;
  /** Timestamp of when the last daily was collected. */
  lastDaily: number;
}
export type Account = BotAccount | null;

/** Daily cash options. */
interface GuildDailyOptions {
  /** How much base cash should be given when someone claims their daily. */
  dailyAmount: number;
  /** Should there be a streak? */
  doDailyStreak: boolean;
  /** How much the daily cash should be incremented for each consecutive day. */
  dailyStreakIncrement: number;
}

/** Guild customization options. */
interface BotGuildSettings {
  /** The guild ID. */
  id: string;
  /** The currency name. */
  currency: string;
  /** The embed color. */
  embedColor: number;
  /** Daily cash options. */
  dailyOptions: GuildDailyOptions;
  /** THe ID of the role that can run maintainer commands. */
  maintainerRole: string;
}
export type GuildSettings = BotGuildSettings | null;

export enum EmbedImage {
  PingPong = 'https://images.emojiterra.com/twitter/v12/512px/1f3d3.png',
  Check = 'https://images.emojiterra.com/twitter/v12/512px/2705.png',
  X = 'https://images.emojiterra.com/twitter/v12/512px/274c.png',
  MoneyBag = 'https://images.emojiterra.com/twitter/v12/512px/1f4b0.png',
  Unlock = 'https://images.emojiterra.com/twitter/v12/512px/1f513.png',
  Lock = 'https://images.emojiterra.com/twitter/v12/512px/1f512.png'
}
