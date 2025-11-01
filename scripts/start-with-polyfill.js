#!/usr/bin/env node

// Charger le polyfill avant tout
require("../polyfills");

// Démarrer Expo avec le polyfill chargé
require("expo/cli");
