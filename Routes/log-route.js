const express = require('express');
const router = express.Router();

const {
    viewUserLogs,
    viewItemLogs,
    viewSingleItemLog,
    viewSingleUserLog
} = require('../Controllers');


router.get('/users', viewUserLogs);
router.get('/users/:id', viewSingleUserLog);
router.get('/items', viewItemLogs);
router.get('/items/:id', viewSingleItemLog);



module.exports = router;