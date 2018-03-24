const axios = require('axios');
const fs = require('fs');
const keys = require('./trulySecret');
const SPORTS_RADAR_API_KEY = keys.SPORTS_RADAR_API_KEY;
const GOOOGLE_SEARCH_API_KEY = keys.GOOOGLE_SEARCH_API_KEY;
const allPlayers = require('./allPlayers.json');
const players = require('./players.json');
const playersWithStats = require('./playersWithStats.json');

const teamRankingsURL = `https://api.sportradar.us/mlb/trial/v6.5/en/seasons/2017/REG/rankings.json?api_key=${SPORTS_RADAR_API_KEY}`;
const leagueDepthChartsURL = `https://api.sportradar.us/mlb/trial/v6.5/en//league/depth_charts.json?api_key=${SPORTS_RADAR_API_KEY}`;

const playerDataURL = playerID => `https://api.sportradar.us/mlb/trial/v6.5/en/players/${playerID}/profile.json?api_key=${SPORTS_RADAR_API_KEY}`

const imgSearchURL = searchTerm => `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&cx=000795479003306408140%3Aknnkdxhtjau&exactTerms=${searchTerm}&fileType=jpg&imgSize=large&imgType=photo&num=1&searchType=image&key=${GOOOGLE_SEARCH_API_KEY}`


function getPlayers() {
  const players = [];
  return axios.get(leagueDepthChartsURL)
    .then(res => res.data.teams)
    .then(teams => {
      teams.forEach(team => {
        team.positions.forEach(position => {
          if (position.players) {
            players.push(position.players[0])
          }
        })
      })
      return Promise.all(players.map(player => {
        return getImageLink(player.preferred_name, player.last_name);
      }))
    })
    .then(imageURLs => {
      const playersWithImages = players.map((p, i) => {
        return Object.assign({}, p, { photo: imageURLs[i] });
      })
      writeToFile(playersWithImages, 'playersWithImages.json')
    })
    .catch(err => console.log(err.data))
}

function getImageLink(first, last) {
  const playerName = `${first}+${last}`;
  return axios.get(imgSearchURL(playerName))
    .then(res => {
      if (res.data.items) {
        console.log(res.data.items[0].link)
        return res.data.items[0].link
      } else {
        return null;
      }
    })
    .catch(err => console.log(err))
}

function writeToFile(data, file) {
  const json = JSON.stringify(data, null, 2)
  fs.writeFile(file, json, 'utf8', (err) => {
    err ? console.error(err) : console.log('file written successfully');
  })
}

function addImagesToPlayers() {
  const promiseArray = [];
  allPlayers.forEach(player => {
    promiseArray.push(
      getImageLink(player.preferred_name, player.last_name)
        .then(link => {
          player.photo = link;
          return player;
        })
    )
  })
  return Promise.all(promiseArray)
    .then(playersWithPhotos => writeToFile(playersWithPhotos, 'players.json'))
}

function addPlayerStats() {
  const promiseArray = [];
  players.forEach((player, i) => {
    const playerIndex = playersWithStats.findIndex(p => {
      if (p) {
        return p.id === player.id
      }
      return false
    })
    if (playerIndex === -1) {
      promiseArray.push(
        axios.get(playerDataURL(player.id))
          .then(res => {
            const season2017 = res.data.player.seasons.find(s => s.year === 2017 && s.type === 'REG')
            const team = res.data.player.team
            const updatedPlayer = Object.assign(
              {},
              player,
              {
                team,
                avg: +season2017.totals.statistics.hitting.overall.avg,
                slg: +season2017.totals.statistics.hitting.overall.slg
              }
            )
            if (season2017.totals.statistics.pitching) {
              updatedPlayer.era = +season2017.totals.statistics.pitching.overall.era;
              updatedPlayer.oba = +season2017.totals.statistics.pitching.overall.oba;
            }
            return updatedPlayer
          })
          .catch(err => console.log('PLAYER ERROR', player, err.stack, `INDEX ${i}`))
      )
    } else {
      promiseArray.push(Promise.resolve(playersWithStats[playerIndex]))
    }
  })
  return Promise.all(promiseArray)
    .then(playersWithStats => {
      const filteredPlayers = playersWithStats.filter(p => !!p && !!p.photo);
      writeToFile(filteredPlayers, 'playerDataFinal.json')
    })
}

function checkPlayerStats(playerID) {
  return axios.get(playerDataURL(playerID))
    .then(res => {
      const season2017 = res.data.player.seasons.find(s => s.year === 2017 && s.type === 'REG')
      const team = res.data.player.team
      console.log(team, season2017.totals.statistics.hitting.overall.avg)
    })
}

function getPictures() {
  const promiseArray = []
  playersWithStats.forEach(player => {
    if (!player.photo) {
      promiseArray.push(
        getImageLink(player.preferred_name, player.last_name)
          .then(link => {
            player.photo = link;
            return player;
          })
      )
    } else {
      promiseArray.push(Promise.resolve(player))
    }
  })
  return Promise.all(promiseArray)
    .then(playersWithImages2 => writeToFile(playersWithImages2, 'playersWithImagesAndStats.json'))
}

// getPictures();

// checkPlayerStats();

addPlayerStats()

// addImagesToPlayers()

// getImageLink('Ryan', 'Braun')
