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

    // Set the message option as selected
    setButtonAsSelected("message", id);
    // Regenerate the code
    generateCode();
}

function handleColorChange(id) {
    // White on blue
    if (id === 'color_scheme0') {
        localStorage.setItem("button_color", "background-color: #4166f5; color: white; border: 1.5px solid transparent;");
        localStorage.setItem("button_filter", "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);");
    }
    // Blue on white
    else if (id === 'color_scheme1') {
        localStorage.setItem("button_color", "background-color: white; color: #4166f5; border: 1.5px solid #4166f5;");
        localStorage.setItem("button_filter", "filter: brightness(0) saturate(100%) invert(34%) sepia(73%) saturate(3397%) hue-rotate(220deg) brightness(100%) contrast(93%);");
    }

    // Set the color option as selected
    setButtonAsSelected("color", id);
    // Regenerate the code
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

    // If items are null, set placeholder values
    if (message == null) localStorage.setItem("message", "Chat on Signal");
    if (button_color == null) localStorage.setItem("button_color", "background-color: #4166f5; color: white; border: 1.5px solid transparent;");
    if (image_filter == null) localStorage.setItem("button_filter", "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);");
    message = localStorage.getItem("message");
    button_color = localStorage.getItem("button_color");
    image_filter = localStorage.getItem("button_filter");

    // Standard message design
    if (message != "") {
        message = "<p style='margin:0;font-size:14px;'>" + message + "</p></a>";
    }
    // Empty message design
    else {
        grid_template_columns = "1fr";
    }

    let code = "<a target='_blank' rel='noreferrer' href='" + link + "' style='font-family:Arial, Helvetica, sans-serif;"
        + button_color + "padding: 0.5em 1em 0.5em 1em; border-radius: 24px;"
        + "display: grid;width: fit-content;grid-template-columns:" + grid_template_columns + ";justify-items: center;"
        + "align-items: center;text-decoration: none;column-gap:5px;'><img alt='Signal Logo' style='width: 20px;"
        + image_filter + "' "
        + "src='https://signalupdateinfo.com/assets/images/icons/signal-icon.png'>" + message;

    // Replace old button with new button
    new_button.innerHTML = code;
    button_code.innerText = code;
    button_preview_container.replaceChild(new_button, old_button);

    // Reset the status of the copy button
    document.getElementById("copy-icon").setAttribute("src", "/assets/images/icons/copy.svg");
    document.getElementById("copy-text").innerText = "Copy";
}

async function copyCodeToClipboard() {
    let copy_icon = document.getElementById("copy-icon");
    let copy_text = document.getElementById("copy-text");

    try {
        // Copy the code to the clipboard
        await navigator.clipboard.writeText(document.getElementById("button-code").innerText);
        // Update the copy button to reflect successful copy
        copy_icon.setAttribute("src", "/assets/images/icons/copy-confirmation.svg");
        copy_text.innerText = "Copied";
    } catch (error) {
        console.error(error.message);
    }
}

function setButtonAsSelected(type, id) {
    if (type === 'message') {
        // Unselect all message buttons
        let message_options = document.querySelectorAll(".message-selected");
        for (let i = 0; i < message_options.length; i++) {
            message_options[i].classList.remove("message-selected");
        }
        // Mark the current message option as selected
        document.getElementById(id).classList.add("message-selected");
    }
    else if (type === 'color') {
        // Unselect all color buttons
        let color_options = document.querySelectorAll(".color-selected");
        for (let i = 0; i < color_options.length; i++) {
            color_options[i].classList.remove("color-selected");
        }
        // Mark the current color option as selected
        document.getElementById(id).classList.add("color-selected");
    }
}