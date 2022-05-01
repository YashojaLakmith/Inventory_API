const express = require('express');
const router = express.Router();

const {
    createItems,
    modifyItems,
    getFromInventory,
    addToInventory,
    removeItem,
    viewAll,
    viewSingleItem
} = require('../Controllers');

router.get('/view', viewAll);
router.post('/create', createItems);
router.get('/view/:id', viewSingleItem);
router.patch('/modify/:id', modifyItems);
router.patch('/add/:id', addToInventory);
router.patch('/get/:id', getFromInventory);
router.delete('/delete/:id', removeItem);

module.exports = router;