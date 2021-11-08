function removeRecommendatations(tab, deleted) {
  function deleteNode(id, selector, isPageActive, parentIndexToDelete) {
    if (isPageActive) {
      const node = document.querySelector(selector);
      if (node) {
        let parent = node;
        for (let i = 0; i < parentIndexToDelete; i++) {
          parent = parent.parentElement;
        }
        parent.parentElement.removeChild(parent);
        deleted[id] = { id, state: true };
      };
      if (!deleted[id]) {
        deleted[id] = { id, state: false };
      }
    } else {
      deleted[id] = { id, state: null };
    }
  }

  const timer = setInterval(() => {
    deleteNode(0, 'ytd-page-manager ytd-browse ytd-two-column-browse-results-renderer div ytd-rich-grid-renderer #contents', tab.url.endsWith('youtube.com/'), 2);
    deleteNode(1, '.style-scope .ytd-watch-next-secondary-results-renderer', tab.url.includes('watch?v='), 1);
    deleteNode(2, 'ytd-comment-thread-renderer', tab.url.includes('watch?v='), 2);
    deleteNode(3, '#destination-buttons', tab.url.includes('feed/explore'), 4);
    deleteNode(4, '.ytp-endscreen-content', tab.url.includes('watch?v='), 1);
    if (deleted.every(node => node.state === true || node.state === null)) {
      console.log("cleared all annoyances");
      console.log(deleted);
      clearInterval(timer);
    }
  }, 500);
}

function removeIfActive(tabId, info) {
  chrome.tabs.get(tabId, function (tab) {
    if (tab.active && tab.url.includes('youtube.com')) {
      if (tab.url.includes('youtube.com') && info.status === 'complete') {
        let deleted = [];
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: removeRecommendatations,
          args: [tab, deleted]
        });
      }
    }
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, info) {
  removeIfActive(tabId, info);
});