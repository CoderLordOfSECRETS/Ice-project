//import {DateTime, Interval, Duration} from 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/+esm'
const DateTime = luxon.DateTime;
const Interval = luxon.Interval;
const Duration = luxon.Duration;
//export default schedule
//Placeholder data, will reqire a parser

const allowedTimes = [{ weekday: { startTime: "17:00", endTime: "18:00" }, weekend: { startTime: "7:00", endTime: "19:00" } }, //U7
{ weekday: { startTime: "17:00", endTime: "18:00" }, weekend: { startTime: "7:00", endTime: "19:00" } }, //U9
{ weekday: { startTime: "17:00", endTime: "18:00" }, weekend: { startTime: "7:00", endTime: "19:00" } }, //U10
{ weekday: { startTime: "17:00", endTime: "19:00" }, weekend: { startTime: "7:00", endTime: "19:00" } }, //U11
{ weekday: { startTime: "17:00", endTime: "19:00" }, weekend: { startTime: "7:00", endTime: "19:00" } }, //U12
{ weekday: { startTime: "17:00", endTime: "20:00" }, weekend: { startTime: "7:00", endTime: "20:00" } }, //U13
{ weekday: { startTime: "17:00", endTime: "20:00" }, weekend: { startTime: "7:00", endTime: "20:00" } }, //U14
{ weekday: { startTime: "18:00", endTime: "21:30" }, weekend: { startTime: "8:00", endTime: "21:30" } }, //U15
{ weekday: { startTime: "18:00", endTime: "21:30" }, weekend: { startTime: "8:00", endTime: "21:30" } }, //U16
{ weekday: { startTime: "18:00", endTime: "22:00" }, weekend: { startTime: "15:00", endTime: "22:00" } }] //U18

let iceSlots = [
    { interval: Interval.after(DateTime.local(2024, 10, 3, 3, 30), Duration.fromISO("PT1H30M")), arena: "Fred Barrett", fullIce: true, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 5, 3, 30), Duration.fromISO("PT1H30M")), arena: "Fred Barrett", fullIce: false, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 5, 4, 30), Duration.fromISO("PT1H30M")), arena: "Fred Barrett", fullIce: true, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 10, 1), Duration.fromISO("PT1H30M")), arena: "Fred Barrett", fullIce: true, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 30, 5, 30), Duration.fromISO("PT1H")), arena: "Fred Barrett", fullIce: false, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 9, 10, 45), Duration.fromISO("PT1H")), arena: "Fred Barrett", fullIce: true, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 3, 3, 30), Duration.fromISO("PT1H")), arena: "Metcalfe", fullIce: true, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 4, 3, 30), Duration.fromISO("PT1H")), arena: "Fred Barrett", fullIce: false, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 6, 3, 30), Duration.fromISO("PT1H")), arena: "Fred Barrett", fullIce: true, teamsassigned: { number: 0 } },
    { interval: Interval.after(DateTime.local(2024, 10, 7, 16, 30), Duration.fromISO("PT1H")), arena: "Fred Barrett", fullIce: true, teamsassigned: { number: 0 } }];

let metcalfeGames = [
    { interval: Interval.after(DateTime.local(2024, 10, 3, 5, 15), Duration.fromISO("PT1H30M")), arena: "Fred Barrett", homeTeam: { name: "Metcalfe Jets U15 B1", age: 8, level: "B" }, awayTeam: { name: "Metcalfe Jets U18 B1", age: 10, level: "B" } }];
let metcalfeTeams = [{ name: "Metcalfe Jets U15 B1", age: 8, level: "B" }, { name: "Metcalfe Jets U18 B1", age: 10, level: "B" }, { name: "Metcalfe Jets U9 A", age: 2, level: "A" }];

function assignIceValue() {
    iceSlots.forEach(slot => {
        slot.value = slot.interval.length("hours");
        if (slot.fullIce) {
            slot.value *= 2;
        }
    });
}
assignIceValue();
//function call will need to be bound

function sortGames() {
    metcalfeGames.forEach(game => {
        metcalfeTeams.forEach(team => {
            team.assignedGames = [];
            if (team.name == game.homeTeam.name || game.awayTeam.name) {
                team.assignedGames.push(game);
            }
        });
    });
}

function checkAgeGap(team1, team2) {
    let distance = Math.abs(team1.age - team2.age)
    return distance;
}

function checkLevelGap(team1, team2, abs) {
    function standardizeLevel(team) {
        let level;
        if (team.level.toUpperCase() == "C") {
            level = 0;
        } else if (team.level.toUpperCase() == "B") {
            level = 1;
        } else if (team.level.toUpperCase() == "A") {
            level = 2;
        } else if (team.level.toUpperCase() == "RB") {
            level = 3;
        } else {
            console.error("Unrecognized level!");
        }
        return level;
    }
    let level1 = standardizeLevel(team1);
    let level2 = standardizeLevel(team2);
    if (abs) {
        return Math.abs(level1 - level2);
    } else {
        return level1 - level2
    }
}

function checkAgeTime(age, time) {
    if (time.isWeekend) {
        if (DateTime.fromObject({ year: time.year, month: time.month, day: time.day, hour: parseInt(allowedTimes[age - 1].weekend.startTime.slice(0, 2)), minute: parseInt(allowedTimes[age - 1].weekend.startTime.slice(3)) }) <= time && DateTime.fromObject({ year: time.year, month: time.month, day: time.day, hour: parseInt(allowedTimes[age - 1].weekend.endTime.slice(0, 2)), minute: parseInt(allowedTimes[age - 1].weekend.endTime.slice(3)) }) >= time) {
            return true;
        } else {
            return false;
        }
    } else {
        if (DateTime.fromObject({ year: time.year, month: time.month, day: time.day, hour: parseInt(allowedTimes[age - 1].weekday.startTime.slice(0, 2)), minute: parseInt(allowedTimes[age - 1].weekday.startTime.slice(3)) }) <= time && DateTime.fromObject({ year: time.year, month: time.month, day: time.day, hour: parseInt(allowedTimes[age - 1].weekday.endTime.slice(0, 2)), minute: parseInt(allowedTimes[age - 1].weekday.endTime.slice(3)) }) >= time) {
            return true;
        } else {
            return false;
        }
    }
}

function padInterval(interval, paddingLength) {
    return Interval.merge([Interval.before(interval.start, paddingLength), interval, Interval.after(interval.end, paddingLength)])
}

function rankslot(slot) {
    sortGames();
    slot.rankings = []
    metcalfeTeams.forEach(team => {
        let hasOverlap = false;
        let iceSameDay = 0

        team.assignedGames.forEach(game => {
            if (game.interval.overlaps(padInterval(slot.interval, Duration.fromISOTime("03:00")))) {
                hasOverlap = true;
            }
        });

        if (hasOverlap || !checkAgeTime(team.age, slot.interval.start)) {
            slot.rankings.push({ ranking: 0, name: team.name })
            return; // Continue to the next team
        }

        if (slot.fullIce && slot.teamsassigned.number == 1) {
            //full ice, one team on
            let ageGap = checkAgeGap(slot.teamsassigned.team1, team);
            let levelGap = checkLevelGap(slot.teamsassigned.team1, team);
            // RULE: A team can only move up one age group if the level is same or less
            if (!ageGap == 0 && ageGap > 1) {
                slot.rankings.push({ ranking: 0, name: team.name });
                return;
            } else if (ageGap == 1 && !levelGap >= 0) {
                slot.rankings.push({ ranking: 0, name: team.name });
                return;
            }
        }

        //return here with more ranking criteria
        team.assignedGames.forEach(game => {
            if (game.interval.start.hasSame(slot.interval.start, 'day')) {
                iceSameDay += 1
            }
        });
        if (team.assignedPractices) {
            team.assignedPractices.forEach(practice => {
                if (practice.interval.start.hasSame(slot.interval.start, 'day')) {
                    iceSameDay += 1
                }
            });
        }
        if (iceSameDay == 2) {
            slot.rankings.push({ ranking: 15, name: team.name });
            return;
        } else if (iceSameDay == 1) {
            slot.rankings.push({ ranking: 25, name: team.name });
            return;
        } else if (iceSameDay == 0) {
            slot.rankings.push({ ranking: 100, name: team.name });
            return;
        } else {
            slot.rankings.push({ ranking: 0, name: team.name });
            return;
        }
    });
}

function resetIceValue() {
    metcalfeTeams.forEach(team => {
        team.iceValue = 0;
    });
}

function assignSlots(availiableSlots) {
    resetIceValue()
    availiableSlots.forEach(slot => {
        rankslot(slot);
    });
    metcalfeTeams.forEach(team => {
        let favoriteSlots = { slots: [], ranking: 0 };
        availiableSlots.forEach(slot => {
            let ranking = slot.rankings.filter(ranking => ranking.name === team.name)[0].ranking;
            if (ranking > favoriteSlots.ranking) {
                favoriteSlots = { slots: [slot], ranking: ranking };
            } else if (ranking == favoriteSlots.ranking) {
                favoriteSlots.slots.push(slot);
            }
        });
        team.favoriteSlots = favoriteSlots
        team.iceSlots = []
    });
    //slot distribution

    metcalfeTeams.sort((a, b) => { //sort by ice value, then favorite slots
        if (a.iceValue == b.iceValue || !a.iceValue || !b.iceValue) {
            return a.favoriteSlots.length - b.favoriteSlots.length
        } else {
            return a.iceValue - b.iceValue
        }
    });
    metcalfeTeams.forEach(team => {
        //rethink loop structure
        let boolBreak = false
        function updateSlots(tries) {
            const pos = availiableSlots.indexOf(team.favoriteSlots.slots[tries])
            if (pos < 0) {
                console.warn("missing slot from availiable slots")
                if (tries + 1 > team.favoriteSlots.slots.length) {
                    console.warn("team", team, "is out of slots with", team.iceSlots.length, "slots");
                    boolBreak = true;
                    return;
                } else {
                    updateSlots(tries + 1)
                }
            } else {
                team.iceSlots.push(team.favoriteSlots.slots[tries]);
                availiableSlots.splice(pos, 1);
            }
        }
        if(boolBreak) {return;}
        updateSlots(0)
    });
    if (availiableSlots.length > 0) { assignSlots(availiableSlots); }
}

async function schedule() {
    //add checks and data verification
    assignSlots(iceSlots);
    console.log(metcalfeTeams);
}
