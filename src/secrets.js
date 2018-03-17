const playerProfileURL = (playerId) => {
    return `https://api.sportradar.us/mlb/trial/v6.5/en/players/${playerId}/profile.json?api_key=7nfa27xrfmndd65r5j7pydfd`
}


module.exports = {
    playerProfile: playerProfileURL,
    sportradarStats: "https://api.sportradar.us/mlb-t6/seasontd/2017/REG/leaders/statistics.json?api_key=7nfa27xrfmndd65r5j7pydfd",
    sportradarPhoto: "https://api.sportradar.us/mlb-images-{access_level}{version}/{provider}/{league}/{image_type}/players/{asset_id}/{filename}.jpg?api_key=7nfa27xrfmndd65r5j7pydfd",
    playerManifest: "https://api.sportradar.us/mlb-images-t3/ap//players/000b5aca-724b-4768-a5d5-127d1e7cef02/original.jpg?api_key=7nfa27xrfmndd65r5j7pydfd",
}

//
// "https://api.sportradar.us/mlb-images-t3/getty/headshots/players/2016/manifest.json?api_key=7nfa27xrfmndd65r5j7pydfd"
//
// "https://api.sportradar.us/mlb-images-t3/getty/mlb/schema/manifest-v2.0.xsd?api_key=7nfa27xrfmndd65r5j7pydfd"
//
// "https://api.sportradar.us/{sport}-images-{access_level}{version}/{provider}/{league}/{image_type}/players/{year}/manifest.{format}?api_key={your_api_key}""
