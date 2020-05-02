// Giving it a default value so you don't need to set up a chain of events to test with
async function getMatchInfo(matchId = '3365077409') {
  // console.log('running')
  // let baseUrl = `http://jvaughn.org/postmortem/passthrough_core.php?match_id=${matchId}&dir=_lol_match_v4_matchlists_by-account_`;
  let url = `http://jvaughn.org/postmortem/passthrough_core.php?match_id=${matchId}&dir=_lol_match_v4_timelines_by-match_`;
  let response = await fetch(url);
  let json = await response.json();
  return json;
} 

export default getMatchInfo;