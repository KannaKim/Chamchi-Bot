const balance = require("../wallets/balance")
const {money_transfer_tax_rates} = require("../config.json")
const discord_util = require("../utill/discord")
const loggers = require("../log/loggers")
const definition = require("../definition")
const validator = require("validator")

async function get_statement(user_id){
    user_id = discord_util.mention_to_id(user_id)
    if(!user_id) return "잘못된 유저아이디입니다."
    let chamchi_balance = await balance.get_point_wrapper(user_id,"chamchi_point")
    if(chamchi_balance == undefined){
        return "유저가 존재하지않습니다."
    }

    let honor_balance = await balance.get_point_wrapper(user_id,"honor_point")
    if(!honor_balance == undefined){
        return "유저가 존재하지않습니다."
    }

    return `참치: ${chamchi_balance} CHAMCHI\n명예: ${honor_balance} HONOUR`
}
async function send_money_logger_context_generate(payer, payee, payment_type, amount, taxed_amount, amount_after_tax){
    let payer_chamchi = await balance.get_point_wrapper(payer, "chamchi_point").catch(reject=>reject)
    let payer_honour = await balance.get_point_wrapper(payer, "honor_point").catch(reject=>reject)
    let payee_chamchi = await balance.get_point_wrapper(payee, "chamchi_point").catch(reject=>reject) 
    let payee_honour = await balance.get_point_wrapper(payee, "honor_point").catch(reject=>reject)
    if(payer_chamchi==undefined || payer_honour==undefined || payee_chamchi==undefined || payee_honour==undefined){
        return ""   //err occured
    }

    let log_msg = `${payer} sent ${amount} ${payment_type} to ${discord_util.mention_to_id(payee)}, taxed amount: ${taxed_amount} ${payment_type} sent amount after tax: ${amount_after_tax} ${payment_type},payer balance: ${payer_chamchi} CHAMCHI ${payer_honour} HONOUR, payee balance: ${payee_chamchi} CHAMCHI ${payee_honour} HONOUR`
    return log_msg
}
async function send_money(payer, payee, payment_type_local, amount){
    let min_send_amount = 100
    
    payer = discord_util.mention_to_id(payer)
    payee = discord_util.mention_to_id(payee)
    
    if(!payer) return "지급자가 잘못되었습니다."
    if(!payee) return "대상이 잘못되었습니다."
    payment_type = definition.currency_type.get(payment_type_local)
    if(!payment_type){
        return "종류가 잘못되었습니다."
    }
    if(!validator.isNumeric(amount)){
        return "양의 형식이 잘못되었습니다."
    }
    if(amount < min_send_amount){
        return `보내는 양이 너무 작습니다. 최소 ${min_send_amount} 이상 보내주세요`
    }

    let payer_balance = await balance.get_point_wrapper(payer, payment_type)
    if(typeof payer_balance != 'number' ){
        return payer_balance;
    } 
    if(payer_balance - amount < 0){
        return "잔고가 모자랍니다"
    }

    let payee_balance = await balance.get_point_wrapper(payee, payment_type)
    if(typeof payee_balance != 'number' ){
        return payee_balance;
    } 
    if(payee_balance - amount < 0){
        return "잔고가 모자랍니다"
    }

    let tax = money_transfer_tax_rates
    let amount_after_tax = Math.round(parseInt(amount) * (100-tax)/100)+""
    let taxed_amount = amount - amount_after_tax

    let subtract_err = await balance.subtract_wrapper(payer, payment_type, amount)
    if(subtract_err){
        return subtract_err
    }

    let add_err = await balance.add_wrapper(payee, payment_type, amount_after_tax)
    if(add_err){
        return add_err
    }
    let log_msg = await send_money_logger_context_generate(payer,payee,payment_type_local,amount, taxed_amount, amount_after_tax)
    if(!log_msg){
        return "회원이 존재하지않습니다."
    }
    
    let log_err = await loggers.save_log_to_sql_wrapper(payer, log_msg).catch(reject=> reject)
    if(log_err){
        return log_err
    }

    let ret_msg = `수수료: ${Math.round(taxed_amount)} ${payment_type_local}\n${Math.round(amount_after_tax)}${payment_type_local} 송금완료` 
    return ret_msg
}
async function reduce_balance(admin_id, target, payment_type_local, amount){
    admin_id = discord_util.mention_to_id(admin_id)
    target = discord_util.mention_to_id(target)

    if(!admin_id) return "admin id is wrong"
    if(!target) return "target is wrong"
    payment_type = definition.currency_type.get(payment_type_local)
    if(!payment_type){
        return "payment type is wrong"
    }
    if(!validator.isNumeric(amount)){
        return "amount is wrong"
    }
    let sub_err = await balance.subtract_wrapper(target, payment_type, amount)
    if(sub_err){
        return sub_err
    }

    let log_msg = `admin ${admin_id} has reduced ${amount}${payment_type_local} to ${target}`
    let log_err = await loggers.save_log_to_sql_wrapper(admin_id, log_msg)
    if(log_err){
        return log_err
    }

    let target_balance = await get_statement(target)
    if(!target_balance){
        return "존재하지않는 유저입니다"
    }

    
    return `설정완료\n${target_balance}`
}
async function set_balance(admin_id, target ,payment_type_local, amount){
    admin_id = discord_util.mention_to_id(admin_id)
    target = discord_util.mention_to_id(target)

    if(!admin_id) return "admin id is wrong"
    if(!target) return "target is wrong"
    payment_type = definition.currency_type.get(payment_type_local)
    if(!payment_type){
        return "payment type is wrong"
    }
    if(!validator.isNumeric(amount)){
        return "amount is wrong"
    }
    let set_err = await balance.set_wrapper(target, payment_type, amount).catch(reject=>reject)
    if(set_err){
        return set_err
    }

    let log_msg = `admin ${admin_id} has set ${amount}${payment_type_local} to ${target}`
    let log_err = await loggers.save_log_to_sql_wrapper(admin_id, log_msg).catch(reject=> reject)
    if(log_err){
        return log_err
    }

    let target_balance = await get_statement(target)
    if(!target_balance){
        return "유저가 존재하지않습니다."
    }

    return `설정완료\n${target_balance}`
}
async function add_balance(admin_id, target, payment_type_local, amount){
    admin_id = discord_util.mention_to_id(admin_id)
    target = discord_util.mention_to_id(target)

    if(!admin_id) return "admin id is wrong"
    if(!target) return "target is wrong"
    payment_type = definition.currency_type.get(payment_type_local)
    if(!payment_type){
        return "payment type is wrong"
    }
    if(!validator.isNumeric(amount)){
        return "amount is wrong"
    }

    let sub_err = await balance.add_wrapper(target, payment_type, amount)
    if(sub_err){
        return sub_err
    }

    let log_msg = `admin ${admin_id} has added ${amount}${payment_type_local} to ${target}`
    let log_err = await loggers.save_log_to_sql_wrapper(admin_id, log_msg).catch(reject=> reject)
    if(log_err){
        return log_err
    }

    let target_balance = await get_statement(target)
    if(!target_balance){
        return "존재하지않는 유저입니다"
    }

    
    return `설정완료\n${target_balance}`
}
module.exports ={
    get_statement,
    send_money,
    reduce_balance,
    add_balance,
    set_balance
}