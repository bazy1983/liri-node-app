require("dotenv").config();

var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');



var myCommand = process.argv;

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);




// var http = require("http");
// var port = 3000;
// var server = http.createServer(function(request, response){
//     console.log("Got Request");
//     response.end(allTweets); 
// //server end
// });
// server.listen(port, function(error){
//     if(error) {
//         return console.log("something went wrong", error)
//     };
//     console.log("server is listening on port: ", port);
// });


// twitter GET request

switch (myCommand[2]) {

    case ("my-tweets"): 
    tweetCommand();
    break;

    case ("spotify"): 
    spotifyCommand();
    break;
}

function tweetCommand() {

    var params = {user_id: 'bazy1983'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    
      if (!error) {
        //console.log(tweets);
        for (var i = 0; i<tweets.length ; i++){
            console.log(tweets[i].user.name + ": "+ tweets[i].text +"; " +tweets[i].created_at);
        }
      } else {
          console.log("Got an error: "+ error)
      }
    });
}

function spotifyCommand() {
    spotify.search({ type: 'track', query: 'hello - lionel', limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      //console.log(data); 
      var tracks = data.tracks.items;
      console.log("********* ITEMS ***********")
      
      console.log(`${tracks[0].album.name} by ${tracks[0].artists[0].name}: ${tracks[0].external_urls.spotify}`);
      });
}