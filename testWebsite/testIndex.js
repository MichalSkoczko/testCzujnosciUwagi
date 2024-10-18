document.addEventListener('DOMContentLoaded', function() {
    badanieElement = document.getElementById('badanie');
    powitanieElement = document.getElementById('powitanie');
    footerElement = document.getElementById('footer');

    rozpocznijBadanieButton = document.getElementById('startButton');
    rozpocznijBadanieButton.addEventListener('click', function() {
        console.log('rozpocznijBadanieButton clicked');
        badanieRunner();
    });
    document.getElementById('restartButton').addEventListener('click', function() {
        console.log('restartButton clicked');
        document.getElementById('koniec').style.display = 'none';
        powitanieElement.style.display = 'block';
    });

    function badanieRunner() {
        colors = ["darkgreen", "lightgreen", "darkblue", "yellow", "purple", "orange", "pink", "lightblue", "black"];
        powitanieElement.style.display = 'none';
        footerElement.style.display = 'none';
        badanieElement.style.display = 'block';
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        console.log('Current Time in Seconds:', currentTimeInSeconds);
        const endTimeInSeconds = currentTimeInSeconds + 60;
        let timesUp = false;
        async function checkTime() {
            const interval = setInterval(() => {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                if (currentTimeInSeconds >= endTimeInSeconds) {
                    clearInterval(interval);
                    console.log('Time is up!');
                    timesUp = true;
                }
            }, 1000);
        }
        checkTime();

        const results = [];

        function runItem(isTraining = 0) {
            if (timesUp) {
                document.getElementById('koniec').style.display = 'block';
                document.getElementById('result').innerHTML = results.map(result => result.join(', ')).join('<br>');
                badanieElement.style.display = 'none';
                footerElement.style.display = 'block';
                return;
            }
            
            const isRedDisplayed = Math.random() >= 0.5;
            const randomColors = []
            while (randomColors.length < 5){
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                if (!randomColors.includes(randomColor)){
                    randomColors.push(randomColor);
                }
            }
            const circles = []
            if(isRedDisplayed){
                circles.push('<div style="width: 100px; height: 100px; background-color: '+"red"+'; border-radius: 50%; display: inline-block; margin-left: 10px;"></div>');
            }
            while (circles.length < 5){
                circles.push('<div style="width: 100px; height: 100px; background-color: '+randomColors[circles.length]+'; border-radius: 50%; display: inline-block; margin-left: 10px;"></div>');
            }
            for (let i = circles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [circles[i], circles[j]] = [circles[j], circles[i]];
            }
            circlesElement = document.getElementById('circles');
            circlesElement.innerHTML = '';
            document.getElementById("trainingFeedback").innerHTML = '';
            circlesElement.innerHTML = circles.join('');
            const currentTime = new Date();
            let spacePressed = false;
            console.log('Current Time:', currentTime.toLocaleTimeString());
            console.log('randomColor:', randomColors);
            let resolved = false;
            function handleKeydown(event) {
                if (event.code === 'Space') {
                    document.removeEventListener('keydown', handleKeydown);
                    console.log('Spacebar pressed');
                    resolved = true;
                    const endTime = new Date();
                    const timeDeltaInSeconds = ((endTime - currentTime)/1000);
                    console.log('Time Delta in Seconds:', timeDeltaInSeconds);
                    resolve(timeDeltaInSeconds);
                }
            }
            document.addEventListener('keydown', handleKeydown);
            function checkIfSecondPassed(startTime) {
                const currentTime = new Date();
                const timeDeltaInSeconds = (currentTime - startTime) / 1000;
                return timeDeltaInSeconds >= 2 ? false : true;
            }

            const startTime = new Date();
            const interval = setInterval(() => {
                if (!checkIfSecondPassed(startTime) || resolved) {
                    document.removeEventListener('keydown', handleKeydown);
                    clearInterval(interval);
                    console.log('Decision made');
                    if (!resolved) {
                        resolve(1);
                    }
                }
            }, 1);
            function resolve(reactionTime) {
                const isDecisionGood = isRedDisplayed == spacePressed;
                if (isTraining < 3) {
                    if (isDecisionGood) {
                        document.getElementById("trainingFeedback").innerHTML = '<span style="color: green;">Dobrze</span>';
                    } else {
                        document.getElementById("trainingFeedback").innerHTML = '<span style="color: red;">Źle</span>';
                    }
                    
                } else {
                    results.push([isRedDisplayed, spacePressed, isDecisionGood, reactionTime]);
                }
                circlesElement.innerHTML = '';
                setTimeout(() => {runItem(isTraining+1)}, 500);
                
            }
        }
        setTimeout(() => runItem(0), 500);
        console.log('Results:', results);
    }

});