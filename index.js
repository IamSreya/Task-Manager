const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Public directory setup
app.use(express.static(path.join(__dirname, 'public')));

//ejs template engine setup
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    fs.readdir(`./files`, function(err, files) {
        res.render("index", {
            files: files
        });
    })
});

//Read More...
app.get("/file/:filename", function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8" ,function(err, filedata) {
        res.render("show", {filename: req.params.filename, filedata: filedata});
    })
});

//Create a new file
app.post("/create", function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/");
    })
});


//Edit a file
app.get("/edit/:filename", function(req, res){
    res.render("edit", { filename: req.params.filename });
});

app.post("/edit", function(req, res){
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}` , function(err) {
        res.redirect("/");
    });
});

//Delete a file
app.get("/delete/:filename", function(req, res){
    fs.unlink(`./files/${req.params.filename}`, function(err) {
        res.redirect("/");
    });
});

app.listen(3000, function() {
    console.log('Server is running on http://localhost:3000');
});