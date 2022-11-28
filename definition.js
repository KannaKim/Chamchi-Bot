module.exports={
    currency_type: new Map().set("참치","chamchi_point").set("명예","honor_point").set("카지노칩","chip_point"),
    currency_type_to_tiker: new Map().set("chamchi_point", "CHAMCHI").set("honor_point", "HONOUR").set("chip_point","CHIP"),
    currency_name_to_tiker: new Map().set("참치", "CHAMCHI").set("명예", "HONOUR").set("카지노칩","CHIP"),
    chamchi_per: new Map().set("chip_point",1300),
    speetto_price_in_chip: 11,
    game_id: new Map().set("SPEETTO",1)
}