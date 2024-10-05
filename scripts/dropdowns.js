document.addEventListener('DOMContentLoaded', function () {
    const slotsTypeDropdown = document.getElementById("slot-input-type");
    const slotsUploadDiv = document.getElementById("slot-input-type-Upload");
    const slotsManualDiv = document.getElementById("slot-input-type-Manual");

    const gamesTypeDropdown = document.getElementById("games-input-type")
    const gamesUploadDiv = document.getElementById("games-input-type-Upload")
    const gamesTTMDiv = document.getElementById("games-input-type-ttmWebLink")
    const gamesManualDiv = document.getElementById("games-input-type-Manual")

    const teamsTypeDropdown = document.getElementById("teams-input-type")
    const teamsUploadDiv = document.getElementById("teams-input-type-Upload")
    const teamsTTMDiv = document.getElementById("teams-input-type-ttmWebLink")
    const teamsManualDiv = document.getElementById("teams-input-type-Manual")

    const Black_BoxesTypeDropdown = document.getElementById("Black_Boxes-input-type");
    const Black_BoxesUploadDiv = document.getElementById("Black_Boxes-input-type-Upload");
    const Black_BoxesManualDiv = document.getElementById("Black_Boxes-input-type-Manual");

    function toggleDivs(dropdown, div1, div2, div3) {
        if (dropdown.value === 'Upload') {
            div1.style.display = 'block';
            div2.style.display = 'none';
            if (div3) { div3.style.display = 'none'; }
        } else if (dropdown.value === 'ttmWebLink') {
            div1.style.display = 'none';
            div2.style.display = 'block';
            if (div3) { div3.style.display = 'none'; }
        } else if (dropdown.value === 'Manual') {
            div1.style.display = 'none';
            if (div3) { 
                div2.style.display = 'none';
                div3.style.display = 'block'; 
            } else {
                div2.style.display = 'block';
            }
        }
    }

    // Assign event handlers
    slotsTypeDropdown.onchange = () => toggleDivs(slotsTypeDropdown, slotsUploadDiv, slotsManualDiv);
    toggleDivs(slotsTypeDropdown, slotsUploadDiv, slotsManualDiv);

    gamesTypeDropdown.onchange = () => toggleDivs(gamesTypeDropdown, gamesUploadDiv, gamesTTMDiv, gamesManualDiv);
    toggleDivs(gamesTypeDropdown, gamesUploadDiv, gamesTTMDiv, gamesManualDiv);

    teamsTypeDropdown.onchange = () => toggleDivs(teamsTypeDropdown, teamsUploadDiv, teamsTTMDiv, teamsManualDiv);
    toggleDivs(teamsTypeDropdown, teamsUploadDiv, teamsTTMDiv, teamsManualDiv);

    Black_BoxesTypeDropdown.onchange = () => toggleDivs(Black_BoxesTypeDropdown, Black_BoxesUploadDiv, Black_BoxesManualDiv);
    toggleDivs(Black_BoxesTypeDropdown, Black_BoxesUploadDiv, Black_BoxesManualDiv);
});

function updateTeamDropdowns() {
    const teamDropdowns = [{obj:document.getElementById("games-input-type-Manual-form-homeTeam"),metcalfe: false}, 
        {obj:document.getElementById("games-input-type-Manual-form-awayTeam"),metcalfe:false},
    {obj:document.getElementById("Black_Boxes-input-type-Manual-form-affectedTeam"),metcalfe:true}]
    teamDropdowns.forEach(dropdown => {
        dropdown.obj.innerHTML = ""; // Clear existing options
        if(dropdown.metcalfe) {
        // Populate dropdown with Metcalfe teams
        metcalfeTeams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.name;
            option.textContent = team.name;
            dropdown.obj.appendChild(option);
        });
    } else {
        Teams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.name;
            option.textContent = team.name;
            dropdown.obj.appendChild(option);
        });
    }
    });
}