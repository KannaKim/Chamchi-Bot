const { SlashCommandBuilder } = require('discord.js');
const balance = require('../factory/balance')
const {money_transfer_tax_rates} = require("../config.json")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('송금')
		.setDescription(`참치서버용 참치/명예 포인트를 송금합니다.\n **${money_transfer_tax_rates}%에 수수료가 부가됩니다.**\n사용방법: /송금 <대상> <포인트 종류> <송금 양>\n`,[]
        +'사용예시:\n/송금 @참치 명예 20\n/송금 @참치 참치 1000')
		.addStringOption(option =>
            option.setName('대상')
                .setDescription('포인트를 보낼 대상, @멘션 또는 아이디 로 지정합니다.')
                .setRequired(true))
		.addStringOption(option =>
			option.setName('포인트종류')
				.setDescription('포인트를 보낼 종류, 참치 또는 명예가 있습니다.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('송금양')
				.setDescription('보낼 포인트의 양, 정수만 가능합니다.')
				.setRequired(true)),
	async execute(interaction) {
		let commands = interaction.options.data
		let msg = ""
		if(commands.length != 3) await interaction.reply("잘못된 사용법입니다.\n@봇멘션  [user id] [참치 | 명예] [amount]\n사용 예시:@참치, 잔고설정, 185979168822001665, 참치, 10000");
		else{
			msg = await balance.send_money(interaction.user.id, commands[0].value, commands[1].value, commands[2].value+"").catch(reject=>{msg=reject})		
		}
		await interaction.reply(msg)
	},
};