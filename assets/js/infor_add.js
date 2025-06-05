async function displayCustomerInfo() {
    // Lấy customer_id từ localStorage
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
        alert('Không tìm thấy thông tin khách hàng trong localStorage');
        return;
    }
    const customer = JSON.parse(customerData);
    const customer_id = customer.customer_id;

    try {
        // Gọi API để lấy thông tin khách hàng
        const response = await fetch(`http://localhost:9090/getCustomer/${customer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const customerInfo = await response.json();

        // Hiển thị thông tin khách hàng lên khối div
        document.getElementById('viewname').innerText = customerInfo.name;
        document.getElementById('viewaddress').innerText = customerInfo.address;
        document.getElementById('viewphone').innerText = customerInfo.phone;
        document.getElementById('viewemail').innerText = customerInfo.email;
        document.getElementById('fullName').value = customerInfo.name;
        document.getElementById('Address').value = customerInfo.address;
        document.getElementById('Phone').value = customerInfo.phone;
        document.getElementById('Email').value = customerInfo.email;

        console.log('Customer information displayed successfully:', customerInfo);

    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi lấy thông tin khách hàng: ' + error.message);
    }
}

// Gọi hàm displayCustomerInfo khi trang được tải
document.addEventListener('DOMContentLoaded', displayCustomerInfo);


async function updateCustomer(event) {
      event.preventDefault();
      const newName = document.getElementById('fullName').value;
      const newPhone = document.getElementById('Phone').value;
      const newAddress = document.getElementById('Address').value;
      const newEmail = document.getElementById('Email').value;
      const customerData = localStorage.getItem('customer');
      const customer = JSON.parse(customerData);
      const customereditid=customer.customer_id;

      if (newName && newPhone && newAddress && newEmail && customereditid !== null) {
          try {
              const response = await fetch(`http://localhost:9090/updateCustomerInfo/${customereditid}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ name: newName, phone: newPhone, address:newAddress,email:newEmail })
              });
              if (response.ok) {
                    window.location.href = 'account_admin.html';
              } else {
                  console.error('Failed to update ');
              }
          } catch (error) {
              console.error('Error updating :', error);
          }
      }
  }

  function isStrongPassword(password) {
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
  return passwordRegex.test(password);
}

async function changePassword(event) {
  event.preventDefault();

  const currentPassword = document.getElementById('currentPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('renewPassword').value.trim();

  const customerData = localStorage.getItem('customer');

  if (!customerData) {
    alert("Không tìm thấy thông tin người dùng.");
    return;
  }

  const customer = JSON.parse(customerData);
  const customerId = customer.customer_id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Mật khẩu mới và xác nhận không khớp.");
    return;
  }

  if (!isStrongPassword(newPassword)) {
    alert("Mật khẩu mới phải có ít nhất 5 ký tự và chứa ít nhất một ký tự đặc biệt");
    return;
  }

  try {
    const response = await fetch(`http://localhost:9090/api/changePassword/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: currentPassword,
        newPassword: newPassword
      })
    });

    const data = await response.json();

    if (response.ok && data.message) {
      alert(data.message);
      if (data.message.toLowerCase().includes("thanh cong")) {
        window.location.href = "account_admin.html";
      }
    } else {
      alert(data.message || "Có lỗi xảy ra khi đổi mật khẩu.");
    }
  } catch (error) {
    console.error("Lỗi kết nối server:", error);
    alert("Không thể kết nối đến server.");
  }
}