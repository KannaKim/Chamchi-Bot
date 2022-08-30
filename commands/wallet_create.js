const { SlashCommandBuilder } = require('discord.js');
const create = require('../wallets/create')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('지갑개설')
		.setDescription('참치서버용 지갑을 개설합니다.'),
	async execute(interaction) {
		let success = await create.create_account(interaction.user.id)
		if(success){
			await interaction.reply('지갑을 개설하였습니다.');
		}
		else{
			await interaction.reply("이미 지갑을 개설하셧거나 개설중 오류가 발생하였습니다.")
		}
	},
};