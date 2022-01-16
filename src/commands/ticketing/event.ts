import {
  CategoryChannel,
  GuildMember,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Role,
  TextChannel,
} from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import hastebin from 'hastebin';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

export default class Ticket {
  static async ticketEvent(interaction: any) {
    if (
      interaction.guild.channels.cache.find(
        (c: any) => c.topic == `ticket-${interaction.user.id}`,
      )
    ) {
      return interaction.reply({
        content: 'You have already created a ticket!',
        ephemeral: true,
      });
    }

    interaction.guild.channels
      .create(`ticket-${interaction.user.id}`, {
        parent: conf.ticketCategory,
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: conf.supportRole,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      })
      .then(async (c: any) => {
        interaction.reply({
          content: `Ticket created! <#${c.id}>`,
          ephemeral: true,
        });

        const emoji = await interaction.guild.emojis.cache.get(
          '925405072521855006',
        );

        const embed = new MessageEmbed()
          .setColor('#3DBEEE')
          .setAuthor('Ticket')
          .setDescription(`<@${interaction.user.id}> created a ticket.`)
          .setTimestamp();

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('close-ticket')
            .setLabel('Close ticket')
            .setEmoji(emoji)
            .setStyle('DANGER'),
        );

        const opened = await c.send({
          content: `<@${interaction.user.id}> <@&${conf.supportRole}>`,
          embeds: [embed],
          components: [row],
        });

        opened.pin().then(() => {
          opened.channel.bulkDelete(1);
        });
      });
  }

  static async closeTicket(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.guild)
      return interaction.reply({
        content: 'No guild found',
      });
    if (!interaction.channel)
      return interaction.reply({
        content: 'No channel found',
      });
    if (interaction.channel.type != 'GUILD_TEXT')
      return interaction.reply({
        content: "You can't do this here.",
        ephemeral: true,
      });

    const chan: TextChannel = interaction.channel;
    const userID = await chan.messages.fetchPinned().then((messages: any) => {
      const first = messages.first();
      return first.mentions.users.first().id;
    });

    console.log(userID);

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('confirm-close')
        .setLabel('Close ticket')
        .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('no')
        .setLabel('Cancel')
        .setStyle('SECONDARY'),
    );

    const verif = await interaction.reply({
      content: 'Are you sure you want to close the ticket?',
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 10000,
    });

    collector.on('collect', (i: any) => {
      if (i.customId == 'confirm-close') {
        interaction.editReply({
          content: `Ticket closed by <@!${interaction.user.id}>`,
          components: [],
        });

        chan
          .edit({
            name: `closed-${chan.name}`,
            permissionOverwrites: [
              {
                id: interaction.guild!.members.cache.get(userID) as GuildMember,
                deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
              },
              {
                id: interaction.guild!.roles.cache.get(
                  conf.supportRole,
                ) as Role,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
              },
              {
                id: interaction.guild!.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
            ],
          })
          .then(async () => {
            const embed = new MessageEmbed()
              .setColor('#3DBEEE')
              .setAuthor('Ticket')
              .setDescription('```Ticket control```')
              .setTimestamp();

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId('delete-ticket')
                .setLabel('Delete ticket')
                .setEmoji('🗑️')
                .setStyle('DANGER'),
            );

            const channel: CategoryChannel =
              (await interaction.guild!.channels.fetch(
                conf.closedTicketCategory,
              )) as CategoryChannel;

            chan.setParent(channel);

            chan.send({
              embeds: [embed],
              components: [row],
            });
          });

        collector.stop();
      }
      if (i.customId == 'no') {
        interaction.editReply({
          content: 'Closing the cancelled ticket !',
          components: [],
        });
        collector.stop();
      }
    });

    collector.on('end', (i: any) => {
      if (i.size < 1) {
        interaction.editReply({
          content: 'Closing the cancelled ticket !',
          components: [],
        });
      }
    });
  }

  static async deleteTicket(interaction: any) {
    const chan = interaction.channel;

    interaction.reply({
      content: 'Saving messages...',
    });

    chan.messages.fetch().then(async (messages: any) => {
      let a = messages
        .filter((m: any) => m.author.bot !== true)
        .map(
          (m: any) =>
            `${new Date(m.createdTimestamp).toLocaleString('si-SL')} - ${
              m.author.username
            }#${m.author.discriminator}: ${
              m.attachments.size > 0
                ? m.attachments.first().proxyURL
                : m.content
            }`,
        )
        .reverse()
        .join('\n');
      if (a.length < 1) a = 'Nothing';
      hastebin
        .createPaste(
          a,
          {
            contentType: true,
            server: 'https://hastebin.com',
          },
          {},
        )
        .then(function (urlToPaste: any) {
          const embed = new MessageEmbed()
            .setAuthor('Logs Ticket')
            .setDescription(
              `📰 Ticket logs \`${chan.id}\` created by <@!${chan.topic}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${urlToPaste})`,
            )
            .setColor('#3DBEEE')
            .setTimestamp();

          const embed2 = new MessageEmbed()
            .setAuthor('Logs Ticket')
            .setDescription(
              `📰 Logs of your ticket \`${chan.id}\`: [**Click here to see the logs**](${urlToPaste})`,
            )
            .setColor('#3DBEEE')
            .setTimestamp();

          interaction.guild.channels.cache.get(conf.ticketLogs).send({
            embeds: [embed],
          });
          interaction.guild.members.cache
            .get(chan.topic.split('-')[0])
            .send({
              embeds: [embed2],
            })
            .catch(() => {
              console.log('Unable to DM this user.');
            });
          chan.send('Deleting the channel...');

          setTimeout(() => {
            chan.delete();
          }, 5000);
        });
    });
  }
}
