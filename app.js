//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
let date = require(__dirname + "/date.js");

let day = date.getDate();

app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// *** connect to mongoose database ***
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// *** items schema  ***
const itemsSchema =  {
name: String
};
// *** items model ***
const Item = mongoose.model("Item", itemsSchema);


// *** create some items ***
const item1 = new Item({
  name: "Welcome to your to-do list"
});

const item2 = new Item({
  name: "Hit '+' button to add new task"
});

const item3 = new Item({
  name: " Click on the checkbox to delete task"
});



const defaultItems = [item1, item2, item3];


// *** listschema ***
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



// *** insert items and send to home route ***

app.get("/", function(req,res) {

  

  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Items added successfully to Database");
        }
      });
      res.redirect("/");
    }else{

      res.render("list", {listTitle: day , newListItems: foundItems});
    }

   
  });


});

// *** getting items and content from app ***
app.post("/", function(req, res){
  let itemName = req.body.newItem;
  let listName = req.body.list;

  let item = new Item ({
    name: itemName
  });

  if(listName === day ){
    item.save();
    res.redirect("/");
  }else {
    List.findOne({name: listName}, function(err, foundList){
foundList.items.push(item);
foundList.save();
res.redirect("/" + listName)
    });
  }


});


// *** delete function ***

app.post("/delete", function(req, res){
  let checkedItemId = req.body.checkbox;
  let listName = req.body.listName;
  if(listName = day){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("Task Successfully Deleted");
        res.redirect("/");
      }

    });

  }else {
    List.findOneAndUpdate({name: listName}, {$pull: {items:{_id: checkedItemId}}}, function(err){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }
  
    
  
  
});


// *** create dynamically generated pages *** 

app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
       //create new list
       let list = new List({
        name: customListName,
        item: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);

      }else{
       //show existing list
       res.render("list", {listTitle: foundList.name, newListItems: foundList.items })
      }
    }
  });

 
});

// app.get("/work", function(req, res){
//   res.render("list", {listTitle: "Work list", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });



app.listen(3000, function(){
  console.log("Server Started on port 3000");
});



// switch (currentDay) {
//   case 0:
//     day ="Sunday";
//     break;
//     case 1:
//     day ="Monday";
//     break;
//     case 2:
//     day ="Tuesday";
//     break;
//     case 3:
//     day ="Wednesday";
//     break;
//     case 4:
//     day ="Thursday";
//     break;
//     case 5:
//     day ="Friday";
//     break;
//     case 6:
//     day ="Saturday";
//     break;

//   default:
//     console.log("Error: Current day is equal to: " + currentDay);



function resolveAfter20Seconds(){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("resolved");
    },20000);
   });
}

async function asyncChat(){
  console.log("calling");
  let result = await resolveAfter20Seconds();
  console.log(result);
  
}
