const express = require("express")
const app = express()
const port = process.env.PORT || 8080

const {walkers, dogs, history} = require("./modules/data.js")

// Displays links for testing the endpoints
app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/views/index.html")
})

// Used to view completed walk sessions
app.get("/history", (req, res) => {
    let htmlOutput = `
        <h1>Walk History</h1>
        <ul>
            <li><a href="/">Go Home</a></li>
        </ul>
        <table>
            <tr>
                <th>Session ID</th>
                <th>Walker ID</th>
                <th>Dog ID</th>
                <th>Rating</th>
                <th>Increase Rating</th>
            </tr>
    `
    for (let i = 0; i < history.length; i++) {
        // add a table row for each walk session
        htmlOutput += `
            <tr>
                <td>${history[i].id}</td>
                <td>${history[i].walkerId}</td>
                <td>${history[i].dogId}</td>
                <td>${history[i].rating}</td>
                <td><a href="/ratings/increase/${history[i].id}">Increase Rating</a></td>
            </tr>
        `
    }

    htmlOutput +=`</table>`
    return res.send(htmlOutput)
})
// Function to generate New Session ID, for history
// finds the Max Id in History list, and appends by one
const getNextHistoryId = ()  => {
  let maxId = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].id > maxId) {
      maxId = history[i].id;
    }
  }
  return maxId + 1;
};


// ----------------------------------------------
// TODO: Create your endpoints here
// ----------------------------------------------

//GET
//accepts two route parameters as dogid & walkerid
//Rules
    // both walker and dog must be located in same City
    //if the walker has a preferred breed, the dog's breeds must match that preference
    //if walker has no (null) preferred breed, they can any dog in the same city 
app.get("/walk/:dogid/with/:walkerid",(req,res)=> {
    //console.log(req.params.dogid)
    //console.log(req.params.walkerid)
    const idwalker = req.params.walkerid
    const iddogid = req.params.dogid

    //let dog = "" 
    //let walker =""
    const dogWalker = []


    //Find the Walker Entered
    // Save in dog walker array of dog and walkers of entered id
    for (let i = 0 ; i <walkers.length; i++){
        if ( walkers[i].id === idwalker ) {
            // found
            dogWalker.push(walkers[i]);
            //walker = walkers[i].id;
            //console.log(walker)
            //console.log( dogWalker)
        } 
    }

    //Find the Dog Entered
    // Save in dog walker array of dog and walkers of entered id
    for (let i =0 ; i<dogs.length; i++){
        if (dogs[i].id === iddogid ) {
            //found
            dogWalker.push(dogs[i]);
            //dog = dogs[i].id
            //console.log(dog)
            //console.log( dogWalker)
        } 
    }
    const walker = dogWalker
            .find((item) => {
              if (!item.owner) {
                return true; // walker has no owner // this is the walker portion
              }
            });
    const dog = dogWalker
            .find ((item) => {
              if (item.owner) {
                return true;  // the dog has owner field // this is the dog portion
              }
            });

 //checks for choosen walker and dog
 if (walker.city === dog.owner.city) {
    console.log('Can walk it is in Same City!')

    // continue next check Breed Match Check
    if(walker.preferredBreed === dog.breed || walker.preferredBreed === null) {
        console.log('Can Walk that dog')
        //generating New ID
        const newId = getNextHistoryId();
        //Adding New Session to History
        history.push({
          id: newId,
          walkerId: walker.id,
          dogId:dog.id,
          rating: 1, // rating set to 1 by default; later can be changed
        });
        return res.send( `Walker ${idwalker} can Walk Dog ${iddogid}. City and breeds are the Same or Walker has no preferred Breed.--
                 Session Started, SesstionId: ${newId}`)
    } else {
            console.log('In same city, but walker choosen breed and dog breed do not match, this walker can not walk the choosen dog, Pick another dog')
            return res.send(`Walker ${idwalker} can not Walk Dog ${iddogid}. Breeds do not match`)
      }
 }  else {
        console.log('Not in Same City, this walker can not walk the choosen dog, Pick another dog')
        return res.send(` Walker ${idwalker} can not Walk Dog ${iddogid}. City not the Same`)
 }

     
});// app.get walk/dog

//GET 
//endpoint accepts a completed walk session id as a route parameter.
//1.Search the walk history for a session matching the provided ID.
//2. If the session exists, update its rating by 1. The maximum possible rating is 5.
//3. Responds with a success message confirming the new rating has been recorded.
//if the rating value is already at 5, the endpoint should output an error message explaining the issue
app.get("/ratings/increase/:sessionid",(req,res)=>{
    const sessionID = req.params.sessionid;
    //console.log(typeof sessionID)

    const walkerSession = history
          .find((currW) => {
            if (currW.id === Number(sessionID)) {
              //console.log(currW)
              return true; // keep the session found
            }
            return false;
          });

          if (walkerSession.rating >=5) {
            return res.send(`
              Maximum Possable rating is 5. It is at rating ${walkerSession.rating}. Can not increase Rating!`
            );
          }
          // otherwise increase rating by 1
          walkerSession.rating += 1;
            return res.send(`
              Success! Updated Rating now at ${walkerSession.rating} recorded in walk History`
          ); 
});

// helper functions for "/ratings/get/:walkerid" endpoint

// function to get the ratings (array of ratings) by specifed walkerId
// goes thorugh each history session finds the walkerId entered, saves them
// then keeps the ratings only from them 
const getratingsByWalkerID = (walkerID) => {
    return history 
      .filter((currW)=> {       // finds the walker history for the given walker
        //console.log(currW)
        if (currW.walkerId === walkerID) {
          console.log('Match' + currW) 
          return true; // keep it 
        } 
        return false; // do not keep, keep looping
      })
      .map((currW) => {
        return Number (currW.rating) // takes the ratings only for the given walker, makes sure it is a Number
      })
} ;
//Function to calculate Average Rating
const calAverageRating = (ratings) => {
    // if the ratings are under 4, not engough data return 0 for average
    if (ratings.length < 4) {
       // default avg is 0
        console.log(`Average Rating is 0 by default`)
        return 0;
    } 
    //if 4 or over perform average calulations

    // sort them ascending
    // copy ratings, when sorting, and dropping single lowest, highest
    const sorted = [...ratings].sort((a,b) => a-b)
    // drop single lowest and single highest
    const trimmed = sorted.slice(1,-1)

    // average
    const sum = trimmed.reduce((acc, n) => {
      return acc + n
    }, 0)
    return sum / trimmed.length;
};
// GET
//endpoint accepts walker if as param
// 1. Search walk history for a session matching the provided walkerid
//2. Compute AVG rating for the walker, according to these rules:
    //a. average should be calulated if walker has at least 4 recording ratings (ratings >=4)
    /* b. When there are four or more ratings;
          Calculate the average after excluding the single highest and the single lowest rating. 
          For example,if the walker’s ratings are: 2,2,3,5,5, then the final rating is computed as the average of: 2,3,5. (average = 3.33333)
        c. If fewer than 4 ratings (ratings < 4), average rating defaults to 0 indicated insufficient data
    */
//3. Respond with string message containing the average rating
app.get("/ratings/get/:walkerid", (req, res) => {
  const walkerId = req.params.walkerid;
  //console.log(walkerId);
  //console.log(typeof walkerId);
    const ratings = getratingsByWalkerID(walkerId);
    const avg = calAverageRating(ratings);
    console.log(`Ratings for ${walkerId} is: ${ratings}`);
    console.log(`Average Rating for ${walkerId} is: ${avg}`);
    return res.send(`Average Rating for ${walkerId} is: ${avg}`);
});

const startServer = () => {
 console.log(`The server is running on http://localhost:${port}`)
 console.log(`Press CTRL + C to exit`)
}
app.listen(port, startServer)