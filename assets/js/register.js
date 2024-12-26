document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Ngăn chặn form submit mặc định

    const name = document.getElementById('yourName').value.trim();
    const email = document.getElementById('yourEmail').value.trim();
    const phone = document.getElementById('yourPhone').value.trim();
    const address = document.getElementById('yourAddress').value.trim();
    const username = document.getElementById('yourUsername').value.trim();
    const password = document.getElementById('yourPassword').value.trim();

    // Kiểm tra các trường không được để trống
    if (!name || !email || !phone || !address || !username || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // Kiểm tra email đúng định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ!');
        return;
    }

    // Kiểm tra số điện thoại có 10 số và bắt đầu bằng số 0
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại phải có 10 số và bắt đầu bằng số 0!');
        return;
    }

    const usernameRegex = /^[A-Za-z]/; 
    if (!usernameRegex.test(username)) { 
        alert('Tên đăng nhập phải bắt đầu bằng chữ cái!'); 
        return; 
    }
    // Kiểm tra mật khẩu ít nhất 5 kí tự và có kí tự đặc biệt
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
    if (!passwordRegex.test(password)) {
        alert('Mật khẩu phải ít nhất 5 kí tự và chứa ít nhất một kí tự đặc biệt!');
        return;
    }



    const accountData = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        username: username,
        password: password,
    };

    try {
        const response = await fetch('http://localhost:9090/api/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountData)
        });

        if (!response.ok) { 
            const errorMessage = await response.text(); 
            alert(errorMessage);
            return;
        }
        const result = await response.json();
        console.log('Account created successfully:', result);

        // Hiển thị thông báo thành công và chuyển hướng
        alert('Tài khoản đã được tạo thành công!');
        window.location.href = 'pages-login.html'; // Thay đổi URL đến trang đăng nhập hoặc trang khác

    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi tạo tài khoản.');
    }
});
