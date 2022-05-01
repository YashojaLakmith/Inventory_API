const express = require('express');
const router = express.Router();

const {
    registerUser,
    modifyUsers,
    changePassword,
    deleteUser,
    viewAllUsers,
    viewSingleUser,
} = require('../Controllers');

router.get('/view', viewAllUsers);
router.get('/view/:id', viewSingleUser);
router.post('/register', registerUser);
router.patch('/modify/:id', modifyUsers);
router.patch('/password/:id', changePassword);
router.delete('/delete/:id', deleteUser);

module.exports = router;