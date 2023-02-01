const {pool} = require("../sql_config")
const def = require("../definition")
const validator = require("validator")
const misc = require("../utill/misc")
const discord_util = require("../utill/discord")
const definition = require("../definition")

function profit_log_wrapper(target, amount){
    return new Promise(
        (resolve, reject)=>{
            if( !(validator.isNumeric(String(target)))) reject("잘못된 대상입니다.")
            else if( !(validator.isNumeric(String(amount))) ) reject("잘못된 amount 입니다.")
            return profit_log(target, amount, resolve, reject)
        }
    )
}

function profit_log(target, amount, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
        }   
        connection.query(`update chamchi_database.casino_log set profit = profit + ? where user_id = ?`,[amount, target], function(err, result){
            connection.release();
            if(err){
                reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
            }
            else{
                resolve()
            }
        });
        connection.on('error', function(err) {      
              throw err;
        });
    });
}
function user_exist_wrapper(target){
    return new Promise(
        (resolve, reject)=>{
            if( !(validator.isNumeric(target))) reject("잘못된 대상입니다.")
            return user_exist(target, resolve, reject)
        }
    )
}
function user_exist(target, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
        }   
        connection.query(`select * from casino_log where user_id = ?`,[target], function(err, result){
            connection.release();
            if(err){
                reject("데이터를 등록하는중 오류가 발생하였습니다.")
            }
            else if(result.length == 0){
                resolve(false)
            }
            else{
                resolve(true)
            }
        });
        connection.on('error', function(err) {      
              throw err;
        });
    });
}
function create_casino_log_wrapper(target, resolve, reject){
    return new Promise(
        (resolve, reject)=>{
            if( !(validator.isNumeric(target))) reject("잘못된 대상입니다.")
            return create_casino_log(target, resolve, reject)
        }
    )
}
function create_casino_log(target, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
        }   
        connection.query(`INSERT INTO chamchi_database.casino_log 
        set user_id = (
        SELECT user_id
          FROM user_info
         WHERE user_id = ?)`,[target], function(err, result){
            connection.release();
            if(err){
                reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
            }
            else{
                resolve()
            }
        });
        connection.on('error', function(err) {      
              throw err;
        });
    });
}
module.exports = {
    user_exist_wrapper,
    profit_log_wrapper,
    create_casino_log_wrapper
}