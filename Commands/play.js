const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("노래를 재생합니다.")
        .addStringOption((option) => option.setName("music").setDescription("url 또는 곡명")),
    async execute(client, interaction) {
        
        const response = new EmbedBuilder();

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return await interaction.editReply("음성 채널에 들어가셔야 합니다.");

        const queue = await client.player.nodes.create(interaction.guild);
        if (!queue.connection) await queue.connect(voiceChannel);

        const require = interaction.options.getString("music");
        const isUrl = require.startsWith("http://") || require.startsWith("https://");
        const queryType = (isUrl) ? QueryType.YOUTUBE_VIDEO : QueryType.AUTO;

        const tracklist = await client.player.search(require, {
            requestedBy: interaction.user,
            searchEngine: queryType
        })
        .catch((err) => console.log(err));

        if (!tracklist.tracks.length) {
            response.setTitle("재생 가능한 음악이 없습니다!").setDescription("다른 음악을 검색해 보세요");
            return await interaction.editReply({ embeds: [response.data] });
        }

        const track = tracklist.tracks[0];
        await queue.resolve(track);

        response.setTitle("노래를 트랙에 추가했어요!")
            .setDescription(`song name : ${track?.title}\nsong url : ${track?.url}`)
            .setImage(track?.thumbnail)
            .setColor(Colors.Aqua);

        return await interaction.editReply({embeds : [response.data]});
    }
}