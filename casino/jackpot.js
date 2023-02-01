const {pool} = require("../sql_config")
const def = require("../definition")
const validator = require("validator")
const misc = require("../utill/misc")

function get_jackpot_amount_wrapper(gameID){
    return new Promise(
        (resolve,reject)=>{
            if(!validator.isNumeric(String(gameID))) reject ("gameID는 숫자여야합니다.")
            return get_jackpot_amount(gameID, resolve, reject)
        })
}
function get_jackpot_amount(gameID,resolve,reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`select current_jackpot_amount from casino_jackpot where game_id = ?`, [gameID], function(err, result){
            connection.release();
            if(err){
                reject()
            }
            else if(result.length == 0){
                reject("존재하지않는 게임입니다.")
            }
            else{
                resolve(Math.round(result[0]["current_jackpot_amount"]))
            }
        });
        connection.on('error', function(err) {      
              throw err;
        });
    });
}
function set_jackpot_amount_wrapper(gameID, val){
    return new Promise(
        (resolve,reject)=>{
            if(!validator.isNumeric(String(gameID)) || !validator.isNumeric(String(val))) reject ("잘못된 형식입니다.")
            return set_jackpot_amount(gameID, val, resolve, reject)
        })
}
function set_jackpot_amount(gameID, val, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`update chamchi_database.casino_jackpot set current_jackpot_amount = ${val} where game_id = ?`, [gameID], function(err, result){
            connection.release();
            if(err){
                reject(err)
            }
            else if(result.length == 0){
                reject("존재하지않는 게임입니다.")
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
function add_jackpot_amount_wrapper(gameID, amount){
    return new Promise(
        (resolve,reject)=>{
            if(!validator.isNumeric(String(gameID)) || !validator.isNumeric(String(amount))) reject ("잘못된 형식입니다.")
            return add_jackpot_amount(gameID, amount, resolve, reject)
        })
}
function add_jackpot_amount(gameID, amount, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`update chamchi_database.casino_jackpot set current_jackpot_amount = current_jackpot_amount + ${amount} where game_id = ?`, [gameID], function(err, result){
            connection.release();
            if(err){
                reject(err)
            }
            else if(result.length == 0){
                reject("존재하지않는 게임입니다.")
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
    get_jackpot_amount_wrapper,
    add_jackpot_amount_wrapper,
    set_jackpot_amount_wrapper
}