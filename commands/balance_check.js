const { SlashCommandBuilder } = require('discord.js');
const balance = require('../factory/balance')
const discord_util = require("../utill/discord")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('잔고확인')
		.setDescription('참치/명예 포인트 잔고를 확인합니다.')
        .addStringOption(option =>
            option.setName('대상')
                .setDescription('대상의 잔고를 확인합니다.')
                .setRequired(false)),
	async execute(interaction) {
        let balance_msg = ""
        if(interaction.options.data.length == 1){
            const id = discord_util.mention_to_id(interaction.options.data[0].value)
            if(id == null){
                balance_msg = "대상이 유효하지않습니다."
            }
            else{
                balance_msg = await balance.get_statement(id)
            }
        }
        else if(interaction){
            // balance_msg = await balance.get_statement(interaction.user.id).catch(reject=> balance_msg = reject)
            balance_msg = await balance.get_statement(interaction.user.id)
        }
        await interaction.reply(balance_msg)
	},
};``