function fifty_fifty_win(guess){
    const guess_dic = {0:"홀", 1:"짝"}
    return guess_dic[Math.floor(Math.random()*2)] == guess
}
function createRow(n, nDuplicate , reward, size){
    if( n<=0 || size<=0 ){
        throw TypeError("n or size can't be 0 or less")
    }
    let a = []
    for(let i=0; i<size; i++){
        a.push(Math.floor(Math.random()*n)+1)
    }
    return {"row":a, "duplicate": nDuplicate, "reward": reward}
}
function arrHasK_N_times(arr,k,n){
    let counters = 0
    for(let i=0; i< arr.length; i++){
        if(arr[i]==k){
            counters+=1
        }
    }
    if(counters==n){
        return true
    }
    return false
}
function nDuplicateExist(n, arr){
    let counters = {}
    for(let i=0; i< arr.length; i++){
        if((arr[i] in counters)==false){
            counters[arr[i]] = 0 
        }
        counters[arr[i]] += 1
        if(counters[arr[i]]>=n){
            return true
        }
    }
    return false

}
module.exports = {
    createRow,
    nDuplicateExist,
    arrHasK_N_times,
    fifty_fifty_win
}