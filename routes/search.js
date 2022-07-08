const express = require('express');
const Todo = require('../models/todo');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const router = express.Router();

// endpoint to search todos
router.post('/search_todo', async (req, res) => {
    const {token, search_string, pagec} = req.body;

    if(!token || !search_string || !pagec){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{

        jwt.verify(token, process.env.JWT_SECRET);

        const resultsPerPage = 5;
        let page = pagec >= 1 ? pagec : 1;
        page = page -1;

        const todos = await Todo.find(
            {
                "$or": [
                    {title: new RegExp(search_string, 'i')},
                    {task: new RegExp(search_string, 'i')}
                ]
            },
            {title: 1, task: 1, timestamp: 1, owner_name: 1, owner_id: 1}
        ).sort({timestamp: 'desc'})
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .lean();

        return res.status(200).send({status: 'ok', msg: 'Success', todos});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }

});

module.exports = router;