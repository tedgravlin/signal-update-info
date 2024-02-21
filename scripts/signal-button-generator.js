// On page load, show the right type
window.addEventListener("load", (event) => {
    let type = window.location.hash.substring(1);
    console.log("Type:", type);
    // If there isn't a hash, default to username
    if (type == "") {
        switchType('username');
    }
    else {
        switchType(type);
    }
});

// Generate the HTML code and display it
function generateHTML() {
    let code_output = document.getElementById("code-output");
}

// Switched the generator type that's displayed based on button click
function switchType(type) {
    let username_container = document.getElementById("button-username-container");
    let phone_container = document.getElementById("button-phone-container");
    let group_container = document.getElementById("button-group-container");
    let username_button = document.getElementById("username-button");
    let phone_button = document.getElementById("phone-button");
    let group_button = document.getElementById("group-button");

    // Show username container, hide all other
    if (type == 'username') {
        // Containers
        username_container.style.display = "block";
        phone_container.style.display = "none";
        group_container.style.display = "none";
        // Buttons
        username_button.className = "platform-selected left";
        phone_button.className = "platform-unselected middle";
        group_button.className = "platform-unselected right";
        // URL
        window.location.replace('#' + "username");
    }
    else if (type == 'phone') {
        // Containers
        username_container.style.display = "none";
        phone_container.style.display = "block";
        group_container.style.display = "none";
        // Buttons
        username_button.className = "platform-unselected left";
        phone_button.className = "platform-selected middle";
        group_button.className = "platform-unselected right";
        // URL
        window.location.replace('#' + "phone");
    }
    else if (type == 'group') {
        // Containers
        username_container.style.display = "none";
        phone_container.style.display = "none";
        group_container.style.display = "block";
        // Buttons
        username_button.className = "platform-unselected left";
        phone_button.className = "platform-unselected middle";
        group_button.className = "platform-selected right";
        // URL
        window.location.replace('#' + "group");
    }
}

