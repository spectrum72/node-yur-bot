const Discord = require("discord.js");
const internal = require("stream");
const dotenv = require("dotenv").config();
const Path = require("path");
const fs = require("fs");
const { SlashCommandBuilder, REST, Routes, EmbedBuilder } = require("discord.js");
const { Collection } = require("@discordjs/collection");
const { Player } = require("discord-player");

const guilds = JSON.parse(fs.readFileSync(Path.join(__dirname, "guilds.json")));

//const guilds = JSON.parse("guilds.json");
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
/*const a = fs.readFileSync(Path.join(__dirname, "integer-updating")).toString();
let isUpdating = Boolean(a);*/

const client = new Discord.Client({intents: [Discord.GatewayIntentBits.Guilds,
            Discord.IntentsBitField.Flags.GuildVoiceStates,
            Discord.IntentsBitField.Flags.Guilds,
            Discord.IntentsBitField.Flags.MessageContent,
            Discord.IntentsBitField.Flags.GuildMembers,
            Discord.IntentsBitField.Flags.GuildMessages,
            Discord.IntentsBitField.Flags.GuildVoiceStates]});

client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

let commands = [];
const xcmd = fs.readFileSync(Path.join(__dirname, "needFix.txt")).toString();

const cmdPath = Path.join(__dirname, "Commands");
const cmdFiles = fs.readdirSync(cmdPath).filter((file) => file.endsWith(".js"));

for (const file of cmdFiles) {
    const path = Path.join(cmdPath, file);
    const command = require(path);
    if ("data" in command && "execute" in command) {
        if (xcmd.indexOf(command.data.name) != -1) {
            command.data.name = command.data.name + " -invalid-";
        }
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(CLIENT_TOKEN);

(async() => {
    try {
            for (guild of guilds.guilds) {
                const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.guildsID), { body: commands });
            }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

client.commands.set(commands);

client.once(Discord.Events.ClientReady, () => {
    console.log("Client Ready");
});

client.on(Discord.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    await client.player.extractors.loadDefault();
    if (interaction.commandName.endsWith(" -invalid-")) return await interaction.reply("현재 이용 불가능한 명령어입니다.");

    await interaction.deferReply();
    await command.execute(client, interaction);
});

client.on(Discord.Events.MessageCreate, async (interaction) => {
    if (interaction.content.equals("으응이 손")) {
        interaction.reply("손!");
    }
});

client.login(CLIENT_TOKEN);