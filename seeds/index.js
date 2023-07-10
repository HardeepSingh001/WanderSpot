
const Spot=require('../models/spot')
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers')

const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/wander-spot',{
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
            location: `${cities[random200].City}, ${cities[random200].State}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro enim dolore qui fugit est minus, voluptas nesciunt, ducimus quo consequuntur perferendis. Id consectetur impedit eius dignissimos tempore qui cupiditate voluptatum?',
            price: price
        })
        await s.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
});