// 1
document.addEventListener("DOMContentLoaded", () => {
    const tempDisplay = document.querySelector(".bg1 .text h1:nth-child(2)");
    const powerStatus = document.querySelector(".bg1 .text h1:nth-child(3)");
    const addBtn = document.getElementById("add");
    const subBtn = document.getElementById("sub");
    const powerBtn = document.getElementById("btn");
    const setTimerBtn = document.querySelector(".bg_t1 button");
    const timeInput = document.querySelector("input[type='time']");

    let temperature = 25;
    let isOn = true;
    let timer = "";

    const API_URL = "https://mockapi.io/api/v1/airconditioner/status"; // Replace with actual mock API URL

    // Fetch initial state from API
    function fetchStatus() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                temperature = data.temperature;
                isOn = data.power;
                timer = data.timer;
                updateUI();
            })
            .catch(err => console.error("Failed to fetch AC status:", err));
    }

    // Update UI based on variables
    function updateUI() {
        tempDisplay.textContent = temperature;
        powerStatus.textContent = isOn ? "ON" : "OFF";
        powerStatus.style.color = isOn ? "red" : "gray";
    }

    // Send updated status to API
    function sendStatus() {
        fetch(API_URL, {
            method: "POST", // Use PUT or PATCH if your API requires
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                temperature,
                power: isOn,
                timer
            })
        }).catch(err => console.error("Failed to update AC status:", err));
    }

    // Event handlers
    addBtn.addEventListener("click", () => {
        if (isOn && temperature < 35) {
            temperature++;
            updateUI();
            sendStatus();
        }
    });

    subBtn.addEventListener("click", () => {
        if (isOn && temperature > 16) {
            temperature--;
            updateUI();
            sendStatus();
        }
    });

    powerBtn.addEventListener("click", () => {
        isOn = !isOn;
        updateUI();
        sendStatus();
    });

    setTimerBtn.addEventListener("click", () => {
        timer = timeInput.value;
        alert(`Timer set for ${timer}`);
        sendStatus();
    });

    // Initial load
    fetchStatus();
});
// 2
document.addEventListener("DOMContentLoaded", () => {
    const tempDisplay = document.querySelector(".bg1 .text h1:nth-child(2)");
    const powerStatus = document.querySelector(".bg1 .text h1:nth-child(3)");
    const addBtn = document.getElementById("add");
    const subBtn = document.getElementById("sub");
    const powerBtn = document.getElementById("btn");

    const timeInput = document.querySelector("input[type='time']");
    const setTimerBtn = document.querySelector(".bg_t1 button");
    const timeDisplay = document.querySelector("h3:nth-of-type(2)"); // "Time :" line

    // Mock API URL (commented for now)
    // const API_URL = "https://yourproject.mockapi.io/api/v1/airconditioner/1";

    let temperature = 25;
    let isOn = true;
    let scheduledTime = null;
    let scheduledAction = null;

    // Update display
    function updateUI() {
        tempDisplay.textContent = temperature;
        powerStatus.textContent = isOn ? "OFF" : "ON";
        powerStatus.style.color = isOn ? "red" : "gray";
        powerBtn.style.color = isOn ? "red" : "blue";

        if (scheduledTime && scheduledAction) {
            timeDisplay.innerHTML = `Time : ${scheduledAction.toUpperCase()} at ${scheduledTime}`;
        } else {
            timeDisplay.innerHTML = "Time :";
        }
    }

    // For local testing: mock fetchStatus (remove API calls for now)
    function fetchStatus() {
        // Just update UI with current state for now
        updateUI();
    }

    // For local testing: mock sendStatus (remove API calls for now)
    function sendStatus() {
        // For real API, send PUT request here
        // For now, just log the current status
        console.log("Sending status:", {
            temperature,
            power: isOn,
            timer: scheduledTime && scheduledAction ? { time: scheduledTime, action: scheduledAction } : null
        });
    }

    // Normalize time string to "HH:mm" format for comparison
    function normalizeTime(t) {
        // t is expected to be "HH:mm"
        // Just return t, but you could add validation here if needed
        return t;
    }

    // Check timer every 10 seconds (more responsive)
    setInterval(() => {
        if (!scheduledTime || !scheduledAction) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const currentTime = `${hours}:${minutes}`; // "HH:mm" 24-hour format

        console.log("Checking time: now =", currentTime, "| scheduled =", scheduledTime);

        if (currentTime === scheduledTime) {
            if (scheduledAction === "on") {
                isOn = true;
            } else if (scheduledAction === "off") {
                isOn = false;
            }

            // Clear timer after triggering
            scheduledTime = null;
            scheduledAction = null;
            updateUI();
            sendStatus();
        }
    }, 10000); // Check every 10 seconds

    // Handle temperature +
    addBtn.addEventListener("click", () => {
        if (isOn && temperature < 35) {
            temperature++;
            updateUI();
            sendStatus();
        }
    });

    // Handle temperature -
    subBtn.addEventListener("click", () => {
        if (isOn && temperature > 16) {
            temperature--;
            updateUI();
            sendStatus();
        }
    });

    // Toggle power manually
    powerBtn.addEventListener("click", () => {
        isOn = !isOn;
        updateUI();
        sendStatus();
    });

    // Handle timer set
    setTimerBtn.addEventListener("click", () => {
        const selectedTime = timeInput.value;
        if (!selectedTime) {
            alert("Please select a time.");
            return;
        }

        // Normalize selected time
        const normalizedTime = normalizeTime(selectedTime);

        // Ask user what action to perform at selected time
        const action = confirm("Turn ON at selected time?\nClick Cancel to turn OFF instead")
            ? "on"
            : "off";

        scheduledTime = normalizedTime;
        scheduledAction = action;

        updateUI();
        sendStatus();
    });

    // Initial fetch (mocked)
    fetchStatus();
});
//3 goode
document.addEventListener("DOMContentLoaded", () => {
    const tempDisplay = document.querySelector(".bg1 .text h1:nth-child(2)");
    const powerStatus = document.querySelector(".bg1 .text h1:nth-child(3)");
    const addBtn = document.getElementById("add");
    const subBtn = document.getElementById("sub");
    const powerBtn = document.getElementById("btn");

    const timeInput = document.querySelector("input[type='time']");
    const setTimerBtn = document.querySelector(".bg_t1 button");
    const timeDisplay = document.querySelector("h3:nth-of-type(2)"); // "Time :" line

    // Mock API URL (commented for now)
    // const API_URL = "https://yourproject.mockapi.io/api/v1/airconditioner/1";

    let temperature = 25;
    let isOn = false; // AC starts OFF now
    let scheduledTime = null;
    let scheduledAction = null;

    // Update display
    function updateUI() {
        tempDisplay.textContent = temperature;
        powerStatus.textContent = isOn ? "ON" : "OFF";
        powerStatus.style.color = isOn ? "red" : "gray";
        powerBtn.style.color = isOn ? "blue" : "red";

        if (scheduledTime && scheduledAction) {
            timeDisplay.innerHTML = `Time : ${scheduledAction.toUpperCase()} at ${scheduledTime}`;
        } else {
            timeDisplay.innerHTML = "Time :";
        }
    }

    // For local testing: mock fetchStatus (remove API calls for now)
    function fetchStatus() {
        // Just update UI with current state for now
        updateUI();
    }

    // For local testing: mock sendStatus (remove API calls for now)
    function sendStatus() {
        // For real API, send PUT request here
        // For now, just log the current status
        console.log("Sending status:", {
            temperature,
            power: isOn,
            timer: scheduledTime && scheduledAction ? { time: scheduledTime, action: scheduledAction } : null
        });
    }

    // Normalize time string to "HH:mm" format for comparison
    function normalizeTime(t) {
        // t is expected to be "HH:mm"
        // Just return t, but you could add validation here if needed
        return t;
    }

    // Check timer every 10 seconds (more responsive)
    setInterval(() => {
        if (!scheduledTime || !scheduledAction) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const currentTime = `${hours}:${minutes}`; // "HH:mm" 24-hour format

        console.log("Checking time: now =", currentTime, "| scheduled =", scheduledTime);

        if (currentTime === scheduledTime) {
            if (scheduledAction === "on") {
                isOn = true;
            } else if (scheduledAction === "off") {
                isOn = false;
            }

            // Clear timer after triggering
            scheduledTime = null;
            scheduledAction = null;
            updateUI();
            sendStatus();
        }
    }, 10000); // Check every 10 seconds

    // Handle temperature +
    addBtn.addEventListener("click", () => {
        if (isOn && temperature < 35) {
            temperature++;
            updateUI();
            sendStatus();
        }
    });

    // Handle temperature -
    subBtn.addEventListener("click", () => {
        if (isOn && temperature > 16) {
            temperature--;
            updateUI();
            sendStatus();
        }
    });

    // Toggle power manually
    powerBtn.addEventListener("click", () => {
        isOn = !isOn;
        updateUI();
        sendStatus();
    });

    // Handle timer set
    setTimerBtn.addEventListener("click", () => {
        const selectedTime = timeInput.value;
        if (!selectedTime) {
            alert("Please select a time.");
            return;
        }

        // Normalize selected time
        const normalizedTime = normalizeTime(selectedTime);

        // Ask user what action to perform at selected time
        const action = confirm("Turn ON at selected time?\nClick Cancel to turn OFF instead")
            ? "on"
            : "off";

        scheduledTime = normalizedTime;
        scheduledAction = action;

        updateUI();
        sendStatus();
    });

    // Initial fetch (mocked)
    fetchStatus();
});
//4 the best
document.addEventListener("DOMContentLoaded", () => {
    const tempDisplay = document.querySelector(".bg1 .text h1:nth-child(2)");
    const powerStatus = document.querySelector(".bg1 .text h1:nth-child(3)");
    const addBtn = document.getElementById("add");
    const subBtn = document.getElementById("sub");
    const powerBtn = document.getElementById("btn");

    const timeInput = document.querySelector("input[type='time']");
    const setTimerBtn = document.querySelector(".bg_t1 button");
    const timeDisplay = document.querySelector("h3:nth-of-type(2)");

    let temperature = 25;
    let isOn = false; // Start OFF
    let scheduledTime = null;
    let scheduledAction = null;

    function updateUI() {
        tempDisplay.textContent = temperature;
        powerStatus.textContent = isOn ? "ON" : "OFF";
        powerStatus.style.color = isOn ? "red" : "gray";
        powerBtn.style.color = isOn ? "blue" : "red";

        if (scheduledTime && scheduledAction) {
            const now = new Date();
            const [targetHours, targetMinutes] = scheduledTime.split(":").map(Number);
            const target = new Date(now);
            target.setHours(targetHours);
            target.setMinutes(targetMinutes);
            target.setSeconds(0);

            let diff = Math.floor((target - now) / 1000); // in seconds

            if (diff >= 0) {
                const minutes = Math.floor(diff / 60).toString().padStart(2, "0");
                const seconds = (diff % 60).toString().padStart(2, "0");
                timeDisplay.innerHTML = `Time : in ${minutes}:${seconds}`;
            } else {
                // Time passed — clear the display
                timeDisplay.innerHTML = "Time :";
            }
        } else {
            timeDisplay.innerHTML = "Time :";
        }
    }

    function fetchStatus() {
        updateUI();
    }

    function sendStatus() {
        console.log("Sending status:", {
            temperature,
            power: isOn,
            timer: scheduledTime && scheduledAction ? { time: scheduledTime, action: scheduledAction } : null
        });
    }

    function normalizeTime(t) {
        return t;
    }

    // Timer logic every 10s
    setInterval(() => {
        if (!scheduledTime || !scheduledAction) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const currentTime = `${hours}:${minutes}`;

        console.log("Checking time: now =", currentTime, "| scheduled =", scheduledTime);

        if (currentTime === scheduledTime) {
            isOn = scheduledAction === "on";
            scheduledTime = null;
            scheduledAction = null;
            updateUI();
            sendStatus();
        }
    }, 10000);

    // Live countdown every 1s
    setInterval(() => {
        updateUI();
    }, 1000);

    addBtn.addEventListener("click", () => {
        if (isOn && temperature < 35) {
            temperature++;
            updateUI();
            sendStatus();
        }
    });

    subBtn.addEventListener("click", () => {
        if (isOn && temperature > 16) {
            temperature--;
            updateUI();
            sendStatus();
        }
    });

    powerBtn.addEventListener("click", () => {
        isOn = !isOn;
        updateUI();
        sendStatus();
    });

    setTimerBtn.addEventListener("click", () => {
        const selectedTime = timeInput.value;
        if (!selectedTime) {
            alert("Please select a time.");
            return;
        }

        const normalizedTime = normalizeTime(selectedTime);

        const action = confirm("Turn ON at selected time?\nClick Cancel to turn OFF instead")
            ? "on"
            : "off";

        scheduledTime = normalizedTime;
        scheduledAction = action;

        updateUI();
        sendStatus();
    });

    fetchStatus();
});
//
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://68a4c2f3c123272fb9b3b847.mockapi.io/Tele1"; // Replace with your actual URL

    const tempDisplay = document.querySelector(".bg1 .text h1:nth-child(2)");
    const powerStatus = document.querySelector(".bg1 .text h1:nth-child(3)");
    const addBtn = document.getElementById("add");
    const subBtn = document.getElementById("sub");
    const powerBtn = document.getElementById("btn");

    const timeInput = document.querySelector("input[type='time']");
    const setTimerBtn = document.querySelector(".bg_t1 button");
    const timeDisplay = document.querySelector("h3:nth-of-type(2)");

    let temperature = 25;
    let isOn = false;
    let scheduledTime = null;
    let scheduledAction = null;

    function updateUI() {
        tempDisplay.textContent = temperature;
        powerStatus.textContent = isOn ? "ON" : "OFF";
        powerStatus.style.color = isOn ? "red" : "gray";
        powerBtn.style.color = isOn ? "blue" : "red";

        if (scheduledTime && scheduledAction) {
            const now = new Date();
            const [targetHours, targetMinutes] = scheduledTime.split(":").map(Number);
            const target = new Date(now);
            target.setHours(targetHours);
            target.setMinutes(targetMinutes);
            target.setSeconds(0);

            let diff = Math.floor((target - now) / 1000);

            if (diff >= 0) {
                const minutes = Math.floor(diff / 60).toString().padStart(2, "0");
                const seconds = (diff % 60).toString().padStart(2, "0");
                timeDisplay.innerHTML = `Time : in ${minutes}:${seconds}`;
            } else {
                timeDisplay.innerHTML = "Time :";
            }
        } else {
            timeDisplay.innerHTML = "Time :";
        }
    }

    async function fetchStatus() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            temperature = parseInt(data.temperature) || 25;
            isOn = data.power;
            scheduledTime = data.scheduledTime || null;
            scheduledAction = data.scheduledAction || null;
            updateUI();
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    async function sendStatus() {
        try {
            const payload = {
                temperature,
                power: isOn,
                scheduledTime,
                scheduledAction
            };
            await fetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error("Send error:", err);
        }
    }

    function normalizeTime(t) {
        return t;
    }

    setInterval(() => {
        if (!scheduledTime || !scheduledAction) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const currentTime = `${hours}:${minutes}`;

        if (currentTime === scheduledTime) {
            isOn = scheduledAction === "on";
            scheduledTime = null;
            scheduledAction = null;
            updateUI();
            sendStatus();
        }
    }, 10000);

    setInterval(() => {
        updateUI();
    }, 1000);

    addBtn.addEventListener("click", () => {
        if (isOn && temperature < 35) {
            temperature++;
            updateUI();
            sendStatus();
        }
    });

    subBtn.addEventListener("click", () => {
        if (isOn && temperature > 16) {
            temperature--;
            updateUI();
            sendStatus();
        }
    });

    powerBtn.addEventListener("click", () => {
        isOn = !isOn;
        updateUI();
        sendStatus();
    });

    setTimerBtn.addEventListener("click", () => {
        const selectedTime = timeInput.value;
        if (!selectedTime) {
            alert("Please select a time.");
            return;
        }

        const normalizedTime = normalizeTime(selectedTime);
        const action = confirm("Turn ON at selected time?\nClick Cancel to turn OFF instead") ? "on" : "off";

        scheduledTime = normalizedTime;
        scheduledAction = action;

        updateUI();
        sendStatus();
    });

    fetchStatus();
});
