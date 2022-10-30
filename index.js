const fs = require('node:fs');
const path = require('node:path');
const { Client, Partials, Collection, GatewayIntentBits} = require('discord.js');
const { token, clientId, server_admin } = require('./config');
const balance = require('./factory/balance')
const discord_util = require("./utill/discord")
const client = new Client({ partials: [Partials.Message], intents: [GatewayIntentBits.MessageContent,
	GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});
client.on('messageCreate', async message => {
	const commands = message.content.split(" ")
	if(!message.content.startsWith(`<@${clientId}>`)) return;	// @mention [잔고설정] <userID | userName+Tag> <참치 | 명예 > <amount>
	if(commands[1] == '잔고설정' && server_admin.includes(message.author.id)){
		if(commands.length != 5) await message.reply("잘못된 사용법입니다.\n@봇멘션 잔고설정 [user id] [참치 | 명예] [amount]\n사용 예시:@참치 잔고설정 185979168822001665 참치 10000");
		
		else{
			let msg = await balance.set_balance(message.author.id, commands[2], commands[3], commands[4])
			await message.reply(msg)
		}
	}
	
	else if(commands[1] == '잔고감소' && server_admin.includes(message.author.id)){
		if(commands.length != 5) await message.reply("잘못된 사용법입니다.\n@봇멘션 잔고감소 [user id] [참치 | 명예] [amount]\n사용 예시:@참치 잔고차감 185979168822001665 참치 10000");
		else{
			let msg =""
			// msg = await resolveAfter2Seconds()
			msg = await balance.reduce_balance(message.author.id, discord_util.mention_to_id(commands[2]),commands[3],commands[4])
			message.reply(msg)
		} 
	}
	else if(commands[1] == '잔고증가' && server_admin.includes(message.author.id)){
		if(commands.length != 5) await message.reply("잘못된 사용법입니다.\n@봇멘션 잔고증가 [user id] [참치 | 명예] [amount]\n사용 예시:@참치 잔고차감 185979168822001665 참치 10000");
		
		else {
			let msg = await balance.add_balance(message.author.id, commands[2],commands[3],commands[4])
			message.reply(msg)
		}
	}
	
})
function resolveAfter2Seconds() {
  return new Promise(resolve => {
	aszxc.error()

    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}
async function asyncCall() {
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: "resolved"
}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		await interaction.reply({ content: error, ephemeral: true });
	}
});

client.login(token);