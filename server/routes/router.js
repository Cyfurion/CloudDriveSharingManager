const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user-controller');

router.get('/db/:profile', UserController.getUser);
router.post('/db', UserController.addSnapshot);

module.exports = router;
