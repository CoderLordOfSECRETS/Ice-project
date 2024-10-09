function isNumber(s) {
    return !isNaN(s) && !isNaN(parseFloat(s));
}

function toBool(string) {
    if (string.toLowerCase() == "true") {
        return true
    } else { return false }
}

async function handleFileUpload(event, type) {
    const element = event.target.elements['upload'];
    const file = element.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            const content = event.target.result;
            if (type == "iceSlots") {
                const parsedSlots = parseIceSlotFile(content)
                console.log("Uploading ice slots:", parsedSlots)
                iceSlots.push(parsedSlots)
                toastr["success"]("Ice slots uploaded successfully!", "Success")
            } else if (type == "games") {
                const parsedGames = parseGamesFile(content)
                console.log("Uploading games:", parsedGames)
                Games.push(parsedGames)
                toastr["success"]("Games uploaded successfully!", "Success")
            } else if (type == "teams") {
                const namesArray = content.split(',').map(name => name.trim());
                let internalTeams = []
                namesArray.forEach(team => {
                    internalTeams.push(team)
                    Teams.push(parseTeam(team))
                });
                console.log("Uploading teams:", internalTeams)
                toastr["success"]("Teams uploaded successfully!", "Success")
            } else if (type == "blackBoxes") {
                const parsedBlackBoxes = parseBlackBoxFile(content)
                console.log("Uploading games:", parsedBlackBoxes)
                Games.push(parsedBlackBoxes)
                toastr["success"]("Black boxes uploaded successfully!", "Success")
            } else {
                console.error("invalid file type: internal")
            }
        };
    } else {
        console.error("No file selected.");
        toastr["error"]("No file selected", "Error")
    }
}

function parseTeam(teamName) {
    //assumes format {name} U{age} {level}1
    try {
        let age, level
        const uPos = teamName.lastIndexOf("U")
        if (isNumber(teamName.charAt(uPos + 2))) {
            age = parseInt(teamName.slice(uPos + 1, uPos + 3))
            level = teamName.slice(uPos + 4, uPos + 5)
        } else {
            age = parseInt(teamName.slice(uPos + 1, uPos + 2))
            level = teamName.slice(uPos + 3, uPos + 4)
        }

        if (age == 7) {
            age = 1
        } else if (age == 18) {
            age = 10
        } else {
            age = age - 7
        }

        return { name: teamName, age: age, level: level }
    } catch (error) {
        console.error("Error parsing ice slots:", error.message);
        toastr["error"]("Invalid Ice slot file!", "Error")
        return {};
    }
}

function parseIceSlotFile(content) {
    try {
        const iceSlots = content.split("\n").slice(1) // Remove header line
            .map((line, index) => {
                const [startDateTime, endDateTime, fullIce, arena] = line.split(",");

                if (!startDateTime || !endDateTime || fullIce === undefined || !arena) {
                    console.error(
                        `Skipped invalid ice slot data at line ${index + 2
                        }: Incomplete data.`,
                        toastr["warning"](`invalid ice slot data at line ${index + 2}: Incomplete data.`, "Skipped Data")
                    );
                    return null;
                }
                let luxStartDateTime = DateTime.fromISO(startDateTime.trim())
                let luxEndDateTime = DateTime.fromISO(endDateTime.trim())

                if (
                    !luxStartDateTime ||
                    !luxEndDateTime.isValid() ||
                    !luxStartDateTime ||
                    !luxEndDateTime.isValid()
                ) {
                    console.error(
                        `Skipped invalid ice slot data at line ${index + 2
                        }: Invalid date or time format.`,
                        toastr["warning"](`invalid ice slot data at line ${index + 2}: Invalid date or time format.`, "Skipped Data")
                    );
                    return null;
                }

                if (luxEndDateTime < luxStartDateTime) {
                    console.error(
                        `Skipped invalid ice slot data at line ${index + 2
                        }: End time is before start time.`,
                        toastr["warning"](`invalid ice slot data at line ${index + 2}: End time is before start time.`, "Skipped Data")
                    );
                    return null;
                }

                let luxinterval = Interval.fromDateTimes(luxStartDateTime, luxEndDateTime)
                let parsedArena = arena.trim()

                return {
                    interval: luxinterval,
                    arena: parsedArena,
                    fullIce: toBool(fullIce.trim())
                };
            })
            .filter((slot) => slot !== null); // Remove null entries
        return iceSlots;
    } catch (error) {
        console.error("Error parsing ice slots:", error.message);
        toastr["error"]("Invalid Ice slot file!", "Error")
        return [];
    }
}

function parseGamesFile(content) {
    try {
        const games = content.split("\n").slice(1) // Remove header line
            .map((line, index) => {
                const [startDateTime, endDateTime, homeTeam, awayTeam, arena] = line.split(",");

                if (!startDateTime || !endDateTime || !homeTeam || !awayTeam || !arena) {
                    console.error(
                        `Skipped invalid games data at line ${index + 2
                        }: Incomplete data.`,
                        toastr["warning"](`invalid games data at line ${index + 2}: Incomplete data.`, "Skipped Data")
                    );
                    return null;
                }
                let luxStartDateTime = DateTime.fromISO(startDateTime.trim())
                let luxEndDateTime = DateTime.fromISO(endDateTime.trim())

                if (
                    !luxStartDateTime ||
                    !luxEndDateTime.isValid() ||
                    !luxStartDateTime ||
                    !luxEndDateTime.isValid()
                ) {
                    console.error(
                        `Skipped invalid games data at line ${index + 2
                        }: Invalid date or time format.`,
                        toastr["warning"](`invalid games data at line ${index + 2}: Invalid date or time format.`, "Skipped Data")
                    );
                    return null;
                }

                if (luxEndDateTime < luxStartDateTime) {
                    console.error(
                        `Skipped invalid games data at line ${index + 2
                        }: End time is before start time.`,
                        toastr["warning"](`invalid games data at line ${index + 2}: End time is before start time.`, "Skipped Data")
                    );
                    return null;
                }

                let luxinterval = Interval.fromDateTimes(luxStartDateTime, luxEndDateTime)
                let parsedHomeTeam = parseTeam(homeTeam.trim())
                let parsedAwayTeam = parseTeam(awayTeam.trim())
                let parsedArena = arena.trim()

                return {
                    interval: luxinterval,
                    homeTeam: parsedHomeTeam,
                    awayTeam: parsedAwayTeam,
                    arena: parsedArena
                };
            })
            .filter((slot) => slot !== null); // Remove null entries
        return games;
    } catch (error) {
        console.error("Error parsing games:", error.message);
        toastr["error"]("Invalid games file!", "Error")
        return [];
    }
}

function parseBlackBoxFile(content) {
    try {
        const blackBoxes = content.split("\n").slice(1) // Remove header line
            .map((line, index) => {
                const [startDateTime, endDateTime, team] = line.split(",");

                if (!startDateTime || !endDateTime || !team) {
                    console.error(
                        `Skipped invalid black box data at line ${index + 2
                        }: Incomplete data.`,
                        toastr["warning"](`invalid black box data at line ${index + 2}: Incomplete data.`, "Skipped Data")
                    );
                    return null;
                }
                let luxStartDateTime = DateTime.fromISO(startDateTime)
                let luxEndDateTime = DateTime.fromISO(endDateTime)

                if (
                    !luxStartDateTime ||
                    !luxEndDateTime.isValid() ||
                    !luxStartDateTime ||
                    !luxEndDateTime.isValid()
                ) {
                    console.error(
                        `Skipped invalid black box data at line ${index + 2
                        }: Invalid date or time format.`,
                        toastr["warning"](`invalid black box data at line ${index + 2}: Invalid date or time format.`, "Skipped Data")
                    );
                    return null;
                }

                if (luxEndDateTime < luxStartDateTime) {
                    console.error(
                        `Skipped invalid black box data at line ${index + 2
                        }: End time is before start time.`,
                        toastr["warning"](`invalid black box data at line ${index + 2}: End time is before start time.`, "Skipped Data")
                    );
                    return null;
                }

                let luxinterval = Interval.fromDateTimes(luxStartDateTime, luxEndDateTime)

                return {
                    interval: luxinterval,
                    team: parseTeam(team.trim())
                };
            })
            .filter((slot) => slot !== null); // Remove null entries
        return blackBoxes;
    } catch (error) {
        console.error("Error parsing black boxes:", error.message);
        toastr["error"]("Invalid black box file!", "Error")
        return [];
    }
}

//event listener zone
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('slot-input-type-Upload-form').addEventListener('submit', function (event) {
        event.preventDefault();
        handleFileUpload(event, 'iceSlots');
    });

    document.getElementById('games-input-type-Upload-form').addEventListener('submit', function (event) {
        event.preventDefault();
        handleFileUpload(event, 'games');
    });

    document.getElementById('teams-input-type-Upload-form').addEventListener('submit', function (event) {
        event.preventDefault();
        handleFileUpload(event, 'teams');
    });

    document.getElementById('Black_Boxes-input-type-Upload-form').addEventListener('submit', function (event) {
        event.preventDefault();
        handleFileUpload(event, 'blackBoxes');
    });
});
