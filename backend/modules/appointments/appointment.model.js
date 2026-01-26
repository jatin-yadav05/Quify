const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            // points to the user jiski appointment hai 
            type: mongoose.schema.Types.ObjectId,
            ref : 'User',
            required: true
        },
         staffId: {
            // points to the staff
            type: mongoose.schema.Types.ObjectId,
            ref : 'User',
            required: true
        },
        appointmentDate:{
            type:Date,
            required:true
        }, 
        timeSlot:{
            start: {
               type:String,
               required:true
            },
            end : {
                type:String,
                required:true
            }
        }, 
        status:{
            type:String,
            enum: ['booked', 'checked-in', 'completed', 'cancelled'],
            default: 'booked'
        },
        reason:{
            type: String
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

// appointment schema me user attach krre hain na ki user k sath appointment -> cuz maanlo agar appointment cancel hogi ya delete hogi to hame user schema me change krne ki need nahi hai

// maanlo, ham ye bhi kr skte the ki user schema me ek array store kraye -> which stores appointmentIDS -> but if appointment gets deleted -> it will keep pointing to null ids

