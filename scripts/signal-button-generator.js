// Get the value from the input box and validate it
function handleInput(change) {
    let input_value = document.getElementById('link-input').value;
    let input_type = determineInputType(input_value);

    if (input_type === "link") {
        // Check if the link is a valid username or group link
        if (isValidSignalLink(input_value)) {
            console.log("Valid username or group link");
            localStorage.setItem("link", input_value);
        }
        else {
            console.log("Invalid username or group link");
        }
    }
    else if (input_type === "number") {
        console.log("Valid number was input!");
        localStorage.setItem("link", generatePhoneLink(input_value));
    }

    generateCode();
}

function handleMessageChange(id) {
    if (id !== 'message-custom') {
        localStorage.setItem("message", getMessage(id));
    }
    else {
        localStorage.setItem("message", document.getElementById('custom-message').value);
    }

    generateCode();
}

function handleColorChange(id) {
    // Blue on white
    if (id === 'color_scheme0') {
        localStorage.setItem("button_color", "background-color: #3c76ee; color: white; border: 1.5px solid transparent;");
        localStorage.setItem("button_filter", "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);");
    }
    // White on blue
    else if (id === 'color_scheme1') {
        localStorage.setItem("button_color", "background-color: white; color: #3c76ee; border: 1.5px solid #3c76ee;");
        localStorage.setItem("button_filter", "filter: brightness(0) saturate(100%) invert(54%) sepia(72%) saturate(5717%) hue-rotate(208deg) brightness(98%) contrast(90%);");
    }

    generateCode();
}

// Returns the type of info entered (link or phone number)
function determineInputType(input) {
    const phone_regex = /(\+)[1-9][0-9 \-\(\)\.]{7,32}$/;

    // Check if the input is a valid URL
    if (URL.canParse(input)) {
        return "link";
    }
    // If it's not a URL check if it's a phone number
    else if (phone_regex.test(input)) {
        return "number";
    }
}

// Validate that a link is a proper group or username link
function isValidSignalLink(link) {
    const group_regex = /^https:\/\/signal.group\/#.*$/;
    const username_regex = /^https:\/\/signal.me\/#eu\/*.*$/;

    // If the link matches the regex for group or username link, return true
    if (group_regex.test(link) || username_regex.test(link)) {
        return true;
    }

    // If not valid signal link, return false
    return false;
}

// Generates and returns a phone number link with given phone number
function generatePhoneLink(phone_number) {
    return ('https://signal.me/#p/' + phone_number);
}

function getMessage(id) {
    if (id === 'message0') {
        return "Chat on Signal";
    }
    else if (id === 'message1') {
        return "Message me on Signal";
    }
    else if (id === 'message2') {
        return "Signal Contact";
    }
    else if (id === 'message-custom') {
        return document.getElementById('custom-message').value;
    }
    else if (id === 'message-empty') {
        return "";
    }
}

// Generate the HTML code and display it
function generateCode() {
    let button_code = document.getElementById("button-code");
    let button_preview_container = document.getElementById("button-preview-container");
    let new_button = document.createElement("a");
    let old_button = button_preview_container.children[1];
    let link = localStorage.getItem("link");
    let message = localStorage.getItem("message");
    let button_color = localStorage.getItem("button_color");
    let image_filter = localStorage.getItem("button_filter");
    let grid_template_columns = "0.25fr 1fr";

    // Standard message design
    if (message != "") {
        message = "<p style='margin:0;font-size:14px;'>" + message + "</p></a>";
    }
    // Empty message design
    else {
        grid_template_columns = "1fr";
    }

    let code = "<a target='_blank' href='" + link + "' style='font-family:Arial, Helvetica, sans-serif;"
        + button_color + "padding: 0.5em 1em 0.5em 1em; border-radius: 24px;"
        + "display: grid;width: fit-content;grid-template-columns:" + grid_template_columns +";justify-items: center;"
        + "align-items: center;text-decoration: none;column-gap:5px;'><img style='width: 20px;"
        + image_filter + "' "
        + "src='/assets/images/icons/signal-icon.png'>" + message;

    new_button.innerHTML = code;

    button_code.innerText = code;
    button_preview_container.replaceChild(new_button, old_button);
}