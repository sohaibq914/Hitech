function redirectToExternalBrowser() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.match(/Instagram/i)) {
    if (/android/i.test(userAgent)) {
      // Redirect to Chrome on Android
      window.location.href = "intent://www.hitechinstrument.us#Intent;scheme=https;package=com.android.chrome;end";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // Open link in Safari for iOS users
      window.open("https://www.hitechinstrument.us", "_blank");
    } else {
      // Default fallback for other devices
      window.location.href = "https://www.hitechinstrument.us";
    }
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", redirectToExternalBrowser);
