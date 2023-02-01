const definition = require("../definition")
const {fifty_fifty} = require("../casino_config.json")
const casino = require("../utill/casino")
const balance = require('../wallets/balance')
const casino_log = require("../casino/log")
const jackpot = require("../casino/jackpot")

async function execute(userID, betting_amount, guess, asset_type="카지노칩"){
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
    if(get_balance - betting_amount < 0){
        return "잔고가 모자랍니다."
    }
    let err = await casino_log.profit_log_wrapper(userID, betting_amount)
    if(err){
        return err
    }
    let subtract_err = await balance.subtract_wrapper(userID, asset_type_in_var_name, betting_amount)
    if(subtract_err){
        return subtract_err
    }
    
    let reward = 0
    let betting_fee = betting_amount * 2 * fifty_fifty.fee_in_percentages/100
    let jackpot_contribution = betting_fee/2
    if(casino.fifty_fifty_win(guess)){
        reward = betting_amount * 2 - betting_fee
    }
    if(reward>0){
        let add_err = await balance.add_wrapper(userID, asset_type_in_var_name, String(reward))
        let jackpot_add_err = await jackpot.add_jackpot_amount_wrapper(1, jackpot_contribution) 
        if(jackpot_add_err){
            return jackpot_add_err
        }
        if(add_err){
            return add_err
        }
    }

    err = await casino_log.profit_log_wrapper(userID, 0-reward)
    if(err){
        return err
    }
    
    get_balance = await balance.get_point_wrapper(userID, asset_type_in_var_name)
    if(typeof get_balance != 'number' ){
        return get_balance;
    } 
    return fifty_fifty_text_generate(reward, get_balance, betting_fee, asset_type)
}
function fifty_fifty_text_generate(reward, remaining_balance, betting_fee, asset_type){
    let ret_msg = ""
    if(reward>0){
        ret_msg += `***+${reward}***\nRemaining: ${remaining_balance} ${definition.currency_name_to_tiker.get(asset_type)}, Fee: ${betting_fee}\n`
    }
    else{
        ret_msg += `***꽝!***\nRemaining: ${remaining_balance} ${definition.currency_name_to_tiker.get(asset_type)}\n`
    }
    return ret_msg
} 

module.exports = {
    execute
}