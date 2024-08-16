function redirectToExternalBrowser() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.match(/Instagram/i)) {
    if (/android/i.test(userAgent)) {
      // Redirect to Chrome on Android
      window.location.href = "intent://www.hitechinstrument.us#Intent;scheme=https;package=com.android.chrome;end";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // Prompt iOS users to open in Safari
      window.location.href = "https://www.hitechinstrument.us";
    } else {
      // Default fallback for other devices
      alert("Please open this link in your external browser for better experience.");
    }
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", redirectToExternalBrowser);
