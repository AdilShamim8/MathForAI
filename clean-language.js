(function () {
  "use strict";

  var THEME_KEY = "math-for-ai-theme";
  var bnDetect = /[\u0980-\u09FF]/;
  var bnGlobal = /[\u0980-\u09FF]+/g;

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function getStoredTheme() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      if (value === "light" || value === "dark") {
        return value;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function setStoredTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      return;
    }
  }

  function currentTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function updateThemeControls(theme) {
    var controls = document.querySelectorAll("[data-theme-toggle]");
    controls.forEach(function (control) {
      var next = theme === "dark" ? "light" : "dark";
      control.setAttribute("aria-label", "Switch to " + next + " mode");
      control.setAttribute("title", "Switch to " + next + " mode");
      control.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeControls(theme);
  }

  applyTheme(currentTheme());

  function trimSeparators(text) {
    var cleaned = text;
    cleaned = cleaned.replace(/\s*\u2014\s*$/, "");
    cleaned = cleaned.replace(/\s*\|\s*$/, "");
    cleaned = cleaned.replace(/\s*-\s*$/, "");
    return cleaned;
  }

  function cleanText(text) {
    if (!bnDetect.test(text)) {
      return text;
    }
    var cleaned = text.replace(bnGlobal, "");
    cleaned = cleaned.replace(/\s{2,}/g, " ");
    cleaned = trimSeparators(cleaned);
    return cleaned.trim();
  }

  function markHadBn(node) {
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      node.setAttribute("data-had-bn", "1");
    }
  }

  function cleanTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      var original = node.nodeValue || "";
      if (!bnDetect.test(original)) {
        return;
      }
      markHadBn(node.parentNode);
      var cleaned = cleanText(original);
      if (cleaned === "") {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      } else if (cleaned !== original) {
        node.nodeValue = cleaned;
      }
    });
  }

  function removeBnOnlyElements(root) {
    var elements = root.querySelectorAll("[data-had-bn='1']");
    elements.forEach(function (el) {
      var text = (el.textContent || "").trim();
      var hasAscii = /[A-Za-z0-9]/.test(text);
      if (!hasAscii) {
        el.remove();
      }
    });
  }

  function removeEmptyElements(root) {
    var elements = root.querySelectorAll("[data-had-bn='1']");
    elements.forEach(function (el) {
      if (el.childElementCount === 0 && el.textContent.trim() === "") {
        el.remove();
      }
    });
  }

  function cleanAll(root) {
    cleanTextNodes(root);
    removeBnOnlyElements(root);
    removeEmptyElements(root);
  }

  function cleanTitle() {
    if (!document.title) {
      return;
    }
    var cleaned = cleanText(document.title);
    if (cleaned) {
      document.title = cleaned;
    }
  }

  function ensureSitebar() {
    if (document.querySelector(".sitebar")) {
      return;
    }

    var bar = document.createElement("div");
    bar.className = "sitebar";
    bar.innerHTML = [
      '<div class="sitebar__inner">',
      '  <a class="sitebar__brand" href="index.html" aria-label="Math For AI home">',
      '    <span class="sitebar__mark" aria-hidden="true">M</span>',
      "    <span>Math For AI</span>",
      "  </a>",
      '  <nav class="sitebar__links" aria-label="Site">',
      '    <a class="sitebar__link" href="index.html">Home</a>',
      '    <a class="sitebar__link" href="index.html#modules">Modules</a>',
      '    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme"></button>',
      "  </nav>",
      "</div>"
    ].join("");

    document.body.insertBefore(bar, document.body.firstChild);
    updateThemeControls(currentTheme());
  }

  function setupThemeToggle() {
    document.addEventListener("click", function (event) {
      var control = event.target.closest("[data-theme-toggle]");
      if (!control) {
        return;
      }
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setStoredTheme(next);
      applyTheme(next);
    });

    if (window.matchMedia) {
      var media = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () {
        if (!getStoredTheme()) {
          applyTheme(getSystemTheme());
        }
      };
      if (media.addEventListener) {
        media.addEventListener("change", onChange);
      } else if (media.addListener) {
        media.addListener(onChange);
      }
    }
  }

  function setAriaForDisclosure(el) {
    var panel = el.nextElementSibling;
    if (!panel) {
      return;
    }
    var isOpen = panel.classList.contains("open");
    el.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function enhanceInteractions(root) {
    var disclosureButtons = root.querySelectorAll(".q, .qbtn, .q-btn, .qb");
    disclosureButtons.forEach(function (el) {
      if (el.tagName !== "BUTTON") {
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
      } else if (!el.getAttribute("type")) {
        el.setAttribute("type", "button");
      }
      setAriaForDisclosure(el);
    });

    var buttons = root.querySelectorAll(".nav-btn, .nb, .topic-btn, .nav-item");
    buttons.forEach(function (button) {
      if (button.tagName === "BUTTON" && !button.getAttribute("type")) {
        button.setAttribute("type", "button");
      }
    });

    var externalLinks = root.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function (link) {
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function setupDisclosureKeyboard() {
    document.addEventListener("keydown", function (event) {
      var el = event.target.closest(".q, .qbtn, .q-btn, .qb");
      if (!el || el.tagName === "BUTTON") {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        el.click();
      }
    });

    document.addEventListener("click", function (event) {
      var el = event.target.closest(".q, .qbtn, .q-btn, .qb");
      if (!el) {
        return;
      }
      window.setTimeout(function () {
        setAriaForDisclosure(el);
      }, 0);
    });
  }

  function run() {
    ensureSitebar();
    cleanTitle();
    cleanAll(document.body);
    enhanceInteractions(document);
    setupThemeToggle();
    setupDisclosureKeyboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          var cleaned = cleanText(node.nodeValue || "");
          if (cleaned === "") {
            if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
          } else if (cleaned !== node.nodeValue) {
            node.nodeValue = cleaned;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          cleanAll(node);
          enhanceInteractions(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
