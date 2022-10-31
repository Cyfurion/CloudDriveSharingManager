const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user-controller');

router.get('/user/:id', UserController.getUser);

module.exports = router;
