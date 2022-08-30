const axios = require('axios')
function getData() {
    return axios.get('https://jsonplaceholder.typicode.com/posts');
  }
  (async () => {
    result = await getData()
    console.log(result)
 })()