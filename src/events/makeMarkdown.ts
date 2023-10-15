import { Interaction } from "discord.js";
import { BotEvent } from "../types";
import { exec, ExecException } from 'child_process';

const fs = require('fs');

const event: BotEvent = {
  name: "interactionCreate",
  execute: async (interaction: Interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'postModal') {
      // 모달 입력 값 및 게시글 데이터 수집
      const postTitle = interaction.fields.getTextInputValue('postTitle').replace(/"/g, '');
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
          console.log("❌ 유효한 유튜브 ID가 아닙니다");
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
      
      // Waktaverse Reactions 사이트 Markdown 형식에 맞게 값 변환
      function convertUnixTimeToDate(writeDate: number) {
        const date = new Date(writeDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }
      
      const convertDate = await convertUnixTimeToDate(cafeData?.writeDate);
      const postYoutubeId = extractYoutubeId(postYoutube);

      const postTagsArray = `[${postTags.split(',').map(tag => `'${tag.trim()}'`).join(',')}]`;

      let postAuthor;

      if (cafeData?.nick === '폼푸린') {
        postAuthor = 'pompurin';
      } else if (cafeData?.nick === 'NyMirror') {
        postAuthor = 'nymirror';
      } else if (cafeData?.nick === '울랜') {
        postAuthor = 'woolan';
      } else if (cafeData?.nick === 'Dos0313') {
        postAuthor = 'do_s';
      } else {
        postAuthor = 'wakreactions';
      }

      const postData = `---
title: '${postTitle}'
date: '${convertDate}'
tags: ${postTagsArray}
draft: false
summary: '${postSummary} 같이보기'
images: ['https://i.ytimg.com/vi/${postYoutubeId}/maxresdefault.jpg']
layout: PostLayout
canonicalUrl:
authors: ['${postAuthor}']
---

## 링크

**같이보기 보러가기** (이미지를 클릭하여 이동)
[![같이보기 보러가기](https://cdn.discordapp.com/attachments/1136601898116464710/1137050327938506852/logo.png)](https://cafe.naver.com/steamindiegame/${postCafeId})

**MV 보러가기** (이미지를 클릭하여 이동)
[![MV 시청하기](https://i.ytimg.com/vi/${postYoutubeId}/maxresdefault.jpg)](${postYoutube})

## 추가 정보

![왁리 구독하는법](https://cdn.discordapp.com/attachments/1136601898116464710/1137049857136267374/--2cut.gif)`;

      // markdown 파일 생성
      fs.readdir('../Waktaverse-Reactions-Site/data/blog',function(err: string, filelist: string){
        const postNumber = filelist.length;
        console.log('📃 이번 게시글 번호 : ', postNumber);

        fs.writeFile(`../Waktaverse-Reactions-Site/data/blog/${postNumber}.md`, postData, function(err: string){
          if (err === null) {
              console.log('✅ 게시글 생성 완료');
          } else {
              console.log('❌ 게시글 생성 실패');
          }
        });
      });

      // git commit 및 push (shell script 실행)
      exec('sh ./src/scripts/gitpush.sh', (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          console.error(`실행 중 에러 발생: ${error}`);
          interaction.reply('❌ 게시글 업로드를 실패했습니다.');
          return;
        }
        console.log(`표준 출력: ${stdout}`);
        interaction.reply('✅ 게시글 업로드를 성공했습니다.');
        console.error(`표준 에러: ${stderr}`);
      });
    }
  }
}

export default event;