
// purpose : agar koi token currently waiting me jaara hai -> by any reason -> current user nahi aa paya -> ya staff busy hai -> in cheezo ka log ham create krte jayenge -> taaki sabko notify kar paayen -> maintains transparency

const mongoose = require('mongoose');

const delayLogs = new mongoose.Schema(
    {
      // ye vo tokenId hai -> jiske karan delay hua hai -> maybe vo user abhi nahi aa paya so uski id hogi -> ya agar staff ke karan delay hai to we'll store the first token id that will be affected -> usse ham 
      queueTokenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QueueToken',
        required: true
      },
      reason : {
        type: String,
        enum: ['emergency', 'long_consultation', 'staff_late', 'user_late', 'technical_issue', 'other'],
        required:true
      },
      delayMinutes: {
        type:String,
        required: true,
        min: 1
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User' // jis doctor ki appointment me delay hora hai -> uska reference -> so that ham us appointment ke sare users aur staff ko notify kar paayein
      }
    }
)

module.exports = mongoose.model('DelayLog', delayLogs);