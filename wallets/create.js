const {conn} = require("../sql_config")

async function create_account(user_id){
    let id_success = await create_id(conn, user_id)
    let point_sucess = await create_point(conn, user_id)
    return id_success && point_sucess
}
function create_id(conn, user_id){
    return new Promise((resolve, reject)=>{
        conn.query(`
    insert into chamchi_database.user_info(\`user_id\`) values(?)`, [user_id], function(err, result, feild){
        if(err){
            console.log("id creation unsuccessful")
            resolve(false);
        }
        else{
            console.log("id creation successful")
            resolve(true);
        }
     })
    })
}
function create_point(conn, user_id){
    return new Promise((resolve, reject)=>{
    conn.query(`
    INSERT INTO chamchi_database.point_info 
    set user_id = (
    SELECT user_id
      FROM user_info
     WHERE user_id = ?)`, [user_id], function(err, result, feild){
        if(err){
            console.log(err)
            resolve(false);
        }
        else{
            console.log("point creation sucessful")
            resolve(true);
        }
     })
    })
    
}
module.exports = {
    create_account
}