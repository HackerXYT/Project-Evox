const server = "https://uniwa.evoxs.xyz"
async function reach(url, addServer, type, method = "GET", body = null, headers = {}) {
  try {
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    // Only attach body if it's a POST, PUT, PATCH, etc.
    if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method) && body) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(`${addServer ? server : ""}${url}`, options);

    if (!response.ok) {
      if (response.status === 403) {
        document.getElementById("home").style.filter = 'brightness(0.5)'
        document.getElementById("alert").style.display = null
      }
      throw new Error("Network response was not ok " + response.status);
    }

    const data = await response[!type ? "json" : type]();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

function getToken() {
  return localStorage.getItem("university")
}

function emojiDominantColor(emoji, size = 64) {
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.height = size;

  ctx.clearRect(0, 0, size, size);
  ctx.font = `${size * 0.8}px system-ui, apple color emoji, segoe ui emoji`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2);

  const data = ctx.getImageData(0, 0, size, size).data;
  const colors = {};

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = data.slice(i, i + 4);
    if (a < 128) continue; // ignore transparent pixels

    // reduce noise by quantizing colors
    const key = `${r >> 3},${g >> 3},${b >> 3}`;
    colors[key] = (colors[key] || 0) + 1;
  }

  const dominant = Object.entries(colors)
    .sort((a, b) => b[1] - a[1])[0][0]
    .split(",")
    .map(v => parseInt(v) << 3);

  return (
    "#" +
    dominant
      .map(v => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function stripHTML(inputString) {
  const div = document.createElement('div');
  div.innerHTML = inputString;
  return div.textContent || div.innerText || '';
}
let isTransitioning = false; // global or at outer scope
document.addEventListener('DOMContentLoaded', () => {
  const announcements = document.querySelector('.announcements');
  const container = document.getElementById('announcementsContainer');
  let placeholder = null;
  let touchStartY = 0;
  let canPullToClose = false; // Only allow closing if at top

  if (!container) return;

  // Enter fullscreen on scroll down (keep this – it works great)

  container.addEventListener('scroll', () => {
    // Usage
    if (isDesktop()) {
      return;
    }

    if (isTransitioning) return; // ignore scroll during animation
    if (container.scrollTop > 10 && !announcements.classList.contains('fullscreen')) {
      enterFullScreen(announcements, () => {
        placeholder = createPlaceholder(announcements);
      });
    }
  });

  // ── Pull-to-close with touch (fixed version) ──
  container.addEventListener('touchstart', (e) => {
    if (!announcements.classList.contains('fullscreen')) return;

    touchStartY = e.touches[0].clientY;
    // Only enable pull-to-close if we're already at the very top
    canPullToClose = container.scrollTop <= 0;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!announcements.classList.contains('fullscreen') || !canPullToClose) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    // If user pulls down more than threshold → close
    if (deltaY > 50) {  // 50px feels very natural – adjust if needed
      // Do NOT call preventDefault() here → avoids the warning
      // Just trigger exit immediately
      exitFullScreen(announcements, placeholder, () => {
        placeholder = null;
      });
      canPullToClose = false; // Prevent multiple triggers
    }
    // Optional: Allow small pull without closing (feels smoother)
    // No preventDefault() needed → browser handles rubber band naturally
  }, { passive: true });  // ← IMPORTANT: Set to passive!

  container.addEventListener('touchend', () => {
    canPullToClose = false;
  }, { passive: true });
});

function createPlaceholder(element) {
  const placeholder = document.createElement('div');
  const rect = element.getBoundingClientRect();
  placeholder.style.width = `${rect.width}px`;
  placeholder.style.height = `${rect.height}px`;
  placeholder.style.visibility = 'hidden'; // Invisible but holds space
  element.parentNode.insertBefore(placeholder, element);
  return placeholder;
}

function enterFullScreen(element, createPlaceholderCallback) {
  const rect = element.getBoundingClientRect();

  // Create and insert placeholder to hold space BEFORE fixing position
  createPlaceholderCallback();

  // Now set to fixed with current position/size
  element.style.position = 'fixed';
  element.style.top = `${rect.top}px`;
  element.style.left = `${rect.left}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
  element.style.marginTop = '0'
  element.style.margin = '0'
  // Force reflow to apply changes
  void element.offsetHeight;

  // Add class and transition to full screen
  element.classList.add('fullscreen');
  // These are overridden by .fullscreen, but explicitly set for transition trigger if needed
  element.style.top = '0px';
  element.style.left = '0px';
  element.style.width = '100vw';
  element.style.height = '100vh';
}

function exitFullScreen(element, placeholder, cleanupCallback) {
  if (!placeholder) return;

  const targetRect = placeholder.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // Freeze element visually
  element.style.position = 'fixed';
  element.style.top = `${elementRect.top}px`;
  element.style.left = `${elementRect.left}px`;
  element.style.width = `${elementRect.width}px`;
  element.style.height = `${elementRect.height}px`;

  void element.offsetHeight; // force reflow

  const deltaX = targetRect.left - elementRect.left;
  const deltaY = targetRect.top - elementRect.top;
  const scaleX = targetRect.width / elementRect.width;
  const scaleY = targetRect.height / elementRect.height;

  requestAnimationFrame(() => {
    element.style.transition = 'transform 0.3s ease';
    element.style.margin = '-10px'
    element.style.marginTop = '10px'
    element.style.transform = `
      translate(${deltaX}px, ${deltaY}px)
      scale(${scaleX}, ${scaleY})
    `;
  });

  const cleanup = () => {
    element.classList.remove('fullscreen');
    element.style.transition = '';
    element.style.transform = '';
    element.style.position = '';
    element.style.top = '';
    element.style.left = '';
    element.style.width = '';
    element.style.height = '';
    placeholder.remove();
    cleanupCallback?.();
    element.removeEventListener('transitionend', cleanup);
  };

  element.addEventListener('transitionend', cleanup);
  setTimeout(cleanup, 400);
}




function cleanHtml(htmlString) {
  // Remove inline color styles
  htmlString = htmlString.replace(/style="([^"]*)"/gi, (match, styleContent) => {
    const newStyle = styleContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !/^color\s*:/i.test(s))
      .join('; ');

    return newStyle ? `style="${newStyle}"` : '';
  });

  // Remove &nbsp; ONLY when near hyphens
  // Handles: &nbsp;-, -&nbsp;, &nbsp; - , - &nbsp;
  htmlString = htmlString.replace(
    /(&nbsp;\s*-\s*)|(\s*-\s*&nbsp;)/gi,
    match => match.replace(/&nbsp;/gi, '')
  );

  return htmlString;
}


document.getElementById('search-moodle').addEventListener('focus', (e) => {
  e.target.removeAttribute('readonly');
});

function timeAgoInGreek(isoDate) {
  const now = new Date();
  const past = new Date(isoDate);

  if (now < past) return "στο μέλλον";

  const diffMs = now - past;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "λίγα δευτερόλεπτα πριν";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes === 1 ? "1 λεπτό πριν" : `${minutes} λεπτά πριν`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 ώρα πριν" : `${hours} ώρες πριν`;

  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "1 μέρα πριν" : `${days} μέρες πριν`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return weeks === 1 ? "1 εβδομάδα πριν" : `${weeks} εβδομάδες πριν`;

  // Correct months and years using actual dates
  const yearsDiff = now.getFullYear() - past.getFullYear();
  const monthsDiff = now.getMonth() - past.getMonth() + yearsDiff * 12;

  if (monthsDiff < 12) return monthsDiff === 1 ? "1 μήνα πριν" : `${monthsDiff} μήνες πριν`;

  const years = Math.floor(monthsDiff / 12);
  return years === 1 ? "1 έτος πριν" : `${years} έτη πριν`;
}


function closeDrawer() {
  document.getElementById("home").style.filter = "brightness(1)"
  document.getElementById("drawer").classList.remove("active")
}

function openDrawer() {
  document.getElementById("home").style.filter = "brightness(0.5)"
  document.getElementById("drawer").classList.add("active")
}

function capitalizeGreek(str) {
  if (!str) return str;
  return str[0].toLocaleUpperCase('el-GR') + str.slice(1);
}


function getFileType(extension) {
  if (!extension) return "Unknown";

  const ext = extension.toLowerCase().replace(/^\./, ''); // remove leading dot if present

  const types = {
    'ppt': 'Αρχείο PowerPoint',
    'pptx': 'Αρχείο PowerPoint',
    'doc': 'Αρχείο Word',
    'docx': 'Αρχείο Word',
    'xls': 'Αρχείο Excel',
    'xlsx': 'Αρχείο Excel',
    'pdf': 'Αρχείο PDF',
    'txt': 'Αρχείο κειμένου',
    'jpg': 'Εικόνα',
    'jpeg': 'Εικόνα', //
    'png': 'Εικόνα',
    'gif': 'Εικόνα GIF',
    'mp3': 'Αρχείο ήχου',
    'wav': 'Αρχείο ήχου',
    'mp4': 'Βίντεο',
    'mov': 'Βίντεο',
    'zip': 'Συμπιεσμένο ZIP',
    'rar': 'Συμπιεσμένο RAR',
    // add more as needed
  };

  return types[ext] || "Unknown";
}

function getFileExtension(filename) {
  if (!filename) return ''
  if (typeof filename !== 'string' || !filename.includes('.')) return '';

  const parts = filename.split('.');
  return parts.pop().toLowerCase(); // returns extension in lowercase
}

function isDesktop() {
  // Option 1: Using userAgent to detect mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|windows phone|blackberry|mobile/i.test(userAgent);
  if (!isMobile) return true;

  // Option 2 (optional): fallback to screen width check
  return window.innerWidth > 1024; // Consider devices wider than 1024px as desktop
}


function logout() {
  const keysToRemove = [
    "university",
    "uni_name",
    "uni_pfp",
    "uni_notifications"
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  window.location.reload();

}

function searchCourses(searchTerm) {
  if (!searchTerm || !activeCourse) return [];

  const lowerSearch = searchTerm.toLowerCase();

  return activeCourse
    .map(section => {
      const filteredModules = section.modules
        .map(module => {
          const contents = module.contents || [];

          const filteredContents = contents.filter(content =>
            content.filename.toLowerCase().includes(lowerSearch)
          );

          if (module.name.toLowerCase().includes(lowerSearch) || filteredContents.length > 0) {
            return {
              ...module,
              contents: filteredContents
            };
          }

          return null;
        })
        .filter(module => module !== null);

      if (filteredModules.length > 0) {
        return {
          ...section,
          modules: filteredModules
        };
      }

      return null;
    })
    .filter(section => section !== null);
}