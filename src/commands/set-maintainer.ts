import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { runDb, db } from '../database';

import { EmbedImage, GuildSettings } from '../types';

import { DEFAULT_EMEBED_COLOR } from '../defaults';
import { ensureGuildSettings } from '../utils/ensure';

class SetupCommand extends Command {
  constructor() {
    super('setMaintainer', {
      aliases: ['setMaintainer'],
      args: [
        {
          id: 'maintainerRole',
          type: 'string'
        }
      ]
    });
  }

  userPermissions = (message: Message) => {
    // Make sure we have the "Cash Bot Setup" role.
    return message.member.roles.some((role) => {
      return role.name === 'Cash Bot Setup';
    });
  }

  async exec(message: Message, args: any) {
    // Get the guild settings.
    const guildSettings: GuildSettings = await runDb(db().table('guildSettings').get(message.guild.id));

    let maintainerRole: string = args.maintainerRole;

    maintainerRole = maintainerRole.replace('<@&', '');
    maintainerRole = maintainerRole.replace('>', '');

    if(!message.guild.roles.some((role) => {
      return role.id === maintainerRole;
    })) {
      return message.channel.send({embed: {
        title: 'Cash Bot Maintainer Setup',
        description: 'The provided role does not exist.',
        thumbnail: {
          url: EmbedImage.X
        },
        color: guildSettings?.embedColor || DEFAULT_EMEBED_COLOR
      }});
    }

    ensureGuildSettings(message.guild.id, maintainerRole);

    // Send message.
    return message.channel.send({embed: {
      title: 'Cash Bot Maintainer Setup',
      description: `Success! ${message.guild.roles.get(maintainerRole)?.name} has been set as the maintainer role.`,
      thumbnail: {
        url: EmbedImage.Check
      },
      color: guildSettings?.embedColor || DEFAULT_EMEBED_COLOR
    }});
  }
}

export default SetupCommand;
