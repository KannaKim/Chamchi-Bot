const trace = require("../log/trace")
async function get_user_record(user_id, page_num){

    let result = await trace.get_user_record_wrapper(user_id, page_num).catch(reject=>reject)
    if(result.length == 0){
        return "유저의 기록이 해당페이지에 존재하지않습니다."
    }
    
    let ret_msg = ""
    for(let i=0; i< result.length; i++){
        let row = result[i]
        let datetime = row["created_at"]
        let log_date = `${datetime.getFullYear()}-${String(datetime.getMonth()+1).padStart(2,'0')}-${String(datetime.getDate()).padStart(2,'0')} ${String(datetime.getHours()).padStart(2,'0')}:${String(datetime.getMinutes()).padStart(2,'0')}`
        ret_msg += `${log_date} ${row["context"]}\n`
    }
    return ret_msg
}
module.exports = {
    get_user_record
}