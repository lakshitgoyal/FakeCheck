// FakeCheck Chrome Extension - Background Script

// --- Setup & Initialization ---

// Function to get API key from storage
async function getApiKey() {
  const result = await chrome.storage.sync.get(['apiKey']);
  return result.apiKey;
}

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'fakecheck-analyze',
    title: 'Analyze with FakeCheck',
    contexts: ['image', 'video', 'audio'],
  });
  console.log('FakeCheck context menu created.');
});

// --- Event Listeners ---

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'fakecheck-analyze' && tab && info.srcUrl) {
    const mediaUrl = info.srcUrl;
    console.log('Analyzing media:', mediaUrl);

    // Show loading state in popup badge
    await chrome.action.setBadgeText({ text: '...' });
    await chrome.action.setBadgeBackgroundColor({ color: '#9A7BFF' }); // Accent color

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        // Notify user to set API key
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'API Key Required',
          message: 'Please set your FakeCheck API key in the extension options.',
          priority: 2,
        });
        await chrome.action.setBadgeText({ text: '!' });
        await chrome.action.setBadgeBackgroundColor({ color: '#FFC107' }); // Warning yellow
        // Open options page for the user to set the key
        chrome.runtime.openOptionsPage();
        return;
      }
      
      // --- API endpoint for URL analysis ---
      // IMPORTANT: This must be the URL of your deployed Next.js backend's API route
      // that can handle URL fetching and analysis.
      const FAKECHECK_API_ENDPOINT = 'https://fakecheck-app-prototype-fb-prod.web.app/api/analyze-url'; 
      
      const response = await fetch(FAKECHECK_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ url: mediaUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(`API request failed: ${response.statusText} - ${errorData.error || ''}`);
      }

      const result = await response.json();
      
      // The result from our analyzeUrl action includes the report and verdict
      // Let's combine it with the mediaUrl for the popup
      const finalResult = { ...result, mediaUrl: mediaUrl };

      // Store result for the popup
      await chrome.storage.local.set({ lastAnalysis: finalResult });

      // Update badge based on verdict
      updateBadgeForResult(result);
      
      // If safe, send a message to content script to add overlay
      if (result.verdict === 'Safe') {
         sendBadgeToContentScript(tab.id, mediaUrl);
      }

    } catch (error) {
      console.error('FakeCheck Analysis Error:', error);
      await chrome.storage.local.set({
        lastAnalysis: { error: error.message, mediaUrl },
      });
      await chrome.action.setBadgeText({ text: 'ERR' });
      await chrome.action.setBadgeBackgroundColor({ color: '#F44336' }); // Red
    }
  }
});

// --- Helper Functions ---

function updateBadgeForResult(result) {
  if (!result) return;

  let badgeText = '';
  let badgeColor = '#9A7BFF'; // Default accent

  switch (result.verdict) {
    case 'Safe':
      badgeText = '✓';
      badgeColor = '#4CAF50'; // Green
      break;
    case 'Suspicious':
      badgeText = '?';
      badgeColor = '#FF9800'; // Orange
      break;
    case 'Likely Manipulated':
      badgeText = 'X';
      badgeColor = '#F44336'; // Red
      break;
  }

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });

  // Clear badge after a few seconds
  setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
  }, 5000);
}

// Function to communicate with content scripts
async function sendBadgeToContentScript(tabId, mediaUrl) {
    try {
        const { overlayEnabled } = await chrome.storage.sync.get({ overlayEnabled: true });
        if (overlayEnabled) {
            chrome.tabs.sendMessage(tabId, {
                action: "addVerifiedBadge",
                mediaUrl: mediaUrl,
            });
        }
    } catch (e) {
        console.error("Failed to send message to content script:", e);
    }
}
