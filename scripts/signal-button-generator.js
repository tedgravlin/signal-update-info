// Get the value from the input box and validate it
function handleInput() {
    let input_value = document.getElementById('link-input').value;
    let input_type = determineInputType(input_value);

    if (input_type === "link") {
        // Check if the link is a valid username or group link
        if (isValidSignalLink(input_value)) {
            console.log("Valid username or group link");
            generateCode(input_value);
        }
        else {
            console.log("Invalid username or group link");
        }
    }
    else if (input_type === "number") {
        console.log("Valid number was input!");
        generateCode(generatePhoneLink(input_value));
    }
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


// Generate the HTML code and display it
function generateCode(link) {
    let button_code = document.getElementById("button-code");
    let button_preview_container = document.getElementById("button-preview-container");
    let new_button = document.createElement("a");
    let old_button = button_preview_container.children[0];

    let code = "<a target='_blank' href='" + link + "' style='font-family:Arial, Helvetica, sans-serif;" 
    + "background-color: #3c76ee; color: white; padding: 0.5em 1em 0.5em 1em; border-radius: 24px;" 
    + "display: grid;width: fit-content;grid-template-columns: 0.25fr 1fr;justify-items: center;" 
    + "align-items: center;text-decoration: none;column-gap:5px;'><img style='width: 20px;" 
    + "filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(7497%) hue-rotate(138deg) brightness(105%) contrast(101%);' " 
    + "src='/assets/images/icons/signal-icon.png'><p style='margin: 0;font-size: 14px;'>Chat on Signal</p></a>";

    new_button.innerHTML = code;

    button_code.innerText = code;
    button_preview_container.replaceChild(new_button, old_button);
}