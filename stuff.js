initSolver2x2();
var timeArray = [];
var scrambleArray = [];

document.title = "clean timer";
function update_bg() {
	addX = (window.innerWidth/2 - event.clientX)/16;
	addY = (window.innerHeight/2 - event.clientY)/16;
	// console.log(addX + ' ' + addY)
	document.getElementById('bg').style.backgroundPosition = `calc(50% + ${addX}px) calc(50% + ${addY}px)`;
}
var timeElement;
window.onload = function(){
	var scramble = document.getElementById('scramble');
	var options = document.getElementById('options');
	scramble.innerHTML = genScramble2x2();
	// this for later VVV
	timeElement = document.getElementById('time');
	entireTimer = document.getElementById('timer');
	mainElement = document.getElementById('main');
	rightElement = document.getElementById('right');	
	plusTwoElement = document.getElementById('plusTwo');
	dnfElement = document.getElementById('dnf');
}
function copyScramble() {
	var textArea = document.createElement("textarea");
	textArea.value = scramble.innerHTML;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand("Copy");
	textArea.remove();
}

var penalty = 0;
var start;
function updateTimer() {timeElement.innerHTML = ((Date.now()-start)/1000).toFixed(2);}
var running = false;
var end;
var timerInterval;
var tempbool = true; // probably crappy way of doing this

var first = true;
var finalTime = -1;
document.addEventListener("keydown", function(event) {
	if (event.keyCode == 32) {
		event.preventDefault();
		if (running) { // done timing
			entireTimer.style.width = "50%";
			running = false;
			clearInterval(timerInterval);
			tempbool = false;
			scramble.style.visibility = 'visible'; scramble.style.opacity = 1;
			options.style.visibility = 'visible'; options.style.opacity = 1;
			rightElement.style.visibility = 'visible'; rightElement.style.opacity = 1;
			setTimeout(function(){
				main.style.animation="line 0.5s running"
				main.style.background="rgba(0, 0, 0, 0.3) linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)) no-repeat center/2px 90%"
			}, 200);
			timeElement.style.fontSize = "96px";
			finalTime = timeElement.innerHTML;
			finalScramble = scramble.innerHTML;
			document.title = finalTime;
			timeArray.push(finalTime);
			scrambleArray.push(finalScramble);
			scramble.innerHTML = genScramble2x2();
			// add da stuff
			// rightElement.innerHTML += finalTime + ' - ' + finalScramble + '<br>'
			doList();
			penalty = 0;
			plusTwoElement.style.color = '#FFF';
			dnfElement.style.color = '#FFF';
		}
	}
});
document.addEventListener("keyup", function(event) {
	if (event.keyCode == 32) {
		if (!tempbool) {tempbool=true; return;}
		if (!running && tempbool) { // start timing
			entireTimer.style.width = "100%";
			running = true;
			start = Date.now();
			timerInterval = setInterval(updateTimer, 10);
			scramble.style.opacity = 0; setTimeout(function(){if(running) scramble.style.visibility='hidden';},500);
			options.style.opacity = 0; setTimeout(function(){if(running) options.style.visibility='hidden';},200);
			rightElement.style.opacity = 0; setTimeout(function(){if(running) rightElement.style.visibility='hidden';},200);
			timeElement.style.fontSize = "128px";
			main.style.background="rgba(0, 0, 0, 0.3)"
			if (!first) { main.style.animation="undo-line 0.2s running";
			} else {rightElement.style.display = 'block'; first = false;}
		}
	}
});

// none is 0, dnf is 1, +2 is 2 
function plusTwo() {
	if (penalty == 0) {plusTwoElement.style.color = '#FF8'; penalty = 2;} // if no penalty, set to +2
	else if (penalty == 1) {plusTwoElement.style.color = '#FF8'; dnfElement.style.color = '#FFF'; penalty = 2;} // if its dnf change to +2
	else if (penalty == 2) {plusTwoElement.style.color = '#FFF'; penalty = 0;} // turn +2 off
	penaltyUpdate();
}

function dnf() {
	if (penalty == 0) {dnfElement.style.color = '#F88'; penalty = 1;} // if no penalty, set to dnf
	else if (penalty == 2) {dnfElement.style.color = '#F88'; plusTwoElement.style.color = '#FFF'; penalty = 1;} // if its +2 then change to dnf
	else if (penalty == 1) {dnfElement.style.color = '#FFF'; penalty = 0;} // turn dnf off
	penaltyUpdate();
}

function penaltyUpdate() {
	/*
	withoutLast = (rightElement.innerHTML.split('<br>').slice(0, -2).join('<br>')); // spaghetti to get html of removing last time
	badUneededVariable = (first ? '' : '<br>')
	if (penalty == 0) {
		withoutLast += badUneededVariable+finalTime+' - '+finalScramble+'<br>'
		timeArray.pop(); timeArray.push(finalTime);
	} else if (penalty == 1) {
		withoutLast += badUneededVariable+'DNF '+finalTime+' - '+finalScramble+'<br>'
		timeArray.pop(); timeArray.push('DNF ' + finalTime);
	} else if (penalty == 2) {
		withoutLast += badUneededVariable+(parseFloat(finalTime)+2)+'+ - '+finalScramble+'<br>'
		timeArray.pop(); timeArray.push((parseFloat(finalTime)+2)+'+');
	}
	rightElement.innerHTML = withoutLast;
	*/
	if (penalty == 0) {
		timeArray.pop(); timeArray.push(finalTime);
	} else if (penalty == 1) {
		timeArray.pop(); timeArray.push('DNF ' + finalTime);
	} else if (penalty == 2) {
		timeArray.pop(); timeArray.push((parseFloat(finalTime)+2)+'+');
	}
}

function doList() {
	rightElement.innerHTML = '';
	i = 0;
	while (i < timeArray.length) {
		if (timeArray[i].startsWith('DNF')) {
			rightElement.innerHTML += `<span class='DNF'>${timeArray[i]} - ${scrambleArray[i]}</span><br>`
		} else if (timeArray[i].includes('+')) {
			rightElement.innerHTML += `<span class='plusTwo'>${timeArray[i]} - ${scrambleArray[i]}</span><br>`
		} else {
			rightElement.innerHTML += `<span>${timeArray[i]} - ${scrambleArray[i]}</span><br>`
		}
		i++;
	}
}
