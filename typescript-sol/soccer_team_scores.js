// To compile this code, simply run 'node soccer_team_score.js' in the command line
// Helper function to get the games in a readable format from the txt file
// let parseGames = function (gameFile: File): Array<string> {
//     let fr = new FileReader();
//     fr.readAsText(gameFile);
//     let games = <string>fr.result;      // Casting the result as a string
//     return games.split("\n");
// }
// We want to separate the score from the team name
var getTeamNameAndScore = function (team) {
    // Splitting by empty space allows us to always separate the score
    var words = team.split(" ");
    return [words.slice(0, -1).join(" "), parseInt(words[words.length - 1])];
};
var getTeamsAndNumGames = function (games) {
    var teams = {};
    var numGames = 0;
    games.forEach(function (game) {
        var gameTeams = game.split(", ");
        var team1 = getTeamNameAndScore(gameTeams[0])[0];
        var team2 = getTeamNameAndScore(gameTeams[1])[0];
        if (!(team1 in teams))
            numGames += 1;
        teams[team1] = 0;
        teams[team2] = 0;
    });
    // Every game has two teams, so we want to account for that in our answer
    return [teams, numGames];
};
var getNumTeams = function (teams) {
    return Object.keys(teams).length;
};
// Helper to update the top standings based on new score input
var updateTopTeams = function (topTeams, standings, team) {
    var _a;
    // Beats first place. Need to shuffle first and second down
    if (standings[team] > standings[topTeams[0]]) {
        _a = [topTeams[0], topTeams[1]], topTeams[1] = _a[0], topTeams[2] = _a[1];
        topTeams[0] = team;
        // Beats second place. Need to shuffle second down to third
    }
    else if (standings[team] > standings[topTeams[1]] && team !== topTeams[0]) {
        topTeams[2] = topTeams[1];
        topTeams[1] = team;
        // Beats third place
    }
    else if (standings[team] > standings[topTeams[2]] && team !== topTeams[0] && team != topTeams[1]) {
        topTeams[2] = team;
    }
    return topTeams;
};
// What we display on the command line will depend on whether or not we have any ties
// Tied teams will be displayed in alphabetical order
var displayTopTeams = function (day, standings, topTeams) {
    // Extracting the top three teams from the input array
    var first = topTeams[0], second = topTeams[1], third = topTeams[2];
    console.log("Matchday ".concat(day));
    // Three way tie. Check it first so we don't need any nested if statements
    if (standings[first] === standings[third]) {
        var sortTeams = [first, second, third].sort();
        console.log("".concat(sortTeams[0], ", ").concat(standings[sortTeams[0]], " pts"));
        console.log("".concat(sortTeams[1], ", ").concat(standings[sortTeams[1]], " pts"));
        console.log("".concat(sortTeams[2], ", ").concat(standings[sortTeams[2]], " pts"));
        // First and second tie
    }
    else if (standings[first] === standings[second]) {
        var sortTeams = [first, second].sort();
        console.log("".concat(sortTeams[0], ", ").concat(standings[sortTeams[0]], " pts"));
        console.log("".concat(sortTeams[1], ", ").concat(standings[sortTeams[1]], " pts"));
        console.log("".concat(third, ", ").concat(standings[third], " pts"));
        // Second and third tie
    }
    else if (standings[second] === standings[third]) {
        var sortTeams = [third, second].sort();
        console.log("".concat(first, ", ").concat(standings[first], " pts"));
        console.log("".concat(sortTeams[0], ", ").concat(standings[sortTeams[0]], " pts"));
        console.log("".concat(sortTeams[1], ", ").concat(standings[sortTeams[1]], " pts"));
        // No ties
    }
    else {
        console.log("".concat(first, ", ").concat(standings[first], " pts"));
        console.log("".concat(second, ", ").concat(standings[second], " pts"));
        console.log("".concat(third, ", ").concat(standings[third], " pts"));
    }
    console.log("\n");
};
// The main function that counts up the head-to-head standings every match
var scoreCounter = function (gameData) {
    var games = gameData.split("\n");
    var _a = getTeamsAndNumGames(games), standings = _a[0], numGamesPerDay = _a[1];
    var teams = Object.keys(standings);
    var topTeams = [teams[0], teams[1], teams[2]];
    var day = 1;
    games.forEach(function (game, idx) {
        var teams = game.split(", ");
        var _a = getTeamNameAndScore(teams[0]), team1 = _a[0], score1 = _a[1];
        var _b = getTeamNameAndScore(teams[1]), team2 = _b[0], score2 = _b[1];
        if (score1 > score2) { // Team 1 wins
            standings[team1] += 3;
            standings[team2] += 0;
        }
        else if (score2 > score1) { // Team 2 wins
            standings[team2] += 3;
            standings[team1] += 0;
        }
        else { // Tied game
            standings[team1] += 1;
            standings[team2] += 1;
        }
        updateTopTeams(topTeams, standings, team1);
        updateTopTeams(topTeams, standings, team2);
        if (idx % numGamesPerDay === numGamesPerDay - 1) {
            displayTopTeams(day, standings, topTeams);
            day += 1;
        }
    });
};
var sampleGame = "San Jose Earthquakes 3, Santa Cruz Slugs 3\n\
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
