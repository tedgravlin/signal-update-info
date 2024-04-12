window.addEventListener("load", (event) => {
    // Get the theme switched button
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_button_mobile = document.getElementById("theme-button-mobile");
    const theme_icon_mobile = document.getElementById("theme-icon-mobile");

    // Get the stored theme
    let stored_theme = localStorage.getItem('theme');

    // If null, set theme to 'auto'
    if (stored_theme == null) {
        localStorage.setItem('theme', 'auto');
        stored_theme = localStorage.getItem('theme');
    }
    setTheme(stored_theme);

    // Listen for a click on the desktop button 
    theme_button_desktop.addEventListener("click", function () {
        handleButton();
        animateIcon(theme_button_desktop);
    });
    // Listen for a click on the mobile button 
    theme_button_mobile.addEventListener("click", function () {
        handleButton();
        animateIcon(theme_icon_mobile);
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

    theme_button_desktop.animationName = 'test';

    switch (theme) {
        case 'auto':
            theme_button_desktop.setAttribute('src', '/assets/images/icons/theme-auto.svg');
            theme_icon_mobile.setAttribute('src', '/assets/images/icons/theme-auto.svg');
            theme_button_desktop.setAttribute('alt', 'Auto Theme Icon');
            theme_icon_mobile.setAttribute('alt', 'Auto Theme Icon');
            localStorage.setItem('theme', 'auto');
            root.style.removeProperty('--main-color');
            root.style.removeProperty('--background-color');
            root.style.removeProperty('--text-color');
            root.style.removeProperty('--main-color-filter');
            break;
        case 'light':
            theme_button_desktop.setAttribute('src', '/assets/images/icons/theme-light.svg');
            theme_icon_mobile.setAttribute('src', '/assets/images/icons/theme-light.svg');
            theme_button_desktop.setAttribute('alt', 'Light Theme Icon');
            theme_icon_mobile.setAttribute('alt', 'Light Theme Icon');
            localStorage.setItem('theme', 'light');
            root.style.setProperty('--main-color', '#181d44');
            root.style.setProperty('--text-on-main', '#FFFFFF');
            root.style.setProperty('--card-color', '#FFFFFF');
            root.style.setProperty('--btn-text', '#FFFFFF');
            root.style.setProperty('--background-color', '#9db1ff');
            root.style.setProperty('--on-main-bg-color', '#212962dd');
            root.style.setProperty('--text-color', '#181d44');
            root.style.setProperty('--platform-selected-bg', '#212962dd');
            root.style.setProperty('--main-color-filter', 'brightness(0) saturate(100%) invert(11%) sepia(21%) saturate(2448%) hue-rotate(199deg) brightness(99%) contrast(99%)');
            root.style.setProperty('--text-color-filter', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(199deg) brightness(109%) contrast(104%)');
            root.style.setProperty('--btn-bg-color', '#dee6ffbf');
            root.style.setProperty('--btn-border-color', '#dee6ffbf');
            root.style.setProperty('--btn-selected-border-color', '#a5b2da');
            root.style.setProperty('--input-bg-color', '#bac5eabf');
            root.style.setProperty('--code-container-bg', '#dee6ff4f');
            break;
        case 'dark':
            theme_button_desktop.setAttribute('src', '/assets/images/icons/theme-dark.svg');
            theme_icon_mobile.setAttribute('src', '/assets/images/icons/theme-dark.svg');
            theme_button_desktop.setAttribute('alt', 'Dark Theme Icon');
            theme_icon_mobile.setAttribute('alt', 'Dark Theme Icon');
            localStorage.setItem('theme', 'dark');
            root.style.setProperty('--main-color', '#9db1ff');
            root.style.setProperty('--text-on-main', '#9db1ff');
            root.style.setProperty('--card-color', '#9db1ff');
            root.style.setProperty('--btn-text', '#9db1ff');
            root.style.setProperty('--background-color', '#181d44');
            root.style.setProperty('--on-main-bg-color', '#181d44dd');
            root.style.setProperty('--text-color', '#182142');
            root.style.setProperty('--platform-selected-bg', '#181d44ca');
            root.style.setProperty('--main-color-filter', 'invert(74%) sepia(95%) saturate(1952%) hue-rotate(192deg) brightness(101%) contrast(100%)');
            root.style.setProperty('--text-color-filter', 'brightness(0) saturate(100%) invert(87%) sepia(25%) saturate(7141%) hue-rotate(192deg) brightness(100%) contrast(103%)');
            root.style.setProperty('--btn-bg-color', '#dee6ffbf');
            root.style.setProperty('--btn-border-color', '#181d447a');
            root.style.setProperty('--btn-selected-border-color', '#181d44');
            root.style.setProperty('--input-bg-color', '#bac5eabf');
            root.style.setProperty('--code-container-bg', '#dee6ff4f');
            break;
    }
}

function getNextTheme(system_theme, current_theme) {
    let result = "";

    // When the system theme is light, the first theme after auto should be dark
    if (system_theme === 'light') {
        switch (current_theme) {
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
        switch (current_theme) {
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

function animateIcon(icon) {
    const spin = [
        { transform: "rotate(-360deg)" },
        { transform: "rotate(0deg)" },
    ];

    const spinTiming = {
        duration: 1200,
        iterations: 1,
        easing: 'ease'
    };

    icon.animate(spin, spinTiming);
}
