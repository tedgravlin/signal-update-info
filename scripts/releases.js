const url_params = new URLSearchParams(window.location.search);

// On page load, show the right platform
window.addEventListener("load", (event) => {
    let platform = window.location.hash.substring(1);
    switchRelease(platform);  
});


// Switches platform
function switchRelease(platform) {
    let android_container = document.getElementById("android-container");
    let ios_container = document.getElementById("ios-container");
    let desktop_container = document.getElementById("desktop-container");
    let android_button = document.getElementById("android-button");
    let ios_button = document.getElementById("ios-button");
    let desktop_button = document.getElementById("desktop-button");

    // Android
    if (platform == 'android' || platform == "") {
        // Containers
        android_container.style.display = "grid";
        ios_container.style.display = "none";
        desktop_container.style.display = "none";
        // Buttons
        android_button.className = "platform-selected left";
        ios_button.className = "platform-unselected middle";
        desktop_button.className = "platform-unselected right";
        // URL
        window.location.replace('#' + "android");
    }
    // iOS
    if (platform == 'ios') {
        // Containers
        android_container.style.display = "none";
        ios_container.style.display = "grid";
        desktop_container.style.display = "none";
        // Buttons
        android_button.className = "platform-unselected left";
        ios_button.className = "platform-selected middle";
        desktop_button.className = "platform-unselected right";
        // URL
        window.location.replace('#' + "ios");
    }
    // Desktop
    if (platform == 'desktop') {
        // Containers
        android_container.style.display = "none";
        ios_container.style.display = "none";
        desktop_container.style.display = "grid";
        // Buttons
        android_button.className = "platform-unselected left";
        ios_button.className = "platform-unselected middle";
        desktop_button.className = "platform-selected right";
        // URL
        window.location.replace('#' + "desktop");
    }
}