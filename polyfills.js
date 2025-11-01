// Polyfill pour URL.canParse si nécessaire (Node.js < 18.17.0)
// Cette fonction est nécessaire pour Metro qui l'utilise dans son code
if (typeof global !== "undefined" && typeof global.URL !== "undefined") {
  if (typeof global.URL.canParse === "undefined") {
    global.URL.canParse = function (url, base) {
      try {
        new URL(url, base);
        return true;
      } catch {
        return false;
      }
    };
  }
}

// Polyfill également pour l'objet URL global
if (typeof URL !== "undefined" && typeof URL.canParse === "undefined") {
  URL.canParse = function (url, base) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}
