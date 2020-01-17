/** Accounts stored by the bot. */
interface BotAccount {
  /** The Discord user ID. */
  id: string;
  /** How much cash the user has. */
  cash: { [type: string]: number };
  /** How many dalies in a row the user has collected. */
  dailyStreak: number;
  /** Timestamp of when the last daily was collected. */
  lastDaily: number;
  /** Is the account private to block viewing and stealing. */
  private: boolean;
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
export interface GuildSettings {
  /** The currency name. */
  currency: string;
  /** The embed color. */
  embedColor: number;
  /** Daily cash options. */
  dailyOptions: GuildDailyOptions;
}

export enum EmbedImage {
  PingPong = 'https://images.emojiterra.com/twitter/v12/512px/1f3d3.png',
  Check = 'https://images.emojiterra.com/twitter/v12/512px/2705.png',
  X = 'https://images.emojiterra.com/twitter/v12/512px/274c.png',
  MoneyBag = 'https://images.emojiterra.com/twitter/v12/512px/1f4b0.png'
}
