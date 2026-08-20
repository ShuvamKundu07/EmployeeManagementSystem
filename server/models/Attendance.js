import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    workingHours: {
        type: Number,
        default: 0,
    },
    dayType: {
        type: String,
        default: "-",
    },
    status: {
        type: String,
        enum: ["PRESENT", "LATE", "ABSENT"],
        default: "PRESENT",
    }
}, { timestamps: true });

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;