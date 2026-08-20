import { inngest } from "../inngest/index.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// POST /api/attendance
export const clockInOut = async (req, res) => {
    try {
        const session = req.session || req.user;
        if (!session) return res.status(401).json({ error: "Unauthorized" });

        const userId = session.userId || session.id || session._id;
        const employee = await Employee.findOne({ userId });

        if (!employee) return res.status(404).json({ error: "Employee not found" });
        if (employee.isDeleted) {
            return res.status(403).json({ error: "Your account is deactivated. You cannot clock in/out." });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let record = await Attendance.findOne({
            employeeId: employee._id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        const now = new Date();

        // 1. CLOCK IN: Set dayType to "In Progress"
        if (!record || !record.checkIn) {
            const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
            
            if (!record) {
                record = await Attendance.create({
                    employeeId: employee._id,
                    date: startOfDay,
                    checkIn: now,
                    dayType: "In Progress",       // <-- Set "In Progress"
                    status: isLate ? "LATE" : "PRESENT",
                });
            } else {
                record.checkIn = now;
                record.dayType = "In Progress";   // <-- Set "In Progress"
                record.status = isLate ? "LATE" : (record.status || "PRESENT");
                await record.save();
            }

            try {
                if (inngest) {
                    await inngest.send({
                        name: "employee/check-out",
                        data: {
                            employeeId: employee._id.toString(),
                            attendanceId: record._id.toString(),
                        }
                    });
                }
            } catch (inngestErr) {
                console.warn("Inngest skipped:", inngestErr.message);
            }

            return res.status(200).json({
                success: true,
                type: "CHECK_IN",
                data: record,
            });
        } 
        // 2. CLOCK OUT: Calculate dayType based on total hours
        else if (!record.checkOut) {
            const checkedInTime = new Date(record.checkIn).getTime();
            const diffMs = !isNaN(checkedInTime) ? Math.max(0, now.getTime() - checkedInTime) : 0;
            const diffHours = diffMs / (1000 * 60 * 60);

            record.checkOut = now;
            const workingHours = !isNaN(diffHours) ? parseFloat(diffHours.toFixed(2)) : 0;
            record.workingHours = workingHours;

            // Determine Day Type based on completed hours
            if (workingHours >= 8) {
                record.dayType = "Full Day";
            } else if (workingHours >= 6) {
                record.dayType = "Three Quarter Day";
            } else if (workingHours >= 4) {
                record.dayType = "Half Day";
            } else {
                record.dayType = "Short Day";
            }

            await record.save();

            return res.status(200).json({
                success: true,
                type: "CHECK_OUT",
                data: record,
            }); 
        } 
        // 3. ALREADY CLOCKED OUT
        else {
            return res.status(200).json({
                success: true,
                type: "ALREADY_COMPLETED",
                data: record,
            }); 
        }
    } catch (error) {
        console.error("Attendance Error:", error);
        return res.status(500).json({ error: error.message || "Operation failed" });
    }
};

// GET /api/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session || req.user;
        if (!session) return res.status(401).json({ error: "Unauthorized" });

        const userId = session.userId || session.id || session._id;
        const employee = await Employee.findOne({ userId });

        if (!employee) return res.status(404).json({ error: "Employee not found" });

        const limit = parseInt(req.query.limit || 30);
        const history = await Attendance.find({ employeeId: employee._id })
            .sort({ date: -1, createdAt: -1 })
            .limit(limit);

        return res.json({
            data: history,
            employee: { isDeleted: employee.isDeleted },
        });
    } catch (error) {
        console.error("Fetch Attendance Error:", error);
        return res.status(500).json({ error: "Failed to fetch attendance" });
    }
};