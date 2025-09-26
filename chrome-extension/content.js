// FakeCheck Chrome Extension - Content Script

console.log("FakeCheck content script loaded.");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addVerifiedBadge") {
    addBadgeToMedia(request.mediaUrl);
  }
  // Return true to indicate we will send a response asynchronously if needed.
  return true; 
});

function addBadgeToMedia(mediaUrl) {
  // Find all matching media elements on the page. We use a query that handles cases
  // where the src might be encoded differently.
  const mediaElements = document.querySelectorAll(`img[src="${mediaUrl}"], video[src="${mediaUrl}"], source[src="${mediaUrl}"]`);
  
  mediaElements.forEach(element => {
    const targetElement = element.tagName === 'SOURCE' ? element.closest('video') : element;
    
    if (!targetElement) return;

    // Avoid adding multiple badges to the same element
    if (targetElement.parentElement.classList.contains('fakecheck-verified-wrapper')) {
      return;
    }

    console.log("Adding verified badge to:", targetElement);

    // Create a wrapper to position the badge relative to the media
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.classList.add('fakecheck-verified-wrapper');

    // Create the badge element
    const badge = document.createElement('div');
    badge.style.position = 'absolute';
    badge.style.bottom = '10px';
    badge.style.right = '10px';
    badge.style.width = '32px';
    badge.style.height = '32px';
    badge.style.zIndex = '9999';
    badge.style.borderRadius = '50%';
    badge.style.background = 'hsla(251, 90%, 63%, 0.8)'; // Semi-transparent purple
    badge.style.backdropFilter = 'blur(5px)';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    badge.title = "Verified by FakeCheck as 'Safe'";
    
    // Checkmark SVG icon
    badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`;
    
    // Insert wrapper and move the media element inside it
    if(targetElement.parentNode) {
      targetElement.parentNode.insertBefore(wrapper, targetElement);
    }
    wrapper.appendChild(targetElement);
    wrapper.appendChild(badge);
  });
}
