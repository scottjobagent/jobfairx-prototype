(function() {
  var BREAKPOINT = 1024;

  function shouldBlock() {
    return window.__mobileBlockForceShow || window.innerWidth <= BREAKPOINT;
  }

  function createOverlay() {
    if (document.getElementById('mobileBlockOverlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'mobileBlockOverlay';

    var css =
      '#mobileBlockOverlay {' +
        'display: none;' +
        'position: fixed;' +
        'top: 0; left: 0; right: 0; bottom: 0;' +
        'background: #fff;' +
        'z-index: 99999;' +
        'flex-direction: column;' +
        'align-items: center;' +
        'justify-content: center;' +
        'padding: 32px 28px;' +
        'text-align: center;' +
        'font-family: "Noto Sans", -apple-system, BlinkMacSystemFont, sans-serif;' +
        '-webkit-font-smoothing: antialiased;' +
      '}' +
      '#mobileBlockOverlay.active { display: flex; }' +
      '#mobileBlockOverlay * { margin: 0; padding: 0; box-sizing: border-box; }' +

      '.mb-icon {' +
        'width: 64px;' +
        'height: 64px;' +
        'background: #f0f5ff;' +
        'border-radius: 50%;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'margin-bottom: 24px;' +
      '}' +
      '.mb-icon svg {' +
        'width: 32px;' +
        'height: 32px;' +
        'color: #0044B3;' +
      '}' +

      '.mb-title {' +
        'font-size: 20px;' +
        'font-weight: 700;' +
        'color: #2d2d2d;' +
        'margin-bottom: 10px;' +
        'line-height: 1.3;' +
      '}' +
      '.mb-desc {' +
        'font-size: 14px;' +
        'color: #595959;' +
        'line-height: 1.6;' +
        'max-width: 300px;' +
        'margin-bottom: 28px;' +
      '}' +

      '.mb-btn {' +
        'display: inline-flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'gap: 8px;' +
        'padding: 12px 24px;' +
        'background: #0044B3;' +
        'color: #fff;' +
        'font-size: 16px;' +
        'font-weight: 700;' +
        'border: none;' +
        'border-radius: 8px;' +
        'cursor: pointer;' +
        'font-family: "Noto Sans", -apple-system, BlinkMacSystemFont, sans-serif;' +
        'text-decoration: none;' +
        'transition: background 0.15s;' +
        '-webkit-appearance: none;' +
      '}' +
      '.mb-btn:hover { background: #003399; }' +
      '.mb-btn:visited { color: #fff; }';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    overlay.innerHTML =
      '<div class="mb-icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="2" y="3" width="20" height="14" rx="2"/>' +
          '<line x1="8" y1="21" x2="16" y2="21"/>' +
          '<line x1="12" y1="17" x2="12" y2="21"/>' +
        '</svg>' +
      '</div>' +

      '<h1 class="mb-title">Desktop required</h1>' +

      '<p class="mb-desc">' +
        'Your hiring dashboard is built for desktop screens. To manage events, interview candidates, and review applicants, switch to a larger screen.' +
      '</p>' +

      '<a class="mb-btn" href="https://www.jobfairx.com/employers">' +
        'Back to JobFairX' +
      '</a>';

    document.body.appendChild(overlay);
  }

  function toggle() {
    var overlay = document.getElementById('mobileBlockOverlay');
    if (!overlay) return;
    if (shouldBlock()) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createOverlay();
      toggle();
    });
  } else {
    createOverlay();
    toggle();
  }

  window.addEventListener('resize', toggle);
})();
