
// Simple client-side rate limiting utility
// In a production environment, this should be enforced on the server/edge function

const RATE_LIMIT_KEY = 'booking_attempts';
const LIMIT_COUNT = 5;
const LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export const checkRateLimit = async () => {
  // Try to get IP (best effort client-side)
  let ip = 'unknown';
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip = data.ip;
  } catch (e) {
    console.warn('Could not determine IP address for rate limiting');
  }

  const now = Date.now();
  const storedData = localStorage.getItem(RATE_LIMIT_KEY);
  let attempts = storedData ? JSON.parse(storedData) : [];

  // Filter out old attempts
  attempts = attempts.filter(timestamp => now - timestamp < LIMIT_WINDOW_MS);

  if (attempts.length >= LIMIT_COUNT) {
    return {
      allowed: false,
      error: 'Too many booking attempts. Please try again later.',
      ip
    };
  }

  return { allowed: true, ip };
};

export const recordAttempt = () => {
  const now = Date.now();
  const storedData = localStorage.getItem(RATE_LIMIT_KEY);
  let attempts = storedData ? JSON.parse(storedData) : [];
  
  // Filter old attempts to keep storage clean
  attempts = attempts.filter(timestamp => now - timestamp < LIMIT_WINDOW_MS);
  
  attempts.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
};
