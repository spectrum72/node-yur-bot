const axios = require("axios");
const cheerio = require("cheerio");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("노래방검색")
    .setDescription("노래방에 존재하는 음악, 노래방번호를 검색합니다.")
    .addStringOption((option) => option.setName("term").setDescription("검색할 노래 이름")),
    async execute(client, interaction) {
        

        const uri = "https://www.google.com/search?q=" + interaction.options.getString("term");
        axios.get(encodeURI(uri)).then(res => {

        });
    } 
}