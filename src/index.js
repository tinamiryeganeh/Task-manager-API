// mahale modiriat
const express = require("express");
require('./db/mongoose');
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;


//express.json() is a middleware 
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//const bcrypt = require("bcryptjs");

// const myFunction = async () => {
//     const password = 'SecurePas$1';
//     const hashedPassword = await bcrypt.hash(password, 8);

//     console.log(password);
//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare('SecurePas$2', hashedPassword);


//     console.log(isMatch);

// }


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//     const task = await Task.findById("61607905e6dcb363a6297eff");
//     if (task) {
//         console.log(task);
//     }
//     await task.populate('owner');
//     console.log(task.owner);
// };

// main();


