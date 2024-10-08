function handleFileUpload(element, type) {
    const file = element.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            const content = event.target.result;
            if (type == "iceSlots") {
                const parsedSlots = parseIceSlotFile(content)

            } else if (type == "games") {
                //parse games file
            }
        };
    } else {
        console.error("No file selected.");
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
                let luxStartDateTime = DateTime.fromISO(startDateTime)
                let luxEndDateTime = DateTime.fromISO(endDateTime)

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
                    fullIce: fullIce
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