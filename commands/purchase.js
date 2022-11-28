const { SlashCommandBuilder } = require('discord.js');
const balance = require('../factory/balance')
const discord_util = require("../utill/discord")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('구매')
		.setDescription('참치포인트를 사용하여 특정 자산을 구매합니다.')
        .addStringOption(option =>
            option.setName('종류')
                .setDescription('자산의 종류')
                .addChoices({
					name: "카지노칩",
					value: "카지노칩"
				})
                .setRequired(true))
            .addIntegerOption(option=> 
                option.setName("양")
                .setDescription("구매할 자산의 양")
                .setRequired(true)),
	async execute(interaction) {
        let msg = ""
        if(interaction.options.data.length == 2){   //userid: interaction.user.id
            msg = await balance.purchase(interaction.user.id, interaction.options.data[0].value, interaction.options.data[1].value)
        }
        await interaction.reply(msg)
	},
};``