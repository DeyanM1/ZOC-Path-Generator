const gridContainer = document.getElementById('grid');
const distanceList = document.getElementById('distanceList');
const exportList = document.getElementById('exportList');
const totalPoints = 100; // Gesamtzahl der Punkte
const selectedPoints = []; // Zum Speichern der ausgewählten Punkte
let lastAngle = null; // Letzter Winkel für Vergleich

let path = [];

// Dark/Light Mode Toggle
const themeSwitcher = document.getElementById('themeSwitcher');
themeSwitcher.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    document.querySelector('.container').classList.toggle('dark');
    document.querySelectorAll('.point').forEach(point => point.classList.toggle('dark'));
    document.querySelectorAll('.line').forEach(line => line.classList.toggle('dark'));
    document.querySelectorAll('#distanceList li').forEach(item => item.classList.toggle('dark'));
    document.querySelector('.button').classList.toggle('dark');
    document.getElementById('distances').classList.toggle('dark');
    document.querySelectorAll('#exportList li').forEach(item => item.classList.toggle('dark'));
    document.getElementById('exports').classList.toggle('dark');
});


function onStart() {
    document.body.classList.toggle('dark');
    document.querySelector('.container').classList.toggle('dark');
    document.querySelectorAll('.point').forEach(point => point.classList.toggle('dark'));
    document.querySelectorAll('.line').forEach(line => line.classList.toggle('dark'));
    document.querySelectorAll('#distanceList li').forEach(item => item.classList.toggle('dark'));
    document.querySelectorAll('#exportList li').forEach(item => item.classList.toggle('dark'));
    document.querySelector('.button').classList.toggle('dark');
    document.getElementById('distances').classList.toggle('dark');
    document.getElementById('exports').classList.toggle('dark');
}

function exportPath() {
    while(exportList.firstChild) {
        exportList.removeChild(exportList.firstChild);
    }
    
    const listItem = document.createElement('li');
    listItem.textContent = JSON.stringify(path)//`[${path}]`;
    exportList.appendChild(listItem);
}

// Dynamisches Erstellen der Punkte
for (let i = 0; i < totalPoints; i++) {
    const point = document.createElement('div');
    point.classList.add('point');
    point.dataset.index = i;

    point.addEventListener('click', () => {
        const rect = point.getBoundingClientRect();
        const pointCoords = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            element: point,
            line: null,
        };

        if (point.classList.contains('selected')) {
            removePoint(pointCoords);
        } else {
            point.classList.add('selected');
            selectedPoints.push(pointCoords);

            if (selectedPoints.length > 1) {
                const prevPoint = selectedPoints[selectedPoints.length - 2];
                const distance = drawLine(prevPoint, pointCoords);
                const angle = calculateAngle(prevPoint, pointCoords);

                if (lastAngle !== null) {
                    const angleDifference = calculateAngleDifference(lastAngle, angle);

                    // Winkeländerung nur hinzufügen, wenn sie nicht 0 ist
                    if (angleDifference !== 0) {
                        addAngleToList(angleDifference); // Zeigt den Drehwinkel an
                    }
                }


                lastAngle = angle;
                addDistanceToList(Math.round(distance));
                
            }
        }
    });

    gridContainer.appendChild(point);
}



function drawLine(pointA, pointB) {
    const line = document.createElement('div');
    line.classList.add('line');
    
    const deltaX = pointB.x - pointA.x;
    const deltaY = pointB.y - pointA.y;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${pointA.x}px`;
    line.style.top = `${pointA.y}px`;

    document.body.appendChild(line);
    
    // Verknüpfe die Linie mit beiden Punkten (A und B)
    pointA.line = line;
    pointB.line = line;

    return length;
}

// Funktion zur Berechnung des Winkels zwischen zwei Punkten
function calculateAngle(pointA, pointB) {
    const deltaX = pointB.x - pointA.x;
    const deltaY = pointB.y - pointA.y;
    return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
}

function calculateAngleDifference(prevAngle, currentAngle) {
    let angleDifference = currentAngle - prevAngle;

    // Korrigieren der Winkel, um sicherzustellen, dass er zwischen -180° und 180° liegt
    if (angleDifference > 180) {
        angleDifference -= 360;
    } else if (angleDifference < -180) {
        angleDifference += 360;
    }

    // Zeige nur Winkel an, wenn er ungleich 0 ist
    return angleDifference.toFixed(2);
}

function addDistanceToList(distance) {
    const listItem = document.createElement('li');
    listItem.textContent = `Distanz: ${distance/50}m`;
    distanceList.appendChild(listItem);
    distanceList.scrollTop = distanceList.scrollHeight; // Automatisches Scrollen zum Ende

    path.push(distance/50);
    //console.log(path);
}

function addAngleToList(angle) {
    if (angle != 0) {
        const roundedAngle = Math.round(angle); // Winkel auf ganze Zahl runden
        const listItem = document.createElement('li');
        listItem.textContent = `Winkel: ${roundedAngle}°`;
        distanceList.appendChild(listItem);
        
        path.push((roundedAngle).toString());
        //console.log(path);
    }
}

function removePoint(pointCoords) {
    const index = selectedPoints.findIndex(p => p.element === pointCoords.element);
    if (index > 0) {
        const prevPoint = selectedPoints[index - 1];
        if (prevPoint.line) {
            prevPoint.line.remove();
        }
    }

    selectedPoints.splice(index, 1);
    pointCoords.element.classList.remove('selected');
    if (selectedPoints.length === 0) {
        lastAngle = null;
    }
}

function resetAll() {
    selectedPoints.forEach(p => {
        if (p.element) {
            p.element.classList.remove('selected');
        }
    
        if (p.line) {
            if (document.body.contains(p.line)) {
                document.body.removeChild(p.line);
            }
        }
    });
    selectedPoints.length = 0;
    lastAngle = null;
    path = []

    let distanceList = document.getElementById('distanceList');
    while(distanceList.firstChild) {
        distanceList.removeChild(distanceList.firstChild);
    }
    let exportList = document.getElementById('exportList');
    while(exportList.firstChild) {
        exportList.removeChild(exportList.firstChild);
    }
}

function copy() {
    const exportList = document.getElementById('exportList');
    const listItems = exportList.getElementsByTagName('li');

    //console.log(listItems[0].textContent)



    navigator.clipboard.writeText(listItems[0].textContent)
        .then(() => {
            console.log('Text copied to clipboard');
            showPopup();
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}


function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('show');

    // Hide the popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}