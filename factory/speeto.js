const definition = require("../definition")
const casino = require("../utill/casino")
const balance = require('../wallets/balance')
const casino_log = require("../casino/log")
const jackpot = require("../casino/jackpot")

function createModel(){
    let a = {}
    a[0] = casino.createRow(2,2,4,2)
    a[1] = casino.createRow(8,2,7,3)
    a[2] = casino.createRow(58,2,25,4)
    a[3] = casino.createRow(30,3,100,5)
    a[4] = casino.createRow(52,4,4500,6)
    return {"speetto":a, "cost":11, "jackpot_contribution":2}
}
async function execute(userID, asset_type){
    userID += ""
    let asset_type_in_var_name = definition.currency_type.get(asset_type)

    let check_if_log_exist = await casino_log.user_exist_wrapper(userID)
    if(typeof check_if_log_exist != 'boolean' ){
        return check_if_log_exist;
    }
    if(check_if_log_exist == false){
        let err = await casino_log.create_casino_log_wrapper(userID)
        if(err){
            return err
        }
    }

    let get_balance = await balance.get_point_wrapper(userID, asset_type_in_var_name)
    if(typeof get_balance != 'number' ){
        return get_balance;
    } 
    let model = createModel()
    if(get_balance - model["cost"] < 0){
        return "잔고가 모자랍니다."
    }
    let subtract_err = await balance.subtract_wrapper(userID, asset_type_in_var_name, model["cost"]+"")
    if(subtract_err){
        return subtract_err
    }

    const gameID = String(definition.game_id.get("SPEETTO"))

    let jackpot_add_err = await jackpot.add_jackpot_amount_wrapper(gameID, String(model["jackpot_contribution"])) 
    if(jackpot_add_err){
        return jackpot_add_err
    }

    let current_jackpot_amount = await jackpot.get_jackpot_amount_wrapper(gameID)

    let reward = getReward(model)
    if(check_if_jackpot(model)){
        reward += current_jackpot_amount
        let set_err = await jackpot.set_jackpot_amount_wrapper(gameID, 0)
        if(set_err){
            return set_err
        }
    }
    if(reward>0){
        let add_err = await balance.add_wrapper(userID, asset_type_in_var_name, String(reward))
        if(add_err){
            return add_err
        }
    }
    let err = await casino_log.profit_log_wrapper(userID, String(model["cost"]-reward))
    if(err){
        return err
    }
    get_balance = await balance.get_point_wrapper(userID, asset_type_in_var_name)
    if(typeof get_balance != 'number' ){
        return get_balance;
    } 
    let speeto_text = speeto_text_generate(model, current_jackpot_amount, reward, get_balance)
    return speeto_text
}
function check_if_jackpot(model){
    if(casino.nDuplicateExist(model["speetto"][4]["duplicate"], model["speetto"][4]["row"])){
        return true
    }
    return false
}
function speeto_text_generate(model, jackpot_amount, reward, remaining_chip){
    let speeto_text = `**JACKPOT: ${jackpot_amount} ${definition.currency_name_to_tiker.get("카지노칩")}**\n`
    for(let i=0; i<5; i++){
        for(let j=0; j<model["speetto"][i]["row"].length; j++){
            if(casino.arrHasK_N_times(model["speetto"][i]["row"], model["speetto"][i]["row"][j], 2)){
                speeto_text += `***${model["speetto"][i]["row"][j]}*** `
            }
            else{
                speeto_text += model["speetto"][i]["row"][j] +" "
            }
        }
        if(casino.nDuplicateExist(model["speetto"][i]["duplicate"],model["speetto"][i]["row"])){
            speeto_text += `\t\t\t// ***+${model["speetto"][i]["reward"]} CHIP!***`
        }
        if(i!=model["speetto"][i]["row"].length-1){
            speeto_text += "\n"
        }
    }
    if(reward>0){
        speeto_text += "Earned +"+reward+"\n"
    }
    speeto_text += `\nRemaining: ${remaining_chip} ${definition.currency_name_to_tiker.get("카지노칩")}`
    return speeto_text
}
function getReward(model){    // return reward amount
    let speetto = model["speetto"]
    let total_reward = 0
    for(key in speetto){
        let arr = speetto[key]["row"]
        let nDup = speetto[key]["duplicate"]
        let reward = speetto[key]["reward"]
        if(casino.nDuplicateExist(nDup, arr)){
            total_reward += reward
        }
    }
    return total_reward
} 
module.exports = {
    getReward,
    execute,
    createModel
}