const {conn} = require("../sql_config")
const def = require("../definition")
const validator = require("validator")
const misc = require("../utill/misc")
const discord_util = require("../utill/discord")
const definition = require("../definition")

function subtract_wrapper(target, type, amount){
    return new Promise(
        (resolve, reject)=>{
            if( !(discord_util.is_mention(target) || validator.isNumeric(target))) reject("잘못된 대상입니다.")
            else if( !misc.isKorean(type) ) reject("잘못된 타입입니다.")
            else if( !validator.isNumeric(amount) ) reject("잘못된 양입니다.")
            
            let target_sanitized = discord_util.mention_to_id(target)
            let type_sanitized = def.currency_type.get(type)
            let amount_sanitized = amount

            return subtract(target_sanitized, type_sanitized, amount_sanitized, resolve, reject)
        }
    )
}
function subtract(target, type, amount, resolve, reject){
    conn.query(`update chamchi_database.point_info set ${type} = ${type} - ? where user_id = ?`,[amount, target],
    (err, result)=>{
        if(err){
            reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
        }
        else{
            resolve(`설정 완료`)
        }
    })
}
function add_wrapper(target, type, amount){
    return new Promise(
        (resolve, reject)=>{
            if( !(discord_util.is_mention(target) || validator.isNumeric(target))) reject("잘못된 대상입니다.")
            else if( !misc.isKorean(type) ) reject("잘못된 타입입니다.")
            else if( !validator.isNumeric(amount) ) reject("잘못된 양입니다.")
            
            let target_sanitized = discord_util.mention_to_id(target)
            let type_sanitized = def.currency_type.get(type)
            let amount_sanitized = amount

            return add(target_sanitized, type_sanitized, amount_sanitized, resolve, reject)
        }
    )
}
function add(target, type, amount, resolve, reject){
    conn.query(`update chamchi_database.point_info set ${type} = ${type} + ${amount} where user_id = ?`,[target],
    (err, result)=>{
        if(err){
            reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
        }
        else{
            resolve(`설정 완료`)
        }
    })
}
function set_wrapper(target, type, amount){   //commands:[@참치, 잔고설정, 185979168822001665, 참치, 10000]
    return new Promise((resolve, reject)=>{
        if(!discord_util.is_mention(target) || !misc.isKorean(type) 
        || !validator.isNumeric(amount)) reject("잘못된 사용법입니다.\n@봇멘션 잔고설정 [ @mention | id ] [참치 | 명예] [amount]\n사용 예시:@참치 잔고설정 185979168822001665 참치 10000")
        const target_sanitized = discord_util.mention_to_id(target)
        const type_sanitized = def.currency_type.get(type)
        const amount_sanitized = validator.escape(amount)
    
        return set(target_sanitized, type_sanitized, amount_sanitized, resolve, reject)
    })
}   
function set(target, type, amount, resolve, reject){
    conn.query(`update chamchi_database.point_info set ${type} = ? where user_id = ?`,[amount, target],
    (err, result)=>{
        if(err){
            reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
        }
        else{
            resolve(`설정 완료`)
        }
    })
}
function get_point_wrapper(user_id, type){
    return new Promise(
        (resolve,reject)=>{
            if(!validator.isNumeric(user_id)) reject ("잘못된 유저 아이디입니다.")
            
            let currency_type = definition.currency_type.get(type)
            if(currency_type === undefined){
                reject("잘못된 타입입니다.")
            }
            return get_point(user_id, currency_type, resolve, reject)
        }
    )
}
function get_point(user_id, type, resolve, reject){
    conn.query(`select ${type} from chamchi_database.point_info where user_id = ?`,[user_id],
    (err, result)=>{
        if(result.length == 0){
            reject("등록되지않은 회원입니다.")
        }
        else{
            resolve(Math.round(result[0][type]))
        }
    })
}
module.exports = {
    set_wrapper,
    add_wrapper,
    subtract_wrapper,
    get_point_wrapper
}