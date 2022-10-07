const Player = require('../models/player')



// POST /players
// Create a new player
async function createPlayer(req, res) {
    const { playerName, playerSurname, birthDate, position } = req.body
    try {
        
        const player = await Player.create({
            playerName,
            playerSurname,
            birthDate,
            position
        })
        res.status(201).json({
            id_player: player.id_player,
            playerName,
            playerSurname,
            birthDate,
            position
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        })
        res.status(400).json({
            message: 'Something goes wrong',
            data: { error }
        })

    }
}

async function getPlayers(req, res) {

    try {
        const players = await Player.findAll()
        res.status(200).json({
            players
        })
    } catch (error) {
        res.status(404).json({
            message: 'Something goes wrong',
            data: { error }
        })
        
        res.status(500).json({
            message: 'Internal server error',
            error
        })
    }
}

// GET /players/:position
// Get all players by position
async function getPlayersByPosition(req, res) {
    const id = req.params.id;
    console.log("Ente al metodo")
    try {
        const players = await Player.findByPk(id)
        console.log(players)
        if(!players.position) {
            return res.status(404).json({
                message: 'Player not found'
            })
        } 
        
        res.status(200).json({
            players
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        })
    }
}


module.exports = {
    createPlayer,
    getPlayers,
    getPlayersByPosition
}