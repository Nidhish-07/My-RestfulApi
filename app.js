//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const app = express();

app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Nidhish:<password>@cluster0.jcg7q.mongodb.net/restfulDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const infoSchema = {
  title: String,
  content: String,
  age: String,
};

const Info = mongoose.model("Info", infoSchema);

// app.route("/infos").get((req, res)=> {
//     Info.find({}, (err, foundInfo) => {
//       if (err) {
//         console.log(err);
//       }
//       res.send(foundInfo);
//     });
//   }).post((req, res) => {
//     const newInfo = new Info({
//       title: req.body.title,
//       content: req.body.content,
//     });

//     newInfo.save((err) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send("Successfully added");
//       }
//     });
//   }).delete( (req, res) => {
//     Info.deleteMany((err)=>{
//         if(err){
//             res.send(err)
//         }
//         else{
//             res.send("Successfully deleted all the data");
//         }
//     })
// })// will execute the DRY principal so we dont have to write http method every time

app.get("/infos", (req, res) => {
  Info.find({}, (err, findInfo) => {
    if (err) {
      console.log(err);
    }
    res.send(findInfo);
  });
});

app.post("/infos", (req, res) => {
  const newInfo = new Info({
    title: req.body.title,
    content: req.body.content,
  });

  newInfo.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully added");
    }
  });
});

app.delete("/infos", (req, res) => {
  Info.deleteMany((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully deleted all the data");
    }
  });
});

app
  .route("/infos/:employeeTitle")

  .get((req, res) => {
    Info.findOne({ title: req.params.employeeTitle }, (err, foundTitle) => {
      if (err) {
        res.send("Not data available");
      } else {
        res.send(foundTitle);
      }
    });
  })
  .put((req, res) => {
    Info.replaceOne(
      { title: req.params.employeeTitle },
      {
        title: req.body.title,
        content: req.body.content,
        age: req.body.age,
      },
      {
        overwrite: true,
      },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated");
        }
      }
    );
  })
  .patch((req, res) => {
    Info.updateOne(
      { title: req.params.employeeTitle },
      //   {
      //       $set:{
      //           title:req.body.params, content:req.body.content
      //       }
      //   },
      {
        $set: req.body,
      },

      (err) => {
        if (!err) {
          res.send("Successfully patched");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Info.deleteOne(
      { title: req.params.employeeTitle },

      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully deleted");
        }
      }
    );
  });

app.listen(7000, () => {
  console.log("Server up and running at 7000");
});
