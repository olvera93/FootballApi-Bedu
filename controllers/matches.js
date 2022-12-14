const {Op} = require('sequelize');
const Match = require("../models/Match");
const Team = require("../models/Team");
const Tournament = require("../models/tournament");

async function getMatches(req, res) {
  const options = {
    include: [
      {
        model: Tournament,
        required: true,
      },
      {
        model: Team,
        as: "home",
      },
      {
        model: Team,
        as: "away",
      },
    ],
  }
  const {limit,offset} = req.query;
  if(limit && offset){
    options.limit = parseInt(limit);
    options.offset = parseInt(offset);
  }
  try {
    const matches = await Match.findAll(options);
    return res.status(200).json({
      matches,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Something goes wrong",
      data: err.message,
    });
  }
}
async function getMatch(req, res) {
  const idMatch = req.params.id;
  try {
    const match = await Match.findByPk(idMatch, {
      include: [
        {
          model: Tournament,
          required: true,
        },
        {
          model: Team,
          as: "home",
        },
        {
          model: Team,
          as: "away",
        },
      ],
    });
    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }
    return res.status(200).json({
      match,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Something goes wrong",
      data: err.message,
    });
  }
}
async function createMatch(req, res) {
  const { winner, homeGoals, awayGoals, matchDate, id_home, id_away, id_tournament } = req.body;
  try {
    const match = await Match.create({
      winner,
      homeGoals,
      awayGoals,
      matchDate,
      id_home,
      id_away,
      id_tournament
      });
    return res.status(201).json({ 
      id_match: match.id_match,
      winner,
      homeGoals,
      awayGoals,
      matchDate,
      id_home,
      id_away,
      id_tournament
     });
  } catch (err) {
    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        err.name
      )
    ) {
      return res.status(400).json({
        error: err.errors.map((e) => e.message),
      });
    } else {
      throw err;
    }
  }
}
async function editMatches(req, res) {
  const idMatch = req.params.id;
  const { winner, homeGoals, awayGoals, matchDate, id_home, id_away, id_tournament } = req.body;
  try {
    const match = await Match.findByPk(idMatch);
    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }
    const updatedMatch = await match.update({
      winner,
      homeGoals,
      awayGoals,
      matchDate,
      id_home,
      id_away,
      id_tournament
    });
    return res.status(200).json({ updatedMatch });
  } catch (err) {
    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        err.name
      )
    ) {
      return res.status(400).json({
        error: err.errors.map((e) => e.message),
      });
    } else {
      throw err;
    }
  }
}
async function deleteMatch(req, res) {
  const idMatch = req.params.id;
  try {
    const match = await Match.findByPk(idMatch);
    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }
    await match.destroy();
    return res.status(200).json({ message: "Match deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      data: err.message,
    });
  }
}
//Obtiene todos los partidos que se realizaron dentro de un torneo
async function getMatchesByTournament(req, res) {
  const idTournament = req.params.id;
  try {
    const matches = await Match.findAll({
      where: {
        id_tournament: idTournament,
      },
      include: [
        {
          model: Tournament,
          required: true,
        }
      ],
    });
    return res.status(200).json({
      matches,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Something goes wrong",
      data: err.message,
    });
  }
}
//Obtiene los partidos que ha jugado un equipo como local y visitante
async function getMatchesByTeam(req,res){
  const idTeam = req.params.id;
  try {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { id_home: idTeam },
          { id_away: idTeam },
        ],
      },
      include: [
        {
          model: Tournament,
          required: true,
        },
        {
          model: Team,
          as: "home",
        },
        {
          model: Team,
          as: "away",
        },
      ],
    });
    return res.status(200).json({
      matches,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Something goes wrong",
      data: err.message,
    });
  }
}

module.exports = {
  getMatches,
  getMatch,
  createMatch,
  editMatches,
  deleteMatch,
  getMatchesByTournament,
  getMatchesByTeam
};
