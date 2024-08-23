function redirectToExternalBrowser() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.match(/Instagram/i)) {
    if (/android/i.test(userAgent)) {
      // Redirect to Chrome on Android
      window.location.href = "intent://www.hitechinstrument.us#Intent;scheme=https;package=com.android.chrome;end";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      alert("For a better experience, please open this link in Safari.");
    } else {
      // Default fallback for other devices
      window.location.href = "https://www.hitechinstrument.us";
    }
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", redirectToExternalBrowser);
