// content.js
// Runs in the context of the webpage that the user is viewing.
// Meant to enable typewriter scrolling in Google Docs.

const enableTypewriterScrolling = () => {
  let scrollTimeout;
  let lastCursorTop = 0;
  let allowAutoScroll = true;

  const scrollToCenter = () => {
    if (!allowAutoScroll) return;

    const editor = document.querySelector(".kix-appview-editor");
    const cursor = document.querySelector(".kix-cursor-caret");

    if (editor && cursor) {
      const cursorRect = cursor.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();

      const offset = cursorRect.top - editorRect.top;
      const scrollTop = editor.scrollTop;
      const desiredScrollTop = scrollTop + offset - editorRect.height / 2;

      // Only scroll if the cursor has moved vertically
      if (Math.abs(cursorRect.top - lastCursorTop) > 1) {
        editor.scrollTo({ top: desiredScrollTop, behavior: "smooth" });
        lastCursorTop = cursorRect.top;
      }
    }
  };

  const debouncedScrollToCenter = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => requestAnimationFrame(scrollToCenter), 50);
  };

  const setupListeners = (editor, inputFrame) => {
    // --- MODIFICATION ---
    // Disable auto-scrolling on any mouse activity in the editor.
    editor.addEventListener('wheel', () => { allowAutoScroll = false; }, { passive: true });
    editor.addEventListener('mousedown', () => { allowAutoScroll = false; });

    // --- MODIFICATION ---
    // Only trigger auto-scrolling from a keyboard event.
    if (inputFrame.contentDocument) {
      inputFrame.contentDocument.addEventListener('keydown', () => {
        // Re-enable scrolling on key press and trigger the check.
        allowAutoScroll = true;
        debouncedScrollToCenter();
      });
    } else {
        console.warn("Typewriter Scrolling: Could not find Docs input frame.");
    }
  };

  const checkInterval = setInterval(() => {
    const editor = document.querySelector(".kix-appview-editor");
    const inputFrame = document.querySelector(".docs-texteventtarget-iframe");

    if (editor && inputFrame) {
      clearInterval(checkInterval);
      setupListeners(editor, inputFrame);
      console.log("Typewriter Scrolling activated.");
    }
  }, 100);
};

// Call the function to enable typewriter scrolling
enableTypewriterScrolling();