// On page load, show the right platform
window.addEventListener("load", (event) => {
    let platform = window.location.hash.substring(1);
    switchRelease(platform);
});


// Switches platform
function switchRelease(incoming_platform) {
    let android_container = document.getElementById("android-container");
    let ios_container = document.getElementById("ios-container");
    let desktop_container = document.getElementById("desktop-container");
    let android_button = document.getElementById("android-button");
    let ios_button = document.getElementById("ios-button");
    let desktop_button = document.getElementById("desktop-button");

    let platform_list = ['android', 'ios', 'desktop'];
    let container_list = [android_container, ios_container, desktop_container];
    let button_list = [android_button, ios_button, desktop_button];

    let platform_index = platform_list.indexOf(incoming_platform);

    for (platform in platform_list) {
        // If the platform is empty, default to first platform
        if (incoming_platform == "") platform_index = 0;
        // Show current platform container
        // and mark its button as selected
        if (platform == platform_index) {
            // Change container display to grid
            container_list[platform].style.display = "grid";
            // Animate the release buttons
            animateReleaseButtons(container_list[platform]);
            // Mark as selected
            button_list[platform].classList.remove('platform-unselected');
            button_list[platform].classList.add('platform-selected');
            // Update URL with new hash
            window.location.replace('#' + platform_list[platform]);
        }
        // Hide all other platform containers
        // and mark their buttons as unselected
        else {
            container_list[platform].style.display = "none";
            button_list[platform].classList.remove('platform-selected');
            button_list[platform].classList.add('platform-unselected');
        }
    }
}

function animateReleaseButtons(platform_container) {
    let children = platform_container.children;
    let speed = 0.25;

    // Increment each button's speed by 0.1s
    for (let i = 0; i < platform_container.childElementCount; i++) {
        // Add the animation class to the button
        children[i].classList.add('releaseSlideUp');
        // Cap the speed at 1s
        if (speed <= 1) speed = speed + 0.1;
        // Change the button's animation duration
        children[i].style.animationDuration = speed + "s";
    }
}