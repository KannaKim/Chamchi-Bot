const { SlashCommandBuilder } = require('discord.js');
const balance = require('../factory/balance')
const speeto = require('../factory/speeto')

const discord_util = require("../utill/discord")
const def = require("../definition")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('스피또')
		.setDescription(`스피또를 합니다. 가격은 ${def.speetto_price_in_chip}칩입니다.`),
	async execute(interaction) {
        let msg = await speeto.execute(interaction.user.id, "카지노칩")
        await interaction.reply(msg)
	},
};