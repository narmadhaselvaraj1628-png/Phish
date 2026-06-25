// Central configuration — the server URL is configurable from the popup UI.
// This file holds the default and the shared helpers that derive every endpoint
// from a single base URL, so all scripts agree on where the backend lives.

const DEFAULT_API_BASE_URL = 'http://ec2-44-194-162-249.compute-1.amazonaws.com:3000';
const CHECK_URL_PATH = '/api/check-url';

// Kept for backwards compatibility with any older reference to the full endpoint.
const DEFAULT_API_URL = DEFAULT_API_BASE_URL + CHECK_URL_PATH;

/**
 * Normalizes a server base URL: trims whitespace and strips trailing slashes.
 * Returns '' for blank input.
 */
function normalizeServerUrl(input) {
  if (!input) return '';
  return String(input).trim().replace(/\/+$/, '');
}

/**
 * Validates that a string is a usable http(s) server URL.
 */
function isValidServerUrl(input) {
  const value = normalizeServerUrl(input);
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Reads the configured server base URL from storage, falling back to the default.
 * Works in both the service worker (importScripts) and pages (<script>).
 */
async function getServerBaseUrl() {
  const result = await chrome.storage.sync.get(['serverUrl']);
  return normalizeServerUrl(result.serverUrl) || DEFAULT_API_BASE_URL;
}

/**
 * Builds the URL-check endpoint from the configured base URL.
 */
async function getCheckUrlEndpoint() {
  const base = await getServerBaseUrl();
  return base + CHECK_URL_PATH;
}
