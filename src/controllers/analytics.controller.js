const pool = require("../config/mongoose.config");

class AnalyticsController {
  async getTotalRevenueByCategory(req, res, next) {
    try {
      // Query to calculate total revenue by product category in the past month
      const query = `
      SELECT
      EXTRACT(MONTH FROM o.created_at) AS month,
      p.categories,
      SUM((order_items->>'price')::NUMERIC * (order_items->>'quantity')::NUMERIC) AS total_revenue
  FROM
      orders o
  JOIN
      products p ON (order_items->>'product_id')::INTEGER = p.id
  CROSS JOIN
      jsonb_array_elements(o.order_items) AS order_item
  WHERE
      o.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND o.created_at < DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY
      EXTRACT(MONTH FROM o.created_at), p.categories;
  
  
  
  
            `;
      // Execute the query and send the result as response
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }

  async getSalesPerformanceComparison(req, res, next) {
    try {
      // Query to compare sales performance of products in current vs. previous year
      const query = `
      WITH current_year_sales AS (
        SELECT 
            p.id,
            p.name,
            SUM(oi.quantity) AS quantity_sold_current_year
        FROM 
            orders o
        JOIN 
            order_items oi ON o.id = oi.order_id
        JOIN 
            products p ON oi.product_id = p.id
        WHERE 
            o.status = 'payed'
            AND EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM NOW())
        GROUP BY 
            p.id, p.name
    ), previous_year_sales AS (
        SELECT 
            p.id,
            SUM(oi.quantity) AS quantity_sold_previous_year
        FROM 
            orders o
        JOIN 
            order_items oi ON o.id = oi.order_id
        JOIN 
            products p ON oi.product_id = p.id
        WHERE 
            o.status = 'payed'
            AND EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM NOW()) - 1
        GROUP BY 
            p.id
    )
    SELECT 
        c.id, 
        c.name,
        c.quantity_sold_current_year,
        COALESCE(p.quantity_sold_previous_year, 0) AS quantity_sold_previous_year,
        CASE 
            WHEN p.quantity_sold_previous_year IS NULL THEN 100
            ELSE ((c.quantity_sold_current_year - p.quantity_sold_previous_year) / p.quantity_sold_previous_year) * 100
        END AS sales_growth_percentage
    FROM 
        current_year_sales c
    LEFT JOIN 
        previous_year_sales p ON c.id = p.id;
    
            `;
      // Execute the query and send the result as response
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }

  async getAbandonedCartsAnalysis(req, res, next) {
    try {
      // Query to analyze abandoned shopping carts
      const query = `
      SELECT 
      user_id,
      COUNT(*) AS abandoned_carts_count,
      STRING_AGG(DISTINCT reason, ', ') AS common_reasons
  FROM 
      carts
  WHERE 
      updated_at >= NOW() - INTERVAL '1 month' AND total IS NULL
  GROUP BY 
      user_id;
  
            `;
      // Execute the query and send the result as response
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }

  async getSalesByRegion(req, res, next) {
    try {
      // Query to assess sales performance by product category and geographical region
      const query = `
      SELECT 
      p.categories,
      s.location_type,
      SUM(oi.quantity * p.price) AS total_revenue
  FROM 
      orders o
  JOIN 
      order_items oi ON o.id = oi.order_id
  JOIN 
      products p ON oi.product_id = p.id
  JOIN 
      store s ON p.store_id = s.id
  WHERE 
      o.status = 'payed'
      AND EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM NOW())
  GROUP BY 
      p.categories, s.location_type;
  
            `;
      // Execute the query and send the result as response
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }
}

const analyticsCtrl = new AnalyticsController();
module.exports = analyticsCtrl;
