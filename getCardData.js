const axios = require('axios');
const fs = require('fs');
const keys = require('./trulySecret');
const SPORTS_RADAR_API_KEY = keys.SPORTS_RADAR_API_KEY;
const GOOOGLE_SEARCH_API_KEY = keys.GOOOGLE_SEARCH_API_KEY;
const allPlayers = require('./allPlayers.json');

const teamRankingsURL = `https://api.sportradar.us/mlb/trial/v6.5/en/seasons/2017/REG/rankings.json?api_key=${SPORTS_RADAR_API_KEY}`;
const leagueDepthChartsURL = `https://api.sportradar.us/mlb/trial/v6.5/en//league/depth_charts.json?api_key=${SPORTS_RADAR_API_KEY}`;
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

// addImagesToPlayers()

// getImageLink('Ryan', 'Braun')
