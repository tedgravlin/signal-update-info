// Global variables for button options
let link;
let message;
let button_color;
let image_filter;
let image_size;
let font_size;

// Sanitizes input values, preventing user's from injecting HTML code
function sanitizeString(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
    };
    const regex = /[&<>"']/ig;
    return string.replace(regex, (match) => (map[match]));
}

// Sets localStorage values to default on page load
function resetOnPageLoad() {
    link = "";
    message = "Chat on Signal"
    button_color = "background-color: #4166f5; color: white; border: 1.5px solid transparent;";
    image_filter = "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);";
    image_size = "20px";
    font_size = "14px";
    generateCode();
}

// Get the value from the input box and validate it
function handleInput() {
    let input_value = sanitizeString(document.getElementById('link-input').value);
    let input_type = determineInputType(input_value);

    if (input_type === "link") {
        // Check if the link is a valid username or group link
        if (isValidSignalLink(input_value)) {
            console.log("Valid username or group link");
            link = input_value;
        }
        else {
            console.log("Invalid username or group link");
        }
    }
    else if (input_type === "number") {
        console.log("Valid number was input!");
        link = generatePhoneLink(input_value);
    }

    generateCode();
}

function handleMessageChange(id) {
    message = getMessage(id);

    // Set the message option as selected
    setButtonAsSelected("message", id);
    // Regenerate the code
    generateCode();
}

function handleColorChange(id) {
    // White on blue
    if (id === 'color_scheme0') {
        button_color = "background-color: #4166f5; color: white; border: 1.5px solid transparent;";
        image_filter = "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);";
    }
    // Blue on white
    else if (id === 'color_scheme1') {
        button_color = "background-color: white; color: #4166f5; border: 1.5px solid #4166f5;";
        image_filter = "filter: brightness(0) saturate(100%) invert(34%) sepia(73%) saturate(3397%) hue-rotate(220deg) brightness(100%) contrast(93%);";
    }

    // Set the color option as selected
    setButtonAsSelected("color", id);
    // Regenerate the code
    generateCode();
}

function handleSizeChange(id) {
    // Small
    if (id === 'size0') {
        image_size = "14px";
        font_size = "12px";
    }
    // Medium
    else if (id === 'size1') {
        image_size = "20px";
        font_size = "14px";
    }
    // Large
    else if (id === 'size2') {
        image_size = "25px";
        font_size = "18px";
    }

    // Set the color option as selected
    setButtonAsSelected("size", id);
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
        return sanitizeString(document.getElementById('custom-message').value);
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
    let grid_template_columns = "0.25fr 1fr";

    // Standard message design
    if (message != "") {
        message_element = "<p style='margin:0;font-size:" + font_size + ";'>" + message + "</p></a>";
    }
    // Empty message design
    else {
        grid_template_columns = "1fr";
        message_element = "";
    }

    let code = "<a target='_blank' rel='noreferrer' href='" + link + "' style='font-family:Arial, Helvetica, sans-serif;"
        + button_color + "padding: 0.5em 1em 0.5em 1em; border-radius: 24px;"
        + "display: grid;width: fit-content;height:fit-content;grid-template-columns:" + grid_template_columns + ";justify-items: center;"
        + "align-items: center;text-decoration: none;column-gap:5px;'><img alt='Signal Logo' style='width: " + image_size + ";"
        + image_filter + "' "
        + "src='https://signalupdateinfo.com/assets/images/icons/signal-icon.png'>" + message_element;

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
    else if (type === 'size') {
        // Unselect all color buttons
        let size_options = document.querySelectorAll(".size-selected");
        for (let i = 0; i < size_options.length; i++) {
            size_options[i].classList.remove("size-selected");
        }
        // Mark the current color option as selected
        document.getElementById(id).classList.add("size-selected");
    }
}