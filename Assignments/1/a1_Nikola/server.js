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

//accepts two route parameters as dogid & walkerid
//Rules
    // both walker and dog must be located in same City
    //if the walker has a preferred breed, the dog's breeds must match that preference
    //if walker has no (null) preferred breed, they can any dog in the same city 
app.get("/walk/:dogid/with/:walkerid",(req,res)=> {
    console.log(req.params.dogid)
    console.log(req.params.walkerid)
    const idwalker = req.params.walkerid
    const iddogid = req.params.dogid
    let html = `<h2>The dogs and there owners</h2>`

    let dog = "" 
    let walker =""
    const dogWalker = []
    
    //find the walker entered
    // save in dog walker array of do and walkers of enter id
    for (let i = 0 ; i <walkers.length; i++){
        if ( walkers[i].id === idwalker ) {
            // found
            dogWalker.push(walkers[i]);
            walker = walkers[i].id;
            console.log(walker)
            console.log( dogWalker)
        } else {
            console.log('move to next')
        }
    }
    //find the dog entered
    // save in dog walker array of do and walkers of enter id
    for (let i =0 ; i<dogs.length; i++){
        if (dogs[i].id === iddogid ) {
            //found
            dogWalker.push(dogs[i]);
            dog = dogs[i].id
            console.log(dog)
            console.log( dogWalker)
        } else{
            console.log('move to next')
        }
    }
    //checks for choose walker and dog
    if (dogWalker[0].city === dogWalker[1].owner.city ) {
        console.log('can walk it is in same city!')
        // continue with next check
        if (dogWalker[0].preferredBreed  === dogWalker[1].breed) {
            console.log(dogWalker[0].preferredBreed  === dogWalker[1].breed)
            console.log(dogWalker[0].preferredBreed)
            console.log('Can Walk that dog')
            const newId = getNextHistoryId();
            history.push({
              id: newId,
              walkerId: dogWalker[0].id,
              dogId:dogWalker[1].id,
              rating: 1, // rating not set yet; will be filled later
            });
            console.log(history)
            console.log(dogWalker)
          
            return res.send( `Walker ${idwalker} can  Walk Dog ${iddogid}. City and breeds are the Same.
                 Session Started, SesstionId: ${newId}`)

        } else if (dogWalker[0].preferredBreed === null ) {
            console.log(dogWalker[0].preferredBreed)
            console.log('Can Walk that dog')
            const newId = getNextHistoryId();
            history.push({
              id: newId,
              walkerId: dogWalker[0].id,
              dogId:dogWalker[1].id,
              rating: 1, // rating not set yet; will be filled later
            });
            console.log(history)
             return res.send( `Walker ${idwalker} can  Walk Dog ${iddogid}. City and breeds are the Same }
                Session Started, SesstionId: ${newId}`)
            
          
        } else {
             console.log('in same city, but walker  choosen breed and dog breed do not match, this walker can not walk the choosen dog, Pick another dog')
             return res.send(` Walker ${idwalker} can not Walk Dog ${iddogid}. Breeds do not match`)
        }
    } else {
        console.log('not in same city, this walker can not walk the choosen dog, Pick another dog')
        return res.send(` Walker ${idwalker} can not Walk Dog ${iddogid}. City not the Same`)
    }
    


   /* for (let i = 0; i < Math.min(dogs.length, walkers.length); i++) {
      //console.log(`${dogs[i]} → ${walks[i]}`);
        //console.log(dogs[i].id === req.params.dogid )
        //console.log(walkers[i])
      
    }*/
     
});// app.get walk/dog


//GET 
//endpoint accepts a completed walk session id as a route parameter.
//1.Search the walk history for a session matching the provided ID.
//2. If the session exists, update its rating by 1. The maximum possible rating is 5.
//3. Responds with a success message confirming the new rating has been recorded.
//if the rating value is already at 5, the endpoint should output an error message explaining the issue
app.get("/ratings/increase/:sessionid",(req,res)=>{
    const sessionID = req.params.sessionid;
    console.log(typeof sessionID)


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
              Maximum Possable rating is 5. It is at rating  ${walkerSession.rating}. Can not increase Rating!`
            );
          }
          walkerSession.rating += 1;
            return res.send(`
              Success! Updated Rating now at ${history[Number(sessionID)-1].rating} recorded in walk History`
          );

         /* .map ((currW) => {
            if (currW.rating < 5 ) {
              // go ahead with rating increase 
              currW.rating += 1
              
              console.log(`New Rating: ${currW.rating}`)
              //return success message comfriming new rating recorded
              return true  //res.send(`Success! Updated Rating now at  ${currW.rating} recorded in walk History`)
            }
            // if rating is at 5 or more do not update rating at maximum 
            console.log(`Can not increase at 5 already ${currW.rating}`)
            return false//res.send(`Maximum Possable rating is 5. It is at rating  ${currW.rating}. Can not increase Rating!`)

          })*/
   /* for ( let i =0 ; i< history.length; i ++){
        // searching history walks to find entered ID
            //console.log(typeof history[i].id )


        if (Number(sessionID) === history[i].id) {
            // increase the rating there by 1  up to 5
             if (history[i].rating < 5) {
                // go ahead with rating increase 
                history[i].rating = history[i].rating + 1
                console.log(`New Rating: ${history[i].rating}`)
                // return success message comfriming new rating recorded
                return res.send(`Success! Updated Rating now at  ${history[i].rating} recorded in walk History`)
             } else  /* if rating is at 5 or more do not update rating at maximum {
                console.log(`Can not increase at 5 already ${history[i].rating}`)
                return res.send(`Maximum Possable rating is 5. It is at rating  ${history[i].rating}. Can not increase Rating!`)
              

             }

           
            
        } else {
            console.log("Move to next")
        }

        // leaves loop here
    } // end of loop
*/  console.log(history.rating)
    if (walkerSession === false || walkerSession === "false") {
      console.log(walkerSession)
      return res.send(`Maximum Possable rating is 5. It is at rating ${history[Number(sessionID)-1].rating}. Can not increase Rating!`)
       
    } else {
      console.log(walkerSession)
      return res.send(`Success! Updated Rating now at ${history[Number(sessionID)-1].rating} recorded in walk History`)
      
    } 
});



// helper functions for "/ratings/get/:walkerid" endpoint

// function to get the ratings (array of ratings) by specifed walkerId
// goes thorugh each history session finds the walkerId entered, saves them
// then keeps the ratings only from them 
const getratingsByWalkerID = (walkerID) => {
    return history 
      .filter((currW)=> {       // finds the walker history for the given walker
        console.log(currW)
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

const calAverageRating = (ratings) => {
    // if the ratings are under 4, not engough data return 0 for average
    if (ratings.length < 4) {
       // default avg is 0
        console.log(`Average Rating is 0 by default`)
        return 0;
    } 
    // if 4 or over perform average calulations

    // sort them ascending
    const sorted = [...ratings].sort((a,b) => a-b)
    // drop single lowest and single highest
    const trimmed = sorted.slice(1,-1)

    // average
    const sum = trimmed.reduce((acc, n) => {
      return acc + n
    }, 0)

    return sum / trimmed.length;

//array.reduce((accumulator, currentValue) => { ... }, initialValue) syntax
};




app.get("/test/ratings/get/:walkerid",(req,res) => {
    const walkerId = req.params.walkerid;
    //console.log(typeof walkerId)
    //console.log(getratingsByWalkerID(walkerId))
    const ratings = getratingsByWalkerID(walkerId);
    const avg = calAverageRating(ratings);
    console.log(`Ratings for ${walkerId} is: ${ratings}`);
    console.log(`Average Rating for ${walkerId} is: ${avg}`);
    return res.send(`Average Rating for ${walkerId} is: ${avg}`);

})




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
  console.log(walkerId);
  console.log(typeof walkerId);
  //const walkerRatings = [];
  //let avg = 0;

   
  /*
  for (let i = 0; i < history.length; i++) {
    if (walkerID === history[i].walkerId) {
      // if walkerID matches store that session in walker array
      walkerRatings.push(history[i].rating);
    } else {
      console.log("move to next");
    }
  }
  */
  /*
   let min =  walkerRatings[0];
   let max = walkerRatings[0];
   console.log(min)
   console.log(max)
   console.log(walkerRatings.length);
   console.log(walkerRatings);
   */

   /*
  if (walkerRatings.length < 4) {
         // default avg is 0
        console.log(`Average Rating for Walker ID: ${walkerID} is 0`)
        return res.send(`Average Rating for Walker ID: ${walkerID} is 0`)
  } else {
    // at least 4 ratings or more needed for average
    for (let i = 0; i < walkerRatings.length; i++) {
      //find min and max exclude the single highest and single lowest

      if (walkerRatings[i] < min) {
        min = walkerRatings[i];
      }
      if (walkerRatings[i] > max) {
        max = walkerRatings[i];
      }
    }
// 3 3 3 3 3 3
    // 4. Remove ONE occurrence of min
    let minIndex = walkerRatings.indexOf(min);
    walkerRatings.splice(minIndex, 1);

    // 5. Remove ONE occurrence of max
    let maxIndex = walkerRatings.indexOf(max);
    walkerRatings.splice(maxIndex, 1);

    // 6. Compute average of remaining values
    let sum = 0;
    for (let i = 0; i < walkerRatings.length; i++) {
      sum += walkerRatings[i];
    }
     avg = sum / walkerRatings.length;

    // 7. Return formatted message
    //return `Average rating is ${avg}`;
    
  }
    */
/*
  console.log(walkerRatings.length);
  console.log(walkerRatings);
  //console.log(Math.min(walkerRatings));
  //console.log(Math.max(walkerRatings));
  return res.send(`Average rating for walker id: ${walkerID} is ${avg}`)
*/
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
