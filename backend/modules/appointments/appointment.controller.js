const Appointment = require("./appointment.model");
const jwt = require("jsonwebtoken");

const createAppointment = async(req, res)=>{
       
    try{
        if (!req.body.doctorId || !req.body.date || !req.body.timeSlot.start || !req.body.timeSlot.end){
            // ye message frontend pe user ko jayega -> telling them to fill all the data
            return res.status(400).json({
                status: error,
                message: "All fields are required"  
            })
        }
        
        const patientId = req.user.id; // from auth middleware
        const {doctorId, date, timeSlot, reason } = req.body;

        // check for overlap:

        // returns an array of all the booked appointments of that doctor on that specific day
        const existingAppoitments = await Appointment.find({
            doctorId, 
            date,
            status : 'booked'
        });

        const startMinutes = timeToMinutes(timeSlot.start);
        const endMinutes = timeToMinutes(timeSlot.end);

        const hasOverlap = existingAppointments.some((appt) => {
            const existingStart = timeToMinutes(appt.timeSlot.start);
            const existingEnd = timeToMinutes(appt.timeSlot.end);

            // 10.30 -> becomes 630 min
            // 11: 00 -> becomes 660 min -> easy for comparison
            return (
                startMinutes < existingEnd && 
                endMinutes > existingStart
            );
        })

        // working of some -> ye ek array pe lagta hai -> ye sirf conditions check krta hai -> for any element -> if the condition is true -> returns true

        /*
        .some() returns true if any one element in the array satisfies the condition.
 If none of the elements satisfy it, then it returns false.

 different from filter -> as filter har element pe jata hai -> jiske liye bhi condition true hoti hai -> vo ek nayi array me un elements ko daalta jata hai -> so filter basically returns an array of those elements where the condition is satisfied
        */
        if (hasOverlap){
            return res.status(409).json({
                status : "error",
                message:'This time slot is already booked'
            });
        }

        // The HTTP 409 Conflict error indicates that the request sent to the server could not be completed because it conflicts with the current state of the target resource. It typically occurs when multiple users or processes try to modify the same resource simultaneously or when the client's request violates server-side rules. 
// Common Causes
// The 409 error is a client-side error but is often triggered by server-side logic that prevents data inconsistencies or loss. 
// Concurrent Updates: Multiple users or systems attempt to access and modify the same resource at the same time (e.g., two people editing the same document).

        // timing for different types of doctors :
        // 1. physicians : 10-15 min
        // 2. specialists : 20-30 min
        // 3. Counselling : 45-60 min


        // CREATE APPOINTMENT:

        const appointment = await Appointment.create({
            patientId,
            staffId : doctorId,
            appointmentDate: date,
            timeSlot,
            status : 'booked',
            reason     
        });

        return res.status(201).json({
            status : 'success',
            message: 'Appointment booked successfully',
            data : appointment
        })

    } catch(error){
        console.log("Create appointment error " , error);
        res.status(500).json({
            status : "error",
            message: error.message
        })
    }

}

const getMyAppoitments = async(req, res)=>{ 
     try{
     const patientId = req.user.id;
     const appointments = await Appointment.find({
        patientId
     });

     return res.status(200).json({
        status : 'success',
        count : appointments.length,
        data : appointments
     });

     } catch(error){
          console.log("Error in fetching appointments : ", error);

          return res.status(500).json({
             status : 'error',
             message: 'Failed to fetch appointments'
          });
     }
};

const getDoctorAppointments = async(req, res)=>{
   const doctorId = req.user.id;

   
}

const getAppointmentById = async()=>{

}

const updateAppointmentStatus = async()=>{

}

const cancelAppointment = async()=>{

}

module.exports = {
    createAppointment,
    getMyAppoitments,
    getDoctorAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
}