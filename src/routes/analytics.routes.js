const express = require("express");
const router = express.Router();
const analyticsCtrl = require("../controllers/analytics.controller");

router.get("/revenue-by-category", analyticsCtrl.getTotalRevenueByCategory);
router.get("/sales-performance", analyticsCtrl.getSalesPerformanceComparison);
router.get("/abandoned-carts", analyticsCtrl.getAbandonedCartsAnalysis);
router.get("/sales-by-region", analyticsCtrl.getSalesByRegion);

module.exports = router;
