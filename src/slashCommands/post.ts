import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { CommandInteraction } from "discord.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("post")
    .setDescription("wakreactions.info 사이트에 게시글을 등록합니다"),
  execute: async (interaction: CommandInteraction) => {
    const postModal = new ModalBuilder()
      .setTitle('게시글 등록')
      .setCustomId('postModal')
      .setComponents([
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel('게시글 이름')
            .setPlaceholder('사이트에 들어갈 게시글 이름입니다.')
            .setCustomId('postTitle')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel('참가자 명')
            .setPlaceholder('가수 및 피처링입니다. ex) 고세구,비챤')
            .setCustomId('postTags')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel('시청자 목록')
            .setPlaceholder('ex) 우왁굳,아이네')
            .setCustomId('postSummary')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel('왁물원 게시글 링크')
            .setCustomId('postLink')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel('유튜브 링크')
            .setCustomId('postYoutube')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      ] as ActionRowBuilder<TextInputBuilder>[])

    interaction.showModal(postModal);
    
  },
  cooldown: 10
};

export default command;
