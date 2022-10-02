const {pool} = require("../sql_config")

async function create_account(user_id){
    let id_success = await create_id(user_id)
    let point_sucess = await create_point(user_id)
    return id_success && point_sucess
}
function create_id(user_id){
    return new Promise((resolve, reject)=>{
        pool.getConnection(function(err,connection){
            if (err) {
              connection.release();
              throw err;
            }   
            connection.query(`insert into chamchi_database.user_info(\`user_id\`) values(?)`, [user_id], function(err, result){
                connection.release();
                if(err){
                    console.log("id creation unsuccessful")
                    resolve(false);
                }
                else{
                    console.log("id creation successful")
                    resolve(true);
                }           
            });
            connection.on('error', function(err) {      
                  throw err;
            });
        });
    })
}
function create_point(user_id){
    return new Promise((resolve, reject)=>{

        pool.getConnection(function(err,connection){
            if (err) {
              connection.release();
              throw err;
            }   
            connection.query(`INSERT INTO chamchi_database.point_info set user_id = (SELECT user_id FROM user_info WHERE user_id = ?)`, [user_id], function(err, result){
                connection.release();
                if(err){
                    console.log("point creation unsuccessful")
                    resolve(false);
                }
                else{
                    console.log("point creation successful")
                    resolve(true);
                }           
            });
            connection.on('error', function(err) {      
                  throw err;
            });
        });
    })
    
}
module.exports = {
    create_account
}