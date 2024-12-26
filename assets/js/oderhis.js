///phan trang va hien thi danh sách don hang, xóa don hang
document.addEventListener('DOMContentLoaded', function () {
    const orderList = document.getElementById('order_list').querySelector('tbody');
    const pagination = document.getElementById('pagination');
    const itemsPerPage = 10;
    let currentPage = 1;
    let orders = [];
    let currentEditOrderId=null;
    const customerData = localStorage.getItem('customer');
    const customer = JSON.parse(customerData);
    // Hàm để lấy dữ liệu từ API
    async function fetchOrders() {
      try {
        const response = await fetch(`http://localhost:9090/getOrderByCusId/${customer.customer_id}`);
        const data = await response.json();
        
    
        orders = data;
        displayOrders(orders); // Truyền orders vào hàm displayOrders
        setupPagination();
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  
    function displayOrders() {
      orderList.innerHTML = '';
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = orders.slice(start, end);
  
      paginatedItems.forEach(order => {
        const row = document.createElement('tr');
  
        // const cellId = document.createElement('td');
        // cellId.textContent = order.order_id;
        // row.appendChild(cellId);
  
        const cellOrderDate = document.createElement('td');
        cellOrderDate.textContent = order.order_date;
        row.appendChild(cellOrderDate);
  
        const cellStatus = document.createElement('td');
        cellStatus.textContent = order.status;
        row.appendChild(cellStatus);
  
        // const cellCustomers = document.createElement('td');
        // cellCustomers.textContent = order.customers.customer_id;
        // row.appendChild(cellCustomers);
  
        const cellTotalMoney = document.createElement('td');
        cellTotalMoney.textContent = `${order.total_money} VND`;
        row.appendChild(cellTotalMoney);
  
        const cellActions = document.createElement('td');
        // const editButton = document.createElement('button');
        // editButton.textContent = 'Chỉnh sửa';
        // editButton.className = 'btn btn-warning btn-sm';
        // editButton.addEventListener('click', function () {
        //   editOrder(order.order_id);
        // });
        // cellActions.appendChild(editButton);

        const viewButton = document.createElement('button');
        viewButton.textContent = 'Xem chi tiết';
        viewButton.classList.add('btn', 'btn-primary', 'btn-sm');
        viewButton.addEventListener('click', function () {
            window.location.href = `orderdetail.html?orderId=${order.order_id}`; // Chuyển đến trang chi tiết đơn hàng
        });
        cellActions.appendChild(viewButton);
        row.appendChild(cellActions);
  
        orderList.appendChild(row);
      });
    }
  
    
  
    // Hàm để thiết lập phân trang
    function setupPagination() {
      pagination.innerHTML = '';
      const pageCount = Math.ceil(orders.length / itemsPerPage);
  
      for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
  
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
  
        pageLink.addEventListener('click', function (event) {
          event.preventDefault();
          currentPage = i;
          displayOrders();
        });
  
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
      }
    }

    fetchOrders();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
      const accountIcon = document.getElementById('accountIcon');
      const dropdownMenu = document.getElementById('dropdownMenu');
      const menuItems = document.getElementById('menuItems');
  
      if (loggedInUser) {
      const customerData = localStorage.getItem('customer');
      const customer = JSON.parse(customerData);
          accountIcon.innerHTML = `
              <i class="bi bi-person-circle"></i>
              <span style="margin-left :5px">${customer.name}</span>
          `;
  
          menuItems.innerHTML = `
              <li><a href="account-info.html">Thông tin tài khoản</a></li>
              <li><a href="order-history.html">Đơn hàng</a></li>
              <li><a href="home-page.html" id="logoutBtn">Đăng xuất</a></li>
          `;
  
  
          document.getElementById('logoutBtn').addEventListener('click', () => {
              localStorage.removeItem('loggedInUser'); // Xóa thông tin đăng nhập
        localStorage.removeItem('role');
        localStorage.removeItem('customer');
              window.location.href = 'home-page.html'; // Chuyển hướng về trang chủ
          });
  
      } else {
          accountIcon.innerHTML = `
        <i class="bi bi-person-circle"></i>
              <span  style="margin-left :5px">  Tài khoản</span>
          `;
          
          menuItems.innerHTML = `
              <li><a href="pages-login.html">Đăng nhập</a></li>
              <li><a href="pages-register.html">Đăng ký</a></li>
          `;
      }
  });