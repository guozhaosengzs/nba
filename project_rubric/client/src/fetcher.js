import config from './config.json'

const getAllGames = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/games/?Date_From=undefined&Date_To=undefined&Home=undefined&Away=undefined&City=undefined`, {
        method: 'GET',
    })
    return res.json()
}

const getSearchedGames = async (ht, at, city, dateF, dateT) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/games/?Date_From=${dateF}&Date_To=${dateT}&Home=${ht}&Away=${at}&City=${city}`, {
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
    var res = await fetch(`http://${config.server_host}:${config.server_port}/game?Game_ID=${gameId}`, {
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
    getMostContributing,
    getSearchedGames
}