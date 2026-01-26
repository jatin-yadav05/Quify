const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is healthy'
  });
});

// Feature routes (add as you build)
router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/appointments', require('../modules/appointments/appointment.routes'));
// router.use('/queue', require('../modules/queue/queue.routes'));
// router.use('/delays', require('../modules/delays/delay.routes'));

module.exports = router;
