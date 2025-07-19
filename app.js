const express = require('express');
const app = express();
const conn = require('./config/db');
const authRouter = require('./auth');

app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Auth Routes
app.use('/', authRouter);

// =======================
// GET /get-student
// =======================
app.get('/get-student', (req, res) => {
  const queryStr = 'SELECT * FROM student WHERE deleted_at IS NULL';
  conn.query(queryStr, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
    res.status(200).json({ success: true, message: 'Successfully fetched data', data: results });
  });
});

// =======================
// GET /get-student-by-id?id=1
// =======================
app.get('/get-student-by-id', (req, res) => {
  const id = req.query.id;
  const queryStr = 'SELECT * FROM student WHERE id = ? AND deleted_at IS NULL';
  conn.query(queryStr, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
    res.status(200).json({ success: true, message: 'Successfully fetched data', data: results });
  });
});

// =======================
// POST /store-student
// =======================
app.post('/store-student', (req, res) => {
  const { name, major } = req.body;

  if (!name || !major) {
    return res.status(400).json({
      success: false,
      message: 'Name and major are required'
    });
  }

  const queryStr = 'INSERT INTO student (name, major) VALUES (?, ?)';
  conn.query(queryStr, [name, major], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
    res.status(201).json({
      success: true,
      message: 'Student successfully created',
      data: {
        id: result.insertId,
        name,
        major
      }
    });
  });
});

// =======================
// POST /update-student
// =======================
app.post('/update-student', (req, res) => {
  const { id, name, major } = req.body;

  const updateQuery = 'UPDATE student SET name = ?, major = ? WHERE id = ? AND deleted_at IS NULL';
  const selectQuery = 'SELECT * FROM student WHERE id = ? AND deleted_at IS NULL';

  conn.query(updateQuery, [name, major, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

    conn.query(selectQuery, [id], (err2, rows) => {
      if (err2) return res.status(500).json({ success: false, message: err2.sqlMessage });

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Student not found', data: null });
      }

      res.status(200).json({
        success: true,
        message: 'Successfully updated data',
        data: rows[0]
      });
    });
  });
});

// =======================
// DELETE /delete-student/:id
// =======================
app.delete('/delete-student/:id', (req, res) => {
  const id = req.params.id;
  const now = new Date();
  const queryStr = 'UPDATE student SET deleted_at = ? WHERE id = ?';

  conn.query(queryStr, [now, id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found or already deleted' });
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted student with ID ${id}`,
      data: { id }
    });
  });
});

// =======================
// GET /items?page=1&limit=10 (Pagination)
// =======================
app.get('/items', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) AS total FROM items';
  conn.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const dataQuery = 'SELECT * FROM items LIMIT ? OFFSET ?';
    conn.query(dataQuery, [limit, offset], (err, data) => {
      if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

      res.status(200).json({
        success: true,
        message: 'Successfully fetched paginated items',
        data: data,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      });
    });
  });
});

app.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});
