window.addEventListener("load", (event) => {
    // Get the theme switched button
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_button_mobile = document.getElementById("theme-button-mobile");
    const theme_icon_mobile = document.getElementById("theme-icon-mobile");

    // Get the stored theme
    let stored_theme = localStorage.getItem('theme');

    // Set theme
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

function setTheme(theme) {
    // If null, set theme to 'auto'
    if (theme === null || theme === " ") theme = 'auto';

    updateButton(theme);
    localStorage.setItem('theme', `${theme}`)

    if (theme === 'auto') document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", `${theme}`);
}

function getNextTheme(system_theme, current_theme) {
    // When the system theme is light, the first theme after auto should be dark
    if (system_theme === 'light') {
        switch (current_theme) {
            case 'auto':
                return 'dark';
            case 'dark':
                return 'light';
            case 'light':
                return 'auto';
        }
    }
    // When the system theme is dark, the first button after auto should be light
    else if (system_theme === 'dark') {
        switch (current_theme) {
            case 'auto':
                return 'light';
            case 'light':
                return 'dark';
            case 'dark':
                return 'auto';
        }
    }
}

function updateButton(theme) {
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_icon_mobile = document.getElementById("theme-icon-mobile");

    theme_button_desktop.setAttribute('src', `/assets/images/icons/theme-${theme}.svg`);
    theme_icon_mobile.setAttribute('src', `/assets/images/icons/theme-${theme}.svg`);
    theme_button_desktop.setAttribute('alt', `${theme} Theme Icon`);
    theme_icon_mobile.setAttribute('alt', `${theme} Theme Icon`);
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

