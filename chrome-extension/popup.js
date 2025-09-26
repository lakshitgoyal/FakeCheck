document.addEventListener('DOMContentLoaded', function () {
  const messageEl = document.getElementById('message');
  const resultsEl = document.getElementById('results');
  const errorEl = document.getElementById('error');
  
  const mediaPreviewEl = document.getElementById('media-preview');
  const verdictEl = document.getElementById('verdict');
  const reportSummaryEl = document.getElementById('report-summary');
  const reportLinkEl = document.getElementById('report-link');
  const errorMessageEl = document.getElementById('error-message');

  // Load the last analysis result from local storage
  chrome.storage.local.get(['lastAnalysis'], function (data) {
    const result = data.lastAnalysis;

    if (!result) {
      messageEl.textContent = 'No recent analysis. Right-click media to start.';
      return;
    }

    // Hide initial message
    messageEl.classList.add('hidden');

    if (result.error) {
      // Display error state
      errorEl.classList.remove('hidden');
      errorMessageEl.textContent = result.error;
    } else if (result.verdict) {
      // Display results
      resultsEl.classList.remove('hidden');
      
      // Set the preview, verdict, and summary
      mediaPreviewEl.src = result.mediaUrl || 'icons/icon128.png';
      verdictEl.textContent = result.verdict.replace(/_/g, ' ');
      verdictEl.className = result.verdict.toLowerCase().replace(/_/g, '-');
      
      // Extract the first two sentences of the report for a summary
      const summary = result.report?.split('.').slice(0, 2).join('.') + '.' || 'Analysis complete.';
      reportSummaryEl.textContent = summary;
      
      // Show report link if it exists
      if(result.report_url) { // This key might not exist in the current API response
        reportLinkEl.href = result.report_url;
        reportLinkEl.classList.remove('hidden');
      }
    } else {
       messageEl.textContent = 'Analysis result was unclear. Please try again.';
    }

    // Clear the stored analysis after showing it to prevent showing stale results next time.
    // chrome.storage.local.remove('lastAnalysis');
  });
});
