// Define the custom color for temperature > 30°C (in hex format)
const customColor = '#ff5722'; // Replace this with your preferred hex color code

// Function to update the project box background color based on temperature value, excluding offline statuses
async function updateProjectBoxBackgroundColor() {
    // Get all project boxes
    const projectBoxes = document.querySelectorAll('.project-box');

    // Loop through each project box
    projectBoxes.forEach(projectBox => {
        // Get the temperature value from the field1-value element inside the current project box
        const temperatureElement = projectBox.querySelector('[id^="field1-value-"]');
        
        // Get the status (active or offline) from the corresponding project box header
        const statusElement = projectBox.querySelector('[id^="Crane"]');

        // Check if the status element exists and contains the word "Offline"
        const statusText = statusElement ? statusElement.textContent.trim().toLowerCase() : '';
        const isOffline = statusText.includes('offline');
        
        // Skip the project box if it is offline
        if (isOffline) {
            return; // Do nothing if the status is offline
        }

        // If the project box is not offline, check the temperature
        if (temperatureElement) {
            // Extract the numeric value from the temperature string (e.g., "35.9℃" => 35.9)
            const temperatureValue = parseFloat(temperatureElement.textContent.replace(/[^\d.-]/g, ''));

            // If temperature exceeds 30°C, set background color to the custom color
            if (temperatureValue > 30) {
                projectBox.style.backgroundColor = customColor;
            } else {
                // If temperature is 30°C or below, leave the color as the original (no need to change)
                // The default color in the HTML will remain in place
            }
        }
    });
}


// Call the function when the page loads to check the initial background color
window.addEventListener('load', updateProjectBoxBackgroundColor);

// Optionally, you can call the function periodically to keep checking the temperature
setInterval(updateProjectBoxBackgroundColor, 100); // Check every 15 seconds
