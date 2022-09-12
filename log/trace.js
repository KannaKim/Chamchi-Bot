const {conn} = require("../sql_config")
const def = require("../definition")
const validator = require("validator")
const misc = require("../utill/misc")
const discord_util = require("../utill/discord")
const definition = require("../definition")

function get_user_record_wrapper(user_id, page_num){
    return new Promise(
        (resolve,reject)=>{
            if(!validator.isNumeric(user_id)) reject ([])
            return get_user_record(user_id, page_num, resolve, reject)
        }
    )
}
function get_user_record(user_id, page_num, resolve, reject){
    let n = 5
    let from = (page_num-1)*n
    let to = (page_num)*n
    conn.query(`select * from chamchi_database.log_info where user_id = ? order by created_at desc limit ${from},${to}`,[user_id],
    (err, result)=>{
        if(err){
            reject([])
        }
        if(result.length == 0){
            reject([])
        }
        else{
            resolve(result)
        }
    })
}
module.exports = {
    get_user_record_wrapper
}