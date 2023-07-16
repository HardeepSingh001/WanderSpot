const express=require("express")
const app=express()
const path=require("path")
const Spot=require('./models/spot')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')
const Review=require('./models/review')

app.set('view engine','ejs')
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)



const mongoose=require('mongoose')
const review = require("./models/review")
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

app.get('/home',(req,res)=>{
    res.render("home")
})

app.get("/spots",catchAsync(async(req,res)=>{
    const spots=await Spot.find({});
    res.render('spots/index',{spots})
}))

app.get('/spots/new',(req,res)=>{
    res.render('spots/new')
})

app.post('/spots',catchAsync(async(req,res)=>{
    const spot=new Spot(req.body.spot);
    await spot.save();

    res.redirect(`/spots/${spot._id}`)

}))


app.get('/spots/:id',catchAsync(async(req,res)=>{
    const spot=await Spot.findById(req.params.id).populate('reviews');
    res.render('spots/show',{spot})
}))


app.get('/spots/:id/edit',catchAsync(async(req,res)=>{
    const spot=await Spot.findById(req.params.id)
    res.render('spots/edit',{spot})
}))

app.put('/spots/:id',catchAsync(async(req,res)=>{
    const spot=await Spot.findByIdAndUpdate(req.params.id,{...req.body.spot})

    res.redirect(`/spots/${spot._id}`)
}))

app.delete('/spots/:id',catchAsync(async(req,res)=>{
    await Spot.findByIdAndDelete(req.params.id)
    res.redirect('/spots')
}))

app.post('/spots/:id/reviews', catchAsync(async(req,res)=>{
    const spot=await Spot.findById(req.params.id)
    const review=new Review(req.body.review)
    spot.reviews.push(review);
    await review.save()
    await spot.save()
    res.redirect(`/spots/${spot._id}`)
}))


app.delete('/spots/:id/reviews/:reviewid',catchAsync(async(req,res)=>{
    const {id, reviewid}=req.params
    await Spot.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/spots/${id}`)
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err
    if(!err.message) err.message='Something Went wrong'

    res.status(statusCode).render('error',{err});
    
})

app.listen(3000,()=>{
    console.log("Listening on port 3000..")
})