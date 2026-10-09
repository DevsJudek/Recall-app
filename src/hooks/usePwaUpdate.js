// src/hooks/usePwaUpdate.js
import { useState, useEffect, useCallback, useRef } from 'react';

export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const registrationRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Actively find and unregister any legacy OneSignal worker
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => {
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || '';
        if (url.toLowerCase().includes('onesignal')) {
          r.unregister().catch(() => {});
        }
      });
    }).catch(() => {});

    // Register our application worker /sw.js with root scope
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => {
        registrationRef.current = reg;

        // If a new worker is already waiting to activate
        if (reg.waiting && navigator.serviceWorker.controller) {
          setNeedRefresh(true);
        }

        // Listen for new versions downloading in background
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            // Once fully installed, if we already have an active controller, prompt update
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setNeedRefresh(true);
            }
          });
        });

        // Periodic check for SW updates every 15 minutes
        const intervalId = setInterval(() => {
          if (navigator.onLine && reg) {
            reg.update().catch(() => {});
          }
        }, 15 * 60 * 1000);

        // Check on tab visibility/return
        const onVisibilityChange = () => {
          if (document.visibilityState === 'visible' && navigator.onLine && reg) {
            reg.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
          clearInterval(intervalId);
          document.removeEventListener('visibilitychange', onVisibilityChange);
        };
      })
      .catch(err => {
        console.error('Service worker registration failed:', err);
      });

    // When the user refreshes, activate any waiting worker so the new page loads fresh
    const onBeforeUnload = () => {
      const reg = registrationRef.current;
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  const updateServiceWorker = useCallback(async () => {
    setIsUpdating(true);
    setNeedRefresh(false);

    try {
      const reg = registrationRef.current || await navigator.serviceWorker?.getRegistration();
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (err) {
      console.error('Error activating waiting service worker:', err);
    }

    // Force reload into the fresh version
    let reloaded = false;
    const reloadOnce = () => {
      if (!reloaded) {
        reloaded = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', reloadOnce, { once: true });
    setTimeout(reloadOnce, 400);
  }, []);

  return {
    needRefresh,
    setNeedRefresh,
    updateServiceWorker,
    isUpdating
  };
}
