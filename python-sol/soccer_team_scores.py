from collections import defaultdict
import copy

# Declare some helpful global variables
gameFile = open("sample-input.txt", "r")
standings = defaultdict(lambda: 0)
topTeams = ["", "", ""]

# If you would like to use a file other than the sample input
def getCustomFile():
    filePath = input("Please enter the file path (e.g. /Users/me/Documents/sample-input.txt): ")
    gameFile = open(filePath)
    return

# Takes in a string input that contains a team name and their score for that match
def getTeamNameAndScore(str):
    splitWords = str.split(" ")
    return " ".join(splitWords[0:-1]), splitWords[-1]

def getNumGamesPerDay(games):
    numGames = 0

    # Separate the two teams from each game
    for game in games:
        game = game.split(", ")
        team1 = getTeamNameAndScore(game[0])[0]  # Only extracts the team name
        team2 = getTeamNameAndScore(game[1])[0]
        
        if team1 not in standings:
            numGames += 1
        
        standings[team1], standings[team2] = 0, 0

    return numGames

# Updates topTeams if there's a new top 3 team. Otherwise does nothing
def updateTopTeams(team):
    if standings[team] > standings[topTeams[0]]:
        topTeams[0], topTeams[1], topTeams[2] = team, topTeams[0], topTeams[1]
    elif standings[team] > standings[topTeams[1]] and team != topTeams[0]:
        topTeams[1], topTeams[2] = team, topTeams[1]
    elif standings[team] > standings[topTeams[2]] and team != topTeams[0] and team != topTeams[1]:
        topTeams[2] = team
    return

# Call this function after all teams have played for the day
def displayTopTeams(day):
    first, second, third = topTeams   # Make things easier to read
    print(f'Matchday {day!r}')

    if standings[first] == standings[third]:    # Three way tie
        sortPlaces = copy.deepcopy(topTeams)
        sortPlaces.sort()
    elif standings[second] == standings[third]: # 2nd and 3rd tie
        sortPlaces = [second, third]
        sortPlaces.sort()
        sortPlaces.insert(0, first)
    elif standings[first] == standings[second]: # 1st and 2nd tie
        sortPlaces = [first, second]
        sortPlaces.sort()
        sortPlaces.append(third)
    else:                                       # No tie
        sortPlaces = copy.deepcopy(topTeams)
    
    first, second, third = sortPlaces
    print(f"{first!r}, {standings[first]} pts")
    print(f"{second!r}, {standings[second]} pts")
    print(f"{third!r}, {standings[third]} pts")
    print("\n")

def scoreCounter(file):
    games = file.read().split("\n")
    numGamesPerDay = getNumGamesPerDay(games)
    day = 0

    for (idx, game) in enumerate(games):
        game = game.split(", ")
        team1, score1 = getTeamNameAndScore(game[0])
        team2, score2 = getTeamNameAndScore(game[1])

        if score1 > score2:     # Team 1 wins
            standings[team1] += 3
        elif score2 > score1:   # Team 2 wins
            standings[team2] += 3
        else:                   # Tie game
            standings[team1] += 1
            standings[team2] += 1

        updateTopTeams(team1)
        updateTopTeams(team2)

        if idx % numGamesPerDay == numGamesPerDay - 1:
            day += 1
            displayTopTeams(day)

scoreCounter(gameFile)