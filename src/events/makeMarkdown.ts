import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event : BotEvent = {
    name: "interactionCreate",
    execute: (interaction: Interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'postModal') {
            const postTitle = interaction.fields.getTextInputValue('postTitle');
            const postTags = interaction.fields.getTextInputValue('postTags');
            const postSummary = interaction.fields.getTextInputValue('postSummary');
            const postLink = interaction.fields.getTextInputValue('postLink');
            const postYoutube = interaction.fields.getTextInputValue('postYoutube');
            interaction.reply(`게시글 이름 : ${postTitle}\n참가자 명 : ${postTags}\n시청자 목록 : ${postSummary}\n왁물원 게시글 링크 : ${postLink}\n유튜브 링크 : ${postYoutube}`);
        }
    }
}

export default event;