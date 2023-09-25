// On page load
window.addEventListener("load", (event) => {
    // Get the theme switched button
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_button_mobile = document.getElementById("theme-button-mobile");

    // Get the stored theme
    let stored_theme = localStorage.getItem('theme');

    // If null, set the stored theme to current theme
    if (stored_theme == null) {
        localStorage.setItem('theme','auto');
        stored_theme = localStorage.getItem('theme');
    }
    setTheme(stored_theme);
    theme_button_desktop.setAttribute('value', stored_theme);
    theme_button_mobile.setAttribute('src', '/assets/images/icons/theme-auto.svg');

    // Listen for a click on the button 
    theme_button_desktop.addEventListener("click", function () {
        handleButton();
    });
    // Listen for a click on the button 
    theme_button_mobile.addEventListener("click", function () {
        handleButton();
    });

    function handleButton() {
        stored_theme = localStorage.getItem('theme');

        if (stored_theme === 'dark') {
            setTheme('auto');
            return;
        }
        if (stored_theme === 'light') {
            setTheme('dark');
            return;
        }
        if (stored_theme === 'auto') {
            setTheme('light');
            return;
        }
    }
});

function setTheme(theme) {
    let root = document.querySelector(':root');
    const theme_button_desktop = document.getElementById("theme-button-desktop");
    const theme_icon_mobile = document.getElementById("theme-icon-mobile");

    if (theme === 'auto') {
        theme_button_desktop.setAttribute('src', './assets/images/icons/theme-auto.svg');
        theme_icon_mobile.setAttribute('src', './assets/images/icons/theme-auto.svg');
        localStorage.setItem('theme','auto');
        root.style.removeProperty('--main-color');
        root.style.removeProperty('--background-color');
        root.style.removeProperty('--text-color');
        root.style.removeProperty('--main-color-filter');
    }
    // If the system theme is dark, set to light
    else if (theme === 'light') {
        theme_button_desktop.setAttribute('src', './assets/images/icons/theme-light.svg');
        theme_icon_mobile.setAttribute('src', './assets/images/icons/theme-light.svg');
        localStorage.setItem('theme', 'light');
        root.style.setProperty('--main-color', '#4166f5');
        root.style.setProperty('--background-color', 'white');
        root.style.setProperty('--text-color', 'white');
        root.style.setProperty('--main-color-filter','invert(30%) sepia(84%) saturate(1834%) hue-rotate(219deg) brightness(98%) contrast(96%)');
    }
    // If the system theme is light, set to dark
    else if (theme === 'dark') {
        theme_button_desktop.setAttribute('src', './assets/images/icons/theme-dark.svg');
        theme_icon_mobile.setAttribute('src', './assets/images/icons/theme-dark.svg');
        localStorage.setItem('theme', 'dark');
        root.style.setProperty('--main-color', '#9db1ff');
        root.style.setProperty('--background-color', '#181d44');
        root.style.setProperty('--text-color', '#181d44');
        root.style.setProperty('--main-color-filter','invert(74%) sepia(95%) saturate(1952%) hue-rotate(192deg) brightness(101%) contrast(100%)');
    }
}