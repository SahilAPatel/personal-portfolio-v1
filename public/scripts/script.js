// Sets a new cookie with value and expire date
// takes in the key, value, and minutes to expire parameters
// Used minuts isntead of days for email spam feature
function setCookie(key, value, expireMinutes) {
    // make new date varible and set it to current time plus the expire minutes in miliseconds
    var date = new Date();
    date.setTime(date.getTime() + (expireMinutes * 60 * 1000));
    // set date based on coordinated unviersal time so expire date will be same universally 
    var expireDate = "expires="+date.toUTCString();
    // make string that is valid for document.cookie, path=/ to remmeber cookei belongs to domain
    document.cookie = key + "=" + value + ";" + expireDate + ";path=/";
}

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

// Toogles the websites dark mode by inversing the darkmode cookie
// Renews expire date
// Runs preSetStyle and postSetStyle functions to render appropriate images and stylesheet
function toggleDarkMode() {
    if(getCookie("darkMode") == "false"){
        setCookie("darkMode", "true", 43200);
    } else {
        setCookie("darkMode", "false", 43200);
    }
    preSetStyle();
    postSetStyle();
}

// Sets the style sheet of the page depending on the darkmode cookie setting
// This is done first as without it, the page would first load without css and then transition
function preSetStyle() {
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
}

// Set the images on pages to versions that for the darkmdoe setting
// This has to be done after the html and css is laoded else it causes an error
function postSetStyle() {
    if(getCookie("darkMode") == "true") {
        document.getElementById("darkModeIcon").src="images/darkmode2.png"
        document.getElementById("twitter-image").src="images/twitterdark.png"
        document.getElementById("linkedin-image").src="images/linkedindark.png"
    } else {
        document.getElementById("darkModeIcon").src="images/darkmode.png"
        document.getElementById("twitter-image").src="images/twitter.png"
        document.getElementById("linkedin-image").src="images/linkedin.png"
    }
}

// Code used for unit 4
// Recieved from https://www.w3schools.com/howto/howto_js_tab_img_gallery.asp
function previewImage(imgs) {
    // Get the expanded image
    var expandImg = document.getElementById("expandedImg");
    // Get the image text
    var imgText = document.getElementById("imgtext");
    // Use the same src in the expanded image as the image being clicked on from the grid
    expandImg.src = imgs.src;
    // Use the value of the alt attribute of the clickable image as text inside the expanded image
    imgText.innerHTML = imgs.alt;
    // Show the container element (hidden with CSS)
    //expandImg.parentElement.style.display = "block";
}

// Uses Regxp to make sure the string that is send to the function is a valid Email
// returns Boolean of if the email matches the regex
function validateEmail(email) {
    validEmail = /^[a-z\d-_]+\@[a-z\d-]+(\.[a-z]{2,8}){1,2}$/
    return validEmail.test(email.toLowerCase());
}

// Calidates the form in the contact page
// Checks for empty fields
// Uses validate email to make sure the email is valid
// utlizes and cookie to remember if a message ahs been sent recently (to avoid spam)
// Fianlly tells user the email will be sent if it passes server filter
function validateForm() {
// instanciate new popup
// code revieved from https://tingle.robinparisi.com/
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onOpen: function() {
            console.log('modal open');
        },
        onClose: function() {
            console.log('modal closed');
        },
    });

    if(document.myForm.name.value == "") {
        modal.setContent('<div id="contactme"><h3 style="color:black">Error:</h3><p style="color:black">Empty name field, please provide a name</p></div>');
    } else if(document.myForm.email.value == "") {
        modal.setContent('<div id="contactme"><h3 style="color:black">Error:</h3><p style="color:black">Empty email field, please provide a email</p></div>');
    } else if(!(validateEmail(document.myForm.email.value))) {
        modal.setContent('<div id="contactme"><h3 style="color:black">Error:</h3><p style="color:black">Invalid email address, please provide a valid email</p></div>');
    } else if(document.myForm.subject.value == "") {
        modal.setContent('<div id="contactme"><h3 style="color:black">Error:</h3><p style="color:black">Empty message field, please provide a message</p></div>');
    } else if(getCookie("contact") == "true") {
        modal.setContent('<div id="contactme"><h3 style="color:black">Error:</h3><p style="color:black">Too many submissions, try again in a few minutes</p></div>');
    } else {
        //cant use profanity filter library client side, so message says it 
        modal.setContent('<div id="contactme"><h3 style="color:black">Thank you!</h3><p style="color:black">Given your message gets past the profanity/spam filter, I will get back to you within 2 business days!</p></div>');
    }

    // open popup
    modal.open();
}

//__Main__
// When first launching the website, sets the default setting for darkmode
if (getCookie("darkMode") == "") {
    setCookie("darkMode", "false", 43200);
}

// Sets style sheet
preSetStyle();

// Sets the images once the page is loaded
window.onload = postSetStyle;