const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId'); // Giả sử URL có dạng: orderdetail.html?orderId=1
  
  if (orderId) {
      // Gọi API để lấy thông tin chi tiết đơn hàng
      fetch(`http://localhost:9090/getorderdetail/${orderId}`)
          .then(response => response.json())
          .then(data => {
              // Hiển thị thông tin đơn hàng
              document.getElementById('order-id').textContent = data.orderId;
              document.getElementById('order-date').textContent = data.orderDate;
              document.getElementById('order-status').textContent = data.status;
              document.getElementById('customer-name').textContent = data.customerName;
              document.getElementById('customer-email').textContent = data.customerEmail;
  
              // Hiển thị danh sách sản phẩm
              const productList = document.getElementById('product-list');
              data.products.forEach(product => {
                  const li = document.createElement('li');
                  li.classList.add('list-group-item');
                  li.innerHTML = `<strong>${product.productName}</strong> - Số lượng: ${product.productQuantity} - Tổng: ${product.total.toLocaleString()} VND`;
                  productList.appendChild(li);
              });
          })
  } else {
      alert('Không có mã đơn hàng!');
  }


  
//   document.addEventListener('DOMContentLoaded', () => {
//     // Kiểm tra trạng thái đăng nhập trong localStorage
//     const loggedInUser = localStorage.getItem('loggedInUser');
//     const role = localStorage.getItem("role");
//     // Nếu không có thông tin đăng nhập, chuyển hướng về trang chủ
//     if (!loggedInUser||role==='User') {
//         alert("Only use for Admin");
//         window.location.href = 'home-page.html';
//     }
//   });