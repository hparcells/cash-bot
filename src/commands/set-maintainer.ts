import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { getGuild, database } from '../database';

import { EmbedImage, Guild } from '../types';

import { DEFAULT_EMBED_COLOR } from '../defaults';
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
    const guildSettings: Guild = await getGuild(message.guild.id);

    let maintainerRole: string = args.maintainerRole;

    maintainerRole = maintainerRole.replace('<@&', '');
    maintainerRole = maintainerRole.replace('>', '');

    if(!message.guild.roles.some((role) => {
      return role.id === maintainerRole;
    })) {
      return await message.channel.send({embed: {
        title: 'Cash Bot Maintainer Setup',
        description: 'The provided role does not exist.',
        thumbnail: {
          url: EmbedImage.X
        },
        color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
      }});
    }

    await ensureGuildSettings(message.guild.id);
    await database.collection('accounts').updateOne({ id: message.guild.id }, { $set: { maintainerRole } });

    // Send message.
    return await message.channel.send({embed: {
      title: 'Cash Bot Maintainer Setup',
      description: `Success! ${message.guild.roles.get(maintainerRole)?.name} has been set as the maintainer role.`,
      thumbnail: {
        url: EmbedImage.Check
      },
      color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
    }});
  }
}

export default SetupCommand;
