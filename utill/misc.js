function isKorean(str){
    return (/^([\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff])+$/).test(str)
}
module.exports = {
    isKorean
}