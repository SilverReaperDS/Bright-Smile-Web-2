const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const {
  listUsers,
  listStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  updateUserRole,
  toggleUserActive,
  listUserActivityLogs,
} = require("../controllers/usersAdminController");

router.use(verifyToken, isAdmin);

router.get("/staff", listStaff);
router.post("/staff", createStaff);
router.patch("/staff/:id", updateStaff);
router.delete("/staff/:id", deleteStaff);

router.get("/logs", listUserActivityLogs);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/active", toggleUserActive);

router.get("/", listUsers);

module.exports = router;
