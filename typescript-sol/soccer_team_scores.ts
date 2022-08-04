// To compile this code, simply run 'node soccer_team_score.js' in the command line

// Helper function to get the games in a readable format from the txt file
// let parseGames = function (gameFile: File): Array<string> {
//     let fr = new FileReader();
//     fr.readAsText(gameFile);
//     let games = <string>fr.result;      // Casting the result as a string

//     return games.split("\n");
// }

// We want to separate the score from the team name
let getTeamNameAndScore = function(team: string): Array<any> {
    // Splitting by empty space allows us to always separate the score
    let words = team.split(" ");
    return [words.slice(0, -1).join(" "), parseInt(words[words.length - 1])];
}

let getTeamsAndNumGames = function(games: Array<string>): any {
    let teams:{[index: string]:any} = {};
    let numGames = 0;
    
    games.forEach(game => {
        let gameTeams = game.split(", ");
        let team1 = getTeamNameAndScore(gameTeams[0])[0];
        let team2 = getTeamNameAndScore(gameTeams[1])[0];
        if (!(team1 in teams)) numGames += 1;
        teams[team1] = 0;
        teams[team2] = 0;
    });
    
    // Every game has two teams, so we want to account for that in our answer
    return [teams, numGames];
}

let getNumTeams = function(teams: Object): number {
    return Object.keys(teams).length
}

// Helper to update the top standings based on new score input
let updateTopTeams = function(topTeams: Array<string>, standings: Object, team: string): Array<String> {    
    // Beats first place. Need to shuffle first and second down
    if (standings[team] > standings[topTeams[0]]) {
        [topTeams[1], topTeams[2]] = [topTeams[0], topTeams[1]];
        topTeams[0] = team;
    // Beats second place. Need to shuffle second down to third
    } else if (standings[team] > standings[topTeams[1]] && team !== topTeams[0]) {
        topTeams[2] = topTeams[1];
        topTeams[1] = team;
    // Beats third place
    } else if (standings[team] > standings[topTeams[2]] && team !== topTeams[0] && team != topTeams[1]) {
        topTeams[2] = team;
    }

    return topTeams
}

// What we display on the command line will depend on whether or not we have any ties
// Tied teams will be displayed in alphabetical order
let displayTopTeams = function(day: number, standings: Object, topTeams: Array<string>) {
    // Extracting the top three teams from the input array
    let [first, second, third] = topTeams;
    
    console.log(`Matchday ${day}`);

    // Three way tie. Check it first so we don't need any nested if statements
    if (standings[first] === standings[third]) {
        let sortTeams = [first, second, third].sort()
        console.log(`${sortTeams[0]}, ${standings[sortTeams[0]]} pts`);
        console.log(`${sortTeams[1]}, ${standings[sortTeams[1]]} pts`);
        console.log(`${sortTeams[2]}, ${standings[sortTeams[2]]} pts`);
    // First and second tie
    } else if (standings[first] === standings[second]) {
        let sortTeams = [first, second].sort()
        console.log(`${sortTeams[0]}, ${standings[sortTeams[0]]} pts`);
        console.log(`${sortTeams[1]}, ${standings[sortTeams[1]]} pts`);
        console.log(`${third}, ${standings[third]} pts`);
    // Second and third tie
    } else if (standings[second] === standings[third]) {
        let sortTeams = [third, second].sort()
        console.log(`${first}, ${standings[first]} pts`);
        console.log(`${sortTeams[0]}, ${standings[sortTeams[0]]} pts`);
        console.log(`${sortTeams[1]}, ${standings[sortTeams[1]]} pts`);
    // No ties
    } else {
        console.log(`${first}, ${standings[first]} pts`);
        console.log(`${second}, ${standings[second]} pts`);
        console.log(`${third}, ${standings[third]} pts`);
    }
    console.log("\n")
}

// The main function that counts up the head-to-head standings every match
let scoreCounter = function(gameData: string) {
    let games = gameData.split("\n");
    let standings, numGamesPerDay = getTeamsAndNumGames(games);
    let numTeams = getNumTeams(standings);
    let teams = Object.keys(standings);
    let topTeams = [teams[0], teams[1], teams[2]];
    let day = 1;

    games.forEach((game, idx) => {
        let teams = game.split(", ");
        let [team1, score1] = getTeamNameAndScore(teams[0]);
        let [team2, score2] = getTeamNameAndScore(teams[1]);
        if (score1 > score2) {          // Team 1 wins
            standings[team1] += 3
            standings[team2] += 0
        } else if (score2 > score1) {   // Team 2 wins
            standings[team2] += 3
            standings[team1] += 0
        } else {                        // Tied game
            standings[team1] += 1
            standings[team2] += 1
        }

        updateTopTeams(topTeams, standings, team1);
        updateTopTeams(topTeams, standings, team2);

        if (idx % numGamesPerDay === numGamesPerDay - 1) {
            displayTopTeams(day, standings, topTeams);
            day += 1
        }
    });
}

let sampleGame = "San Jose Earthquakes 3, Santa Cruz Slugs 3\n\
Capitola Seahorses 1, Aptos FC 0\n\
Felton Lumberjacks 2, Monterey United 0\n\
Felton Lumberjacks 1, Aptos FC 2\n\
Santa Cruz Slugs 0, Capitola Seahorses 0\n\
Monterey United 4, San Jose Earthquakes 2\n\
Santa Cruz Slugs 2, Aptos FC 3\n\
San Jose Earthquakes 1, Felton Lumberjacks 4\n\
Monterey United 1, Capitola Seahorses 0\n\
Aptos FC 2, Monterey United 0\n\
Capitola Seahorses 5, San Jose Earthquakes 5\n\
Santa Cruz Slugs 1, Felton Lumberjacks 1";

scoreCounter(sampleGame);