const balance = require("../wallets/balance")
const def = require("../definition")
const {money_transfer_tax_rates} = require("../config.json")
async function get_statement(user_id){
    let chamchi_balance = await balance.get_point_wrapper(user_id,"참치").catch(reject=>{return reject})
    let honor_balance = await balance.get_point_wrapper(user_id,"명예").catch(reject=>{return reject})

    return `참치: ${chamchi_balance} CHAMCHI\n명예: ${honor_balance} HONOUR`
}
async function send_money(payer, payee, payment_type, amount){
    let payer_balance = await balance.get_point_wrapper(payer, payment_type).catch(reject=>{return reject})
    if(payer_balance - amount < 0){
        return "잔고가 모자랍니다"
    }
    let tax = money_transfer_tax_rates
    let taxed_amount = (parseInt(amount) * (100-tax)/100)+""
    await balance.subtract_wrapper(payer, payment_type, amount).catch(reject=>{return reject})
    await balance.add_wrapper(payee, payment_type, taxed_amount).catch(reject=>{return reject})
    
    return `수수료: ${Math.round(amount-taxed_amount)} point\n${payment_type} ${taxed_amount} 송금완료`
}
async function reduce_balance(target, payment_type, amount){
    await balance.subtract_wrapper(target, payment_type, amount).catch(reject=>{return reject})
    let target_balance = await get_statement(target).catch(reject=>{return reject})
    return `설정완료\n${target_balance}`
}
async function add_balance(target, payment_type, amount){
    await balance.add_wrapper(target, payment_type, amount).catch(reject=>{return reject})
    let target_balance = await get_statement(target).catch(reject=>{return reject})
    return `설정완료\n${target_balance}`
}
module.exports ={
    get_statement,
    send_money,
    reduce_balance,
    add_balance
}