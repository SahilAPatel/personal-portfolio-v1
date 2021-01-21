//script is called at the start of every page to set the style sheet

// Get the value of a cookie key
// returns key value or a empty string if no such key
function getCookie(key) {
    var name = key + "=";
    var cookieArray = document.cookie.split(';');
    console.log(cookieArray);

    // iterate through cookieArray
    for(var i=0; i < cookieArray.length; i++) {
        // before every cookie name there is a space so we look for it
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        // check if string name we made earlier is the first word in cookie
        if (cookie.indexOf(name) == 0) {
            // return substring, starting from the length of the name index to the end
            return cookie.substring(name.length, cookie.length);
        }
    }
    // Return blank so we know when there is no such cookie
    return "";
}

// Sets the style sheet of the page depending on the darkmode cookie setting
// This is done first as without it, the page would first load without css and then transition
var head = document.getElementsByTagName('HEAD')[0];

// get prefix ready
var link = document.createElement('link'); 
link.rel = 'stylesheet';  
link.type = 'text/css';

// set file
if(getCookie("darkMode") == "true") {
    link.href = 'styles/style-dark.css';
} else {
    link.href = 'styles/style.css';
}

// push final style tag
head.appendChild(link);