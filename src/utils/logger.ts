import { log } from 'log-type';

/**
 * Logs a message with the bot prefix.
 * @param message The message to log.
 */
export function botLog(message: string) {
  log('[Bot]', 'green', message);
}
