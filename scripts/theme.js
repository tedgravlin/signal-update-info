// On page load
window.addEventListener("load", (event) => {
    // Get the theme switched button
    const theme_button = document.getElementById("theme-button");

    // Get the stored theme
    let stored_theme = localStorage.getItem('theme');

    // If null, set the stored theme to current theme
    if (stored_theme == null) {
        localStorage.setItem('theme','auto');
        stored_theme = localStorage.getItem('theme');
    }
    setTheme(stored_theme);
    theme_button.setAttribute('value', stored_theme);

    // Listen for a click on the button 
    theme_button.addEventListener("click", function () {
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
    });
});

function setTheme(theme) {
    let root = document.querySelector(':root');
    const theme_button = document.getElementById("theme-button");

    if (theme === 'auto') {
        theme_button.setAttribute('value', 'auto');
        localStorage.setItem('theme','auto');
        root.style.removeProperty('--main-color');
        root.style.removeProperty('--background-color');
        root.style.removeProperty('--text-color');
    }
    // If the system theme is dark, set to light
    else if (theme === 'light') {
        theme_button.setAttribute('value', 'light');
        localStorage.setItem('theme', 'light');
        root.style.setProperty('--main-color', '#4166f5');
        root.style.setProperty('--background-color', 'white');
        root.style.setProperty('--text-color', 'white');
    }
    // If the system theme is light, set to dark
    else if (theme === 'dark') {
        theme_button.setAttribute('value', 'dark');
        localStorage.setItem('theme', 'dark');
        root.style.setProperty('--main-color', '#9db1ff');
        root.style.setProperty('--background-color', '#181d44');
        root.style.setProperty('--text-color', '#181d44');
    }
}