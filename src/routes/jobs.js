
const router = require('express').Router();
router.get('/',(req,res)=>{ res.json({jobs:[]}); });
module.exports = router;
