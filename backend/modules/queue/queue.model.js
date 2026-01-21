const mongoose = require('mongoose');


// ye ham appointment se attach krenge -> which will tell us ki us specific appointment ke liye user ka queue me number kya hoga

const queueTokenSchema = new mongoose.Schema(
    {
        appointmentId : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Appointment',
            required:true,
            unique:true
        },
        tokenNumber:{
            type:Number,
            required:true
        },
        staffId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        date: {
            type:String,
            required:true
        },
        status:{
            type:String,
            enum: ['waiting', 'called', 'skipped', 'held', 'completed'], // agar koi current token tha usi time pe emergency aa gayi to current token held pe ho jayega
            default: 'waiting'
        }

    },
    {
      timestamp:true
    }
    
);

// isme ham staffId ka reference isliye de rahe hain taki -> maanlo ek doctor ki kiski appointment chal rhi hai -> check krni ho -> so queueTokenSchema.find() -> isme Dr ka naam dalo (staff Id) + status me called daal do -> current token aa jayega 

// tokenNumber + staffId + date ->  makes the queueTokenSchema -> unique 

queueTokenSchema.index(
    // this is to make each object unique by making sure -> the combination of these 3 things is always unique
    {staffId:1, date: 1, tokenNumber: 1},
    {unique : true}
);  

module.exports = mongoose.model('QueueToken', queueTokenSchema);
