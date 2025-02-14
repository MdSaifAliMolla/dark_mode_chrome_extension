(() => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(128, 128, 128, 0.3)";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "9999";
  document.body.appendChild(overlay);

  // Apply dark mode
  function applyDarkMode(enable) {
    if (enable) {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    } else {
      document.documentElement.style.filter = "";
    }
  }

  // Load saved settings
  chrome.storage.sync.get(["greyness", "darkMode"], ({ greyness = 0.3, darkMode = false }) => {
    overlay.style.backgroundColor = `rgba(128, 128, 128, ${greyness})`;
    applyDarkMode(darkMode);
  });

  // Listen for changes in greyness and dark mode settings
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.greyness) {
      overlay.style.backgroundColor = `rgba(128, 128, 128, ${changes.greyness.newValue})`;
    }
    if (changes.darkMode) {
      applyDarkMode(changes.darkMode.newValue);
    }
  });

  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggleDarkMode !== undefined) {
      applyDarkMode(request.toggleDarkMode);
      sendResponse({ status: "Dark mode toggled" });
    }
  });
})();
