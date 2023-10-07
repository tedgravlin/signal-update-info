window.addEventListener("load", (event) => {
    // Get the theme switched button
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_button_mobile = document.getElementById("theme-button-mobile");

    // Get the stored theme
    let stored_theme = localStorage.getItem('theme');

    // If null, set theme to 'auto'
    if (stored_theme == null) {
        localStorage.setItem('theme','auto');
        stored_theme = localStorage.getItem('theme');
    }
    setTheme(stored_theme);

    // Listen for a click on the desktop button 
    theme_button_desktop.addEventListener("click", function () {
        handleButton();
    });
    // Listen for a click on the mobile button 
    theme_button_mobile.addEventListener("click", function () {
        handleButton();
    });

    function handleButton() {
        let current_theme = localStorage.getItem('theme');
        let system_theme = window.matchMedia("(prefers-color-scheme: dark)");

        // Get the prefers-color-scheme and set theme accordingly
        if (system_theme.matches) {
            system_theme = 'dark';
        }
        else {
            system_theme = 'light';
        }
        setTheme(getNextTheme(system_theme, current_theme));
    }
});

function setTheme(theme) {
    let root = document.querySelector(':root');
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_icon_mobile = document.getElementById("theme-icon-mobile");

    switch(theme) {
        case 'auto':
            theme_button_desktop.setAttribute('src', '/assets/images/icons/theme-auto.svg');
            theme_icon_mobile.setAttribute('src', '/assets/images/icons/theme-auto.svg');
            localStorage.setItem('theme', 'auto');
            root.style.removeProperty('--main-color');
            root.style.removeProperty('--background-color');
            root.style.removeProperty('--text-color');
            root.style.removeProperty('--main-color-filter');
            break;
        case 'light':
            theme_button_desktop.setAttribute('src', '/assets/images/icons/theme-light.svg');
            theme_icon_mobile.setAttribute('src', '/assets/images/icons/theme-light.svg');
            localStorage.setItem('theme', 'light');
            root.style.setProperty('--main-color', 'white');
            root.style.setProperty('--background-color', '#4166f5');
            root.style.setProperty('--on-main-bg-color', '#4165f5e8');
            root.style.setProperty('--text-color', '#4166f5');
            root.style.setProperty('--platform-selected-bg', '#4165f5e6');
            root.style.setProperty('--main-color-filter','brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)');
            root.style.setProperty('--text-color-filter', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(199deg) brightness(109%) contrast(104%)');
            break;
        case 'dark':
            theme_button_desktop.setAttribute('src', '/assets/images/icons/theme-dark.svg');
            theme_icon_mobile.setAttribute('src', '/assets/images/icons/theme-dark.svg');
            localStorage.setItem('theme', 'dark');
            root.style.setProperty('--main-color', '#9db1ff');
            root.style.setProperty('--background-color', '#181d44');
            root.style.setProperty('--on-main-bg-color', '#181d44dd');
            root.style.setProperty('--text-color', '#182142');
            root.style.setProperty('--platform-selected-bg', '#181d44ca');
            root.style.setProperty('--main-color-filter','invert(74%) sepia(95%) saturate(1952%) hue-rotate(192deg) brightness(101%) contrast(100%)');
            root.style.setProperty('--text-color-filter', 'brightness(0) saturate(100%) invert(87%) sepia(25%) saturate(7141%) hue-rotate(192deg) brightness(100%) contrast(103%)');
            break;
    }
}

function getNextTheme(system_theme, current_theme) {
    let result = "";

    // When the system theme is light, the first theme after auto should be dark
    if (system_theme === 'light') {
        switch(current_theme) {
            case 'auto':
                result = 'dark';
                break;
            case 'dark':
                result = 'light';
                break;
            case 'light':
                result = 'auto';
                break;
        }
    }

    // When the system theme is dark, the first button after auto should be light
    else if (system_theme === 'dark') {
        switch(current_theme) {
            case 'auto':
                result = 'light';
                break;
            case 'light':
                result = 'dark';
                break;
            case 'dark':
                result = 'auto';
                break;
        }
    }

    return result;
}