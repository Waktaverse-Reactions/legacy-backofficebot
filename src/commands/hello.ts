import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command : Command = {
    name: "hello",
    execute: (message, args) => {
        let toGreet = message.mentions.members?.first()
        message.channel.send(`${toGreet ? toGreet.user.username : message.member?.user.username}님 안녕하세요!\n명령어 이용을 원하시면 "/"를 입력해주세요!`)
    },
    cooldown: 10,
    aliases: ["sayhello"],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers] // to test
}

export default command