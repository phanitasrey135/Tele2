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
        const data = {
            temperature,
            power: isOn,
            timer: scheduledTime && scheduledAction ? { time: scheduledTime, action: scheduledAction } : null
        };

        console.log("Sending status:", data);

        fetch('https://68a4c2f3c123272fb9b3b847.mockapi.io/Tele1', {  // Replace with your mockapi URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(json => {
            console.log('Status sent successfully:', json);
        })
        .catch(error => {
            console.error('Error sending status:', error);
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
