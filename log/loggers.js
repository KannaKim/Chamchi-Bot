const { pool } = require("../sql_config")
const validator = require("validator")
const discord_util = require("../utill/discord")
function save_log_to_sql_wrapper(user_id, context){
    return new Promise( (resolve, reject) => {
        if( !(discord_util.is_mention(user_id) || validator.isNumeric(user_id))) reject("잘못된 대상입니다.")
        save_log_to_sql(user_id, context, resolve, reject)
    })
}
function save_log_to_sql(user_id, context, resolve, reject){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }   
        connection.query(`INSERT INTO chamchi_database.log_info 
        set user_id = (
        SELECT user_id
          FROM user_info
         WHERE user_id = ?),
         context = ?`,[user_id ,context], function(err, result){
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
module.exports = {
    save_log_to_sql_wrapper
}