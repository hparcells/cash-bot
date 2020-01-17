import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { EmbedImage } from '../types';

import { DEFAULT_EMEBED_COLOR } from '../defaults';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping']
    });
  }

  async exec(message: Message) {
    // Send the first message.
    const sent = await message.channel.send({embed: {
      title: 'Ponging in Process',
      description: 'Ponging...',
      thumbnail: {
        url: EmbedImage.PingPong
      },
      color: DEFAULT_EMEBED_COLOR
    }}) as Message;

    // Get the difference between the two.
    const timeDiff = sent.createdAt.valueOf() - message.createdAt.valueOf();

    // Update message.
    return sent.edit({embed: {
      title: ':ping_pong: Pong!',
      description: `${timeDiff} ms`,
      thumbnail: {
        url: EmbedImage.PingPong
      },
      color: DEFAULT_EMEBED_COLOR
    }});
  }
}

export default PingCommand;
