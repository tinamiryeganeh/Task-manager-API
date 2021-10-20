const express = require("express");
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();



router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        //... = Adding all fields for us (destructure)
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

//filtering
// after ? it comes like key = value
// GET /tasks?completed=true
//pagination
// GET /tasks?limit=10&skip=20
//sorting
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    //filtering 
    const match = {}
    //sorting
    const sort = {}
    //req = request is an object that is sent from user contain all the data 
    //req.query : comes after question mark. For instance (completed=true) in filtering part 
    //req.query = is an object
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        //parts =['createdAt' , 'Desc']
        const parts = req.query.sortBy.split(':')
        //sort = {'createdAt': -1}
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //for paging(limit the responses that return from the server)
        // Limit represent the number of response that will return from the server
        //(skip 20) will skip the first 20
        await req.user.populate({
            //This tasks refers to the task in model/user line 62
            path: 'tasks',
            match,
            //pagination will be sent to the populate as an object
            //options is for paging and sorting only. For filtering we used match
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
});
// router.get("/tasks", auth, async (req, res) => {
//     try {
//         // req.user is filled in our middleware 
//         console.log("Test");
//         await req.user.populate('tasks').exec();
//         console.log(req.user);
//         console.log(req.user.tasks);
//         res.send(req.user.tasks);
//     } catch (error) {
//         res.status(500).send();
//     }
// });


module.exports = router;