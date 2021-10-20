const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-API");






// //mongoose will pluralize (Make them plural) and modify to lower case
// //has to be 'User', Test, Smaple ect because we are going to make a constructor out of it 
// const User = mongoose.model('User', {
//     // What fields we have and what their names and types are
//     name: {
//         type: String
//     },
//     age: {
//         type: Number
//     }
// });

// const me = new User({
//     name: "Tina",
//     age: 27
// });

// //After calling save it will write the info into the db
// //save will return a promise
// // me.save().then(()=>{
// //     console.log(me);
// // }).catch((error)=>{
// //     console.log(error);
// // });




