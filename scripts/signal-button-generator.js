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

// Handle 'Generate' button press
function handleClick() {
    // Get the type from URL
    let type = window.location.hash.substring(1);

    // Username input
    let username_link = document.getElementById('username-link').value;

    // Phone Number input
    let phone_number = document.getElementById('phone-number').value;
    let phone_intl_code = document.getElementById('phone-intl-code').value;

    // Group link input
    let group_link = document.getElementById('group-link').value;

    if (type == 'username') {
        generateCode(username_link);
    }
    else if (type == 'phone') {
        generateCode('https://signal.me/#p/' + '+' + phone_intl_code + phone_number);
    }
    else if (type == 'group') {
        generateCode(group_link);
    }

}


// Generate the HTML code and display it
function generateCode(link) {
    let button_code = document.getElementById("button-code");
    let button_preview = document.getElementById("button-preview");

    let code = "<a target='_blank' href='" + link + "' style='font-family:Arial, Helvetica, sans-serif;" 
    + "background-color: #3c76ee; color: white; padding: 0.5em 1em 0.5em 1em; border-radius: 24px;" 
    + "display: grid;width: fit-content;grid-template-columns: 0.25fr 1fr;justify-items: center;" 
    + "align-items: center;text-decoration: none;column-gap:5px;'><img style='width: 20px;" 
    + "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);' " 
    + "src='/assets/images/icons/signal-icon.png'><p style='margin: 0;font-size: 14px;'>Chat on Signal</p></a>";

    button_code.innerText = code;
    button_preview.innerHTML = code;
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

