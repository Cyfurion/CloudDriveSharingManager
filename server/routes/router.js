const express = require('express');
const router = express.Router();

const SnapshotController = require('../controllers/snapshot-controller');
const UserController = require('../controllers/user-controller');

router.get('/db/:id', SnapshotController.getSnapshot);
router.get('/users/:profile', UserController.getUser);
router.post('/db', SnapshotController.addSnapshot);

module.exports = router;
