const { SlashCommandBuilder } = require('discord.js');
const fifty_fifty_fac = require('../factory/fifty_fifty')
const {fifty_fifty} = require("../casino_config.json")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('홀짝')
		.setDescription(`칩을 사용해 홀/짝에 베팅을 합니다.\n승리시 2배의 칩을 받으며 ${fifty_fifty.fee_in_percentages}%에 수수료가 부가됩니다. 최소 베팅량은 100입니다. \n사용방법: /홀짝 <베팅양> <홀|짝>\n`,[]
        +'사용예시:\n/홀짝 100 홀')
        .addIntegerOption(option =>
			option.setName('베팅양')
				.setDescription('베팅할 칩의 양, 정수만 가능합니다.').setMinValue(100)
				.setRequired(true))
		.addStringOption(option =>
            option.setName('홀짝')
                .setDescription('홀 또는 짝을 선택합니다.')
                .addChoices({
                    name: "홀",
					value: "홀"
                },{
                    name: "짝",
					value: "짝"
                })
                .setRequired(true)),
	async execute(interaction) {
		let commands = interaction.options.data
		let msg = ""

		msg = await fifty_fifty_fac.execute(interaction.user.id, commands[0].value, commands[1].value, )		
		
		await interaction.reply(msg)
	},
};