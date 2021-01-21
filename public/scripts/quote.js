//Run main when the page is loaded, thus p and h3 tags can be edited
window.onload = Main;

function Main() {
    //get a random number based on a seed value
    //utilzies an algorithm I found in a previous project
    function rand_from_seed(x){
        for(var i = 0; i < 100; i++)
          x = (x ^ (x << 1) ^ (x >> 1)) % 10000;
        return x;
    }

    //Turns xhttp resposne data into json and picks a random integer to display onto sports page
    function displayQuote(xhttp) {
        const quotes = JSON.parse(xhttp.response);

        //Generates a seed using todays date thus the quote is the same throughout the day
        var random = rand_from_seed(Math.floor((new Date)/86400000)) % 1600;

        //displays quote
        document.getElementById("quote").innerHTML = '"' + quotes[random]["text"] + '"';
        document.getElementById("author").innerHTML = quotes[random]["author"];
    }

    //Uses AJAX to send get request to api page
    function getQuotes() {
        var url = "https://type.fit/api/quotes"
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //sends data to be parsed and displayed
                displayQuote(this);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    //Starts the quote access process
    getQuotes();
}