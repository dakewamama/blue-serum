const fs = require('fs');
const path = require('path');

// Define folder structure
const folders = [
    'public',
    'src/css',
    'src/js',
    'src/utils'
];

// Define files with initial content
const files = {
    'public/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blue Serum Framework</title>
    <link rel="stylesheet" href="../src/css/styles.css">
</head>
<body>
    <h1>Welcome to Blue Serum</h1>
    <div id="blinkPopup" class="popup hidden">
        <h3>Nearby PaSe Device</h3>
        <p id="deviceName">Device: PaSe Ring</p>
        <p>Status: Ready to Connect</p>
        <button id="connectBtn">Connect</button>
    </div>
    <script src="../src/js/main.js"></script>
</body>
</html>
`,

    'src/css/styles.css': `/* Basic styles for the pop-up */
.popup {
    position: fixed;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: none;
    transition: all 0.3s ease;
}

/* Hidden state for pop-up */
.popup.hidden {
    display: none;
}

/* Show animation for pop-up */
.popup.show {
    display: block;
    animation: popUpAnim 0.5s forwards;
}

/* Animation keyframes */
@keyframes popUpAnim {
    0% {
        opacity: 0;
        transform: translateY(100px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
`,

    'src/js/main.js': `// Import the Bluetooth utility functions
import { discoverDevices, handleDeviceDetected } from './utils/bluetoothUtils.js';

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blue Serum framework initialized');
    
    // Trigger Bluetooth device discovery
    discoverDevices()
        .then(device => {
            handleDeviceDetected(device);
        })
        .catch(error => {
            console.error('Error during Bluetooth device discovery:', error);
        });
});

// Function to show the pop-up
function showPopup(device) {
    const popup = document.getElementById('blinkPopup');
    const deviceNameElem = document.getElementById('deviceName');
    
    // Fill the pop-up with device information
    deviceNameElem.textContent = \`Device: \${device.name}\`;

    // Show the pop-up with animation
    popup.classList.remove('hidden');
    popup.classList.add('show');
}

// Function to hide the pop-up
function hidePopup() {
    const popup = document.getElementById('blinkPopup');
    popup.classList.add('hidden');
}
`,

    'src/js/civic.js': `// Function to verify device UUID using Civic Pass API
export async function verifyDeviceUUID(uuid) {
    try {
        const response = await fetch('https://api.civic.com/verify-uuid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_CIVIC_API_TOKEN'
            },
            body: JSON.stringify({ uuid: uuid })
        });
        const result = await response.json();
        
        if (result.verified) {
            console.log('UUID verified:', uuid);
            return true;
        } else {
            console.log('UUID verification failed:', uuid);
            return false;
        }
    } catch (error) {
        console.error('Civic Pass API verification failed:', error);
        throw error;
    }
}
`,

    'src/utils/bluetoothUtils.js': `// Function to discover Bluetooth devices
export async function discoverDevices() {
    try {
        // Request Bluetooth devices
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['battery_service'] }] // Customize service UUIDs as needed
        });
        console.log('Discovered device:', device.name);
        return device;
    } catch (error) {
        console.error('Bluetooth device discovery failed:', error);
        throw error;
    }
}

// Function to handle discovered devices and their signal strength
export function handleDeviceDetected(device) {
    // Simulate a signal strength value (RSSI) for the demo
    const rssi = Math.random() * -100;

    // Check if the device belongs to a business or individual
    const isBusiness = device.business;  // You can set this property dynamically
    const rangeThreshold = isBusiness ? -80 : -40;

    // Show the pop-up if the device is within the range
    if (rssi >= rangeThreshold) {
        showPopup(device);
    } else {
        console.log('Device out of range.');
    }
}
`,

    'package.json': `{
  "name": "blue-serum",
  "version": "1.0.0",
  "description": "A framework for Blink detection and Bluetooth interaction",
  "main": "src/js/main.js",
  "scripts": {
    "start": "live-server public"
  },
  "dependencies": {
    "civic-pass": "^1.0.0"
  }
}
`,

    'README.md': `# Blue Serum

A framework for Blink detection and Bluetooth interaction.

## Setup

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server**:
   \`\`\`bash
   npm start
   \`\`\`

## Structure

- **public/**: Contains static files such as HTML.
- **src/**: Contains source files for CSS, JavaScript, and utilities.
- **package.json**: Project metadata and dependencies.
`
};

// Create folders
folders.forEach(folder => {
    if (!fs.existsSync(folder)){
        fs.mkdirSync(folder, { recursive: true });
    }
});

// Create files
for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(filePath), content);
}

console.log('Project structure created successfully!');
