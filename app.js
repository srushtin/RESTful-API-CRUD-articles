const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engines", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: "String",
  content: "String"
});

const Article = mongoose.model("Article", articleSchema);

//request to all articles

app.route("/articles")

  .get(function(req, res) {
    Article.find({}, function(err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("successfully added an article!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("deleted item successfully");
      } else {
        res.send(err);
      }
    });
  });

//request to a specific articles

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, result) {
      if (result) {
        res.send(result);
      } else {
        res.send("no articles matching that title was found");
      }
    });
  })

  .put(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("updated successfully");
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("successfully updated!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("deleted successfully");
      } else {
        res.send(err);
      }
    });
  });





app.listen(3000, function() {
  console.log("listening on port 3000");
});
