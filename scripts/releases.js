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

        // Animate release buttons
        animateReleaseButtons(android_container);
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

        // Animate release buttons
        animateReleaseButtons(ios_container);
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

        // Animate release buttons
        animateReleaseButtons(desktop_container);
    }
}

function animateReleaseButtons(platform_container) {
    let children = platform_container.children;
    let speed = 0.25;

    // Increment each button's speed by 0.1s
    for (let i = 0; i < platform_container.childElementCount; i++) {
        // Add the animation class to the button
        children[i].classList.add('cardSlideUp');
        // Cap the speed at 1s
        if (speed <= 1) speed = speed + 0.1;
        // Change the button's animation duration
        children[i].style.animationDuration = speed + "s";
    }
}