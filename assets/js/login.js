document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngừng việc reload trang khi submit form
  
    // Lấy giá trị từ các trường trong form
    const username = document.getElementById("yourUsername").value;
    const password = document.getElementById("yourPassword").value;
  
    // Kiểm tra xem username và password có được nhập không
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }
  
    // Tạo đối tượng dữ liệu cần gửi lên API
    const loginData = {
      username: username,
      password: password
    };
  
    // Gửi yêu cầu đăng nhập tới API (giả sử API có endpoint /api/login)
    fetch("http://localhost:9090/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData) // Chuyển đổi dữ liệu thành JSON
    })
      .then(response => response.json()) // Chuyển phản hồi API thành JSON
      .then(data => {
        if (data.message === "Login successful") {
          // Lưu thông tin người dùng và vai trò vào localStorage
          localStorage.setItem("token", "Bearer " + data.token); // Nếu API trả về token
          localStorage.setItem("role", data.role); // Lưu vai trò
          localStorage.setItem("customer", JSON.stringify(data.customers)); // Lưu thông tin customer
  
          // Chuyển hướng người dùng đến trang phù hợp với vai trò
          if (data.role === "Admin") {
            window.location.href = "index.html"; // Chuyển hướng admin
          } else {
            window.location.href = "home-page.html"; // Chuyển hướng user
          }
        } else {
          alert("Login failed: " + (data.message || "Unknown error"));
        }
      })
      .catch(error => {
        console.error("Error during login:", error);
        alert("An error occurred while logging in.");
      });
  });
  