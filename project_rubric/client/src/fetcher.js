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

const getGame = async (gameId) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/game?id=${gameId}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopPOSPlayer = async (season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/first_all_nba?Season=${season}`, {
        method: 'GET',
    })

    return res.json()
}

const getTopPlayerNoWin = async (season, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/only_got_numbers?Season=${season}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getLucky = async (team) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/lucky?Team=${team}`, {
        method: 'GET',
    })

    return res.json()
}

const getMostContributing = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/contributes_most?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })

    return res.json()
}

export {
    getAllGames,
    getAllPlayersAvg,
    getGame,
    getTopPOSPlayer,
    getTopPlayerNoWin,
    getLucky,
    getMostContributing
}