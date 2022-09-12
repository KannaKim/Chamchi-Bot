const { SlashCommandBuilder } = require('discord.js');
const balance = require('../factory/balance')
const discord_util = require("../utill/discord")
const trace = require("../factory/trace")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('조회')
		.setDescription('대상에 기록을 조회합니다. 페이지당 최근 기점으로 5개씩 나옵니다.\n사용법: /조회 <대상> <페이지>\n예: /조회 @참치 1')
        .addStringOption(option =>
            option.setName('대상')
                .setDescription('추적하고자 하는 대상 @멘션|id 로 조회 가능합니다.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName("페이지")
            .setDescription("기록 페이지를 명시합니다. 명시하지않는다면 자동으로 최근 5개의 기록을 생성해냅니다.")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(999)
        ),
	async execute(interaction) {
        let balance_msg = ""
        const id = discord_util.mention_to_id(interaction.options.data[0].value)
        if(id == null){
            balance_msg = "대상이 유효하지않습니다."
        }
        if(interaction.options.data.length != 2){
            balance_msg = await trace.get_user_record(id,1)
        }   
        else if(interaction){
            balance_msg = await trace.get_user_record(id, interaction.options.data[1].value)
        }
        await interaction.reply(balance_msg)
	},
};``