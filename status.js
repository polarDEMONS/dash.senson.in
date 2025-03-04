// Define an array of channel configurations
const channelConfigurations = [
    { channelId: '2449872', fieldNumber: '1', labelId: 'Crane1' },
    { channelId: '2449873', fieldNumber: '1', labelId: 'Crane2' },
    { channelId: '2449874', fieldNumber: '1', labelId: 'Crane3' },
    { channelId: '2449875', fieldNumber: '1', labelId: 'Crane4' },
];

// Function to fetch data from ThingSpeak
async function fetchData(channelId, field) {
    const url = `https://api.thingspeak.com/channels/${channelId}/fields/${field}.json?results=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.feeds?.[0]?.[`field${field}`] ?? null; // Safe access
    } catch (error) {
        console.error(`Error fetching data for channel ${channelId} field ${field}:`, error);
        return null;
    }
}

// Function to fetch the timestamp of the last entry in the channel
async function fetchLastEntryTimestamp(channelId) {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.feeds && data.feeds.length > 0) {
            return new Date(data.feeds[0].created_at).getTime();
        }
    } catch (error) {
        console.error(`Error fetching last entry timestamp for channel ${channelId}:`, error);
    }
    return 0; // Default to 0 if unable to fetch timestamp
}

// Function to update field status labels
async function updateFieldStatusLabels() {
    const currentTime = Date.now();
    const thirtyMinutesAgo = currentTime - 1 * 60 * 1000; // 1 minute ago for real-time check

    for (const config of channelConfigurations) {
        const value = await fetchData(config.channelId, config.fieldNumber);
        const labelElement = document.getElementById(config.labelId);
        
        if (labelElement) {
            if (value !== null) {
                // Check the timestamp of the last data entry
                const lastEntryTimestamp = await fetchLastEntryTimestamp(config.channelId);
                
                if (lastEntryTimestamp >= thirtyMinutesAgo) {
                    // If the timestamp is recent, it's Active
                    labelElement.textContent = `${config.labelId}: Active`;
                    labelElement.style.color = 'green';
                    
                    // Check for warning state (if value > 30)
                    if (parseFloat(value) > 30) {
                        labelElement.textContent += ` (Warning)`;
                        labelElement.style.color = 'red'; // Set to red if warning
                    }
                } else {
                    // If the timestamp is old, mark as Offline
                    labelElement.textContent = `${config.labelId}: Offline`;
                    labelElement.style.color = 'grey';
                }
            } else {
                // If no value is fetched, mark as Offline
                labelElement.textContent = `${config.labelId}: Offline`;
                labelElement.style.color = 'grey';
            }
        }
    }
}

// Update field status labels when the page loads
window.addEventListener('load', updateFieldStatusLabels);

// Adjust update frequency to avoid hitting ThingSpeak's rate limit
setInterval(updateFieldStatusLabels, 15000); // Update every 15 seconds (to comply with free ThingSpeak limits)
