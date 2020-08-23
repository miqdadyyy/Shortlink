'use strict';

const express = require('express');
const router = express.Router();
const LinkAPI = require('../../api/link');

router.get('/', LinkAPI.getAllLinks);
router.post('/', LinkAPI.storeLink);
router.delete('/:id', LinkAPI.deleteLink);

module.exports = router;
