require("dotenv").config();

var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdbApi = require('omdb-client');
var fs = require("fs");
var chalk = require("chalk");
var date = require("date-and-time");






var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var now = new Date();
var timeNow = date.format(now, 'MM/DD/YYYY HH:mm:ss');
let [node, file, liriCommand, ...param] = process.argv; //distructuring assignment of array

if (liriCommand != undefined) liriCommand = liriCommand.toLowerCase(); //standardize

console.clear();
console.log(chalk.inverse("You can ask Liri: my-tweets, spotify song-name, movie movie-name, read-file (command.txt or random.txt)"));

//validation to prevent user from sending an empty request!!
if ((liriCommand === "spotify" || liriCommand === "movie") && param.length === 0) {
    console.log(chalk.red(`Please search something. ie: ${liriCommand} something`))
    process.exit();
} else {
    var query = param.join("-"); // concatinate search query
}


//initiate command
doSomething(liriCommand, query);

// command log
function writeToFile(x, y) { //x is the command and y is the query
    if (y == undefined) y = "";
    let mylog = `Command: ${x} ${y}; is created at ${timeNow}\n`
    fs.appendFile('log.txt', mylog, function (err) {
        if (err) return err;
        console.log(chalk.red('Command Saved!'));
    });
}


function tweetCommand(y) {
    console.log(chalk.blue("********* Searching Twitter ***********"))
    // twitter GET request
    var params = { screen_name: y };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {
            //console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].user.name + ": " + tweets[i].text + "; " + tweets[i].created_at);
                var log = tweets[i].user.name + ": " + tweets[i].text + "; " + tweets[i].created_at + "\n";
            }
        } else {
            console.log("Got an error: " + error)
        }
    });
}

function spotifyCommand(x) {
    spotify.search({ type: 'track', query: x, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + chalk.red(err));
        }

        //console.log(data); 
        var tracks = data.tracks.items;
        console.log(chalk.blue("********* Searching Spotify ***********"))
        if (tracks[0].preview_url == null) tracks[0].preview_url = "No preview Available!";// some results returned with null

        console.log(`Track: ${tracks[0].name}
Album: ${tracks[0].album.name}
Artist: ${tracks[0].artists[0].name}
Album URL: ${tracks[0].external_urls.spotify}
Track Preview: ${tracks[0].preview_url}`);
    });
}

function movieCommand(x) {
    console.log(chalk.blue("********* Searching IMDB ***********"))
    var params = {
        apiKey: 'bdd0edf1',
        title: x,
        incTomatoes: true
    }
    omdbApi.get(params, function (err, data) {
        if (err) return console.log(chalk.yellow("Movie name is either incorrect or not found!"))
        // process response...
        //console.log(data)
        console.log(`Title: ${data.Title}.
Year: ${data.Year}.
IMDB Rating: ${data.imdbRating}.
Rotten Tomatoes:${data.Ratings[1].Value}.
Country: ${data.Country}.
Language: ${data.Language}.
Plot: ${data.Plot}.
Actors: ${data.Actors}.`);


    });
}

function readFile(x) {
    fs.readFile(x, "utf8", function (err, data) {
        console.log(chalk.blue("********* Reading File ***********"))
        console.log(`Your command is: ${data}`)
        var newCommand = data.split(","),
            newCommandName = newCommand[0],
            newCommandQuery = newCommand[1];
        newCommandQuery = newCommandQuery.replace(/"/g, ''); //remove any quotation marks
        var query = newCommandQuery.replace(/\s+/g, '-')// replaces all spaces represented as \s with dashes
        doSomething(newCommandName, query);
    });
}


// switch between questions
function doSomething(x, y) {
    switch (x) {

        case ("my-tweets"):
            tweetCommand(y);
            writeToFile(x, y);
            break;

        case ("spotify"):
            spotifyCommand(y);
            writeToFile(x, y);
            break;

        case ("movie"):
            movieCommand(y);
            writeToFile(x, y);
            break;

        case ("read-file"):
            readFile(y);
            writeToFile(x, y);
            break;

        default:
            console.log(`Please enter a correct command!`)
    }

}