var HIGHESTSTAT = 99;

// limits number inputs
function limit (num, minNumber) {
	"use strict";
	// check if value is outside of the limits
	if (!$.isNumeric(num.value) || num.value <= minNumber) {
		num.value = minNumber;
	} else if (num.value >= HIGHESTSTAT) {
		num.value = HIGHESTSTAT;
	} else if (Math.floor(num.value) !== num.value) {
		num.value = Math.floor(num.value);
	}
}

// put options in the stat selects
function setupStats () {
	"use strict";
	var options = "<option value='0'>0</option>";
	var negOptions = "<option value='0'>0</option>";
	
	for (var i = 2; i <= 7; i++) {
		options += "<option value='" + i.toString() + "'>" + i.toString() + "</option>";
		negOptions += "<option value='-" + i.toString() + "'>-" + i.toString() + "</option>";
	}
	$(".stat-bonus").html(options);
	$(".stat-penalty").html(negOptions);
	
	for (i = 8; i <= 12; i++) {
		options += "<option value='" + i.toString + "'>" + i.toString() + "</option>";
	}
	$(".stat-spur").html(options);
}

// displays passive skills
// charInfo contains the character info, charNum determines which panel to display on, type determines the skill type
function showSkills(charInfo, charNum, type) {
	"use strict";
	if (charInfo.hasOwnProperty("passive_" + type)) {
		var skills = "";
		$("#passive-" + type + "-" + charNum).removeAttr("disabled");
		$("#skills-" + charNum + " .passive-" + type + "-label").css("color", "white");
		
		for (var i = 0; i < charInfo["passive_" + type].length; i++) {
			var skillName = charInfo["passive_" + type][i];
			skills += "<option value='" + skillName + "'>" + skillName + "</option>";
		}
		skills += "<option value='None'>None</option>";
		$("#passive-" + type + "-" + charNum).html(skills);
		$("#passive-" + type + "-" + charNum + " option:eq(0)").attr("selected", "selected");
	} else { // no passive skill of the given type
		$("#passive-" + type + "-" + charNum).html("<option value='None'>None</option>");
		$("#passive-" + type + "-" + charNum).attr("disabled", "disabled");
		$("#skills-" + charNum + " .passive-" + type + "-label").css("color", "#5b5b5b");
	}
}

// shows extra weapon info
// selectedWeapon is the weapon to display, weaponInfo contains all weapon data, charNum determines the panel, set updateAtk to true to update the character's atk value
function showWeapon(selectedWeapon, weaponInfo, charNum, updateAtk) {
	"use strict";
	
	var mt = 0;
	if (weaponInfo.hasOwnProperty(selectedWeapon)) {
		// show weapon type
		$("#weapon-type-" + charNum).text(weaponInfo[selectedWeapon].type);

		// show weapon might
		$("#weapon-might-" + charNum).text(weaponInfo[selectedWeapon].might);
		mt = weaponInfo[selectedWeapon].might;

		// show weapon range
		$("#weapon-range-" + charNum).text(weaponInfo[selectedWeapon].range);

		// show magical data
		if (weaponInfo[selectedWeapon].magical) {
			$("#weapon-magical-" + charNum).text("Yes");
		} else {
			$("#weapon-magical-" + charNum).text("No");
		}
	} else {	// weapon not found
		$("#weapon-type-" + charNum).text("n/a");
		$("#weapon-might-" + charNum).text("n/a");
		$("#weapon-range-" + charNum).text("n/a");
		$("#weapon-magical-" + charNum).text("n/a");
	}
	
	// update atk
	if (updateAtk) {
		var atk = parseInt($("#atk-" + charNum).val()) + mt - parseInt($("#weapon-might-" + charNum).data("oldmt"));
		atk = Math.min(atk, HIGHESTSTAT);
		atk = Math.max(atk, 1);
		$("#atk-" + charNum).val(atk);
	}
	$("#weapon-might-" + charNum).data("oldmt", mt.toString());
}

// show special cooldown values
// selectedSpecial is the special that is being displayed, specInfo contains all special data, charNum determines the panel
function showSpecCooldown (selectedSpecial, specInfo, charNum) {
	"use strict";
	if (specInfo.hasOwnProperty(selectedSpecial)) {
		$("#spec-cooldown-" + charNum).removeAttr("disabled");
		$("#spec-cooldown-line-" + charNum).css("color", "white");
		$("#spec-cooldown-" + charNum).val(specInfo[selectedSpecial].cooldown);
		$("#spec-cooldown-max-" + charNum).text(specInfo[selectedSpecial].cooldown);
	} else { // special not found
		$("#spec-cooldown-" + charNum).val("0");
		$("#spec-cooldown-" + charNum).attr("disabled", "disabled");
		$("#spec-cooldown-max-" + charNum).text("x");
		$("#spec-cooldown-line-" + charNum).css("color", "#5b5b5b");
	}
}

// displays character information in the character panels
// charInfo contains only the character info to display, weaponInfo contains all weapon data, specInfo contains all special data, charNum determines which panel to display on
function displayChar(charInfo, weaponInfo, specInfo, charNum) {
	"use strict";
	if (!charInfo.hasOwnProperty("move_type")) { // no info -> custom option
		// enable inputs
		$("#extra-char-info-" + charNum).css("color", "white");
		$("#skills-" + charNum + " label").css("color", "white");
		$("#extra-char-info-" + charNum + " select").removeAttr("disabled");
		$("#skills-" + charNum + " select").removeAttr("disabled");
		
		// show collapsed section
		$("#extra-char-info-" + charNum).show(700);
		
		// show all skills and weapons
		return;
	}
	
	// grey out disabled input fields
	$("#extra-char-info-" + charNum).css("color", "#5b5b5b");
	$("#extra-char-info-" + charNum + " select").attr("disabled", "disabled");
	
	// show color
	$("#color-" + charNum).val(charInfo.color);
	
	// show move type
	$("#move-type-" + charNum).val(charInfo.move_type);
	
	// show dragon attribute
	if (charInfo.hasOwnProperty("dragon")) {
		$("#dragon-" + charNum).val("Yes");
	} else {
		$("#dragon-" + charNum).val("No");
	}
	
	// show weapon
	var selectedWeapon = charInfo.weapon[0];
	var weapons = "<option value='" + selectedWeapon + "'>" + selectedWeapon + "</option>";
	for (var weaponIndex = 1; weaponIndex < charInfo.weapon.length; weaponIndex++) {
		weapons += "<option value='" + charInfo.weapon[weaponIndex] + "'>" + charInfo.weapon[weaponIndex] + "</option>";
	}
	weapons += "<option value='None'>None</option>";
	$("#weapon-" + charNum).html(weapons);
	$("#weapon-" + charNum + " option:eq(0)").attr("selected", "selected");
	
	// show extra weapon info
	showWeapon(selectedWeapon, weaponInfo, charNum, false);
	
	// show stats
	$("#hp-" + charNum + ", #curr-hp-" + charNum).val(charInfo.hp);
	$(".hp-" + charNum + "-read").text(charInfo.hp);
	$("#atk-" + charNum).val(charInfo.atk);
	$("#spd-" + charNum).val(charInfo.spd);
	$("#def-" + charNum).val(charInfo.def);
	$("#res-" + charNum).val(charInfo.res);
	
	// reset buffs/debuffs
	$("#stats-" + charNum + " .stat-bonus, #stats-" + charNum + " .stat-penalty, #stats-" + charNum + " .stat-spur").val(0);
	
	// show passive skills
	showSkills(charInfo, charNum, 'a');
	showSkills(charInfo, charNum, 'b');
	showSkills(charInfo, charNum, 'c');
	
	// show command skill
	if (charInfo.hasOwnProperty("command")) {
		$("#command-" + charNum).removeAttr("disabled");
		$("#skills-" + charNum + " .command-label").css("color", "white");
		
		var selectedCommand = charInfo.command[0];
		var commands = "<option value='" + selectedCommand + "'>" + selectedCommand + "</option>";
		for (var commandIndex = 1; commandIndex < charInfo.command.length; commandIndex++) {
			commands += "<option value='" + charInfo.command[commandIndex] + "'>" + charInfo.command[commandIndex] + "</option>";
		}
		commands += "<option value='None'>None</option>";
		$("#command-" + charNum).html(commands);
		$("#command-" + charNum + " option:eq(0)").attr("selected", "selected");
	} else {
		$("#command-" + charNum).html("<option value='None'>None<option>");
		$("#command-" + charNum).attr("disabled", "disabled");
		$("#skills-" + charNum + " .command-label").css("color", "#5b5b5b");
	}
	
	// show special skill
	if (charInfo.hasOwnProperty("special")) {
		$("#special-" + charNum).removeAttr("disabled");
		$("#skills-" + charNum + " .special-label").css("color", "white");
		
		var selectedSpecial = charInfo.special[0];
		var specials = "<option value='" + selectedSpecial + "'>" + selectedSpecial + "</option>";
		for (var specIndex = 1; specIndex < charInfo.special.length; specIndex++) {
			specials += "<option value='" + charInfo.special[specIndex] + "'>" + charInfo.special[specIndex] + "</option>";
		}
		specials += "<option value='None'>None</option>";
		$("#special-" + charNum).html(specials);
		$("#special-" + charNum + " option:eq(0)").attr("selected", "selected");
		
		// show cooldown values
		showSpecCooldown(selectedSpecial, specInfo, charNum);
		
	} else {
		$("#special-" + charNum).html("<option value='None'>None<option>");
		$("#special-" + charNum).attr("disabled", "disabled");
		$("#spec-cooldown-" + charNum).val("0");
		$("#spec-cooldown-" + charNum).attr("disabled", "disabled");
		$("#skills-" + charNum + " .special-label").css("color", "#5b5b5b");
		$("#spec-cooldown-max-" + charNum).text("x");
		$("#spec-cooldown-line-" + charNum).css("color", "#5b5b5b");
	}
}

// determines if the attacker has triangle advantage
// returns 1 if advamtage, -1 if disadvantage, 0 if neither
function triAdvantage (attackColor, defendColor) {
	"use strict";
	if (attackColor === defendColor || attackColor === "Colorless" || defendColor === "Colorless") {
		return 0;
	} else if ((attackColor === "Red" && defendColor === "Green") || (attackColor === "Green" && defendColor === "Blue") || (attackColor === "Blue" && defendColor === "Red")) {
		return 1;
	}
	
	return -1;
}

// calculates how much damage the attacker will do to the defender in just one attack phase
// battleInfo contains all necessary info for calculation, initiator determines if the battle initiator is attacking or not
// logIntro describes the attack, weaponInfo contains all weapon data
// returns the results of the attack phase with an updated log message
function singleCombat(battleInfo, initiator, logIntro, weaponInfo) {
	"use strict";
	
	// log message
	battleInfo.logMsg += "<li class='battle-interaction'>";
	
	// attacker/defender info
	var defClass;
	var attacker;
	var defender;
	
	if (initiator) {
		defClass = "defender";
		attacker = battleInfo.attacker;
		defender = battleInfo.defender;
	} else {
		defClass = "attacker";
		attacker = battleInfo.defender;
		defender = battleInfo.attacker;
	}
	
	battleInfo.logMsg += "<strong>" + attacker.name + "</strong> " + logIntro +". ";
	
	// determine attack modifier
	var atkPower = attacker.atk;
	var triAdv = triAdvantage(attacker.color, defender.color);
	var oldHP = defender.currHP;
	var atkMod = 1;
	var roundUp = false;
	
	// triangle advantage
	if (triAdv > 0) {
		atkMod = 1.2;
		battleInfo.logMsg += "Triangle advantage boosts attack by 20%. ";
	} else if (triAdv < 0) {
		atkMod = 0.8;
		roundUp = true;
		battleInfo.logMsg += "Triangle disadvantage reduces attack by 20%. ";
	}
	
	// super effectiveness against movement types
	if (weaponInfo[attacker.weaponName].hasOwnProperty("move_effective") && weaponInfo[attacker.weaponName].move_effective === defender.moveType) {
		atkMod *= 1.5;
		battleInfo.logMsg += "Effectiveness against " + defender.moveType + " boosts attack by 50%. ";
	}
	
	// calculate attack
	if (atkMod < 1 || (atkMod > 1 && roundUp)) {
		atkPower = Math.ceil(attacker.atk * atkMod);
	} else if (atkMod > 1) {
		atkPower = Math.floor(attacker.atk * atkMod);
	}
	
	// calculate damage
	var dmg = 0;
	if (attacker.magical) {
		dmg = Math.max(atkPower - defender.res, 0);
		// halve staff damage
		if (attacker.type === "Staff") {
			dmg = Math.floor(dmg / 2);
		}
	} else {
		dmg = Math.max(atkPower - defender.def, 0);
	}
	
	if (initiator && weaponInfo[attacker.weaponName].hasOwnProperty("brave")) {
		battleInfo.logMsg += attacker.weaponName + " grants double attack. <span class='dmg'><strong>" + dmg.toString() + " × 2 damage dealt.</strong><br>";

	} else {
		battleInfo.logMsg += "<span class='dmg'><strong>" + dmg.toString() + " damage dealt.</strong><br>";
	}
	
	defender.currHP = Math.max(defender.currHP - dmg, 0);
	battleInfo.logMsg += "<span class='" + defClass + "'><strong>" + defender.name + " HP:</strong> " + oldHP.toString() + " → " + defender.currHP.toString() + "</span></li>";
	
	// store info
	if (initiator) {
		battleInfo.attacker = attacker;
		battleInfo.defender = defender;
	} else {
		battleInfo.attacker = defender;
		battleInfo.defender = attacker;
	}
	
	return battleInfo;
}

// simulates a battle between the characters currently on display and outputs to the battle log and results section
// charInfo contains all character data, weaponInfo contains all weapon data, specInfo contains all special data
function simBattle(charInfo, weaponInfo, specInfo) {
	"use strict";
	
	// check if attacker has a weapon, if not no attack
	if ($("#weapon-1").val() === "None") {
		$("#interaction-list").hide().html("<li class='battle-interaction-final'><strong>" + $("#char-1").val() + "</strong> does not have a weapon and cannot attack.</li>");
		$(".hp-remain-block").hide();
		$("#hp-remain-1").text($("#curr-hp-1").val().toString());
		$("#hp-remain-2").text($("#curr-hp-2").val().toString());
		$("#interaction-list").fadeIn("slow");
		$(".hp-remain-block").fadeIn("slow");
		return;
	}
	
	// contains both attacker, defender info and battle log messages
	var battleInfo = {};
	battleInfo.attacker = {};
	battleInfo.defender = {};
	battleInfo.logMsg = "";
	
	// get all attacker info
	battleInfo.attacker.name = $("#char-1").val();
	battleInfo.attacker.color = $("#color-1").val();
	battleInfo.attacker.moveType = $("#move-type-1").val();
	battleInfo.attacker.weaponName = $("#weapon-1").val();
	battleInfo.attacker.type = $("#weapon-type-1").text();
	battleInfo.attacker.range = parseInt($("#weapon-range-1").text());
	
	if ($("#weapon-magical-1").text() === "Yes") {
		battleInfo.attacker.magical = true;
	} else {
		battleInfo.attacker.magical = false;
	}
	
	battleInfo.attacker.currHP = parseInt($("#curr-hp-1").val());
	battleInfo.attacker.atk = parseInt($("#atk-1").val()) + parseInt($("#atk-bonus-1").val()) + parseInt($("#atk-penalty-1").val()) + parseInt($("#atk-spur-1").val());
	battleInfo.attacker.spd = parseInt($("#spd-1").val()) + parseInt($("#spd-bonus-1").val()) + parseInt($("#spd-penalty-1").val()) + parseInt($("#spd-spur-1").val());
	battleInfo.attacker.def = parseInt($("#def-1").val()) + parseInt($("#def-bonus-1").val()) + parseInt($("#def-penalty-1").val()) + parseInt($("#def-spur-1").val());
	battleInfo.attacker.res = parseInt($("#res-1").val()) + parseInt($("#res-bonus-1").val()) + parseInt($("#res-penalty-1").val()) + parseInt($("#res-spur-1").val());
	
	// get all defender info
	battleInfo.defender.name = $("#char-2").val();
	battleInfo.defender.color = $("#color-2").val();
	battleInfo.defender.moveType = $("#move-type-2").val();
	battleInfo.defender.weaponName = $("#weapon-2").val();
	
	
	if (battleInfo.defender.weaponName !== "None") {
		battleInfo.defender.type = $("#weapon-type-2").text();
		battleInfo.defender.range = parseInt($("#weapon-range-2").text());

		if ($("#weapon-magical-2").text() === "Yes") {
			battleInfo.defender.magical = true;
		} else {
			battleInfo.defender.magical = false;
		}
	}
	
	battleInfo.defender.currHP = parseInt($("#curr-hp-2").val());
	battleInfo.defender.atk = parseInt($("#atk-2").val()) + parseInt($("#atk-bonus-2").val()) + parseInt($("#atk-penalty-2").val()) + parseInt($("#atk-spur-2").val());
	battleInfo.defender.spd = parseInt($("#spd-2").val()) + parseInt($("#spd-bonus-2").val()) + parseInt($("#spd-penalty-2").val()) + parseInt($("#spd-spur-2").val());
	battleInfo.defender.def = parseInt($("#def-2").val()) + parseInt($("#def-bonus-2").val()) + parseInt($("#def-penalty-2").val()) + parseInt($("#def-spur-2").val());
	battleInfo.defender.res = parseInt($("#res-2").val()) + parseInt($("#res-bonus-2").val()) + parseInt($("#res-penalty-2").val()) + parseInt($("#res-spur-2").val());
	
	// attacker initiates
	battleInfo = singleCombat(battleInfo, true, "attacks", weaponInfo);
	
	// defender will try to counter-attack if they haven't been ko'd
	if (battleInfo.defender.currHP > 0) {
		// defender must be in range to counter-attack
		if (battleInfo.defender.weaponName !== "None" && battleInfo.defender.range === battleInfo.attacker.range) {
			battleInfo = singleCombat(battleInfo, false, "counter-attacks", weaponInfo);
		} else {
			battleInfo.logMsg += "<li class='battle-interaction'><strong>" + battleInfo.defender.name + "</strong> " + " is unable to counter-attack.</li>";
		}
		
		// if attacker hasn't been ko'd, check for follow ups
		if (battleInfo.attacker.currHP > 0) {
			if (battleInfo.attacker.spd >= battleInfo.defender.spd + 5) { // attacker follows up
				battleInfo = singleCombat(battleInfo, true, "makes a follow-up attack", weaponInfo);
			} else if ((battleInfo.defender.weaponName) !== "None" && (battleInfo.defender.spd >= battleInfo.attacker.spd + 5) && (battleInfo.defender.range === battleInfo.attacker.range)) { 
				// defender follows up
				battleInfo = singleCombat(battleInfo, false, "makes a follow-up attack", weaponInfo);
			}
		}
	}
	
	// display results
	$("#interaction-list").hide().html(battleInfo.logMsg);
	$(".hp-remain-block").hide();
	$("#hp-remain-1").text(battleInfo.attacker.currHP.toString());
	$("#hp-remain-2").text(battleInfo.defender.currHP.toString());
	$("#interaction-list").children().last().removeClass("battle-interaction").addClass("battle-interaction-final");
	$("#interaction-list").fadeIn("slow");
	$(".hp-remain-block").fadeIn("slow");
}

// get JSON data and simulate battle
function getDataAndSim() {
	"use strict";
	$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
				simBattle(charInfo, weaponInfo, specInfo);
			});
		});
	});
}

// put options in the character selects
function setupChars() {
	"use strict";
	
	// stores all character options
	var options = "";
	
	// retrieve characters and add them to the list of options
	$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
				for (var key in charInfo) {
					if (charInfo.hasOwnProperty(key)) {
						options += "<option value=\"" + key + "\">" + key + "</option>";
					}
				}

				// add to html
				$(".char-selector").html(options);

				// set default characters
				$("#char-1 option:eq(0)").attr("selected", "selected");
				displayChar(charInfo[$("#char-1").val()], weaponInfo, specInfo, "1");
				$("#char-2 option:eq(1)").attr("selected", "selected");
				displayChar(charInfo[$("#char-2").val()], weaponInfo, specInfo, "2");
				
				// simulate initial battle
				simBattle(charInfo, weaponInfo, specInfo);
			});
		});
	});
}

// setup inital page
$(document).ready( function () {
	"use strict";	
	
	// setup show/hide buttons
	$(".collapse-button").on("click", function() {
		// toggle a section
		$("#" + $(this).data("section")).toggle(700);
	});

	// setup number input changes
	$(".more-than-zero").on("change", function () {
		limit(this, 1);	
	});
	$(".zero-or-more").on("change", function () {
		limit(this, 0);	
	});

	// setup hp value updates
	$(".hp-stat").on("change", function () {
		// old value
		var oldHP = parseInt($("#" + this.id + "-denom").text());

		// update hp value in rest of the page
		$("." + this.id + "-read").text(this.value);

		// check if current hp needs to be updated as well
		if ((this.value < parseInt($("#curr-" + this.id).val())) || parseInt($("#curr-" + this.id).val()) === oldHP) {
			$("#curr-" + this.id).val(this.value);
		}
		
		getDataAndSim();
	});
	$(".curr-hp-val").on("change", function () {
		// current hp cannot be greater than base hp
		var baseHP = parseInt($("#hp-" + $(this).data("charnum")).val());
		if (this.value > baseHP) {
			this.value = baseHP;
		}
		
		getDataAndSim();
	});
	
	// setup special cooldown updates
	$(".spec-cool").on("change", function () {
		var maxCooldown = parseInt($("#spec-cooldown-max-" + $(this).data("charnum")).text());
		if (this.value > maxCooldown) {
			this.value = maxCooldown;
		}
		
		getDataAndSim();
	});
	
	// setup initial display
	setupStats();
	setupChars();
	
	// setup character select
	$("#char-1").on("change", function () {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
				$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
					displayChar(charInfo[$("#char-1").val()], weaponInfo, specInfo, "1");
					simBattle(charInfo, weaponInfo, specInfo);
				});
			});
		});
	});
	$("#char-2").on("change", function () {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
				$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
					displayChar(charInfo[$("#char-2").val()], weaponInfo, specInfo, "2");
					simBattle(charInfo, weaponInfo, specInfo);
				});
			});
		});
	});
	
	// setup weapon select
	$("#weapon-1").on("change", function () {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
				$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
					showWeapon($("#weapon-1").val(), weaponInfo, "1", true);
					simBattle(charInfo, weaponInfo, specInfo);
				});
			});
		});
	});
	$("#weapon-2").on("change", function () {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
				$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
					showWeapon($("#weapon-2").val(), weaponInfo, "2", true);
					simBattle(charInfo, weaponInfo, specInfo);
				});
			});
		});
	});
	
	// setup special select
	$("#special-1").on("change", function () {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
				$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
					showSpecCooldown($("#special-1").val(), specInfo, "1");
					simBattle(charInfo, weaponInfo, specInfo);
				});
			});
		});
	});
	$("#special-2").on("change", function () {
		$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/char.json", function(charInfo) {
			$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/weapon.json", function(weaponInfo) {
				$.getJSON("https://rocketmo.github.io/feh-damage-calc/data/special.json", function(specInfo) {
					showSpecCooldown($("#special-2").val(), specInfo, "2");
					simBattle(charInfo, weaponInfo, specInfo);
				});
			});
		});
	});
	
	// setup other battle value changes
	$(".battle-val").on("change", function () {
		getDataAndSim();
	});
});
