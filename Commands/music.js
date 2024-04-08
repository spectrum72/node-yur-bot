const { QueryType } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("음악을 추가합니다%")
    .addStringOption((option) => option.setName("music").setRequired(true).setDescription("music url or name")),
    async execute(client, interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return await interaction.editReply("음성 채널에 들어가셔야 합니다.");

        const queue = await client.player.nodes.create(interaction.guild);
        if (!queue.connection) await queue.connect(voiceChannel);

        const request = interaction.options.getString("music");
        const queryType = (request.startsWith("https://") || request.startsWith("http://")) ? QueryType.YOUTUBE_VIDEO : QueryType.AUTO;

        const result = await client.player.search(request, {
            requestedBy: interaction.user,
            searchEngine: queryType
        });

        console.log(result.tracks.length);

        if (result.tracks.length === 0) {
            interaction.delete();
            return await interaction.editReply("음악을 찾지 못하였습니다.");
        }
        const music = result.tracks[0];
        console.log(music);
        await queue.addTrack(music);

        const result_embed = new EmbedBuilder().setDescription(`${music?.title} had been added to the list\nlink: ${music?.url}`);
        await interaction.editReply({embeds : [result_embed.data]});

        if (queue.tracks.length != 0 && !queue.isPlaying()) queue.node.play();
        console.log(queue.tracks);
    }
}