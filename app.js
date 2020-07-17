var express = require("express"),
mongoose    = require("mongoose"),
ShortUrl    = require("./models/shortUrl"), 
app         = express()

mongoose.connect("mongodb://localhost/urlShortener",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false})

app.set("view engine","ejs")
app.use(express.urlencoded({ extended: false }))


app.get("/", async (req, res) => {
     var shortUrls = await ShortUrl.find()
     res.render("index", { shortUrls: shortUrls })
})

app.post("/shortUrls", async (req,res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')       
})

app.get("/:shortUrl", async (req, res) => {
  var shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
});

app.listen(process.env.PORT || 5000)