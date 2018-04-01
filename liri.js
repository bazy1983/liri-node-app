require("dotenv").config();

var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdbApi = require('omdb-client');
var fs = require("fs");
var chalk = require("chalk");



var myCommand = process.argv;

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var liriCommand = myCommand[2]
var query = myCommand[3]; // search query

if (myCommand[4] != undefined){
    console.clear();
    console.log(chalk.red("please use dash to search multi-word queries!"))
    process.exit();
}

console.log (chalk.inverse("You can ask Liri: my-tweets, spotify, movie"));
console.clear();


// record search log
function writeToFile (x){
    fs.appendFile('log.txt', x, function (err) {
        if (err) return err;
        console.log(chalk.red('Command Saved!'));
     });
}

writeToFile(`${liriCommand}: ${query}`)


// switch between questions
switch (liriCommand) {

    case ("my-tweets"): 
    tweetCommand();
    break;

    case ("spotify-this-song"): 
    spotifyCommand(query);
    break;

    case ("movie-this"):
    movieCommand(query)
    break;

    case("do-what-it-says"):
    readFile();
    break;
}

function tweetCommand() {
    // twitter GET request
    var params = {user_id: 'bazy1983'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    
      if (!error) {
        //console.log(tweets);
        for (var i = 0; i<tweets.length ; i++){
            console.log(tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at);
            var log = tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at + "\n";
            writeToFile(log);
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
      
      
      console.log(`Track: ${tracks[0].name}
Album: ${tracks[0].album.name}
Artist: ${tracks[0].artists[0].name}
Album URL: ${tracks[0].external_urls.spotify}
Track Preview: ${tracks[0].preview_url}`);
      });
}

function movieCommand (x){
 
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
    

    // writing to log file
    var log = `Title: ${data.Title}.
    Year: ${data.Year}.
    IMDB Rating: ${data.imdbRating}.
    Rotten Tomatoes:${data.Ratings[1].Value}.
    Country: ${data.Country}.
    Language: ${data.Language}.
    Plot: ${data.Plot}.
    Actors: ${data.Actors}.` + "\n";
     writeToFile(log);
    
});
}

function readFile (){
    fs.readFile("random.txt", "utf8", function(err, data) {
        console.log(data)
    });
}