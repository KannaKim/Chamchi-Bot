const {pool} = require("../sql_config")
const def = require("../definition")
const validator = require("validator")
const misc = require("../utill/misc")
const discord_util = require("../utill/discord")
const definition = require("../definition")

function subtract_wrapper(target, type, amount){
    return new Promise(
        (resolve, reject)=>{
            if( !(validator.isNumeric(target))) reject("잘못된 대상입니다.")
            else if( !misc.isEnglisOrUnderScore(type) ) reject("잘못된 타입입니다.")
            else if( !validator.isNumeric(amount) ) reject("잘못된 양입니다.")
            return subtract(target, type, amount, resolve, reject)
        }
    )
}
function subtract(target, type, amount, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
        }   
        connection.query(`update chamchi_database.point_info set ${type} = ${type} - ? where user_id = ?`,[amount, target], function(err, result){
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
    // conn.query(`update chamchi_database.point_info set ${type} = ${type} - ? where user_id = ?`,[amount, target],
    // (err, result)=>{
    //     if(err){
    //         reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
    //     }
    //     else{
    //         resolve()
    //     }
    // })
}
function add_wrapper(target, type, amount){
    return new Promise(
        (resolve, reject)=>{
            if( !(validator.isNumeric(target))) reject("잘못된 대상입니다.")
            else if( !misc.isEnglisOrUnderScore(type) ) reject("잘못된 타입입니다.")
            else if( !validator.isNumeric(amount) ) reject("잘못된 양입니다.")

            return add(target, type, amount, resolve, reject)
        }
    )
}
function add(target, type, amount, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`update chamchi_database.point_info set ${type} = ${type} + ${amount} where user_id = ?`,[target], function(err, result){
            connection.release();
            if(err){
                reject("데이타베이스에 오류가 발생하엿습니다.")
            }
            else if(result.affectedRows == 0){
                reject("등록되지않은 회원입니다.")
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
function set_wrapper(target, type, amount){   //commands:[@참치, 잔고설정, 185979168822001665, 참치, 10000]
    return new Promise((resolve, reject)=>{
        if(!validator.isNumeric(target) || !misc.isEnglisOrUnderScore(type) ||
        !validator.isNumeric(amount)) reject("잘못된 사용법입니다.\n@봇멘션 잔고설정 [ @mention | id ] [참치 | 명예] [amount]\n사용 예시:@참치 잔고설정 185979168822001665 참치 10000")
    
        return set(target, type, amount, resolve, reject)
    })
}   
function set(target, type, amount, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`update chamchi_database.point_info set ${type} = ? where user_id = ?`,[amount, target], function(err, result){
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
    // conn.query(`update chamchi_database.point_info set ${type} = ? where user_id = ?`,[amount, target],
    // (err, result)=>{
    //     if(err){
    //         reject("등록되지않은 회원이거나 데이터를 등록하는중 오류가 발생하였습니다.")
    //     }
    //     else{
    //         resolve()
    //     }
    // })
}
function get_point_wrapper(user_id, type){
    return new Promise(
        (resolve,reject)=>{
            if(!validator.isNumeric(user_id) || !misc.isEnglisOrUnderScore(type)) reject ("")
        
            return get_point(user_id, type, resolve, reject)
        }
    )
}
function get_point(user_id, type, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`select ${type} from chamchi_database.point_info where user_id = ?`,[user_id], function(err, result){
            connection.release();
            if(err){
                reject()
            }
            else if(result.length == 0){
                reject("등록되지않은 회원입니다.")
            }
            else{
                resolve(Math.round(result[0][type]))
            }
        });
        connection.on('error', function(err) {      
              throw err;
        });
    });
    // conn.query(`select ${type} from chamchi_database.point_info where user_id = ?`,[user_id],
    // (err, result)=>{
    //     if(err){
    //         reject()
    //     }
    //     else if(result.length == 0){
    //         reject()
    //     }
    //     else{
    //         resolve(Math.round(result[0][type]))
    //     }
    // })
}
module.exports = {
    set_wrapper,
    add_wrapper,
    subtract_wrapper,
    get_point_wrapper
}