# Open the score file and save it to a separate variable that we can read
# Declaring some helpful global variables
$scoreFile = File.read("sample-input.txt")
$teamStandings = Hash.new(0)
$topSeeds = ["", "", ""]

# Sample output should look like:
    # San Jose Earthquakes: 2
    # Santa Cruz Slugs: 3
    # Capitola Seahorses: 5
    # Aptos FC: 9
    # Felton Lumberjacks: 7
    # Monterey United: 6

# If you want to use a different input file, uncomment the following line
def customInput
    puts "Please input the file path: "
    input = gets
    $scoreFile = File.read(gets)
end

# Helper function to get all the team names into our hash. Stops once we see
# a team for the second time. Since all the teams MUST play at least once a day,
# we don't have to worry about games being in or out of order
def getNumGames(games)
    teamRecorded = false
    counter = 0

    while !teamRecorded
        game = games[counter].split(", ")
        team1, team2 = game[0][0...-2], game[1][0...-2]
        score1, score2 = game[0][-1], game[1][-1]
        counter += 1

        if $teamStandings.has_key?(team1) or $teamStandings.has_key?(team2)
            teamRecorded = true
        end

        $teamStandings[team1] = 0
        $teamStandings[team2] = 0
    end

    # (Number of games * 2 teams) / number of teams
    return counter - 1

end

# Helper function to check the top 3 teams for each day
def updateStandings(team)
    
    # case $teamStandings[team]
    
    # Beating first
    if $teamStandings[team] > $teamStandings[$topSeeds[0]]
        $topSeeds[1], $topSeeds[2]= $topSeeds[0], $topSeeds[1]
        $topSeeds[0] = team
        # Beating second
    elsif $teamStandings[team] > $teamStandings[$topSeeds[1]] and team != $topSeeds[0]
        $topSeeds[2] = $topSeeds[1]
        $topSeeds[1] = team
        # Beating third
    elsif $teamStandings[team] > $teamStandings[$topSeeds[2]] and team != $topSeeds[0] and team != $topSeeds[1]
        $topSeeds[2] = team
    end
end

# Helper function to display the head to head standings for a given day
def displayTopTeams(day, first, second, third)
    p "Current standings for day #{day}:"
    # Three way tie. Do this first since it has to fulfill two conditions
    # Allows the other conditions to be less messy
    if $teamStandings[first] == $teamStandings[second] and $teamStandings[second] == $teamStandings[third]
        sortPlaces = [$teamStandings[first], $teamStandings[second], $teamStandings[third]].sort
        p "1st: #{first} #{sortPlaces[0]} pts"
        p "1st: #{second} #{sortPlaces[1]} pts"
        p "1st: #{third} #{sortPlaces[2]} pts"
    # First and second tie
    elsif $teamStandings[first] == $teamStandings[second]
        sortPlaces = [$teamStandings[first], $teamStandings[second]].sort
        p "1st: #{first} #{sortPlaces[0]} pts"
        p "1st: #{second} #{sortPlaces[1]} pts"
        p "3rd: #{third} #{$teamStandings[third]} pts"
    # Second and third tie 
    elsif $teamStandings[second] == $teamStandings[third]
        sortPlaces = [$teamStandings[second], $teamStandings[third]].sort
        p "1st: #{first} #{$teamStandings[first]} pts"
        p "3rd: #{second} #{sortPlaces[0]} pts"
        p "3rd: #{third} #{sortPlaces[1]} pts"
    # No Ties
    else
        p "1st: #{first} #{$teamStandings[first]} pts"
        p "2nd: #{second} #{$teamStandings[second]} pts"
        p "3rd: #{third} #{$teamStandings[third]} pts"
    end
    puts
end

# Main function
def scoreSplitter
    # The best way to handle the overall standings is with a hashmap
    # The map should have keys as the team name and values as their overall score
    # First, let's get the data in a readable format with our helper function

    # Uncomment this line if you would like a custom input. Changes $scoreFile
    # customInput()

    games = $scoreFile.split("\n")
    numGamesPerDay = getNumGames(games)
    day = 0

    games.each_with_index do |game, idx|
        # This is just to make things easier to read
        game = game.split(", ")
        team1, team2 = game[0][0...-2], game[1][0...-2]
        score1, score2 = game[0][-1], game[1][-1]

        # Next, we want to get the score and the name for each team
        # We need to ensure that even teams that don't earn a single point are still
        # on the leaderboard
        if score1 > score2      # Team 1 wins
            $teamStandings[team1] += 3
            $teamStandings[team2] += 0      # Now even bad teams are accounted for
        elsif score2 > score1   # Team 2 wins
            $teamStandings[team2] += 3
            $teamStandings[team1] += 0
        else                    # Tied game
            $teamStandings[team1] += 1
            $teamStandings[team2] += 1
        end

        updateStandings(team1)
        updateStandings(team2)

        if idx % numGamesPerDay == numGamesPerDay - 1
            day += 1
            displayTopTeams(day, $topSeeds[0], $topSeeds[1], $topSeeds[2])
        end
        
    end

    $teamStandings

end

puts scoreSplitter