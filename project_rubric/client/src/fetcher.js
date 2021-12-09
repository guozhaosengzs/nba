import config from './config.json'

const getAllGames = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/games/?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllPlayersAvg = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player_avg?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getGame = async (Game_ID) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/game?id=${Game_ID}`, {
        method: 'GET',
    })
    return res.json()
}


export {
    getAllGames,
    getAllPlayersAvg,
    getGame
}