const balance = require("../wallets/balance")
const def = require("../definition")
const {money_transfer_tax_rates} = require("../config.json")
const discord_util = require("../utill/discord")
const loggers = require("../utill/loggers")
const definition = require("../definition")

async function get_statement(user_id){
    let chamchi_balance = await balance.get_point_wrapper(user_id,"참치").catch(reject=>{return reject})
    let honor_balance = await balance.get_point_wrapper(user_id,"명예").catch(reject=>{return reject})

    return `참치: ${chamchi_balance} CHAMCHI\n명예: ${honor_balance} HONOUR`
}
function send_money_logger_context_generate(payer, payee, payment_type, amount, taxed_amount, amount_after_tax){
    let log_msg = `${payer} sent ${amount} ${payment_type} to ${discord_util.mention_to_id(payee)}\ntaxed amount: ${taxed_amount} ${payment_type}\nsent amount after tax: ${amount_after_tax} ${payment_type}`
    return log_msg
}
async function send_money(payer, payee, payment_type, amount){
    let payer_balance = await balance.get_point_wrapper(payer, payment_type).catch(reject=>{return reject})
    if(typeof payer_balance != 'number' ){
        return payer_balance;
    } 
    if(payer_balance - amount < 0){
        return "잔고가 모자랍니다"
    }
    let tax = money_transfer_tax_rates
    let amount_after_tax = Math.round(parseInt(amount) * (100-tax)/100)+""
    let taxed_amount = amount - amount_after_tax

    let subtract_err = await balance.subtract_wrapper(payer, payment_type, amount).catch(reject=>{return reject})
    if(subtract_err){
        return subtract_err
    }

    let add_err = await balance.add_wrapper(payee, payment_type, amount_after_tax).catch(reject=>{return reject})
    if(add_err){
        return add_err
    }
    let log_msg = send_money_logger_context_generate(payer,payee,payment_type,amount, taxed_amount, amount_after_tax)
    let log_err = await loggers.save_log_to_sql_wrapper(payer, log_msg)
    if(log_err){
        return log_err
    }
    let ret_msg = `수수료: ${Math.round(taxed_amount)} ${payment_type}\n${Math.round(amount_after_tax)} ${payment_type} 송금완료` 
    return ret_msg
}
async function reduce_balance(target, payment_type, amount){
    await balance.subtract_wrapper(target, payment_type, amount).catch(reject=>{return reject})
    let target_balance = await get_statement(target).catch(reject=>{return reject})
    return `설정완료\n${target_balance}`
}
async function add_balance(target, payment_type, amount){
    target = discord_util.mention_to_id(target)
    let add_err = await balance.add_wrapper(target, payment_type, amount).catch(reject=>{return reject})
    if(add_err){
        return add_err
    }
    let target_balance = await get_statement(target).catch(reject=>{return reject})
    return `설정완료\n${target_balance}`
}
module.exports ={
    get_statement,
    send_money,
    reduce_balance,
    add_balance
}