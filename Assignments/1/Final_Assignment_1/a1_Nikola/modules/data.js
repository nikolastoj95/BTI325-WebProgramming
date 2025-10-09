//Y ou may modify the objects as needed to test your code. 
// However, the overall structure of the objects should remain the same.

const walkers = [
    { id: "ahassan", name: "Amina Hassan", city: "Toronto", preferredBreed: "Golden Retriever" },        
    { id: "gokafor", name: "Gabriel Okafor", city: "Ottawa", preferredBreed: null },
    { id: "rpatel", name: "Raj Patel", city: "Vancouver", preferredBreed: null },  
    { id: "mchen", name: "Ming Chen", city: "Toronto", preferredBreed: null },    
]

const dogs = [
    { id: "buddy427", name: "Buddy", breed: "Golden Retriever", owner: { name: "Clark Kent", city: "Toronto", reports: 1 } },
    { id: "fido601", name: "Fido", breed: "Yorkie", owner: { name: "Bruce Wayne", city: "Toronto", reports: 1 } },
    { id: "max219", name: "Max", breed: "Golden Retriever", owner: { name: "Jack Sparrow", city: "Vancouver", reports: 2 } },    
    { id: "bella764", name: "Bella", breed: "Beagle", owner: { name: "Katniss Everdeen", city: "Vancouver", reports: 1 } },
    { id: "rocky301", name: "Rocky", breed: "Bulldog", owner: { name: "Daenerys Targaryen ", city: "Ottawa", reports: 0 } },
    { id: "luna888", name: "Luna", breed: "Poodle", owner: { name: "Hermione Granger", city: "Vancouver", reports: 0 } },
    { id: "rover123", name: "Rover", breed: "German Shepherd", owner: { name: "Elena Gilbert", city: "Vancouver", reports: 0 } },
]

const history = [    
    { id: 1, walkerId: "rpatel", dogId: "max219", rating: 5 },
    { id: 2, walkerId: "rpatel", dogId: "luna888", rating: 1 },
    { id: 3, walkerId: "rpatel", dogId: "max219", rating: 2 },
    { id: 4, walkerId: "rpatel", dogId: "bella764", rating: 4 },
    { id: 5, walkerId: "rpatel", dogId: "rover123", rating: 1 },
    { id: 6, walkerId: "rpatel", dogId: "max219", rating: 5 }, // rpatel : 5,1,4,2,1,5 -> 5,1,4,2 
    { id: 7, walkerId: "mchen", dogId: "fido601", rating: 4 },
    { id: 8, walkerId: "mchen", dogId: "buddy427", rating: 2 },
    
]

// export the walkers, dogs, and history arrays as named exports for use with require()
module.exports = { walkers, dogs, history }