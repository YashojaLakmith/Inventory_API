const express = require('express');
const router = express.Router();

const {login} = require('../Controllers');

router.post('/', login);


module.exports = router;