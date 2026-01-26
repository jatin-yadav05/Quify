const express = require("express");
const router = express.Router();
const appointmentController = require("./appointment.controller");

router.post("/book", appointmentController.createAppointment);
router.get("/my", appointmentController.getMyAppoitments);
router.get("/doctor/:id", appointmentController.getDoctorAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.patch("/:id/status", appointmentController.updateAppointmentStatus);
router.patch("/:id/cancel", appointmentController.cancelAppointment);


module.exports = router;

