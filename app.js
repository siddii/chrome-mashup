function startTimer(sectionId) {
    document.getElementById(sectionId).getElementsByTagName('timer')[0].start();
}

function stopTimer(sectionId) {
    document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();
}

function stopResumeTimer(sectionId, btn) {
    if (btn.innerHTML === 'Stop') {
        document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();
        btn.innerHTML = 'Resume';
    }
    else {
        document.getElementById(sectionId).getElementsByTagName('timer')[0].resume();
        btn.innerHTML = 'Stop';
    }
}