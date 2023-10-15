import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "interactionCreate",
  execute: async (interaction: Interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'postModal') {
      // 모달 입력 값 및 게시글 데이터 수집
      const postTitle = interaction.fields.getTextInputValue('postTitle');
      const postTags = interaction.fields.getTextInputValue('postTags');
      const postSummary = interaction.fields.getTextInputValue('postSummary');
      const postCafe = interaction.fields.getTextInputValue('postLink');
      const postYoutube = interaction.fields.getTextInputValue('postYoutube');

      const postCafeId = postCafe.replace('https://cafe.naver.com/steamindiegame/', '');

      function extractYoutubeId(postYoutube: string) {
        if (postYoutube.includes('youtu.be/')) {
          return postYoutube.replace('https://youtu.be/', '').split('?si')[0];
        } else if (postYoutube.includes('youtube.com/watch?v=')) {
          return postYoutube.split('v=')[1];
        } else {
          console.log("유효한 유튜브 ID가 아닙니다");
          return null;
        }
      }

      async function extractCafeData(postCafeId: string) {
        try {
          const apiUrl = `https://apis.naver.com/cafe-web/cafe-articleapi/v2.1/cafes/27842958/articles/${postCafeId}?useCafeId=true`;
      
          const response = await fetch(apiUrl);
          const jsonData = await response.text();
          const data = JSON.parse(jsonData);
      
          const nick = data.result.article.writer.nick;
          const writeDate = data.result.article.writeDate;
      
          return { nick, writeDate };
        } catch (error) {
            console.log("ERROR : ", error);
            return null;
        }
      }      

      const cafeData = await extractCafeData(postCafeId);

      function convertUnixTimeToDate(writeDate: number) {
        const date = new Date(writeDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }
      
      const convertDate = await convertUnixTimeToDate(cafeData?.writeDate);
      const postYoutubeId = extractCafeData(postYoutube);

        interaction.reply(`
게시글 이름 : ${postTitle}
참가자 명 : ${postTags}
시청자 목록 : ${postSummary}
왁물원 게시글 링크 : ${postCafe}
유튜브 링크 : ${postYoutube}

게시글 ID : ${postCafeId}
유튜브 ID : ${postYoutubeId}

작성자 닉네임: ${cafeData?.nick}
작성일: ${convertDate}`); // 해당 값들을 markdown 만들 때 써야함
    }
  }
}

export default event;