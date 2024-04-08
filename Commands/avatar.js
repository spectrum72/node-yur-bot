const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("change bot avatar")
        .addAttachmentOption((option) => option.setName("image").setDescription("changed avatar").setRequired(true)),
    async execute(client, interaction) {
        const attachment = interaction.options.getAttachment("image");
        const url = (attachment) ? attachment.url : null;

        client.user.setAvatar(url);
        const result = new EmbedBuilder().setTitle("아바타 변경").setDescription("[변경된 아바타]").setColor(Colors.Green).setImage(url);
        await interaction.editReply({embeds: [result.data]});
        const proceed = `Avatar Converted - ${url}`;
        return proceed; 
    } 
}