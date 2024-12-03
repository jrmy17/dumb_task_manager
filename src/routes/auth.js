
const express = require('express');
const router = express.Router();
const users = require('../models/user')

// Placeholder routes for authentication
router.get('/login', (req, res) => res.render('login'));
router.post('/login', (req, res) => {
    users.authenticate(req.body.username, req.body.password, (user) => {
        if (user.connected) {
            res.redirect('/?userId=' + user.id)
        }
    })
})
router.get('/user/register', (req, res) => {
    let username = req.query.username;
    var password = req.query.password;
    let email = req.query.email;
    users.create({ username, password, email }, (err, user) => {
        if (user) {
            res.redirect('/login');
        } else {
            res.redirect('/')
        }
    })
})
router.get('/register', (req, res) => res.render('register'));

module.exports = router;
