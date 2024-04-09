const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("재생 가능한 음악을 검색합니다.")
        .addStringOption((option) => option.setName("query").setDescription("search")),
    async execute(client, interaction) {

        const response = new EmbedBuilder();

        const query = interaction.options.getString("query");
        const tracklist = await client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!tracklist.tracks.length) {
            response.setTitle("재생 가능한 음악이 없어요!").setDescription("철자, 기호 등을 잘못 입력하였는지 확인해보세요");
            return await interaction.editReply({embeds: [response.data]}); 
        }

        
        let description = "";
        for (let i = 0; i < tracklist.tracks.length; i++) {
            track = tracklist.tracks[i];
            description += `[${i+1}] ${track?.title}\n\n`;
        }

        response.setName(`${tracklist.tracks.length}개의 음악을 찾았어요!`)
            .setDescription(description)
            .setColor(Colors.Green);
        return await interaction.editReply({ embeds : [response.data]});
    }
}