const express = require('express');
const router = express.Router();
const MemberController = require('../../app/controllers/MemberController')

router.get('/member', MemberController.getMemberList);
router.post('/member', MemberController.addMember);
router.delete('/member', MemberController.deleteMember)

module.exports = router