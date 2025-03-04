document.addEventListener("DOMContentLoaded", function () {
    async function fetchTemperatureData(channelNumber, boxElement, circleElement) {
        try {
            const response = await fetch(`https://api.thingspeak.com/channels/${channelNumber}/fields/1.json?results=1`);
            const data = await response.json();

            if (!data.feeds || data.feeds.length === 0) {
                console.error(`No data for channel ${channelNumber}`);
                return;
            }

            const latestEntry = data.feeds[0];
            const temperatureText = latestEntry['field1'];

            if (!temperatureText) {
                console.error(`Invalid data from channel ${channelNumber}`);
                return;
            }

            const temperature = parseFloat(temperatureText.replace(/[^\d.-]/g, ""));
            updateCircleColor(boxElement, temperature, circleElement);
        } catch (error) {
            console.error(`Error fetching data for channel ${channelNumber}:`, error);
        }
    }

    function updateCircleColor(boxElement, temperature, circleElement) {
        if (!circleElement) return;

        const statusText = boxElement.querySelector(".box-content-header").textContent.trim().toLowerCase();

        if (statusText.includes("offline")) {
            circleElement.setAttribute("fill", "grey"); // Offline status
            clearInterval(circleElement.blinkInterval);
            circleElement.blinkInterval = null;
        } else if (temperature > 35) {
            blinkCircle(circleElement); // Start blinking if temperature > 30
        } else {
            circleElement.setAttribute("fill", "green"); // Normal color
            clearInterval(circleElement.blinkInterval);
            circleElement.blinkInterval = null;
        }
    }

    function blinkCircle(circleElement) {
        if (circleElement.blinkInterval) return; // Prevent multiple intervals

        let isBlinking = true;
        circleElement.blinkInterval = setInterval(() => {
            circleElement.setAttribute("fill", isBlinking ? "red" : "none");
            isBlinking = !isBlinking;
        }, 500);
    }

    function initializeMonitoring() {
        const projectBoxes = document.querySelectorAll(".project-box-wrapper");

        projectBoxes.forEach(box => {
            const channelNumber = box.getAttribute("data-channel");
            const circleElement = box.querySelector("svg circle");

            if (channelNumber && circleElement) {
                setInterval(() => fetchTemperatureData(channelNumber, box, circleElement), 1000);
            }
        });
    }

    initializeMonitoring();
});
