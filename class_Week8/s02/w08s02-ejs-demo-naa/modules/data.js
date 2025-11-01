const students = [
    {name:"Peter", course:"BSD"},
    {name:"Mary", course:"CPA"},
    {name:"Fred", course:"BSD"},
    {name:"Betty", course:"CPP"},
]

const chatMessages = [
    {sender:"Shohei", msg:"What are you doing tonight?", img:"https://imageio.forbes.com/specials-images/imageserve/67e1d7d1e8b4079f02644ba8/0x0.jpg?format=jpg&crop=2077,2075,x814,y0,safe&height=416&width=416&fit=bounds"},
    {sender:"Yoshi", msg:"Playing a baseball game", img:"https://img.olympics.com/images/image/private/t_1-1_300/f_auto/primary/c9g6peqdr4jphandv9ko"},
    {sender:"Shohei", msg:"Me too. Who are you playing", img:"https://imageio.forbes.com/specials-images/imageserve/67e1d7d1e8b4079f02644ba8/0x0.jpg?format=jpg&crop=2077,2075,x814,y0,safe&height=416&width=416&fit=bounds"},
    {sender:"Yoshi", msg:"Toronto Blue Jays", img:"https://img.olympics.com/images/image/private/t_1-1_300/f_auto/primary/c9g6peqdr4jphandv9ko"},
    {sender:"Yoshi", msg:"That team is difficult to beat, I'm scared", img:"https://img.olympics.com/images/image/private/t_1-1_300/f_auto/primary/c9g6peqdr4jphandv9ko"},
    {sender:"Shohei", msg:"Agree", img:"https://imageio.forbes.com/specials-images/imageserve/67e1d7d1e8b4079f02644ba8/0x0.jpg?format=jpg&crop=2077,2075,x814,y0,safe&height=416&width=416&fit=bounds"},
]

// export the data so its available to other parts of app (example:server.js)
module.exports = {students, chatMessages}