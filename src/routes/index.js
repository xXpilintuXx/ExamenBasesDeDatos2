const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('layouts/welcome');
});


module.exports = router;