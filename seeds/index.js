
const Spot=require('../models/spot')
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers')

const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://knightc0der001:h7355435535@wander-spot.0ps6fyd.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample= array =>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Spot.deleteMany({});
    for(let i=0;i<50;i++){
        const random200=Math.floor(Math.random()*200);
        const price=Math.floor(Math.random()*1000)+10;
        const s=new Spot({
            geometry:{
                type:"Point",
                coordinates: [cities[random200].Longitude,cities[random200].Latitude]
                
            },
            author:'64be78470a64e733b35cf3a9',
            location: `${cities[random200].City}, ${cities[random200].State}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/collection/483251?sig=${random200}`,
            description: 'This Spot is an enchanting retreat nestled amidst the natural splendor of the great outdoors. It is a sanctuary for nature enthusiasts, adventurers, and families seeking to escape the hustle and bustle of city life. Surrounded by lush forests, picturesque landscapes, and serene lakes, It offers a haven of tranquility and opportunities for unforgettable experiences. Here, you can immerse yourself in the soothing sounds of chirping birds and rustling leaves, relishing the fresh mountain air. Enjoy a cozy campfire under the starlit sky, sharing stories and creating cherished memories with loved ones. The spot provides a perfect blend of modern amenities and rustic charm, offering well-maintained facilities, comfortable cabins, and spacious tents for a restful night sleep.',
            price: price,
           
        })
        await s.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
});