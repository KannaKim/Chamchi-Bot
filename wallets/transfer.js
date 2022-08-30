const misc = require("../utill/misc")
const discord_util = require("../utill/discord")
const balance = require("../wallets/balance")
const balance_check = require("../commands/balance_check")
async function send_money_wrapper(payer, payee, payment_type, amount){
    return new Promise(
        (resolve, reject)=>{
            if(validator.isNumeric(payer)){
                reject("잘못된 지불자 형식입니다.")
            }
            else if(!(discord_util.is_mention(payee) || validator.isNumeric(payee))) {
                reject("잘못된 대상입니다.")
            }
            else if(misc.isKorean(payment_type)){
                reject("잘못된 형식입니다.")
            }
            else if(validator.isNumeric(amount)){
                reject("잘못된 양입니다.")
            } 
            let payer_sanitized = payer
            let target_sanitized = discord_util.mention_to_id(target)
            let type_sanitized = def.currency_type.get(type)
            let amount_sanitized = amount

            if(await(balance.get_wrapper(payer_sanitized)) - amount < 0){
                reject("잔고가 부족합니다.")
            }
            else{
                send_money(payer_sanitized, target_sanitized, type_sanitized, amount_sanitized)
            }
        }
    )
}
async function send_money(payer, payee, payment_type, amount){
    if(validator.isNumeric(payer)){
        return("잘못된 지불자 형식입니다.")
    }
    else if(!(discord_util.is_mention(payee) || validator.isNumeric(payee))) {
        return("잘못된 대상입니다.")
    }
    else if(misc.isKorean(payment_type)){
        return("잘못된 형식입니다.")
    }
    else if(validator.isNumeric(amount)){
        return("잘못된 양입니다.")
    } 
    let payer_balance = await balance.get_chamchi_point_wrapper(payer)
    if(payer_balance - amount < 0 ){
        return "잔고가 모자랍니다"
    }
    balance.subtract_wrapper(payer, payment_type)

}
module.exports = {
    send_money
}