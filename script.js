const SETTINGS_KEY = "gamerxdgz-dashboard-settings";

const defaultSettings = {
    timeStyle: "digital",
    timeFormat: "12"
};

const greetingElement = document.getElementById("greeting");
const timeDisplay = document.getElementById("timeDisplay");
const dateDisplay = document.getElementById("dateDisplay");
const settingsButton = document.getElementById("settingsButton");
const closeSettings = document.getElementById("closeSettings");
const doneSettings = document.getElementById("doneSettings");
const resetSettings = document.getElementById("resetSettings");
const settingsOverlay = document.getElementById("settingsOverlay");
const timeStyleSelect = document.getElementById("timeStyle");
const timeFormatSelect = document.getElementById("timeFormat");

function loadSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (!saved) {
            return { ...defaultSettings };
        }

        const parsed = JSON.parse(saved);

        return {
            ...defaultSettings,
            ...parsed
        };

    } catch {
        return { ...defaultSettings };
    }
}

let settings = loadSettings();

function saveSettings() {
    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );
}

function getGitHubUsername() {
    const path = window.location.pathname
        .replace(/^\/+|\/+$/g, "") // FIXED: Properly escaped the forward slashes
        .split("/");
        
    /*
     * GitHub Pages project URLs look like:
     *
     * username.github.io/repository
     *
     * For this repository, the fallback is GamerXD_GZ.
     *
     * If the page is hosted directly on the user's GitHub
     * Pages profile, the pathname is also handled safely.
     */

    if (path.length > 0 && path[0]) {
        return "GamerXD_GZ";
    }

    return "GamerXD_GZ";
}

function updateGreeting() {
    const username = getGitHubUsername();
    greetingElement.textContent =
        `Hello, ${username}.`;
}

function getTimeParts() {
    const now = new Date();
    let hours = now.getHours();

    const minutes = now.getMinutes()
        .toString()
        .padStart(2, "0");

    const seconds = now.getSeconds()
        .toString()
        .padStart(2, "0");

    let suffix = "";

    if (settings.timeFormat === "12") {
        suffix = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }
    }

    hours = hours
        .toString()
        .padStart(2, "0");

    return {
        hours,
        minutes,
        seconds,
        suffix
    };
}

function updateClock() {
    const now = new Date();
    const parts = getTimeParts();

    const date = now.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

    dateDisplay.textContent = date;

    timeDisplay.classList.remove("dialogue");

    if (settings.timeStyle === "dialog") {

        timeDisplay.classList.add("dialogue");

        const suffix = parts.suffix
            ? ` ${parts.suffix}`
            : "";

        timeDisplay.textContent =
            `It's ${parts.hours}:${parts.minutes}:${parts.seconds}${suffix}.`;

    } else {

        const suffix = parts.suffix
            ? ` ${parts.suffix}`
            : "";

        timeDisplay.textContent =
            `${parts.hours}:${parts.minutes}:${parts.seconds}${suffix}`;
    }
}

function openSettings() {
    timeStyleSelect.value = settings.timeStyle;
    timeFormatSelect.value = settings.timeFormat;
    settingsOverlay.classList.remove("hidden");
    settingsOverlay.setAttribute("aria-hidden", "false");
}

function closeSettingsPanel() {
    settingsOverlay.classList.add("hidden");
    settingsOverlay.setAttribute("aria-hidden", "true");
}

settingsButton.addEventListener(
    "click",
    openSettings
);

closeSettings.addEventListener(
    "click",
    closeSettingsPanel
);

doneSettings.addEventListener(
    "click",
    () => {
        settings.timeStyle =
            timeStyleSelect.value;

        settings.timeFormat =
            timeFormatSelect.value;

        saveSettings();
        updateClock();

        closeSettingsPanel();
    }
);

resetSettings.addEventListener(
    "click",
    () => {
        settings = {
            ...defaultSettings
        };

        timeStyleSelect.value =
            settings.timeStyle;

        timeFormatSelect.value =
            settings.timeFormat;

        saveSettings();
        updateClock();
    }
);

settingsOverlay.addEventListener(
    "click",
    (event) => {
        if (event.target === settingsOverlay) {
            closeSettingsPanel();
        }
    }
);

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeSettingsPanel();
        }
    }
);

updateGreeting();
updateClock();

setInterval(
    updateClock,
    1000
);
