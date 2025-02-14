document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("greynessSlider");
  const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

  // Load saved settings
  chrome.storage.sync.get(["greyness", "darkMode"], ({ greyness = 0.3, darkMode = false }) => {
    slider.value = greyness;
    toggleDarkModeBtn.textContent = "Toggle Current Mode"
  });

  // Save greyness value when slider changes
  slider.addEventListener("input", () => {
    chrome.storage.sync.set({ greyness: slider.value });
  });

  // Toggle dark mode
  toggleDarkModeBtn.addEventListener("click", () => {
    chrome.storage.sync.get("darkMode", ({ darkMode = false }) => {
      chrome.storage.sync.set({ darkMode: !darkMode });
      toggleDarkModeBtn.textContent = "Toggle Current Mode";

      // Send message to content script to update styles
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { toggleDarkMode: !darkMode });
      });
    });
  });
});


  