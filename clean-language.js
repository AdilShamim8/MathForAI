(function () {
  "use strict";

  var bnDetect = /[\u0980-\u09FF]/;
  var bnGlobal = /[\u0980-\u09FF]+/g;

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
    var elements = root.querySelectorAll("*");
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

  function run() {
    cleanTitle();
    cleanAll(document.body);
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
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
