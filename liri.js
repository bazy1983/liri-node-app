require("dotenv").config();

var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdbApi = require('omdb-client');
var fs = require("fs");
var chalk = require("chalk");
var date = require("date-and-time");




var myCommand = process.argv;

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var liriCommand = myCommand[2]
if (liriCommand != undefined) liriCommand = liriCommand.toLowerCase(); //standardize
var query = myCommand[3]; // search query
var now = new Date();
var timeNow = date.format(now, 'MM/DD/YYYY HH:mm:ss');

console.clear();
console.log (chalk.inverse("You can ask Liri: my-tweets, spotify song-name, movie movie-name, do"));

//validation to prevent user from sending an empty request!!
// if (liriCommand === "spotify" || liriCommand  === "movie" && query == undefined){
//     console.clear();
//     console.log(chalk.red(`Please search something. ie: ${liriCommand} something`))
//     process.exit();
// }

//validation to prevent user from using spaces when querying stuff!!
if (myCommand[4] != undefined){
    console.clear();
    console.log(chalk.red("Please use dash to search multi-word queries!"))
    process.exit();
}

//initiate command
doSomething(liriCommand, query);

// command log
function writeToFile (x , y){ //x is the command and y is the query
    if (y == undefined) y = "";
    let mylog = `Command: ${x} ${y}; is created at ${timeNow}\n`
    fs.appendFile('log.txt', mylog, function (err) {
        if (err) return err;
        console.log(chalk.red('Command Saved!'));
     });
}

writeToFile(liriCommand, query)


function tweetCommand(y) {
    console.log(chalk.blue("********* Searching Twitter ***********"))
    // twitter GET request
    var params = {user_id: y};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    
      if (!error) {
        //console.log(tweets);
        for (var i = 0; i<tweets.length ; i++){
            console.log(tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at);
            var log = tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at + "\n";
        }
      } else {
          console.log("Got an error: "+ error)
      }
    });
}

function spotifyCommand(x) {
    spotify.search({ type: 'track', query: x, limit: 1 }, function(err, data) {
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

function movieCommand (x){
    console.log(chalk.blue("********* Searching IMDB ***********"))
var params = {
    apiKey: 'bdd0edf1',
    title: x,
    incTomatoes: true
}
omdbApi.get(params, function(err, data) {
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

function readFile (){
    fs.readFile("random.txt", "utf8", function(err, data) {
        console.log(chalk.blue("********* Reading File ***********"))
        console.log(`Your command is: ${data}`)
        var newCommand = data.split(","),
        newCommandName = newCommand[0],
        newCommandQuery = newCommand[1],
        newCommandQuery = newCommandQuery.replace(/"/g,''); //remove any quotation marks
        var query = newCommandQuery.replace(/\s/g,'-')// replaces all spaces represented as \s with dashes
        doSomething(newCommandName, query);
    });
}


// switch between questions
function doSomething (x , y){
    switch (x) {
    
        case ("my-tweets"): 
        tweetCommand(y);
        break;
    
        case ("spotify"): 
        spotifyCommand(y);
        break;
    
        case ("movie"):
        movieCommand(y)
        break;
    
        case("do"):
        readFile();
        break;

        default:
        console.log(`Please enter a correct command`)
    }

}