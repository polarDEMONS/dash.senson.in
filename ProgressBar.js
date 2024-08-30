// Define an array of progress bar configurations
const progressBarConfigurations = [
    {
        channelNumber: '2449872',
        fieldNumber: 'field1',
        chartId: 'progress_bar_2449872_field1', // Generate a unique ID for each progress bar
        color: '#ff942e' // Specify the progress bar color
    },
    {
        channelNumber: '2449873',
        fieldNumber: 'field1',
        chartId: 'progress_bar_2449873_field1', // Generate a unique ID for each progress bar
        color: '#4f3ff0' // Specify the progress bar color
    },
    {
        channelNumber: '2449874',
        fieldNumber: 'field1',
        chartId: 'progress_bar_2449874_field1', // Generate a unique ID for each progress bar
        color: '#096c86' // Specify the progress bar color
    },
    {
        channelNumber: '2449875',
        fieldNumber: 'field1',
        chartId: 'progress_bar_2449875_field1', // Generate a unique ID for each progress bar
        color: '#df3670' // Specify the progress bar color
    },
    
    {
        channelNumber: 'CHANNEL_NUMBER_HERE',
        fieldNumber: 'FIELD_NUMBER_HERE',
        chartId: 'progress_bar_CHANNEL_NUMBER_HERE_FIELD_NUMBER_HERE',
        color: '#ff5733' // Specify the progress bar color
    },
    // Add more progress bar configurations as needed
];

// Function to fetch data and update progress bar
function fetchDataAndUpdateProgressBar(config) {
    fetch(`https://api.thingspeak.com/channels/${config.channelNumber}/fields/${config.fieldNumber}/last.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data); // Log the received data

            // Check if the data contains the specified field number
            if (config.fieldNumber in data && data[config.fieldNumber] !== null && !isNaN(data[config.fieldNumber])) {
                const recentValue = parseFloat(data[config.fieldNumber]);
                console.log('Parsed value:', recentValue); // Log the parsed value

                // Update the progress bar
                const progressBar = document.getElementById(config.chartId);
                progressBar.style.width = `${recentValue}%`;
                progressBar.style.backgroundColor = config.color;
            } else {
                console.error('Field value is invalid or missing');
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
        });
}

// Call the function to fetch data and update progress bar every 5 seconds
setInterval(() => {
    progressBarConfigurations.forEach(config => fetchDataAndUpdateProgressBar(config));
}, 5000);
