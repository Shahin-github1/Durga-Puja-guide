// PWA Installer & Service Worker Registration
let deferredPrompt = null;

export function initPWA() {
  // 1. Register Service Worker for offline capability
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully, scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Mobile Install Prompt handling
  const installBtn = document.getElementById('btnInstallApp');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar from appearing on mobile
    e.preventDefault();
    deferredPrompt = e;

    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.classList.add('pulse-glow');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        // Fallback guidance for iOS Safari or browsers without beforeinstallprompt
        alert('To install Sharod Sathi on your phone:\n\n• On iPhone/Safari: Tap the "Share" button at bottom, then select "Add to Home Screen".\n• On Android/Chrome: Tap the 3 dots menu at top right, then select "Install app" or "Add to Home screen".');
        return;
      }

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] User response to install prompt: ${outcome}`);
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed on device!');
    if (installBtn) installBtn.style.display = 'none';
  });
}
