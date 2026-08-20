import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";

// POST /api/leave
export const createLeave = async (req, res) => {
    try {
        const session = req.session || req.user;
        if (!session) {
            return res.status(401).json({ error: "Unauthorized session" });
        }

        // Find the employee linked to this account
        const userAccountId = session.userId || session.id || session._id;
        const employee = await Employee.findOne({ userId: userAccountId });

        if (!employee) {
            return res.status(404).json({ error: "Employee profile not found" });
        }

        if (employee.isDeleted) {
            return res.status(403).json({ error: "Your account is deactivated. You cannot apply for leave." });
        }

        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start <= today || end <= today) {
            return res.status(400).json({ error: "Leave dates must be in the future" });
        }

        if (end < start) {
            return res.status(400).json({ error: "End date cannot be before start date" });
        }

        // Note: userId stores the employee._id because ref: "Employee"
        const leave = await LeaveApplication.create({
            userId: employee._id, 
            type,
            startDate: start,
            endDate: end,
            reason,
            status: "PENDING",
        });

        // Safe Inngest trigger
        try {
            if (inngest) {
                await inngest.send({
                    name: "leave/pending",
                    data: { leaveApplicationId: leave._id.toString() }
                });
            }
        } catch (inngestErr) {
            console.warn("Inngest send skipped:", inngestErr.message);
        }

        return res.status(201).json({
            success: true,
            data: leave
        });

    } catch (error) {
        console.error("Create Leave Error:", error);
        return res.status(500).json({ error: error.message || "Failed to create leave" });
    }
};

// GET /api/leave
export const getLeaves = async (req, res) => {
    try {
        const session = req.session || req.user;
        if (!session) return res.status(401).json({ error: "Unauthorized" });

        const isAdmin = session.role === "ADMIN";

        if (isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            
            // Populate userId which references the Employee model
            const leaves = await LeaveApplication.find(where)
                .populate({
                    path: "userId",
                    select: "firstName lastName department email" // Explicitly select fields
                })
                .sort({ createdAt: -1 });

            const data = leaves.map((l) => {
                const obj = l.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.userId, // obj.userId contains the populated Employee document
                };
            });
            return res.json({ data });
        } else {
            const userAccountId = session.userId || session.id || session._id;
            const employee = await Employee.findOne({ userId: userAccountId }).lean();

            if (!employee) return res.status(404).json({ error: "Employee profile not found" });

            const leaves = await LeaveApplication.find({
                userId: employee._id
            }).sort({ createdAt: -1 });

            return res.json({
                data: leaves,
                employee: { ...employee, id: employee._id.toString() }
            });
        }
    } catch (error) {
        console.error("Get Leaves Error:", error);
        return res.status(500).json({ error: error.message || "Failed to fetch leaves" });
    }
};

// PUT /api/leave/:id
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const leave = await LeaveApplication.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after" }
        );

        if (!leave) {
            return res.status(404).json({ error: "Leave application not found" });
        }

        return res.json({ success: true, data: leave });
    } catch (error) {
        console.error("Update Leave Status Error:", error);
        return res.status(500).json({ error: error.message || "Failed to update leave status" });
    }
};