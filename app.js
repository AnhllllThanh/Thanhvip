// app.js (backend)
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Để server có thể nhận dữ liệu JSON từ frontend

// Định nghĩa schema người dùng
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// API đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập không tồn tại.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không đúng.' });
        }

        // Đăng nhập thành công
        req.session.user = user;
        res.json({ success: true, message: 'Đăng nhập thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
    }
});

// Lắng nghe cổng
app.listen(8080, () => {
    console.log('Server chạy trên cổng 8080');
});
