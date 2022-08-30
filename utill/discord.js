function is_mention(str){
    return (/^<@!*([0-9])+>$/g).test(str)
}
function mention_to_id(str){
    return str.match(/[0-9]+/) ? str.match(/[0-9]+/)[0]:null 
}

module.exports = {
    is_mention, mention_to_id
}