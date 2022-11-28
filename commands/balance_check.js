const { SlashCommandBuilder } = require('discord.js');
const definition = require('../definition');
const balance = require('../factory/balance')
const discord_util = require("../utill/discord")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('잔고확인')
		.setDescription('참치/명예 포인트 잔고를 확인합니다.')
        .addStringOption(option =>
            option.setName('대상')
                .setDescription('대상의 잔고를 확인합니다.')
                .setRequired(false))
                .addStringOption(option =>
                    option.setName('포인트종류')
                        .setDescription('포인트를 보낼 종류, 참치 또는 명예가 있습니다.')
                        .setRequired(false)
                        .addChoices({
                            name: "참치",
                            value: "참치"
                        },{
                            name: "명예",
                            value: "명예"
                        },{
                            name: "카지노칩",
                            value: "카지노칩"
                        })),
	async execute(interaction) {
        let balance_msg = ""
        let option_val = new Map()
        for(let i=0; i<interaction.options.data.length; i++){
            option_val.set(interaction.options.data[i].name, interaction.options.data[i].value)
        }
        const target_id = option_val.get("대상") 
        const asset_name = option_val.get("포인트종류") 
        if(option_val.has("포인트종류") && option_val.has("대상")){
            balance_msg = await balance.get_point(target_id,asset_name)
        }
        else if(option_val.has("대상")){
            balance_msg = await balance.get_statement(target_id)
        }
        else if(option_val.has("포인트종류")){
            balance_msg = await balance.get_point(interaction.user.id,asset_name)
        }
        else{
            balance_msg = await balance.get_statement(interaction.user.id)
        }
        // if(interaction.options.data.length == 1){
        //     option_val.set(interaction.options.data[0].name, interaction.options.data[0].value)
            
        //     if(option_val.has("대상")){
        //         const id = discord_util.mention_to_id(option_val.get("대상"))
        //         if(id == null){
        //             balance_msg = "대상이 유효하지않습니다."
        //         }
        //         else{
        //             balance_msg = await balance.get_statement(id)
        //         }
        //     }
        //     else if(option_val.has("포인트종류")){
        //         balance_msg = await balance.get_point(interaction.user.id, option_val.get("포인트종류"))
                
        //     }
        // }
        // else if(interaction.options.data.length == 2){
        //     option_val.set(interaction.options.data[0].name, interaction.options.data[0].value)
        //     option_val.set(interaction.options.data[1].name, interaction.options.data[1].value)

        //     const id = discord_util.mention_to_id(option_val.get("대상"))
        //     balance_msg = await balance.get_point(id, definition.currency_type.get( option_val.get("포인트종류")))
        // }   
        // else if(interaction){
        //     // balance_msg = await balance.get_statement(interaction.user.id).catch(reject=> balance_msg = reject)
        //     balance_msg = await balance.get_statement(interaction.user.id)
        // }
        await interaction.reply(balance_msg)
	},
};``