const config = require("./config.json")

module.exports = {
    token: config.chamchi_bot_on_development? config.token_dev: config.token_prod,
    clientId: config.chamchi_bot_on_development? config.clientId_dev: config.clientId_prod,
    server_admin: config.server_admin
}