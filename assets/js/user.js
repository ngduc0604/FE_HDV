//
document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product_list').querySelector('tbody');
    const pagination = document.getElementById('pagination');
    const itemsPerPage = 10;
    let currentPage = 1;
    let products = [];
    let currentEditProductId = null;
  
    // Hàm để lấy dữ liệu từ API
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:9090/classifyCustomersByTotalSpent');
            const data = await response.json();
            products = data;
            displayProducts();
            setupPagination();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
  
    // Hàm để hiển thị sản phẩm lên bảng
    function displayProducts() {
        productList.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = products.slice(start, end);
  
        paginatedItems.forEach(product => {
            const row = document.createElement('tr');
  
            const cellId = document.createElement('td');
            cellId.textContent = product.customerId;
            row.appendChild(cellId);
  
            const cellName = document.createElement('td');
            cellName.textContent = product.name;
            row.appendChild(cellName);

            const cellEmail = document.createElement('td');
            cellEmail.textContent = product.email;
            row.appendChild(cellEmail);
  

            const cellPrice = document.createElement('td');
            cellPrice.textContent = `${product.totalSpent} VND`;
            row.appendChild(cellPrice);
  
            const cellStock = document.createElement('td');
            cellStock.textContent = product.customerType;
            row.appendChild(cellStock);

            productList.appendChild(row);
        });
    }
  
    // Hàm để thiết lập phân trang
    function setupPagination() {
        pagination.innerHTML = '';
        const pageCount = Math.ceil(products.length / itemsPerPage);
  
        for (let i = 1; i <= pageCount; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = 'page-item';
  
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
  
            pageLink.addEventListener('click', function(event) {
                event.preventDefault();
                currentPage = i;
                displayProducts();
            });
  
            pageItem.appendChild(pageLink);
            pagination.appendChild(pageItem);
        }
    }
  
    // Hàm để hiển thị form chỉnh sửa

    // Gọi hàm để lấy dữ liệu từ API và hiển thị sản phẩm
    fetchProducts();
  });


  async function fetchAndDisplayNumberOfCustomer() {
    try {
      const response = await fetch('http://localhost:9090/getNumberOfCustomer');
      const data = await response.json();
      const totalcuss = document.getElementById('NumberOfCustomer');
      totalcuss.innerText = `${data.NumberOfCustomer}`;
    } catch (error) {
      console.error( error);
    }
  }
  fetchAndDisplayNumberOfCustomer();


  document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra trạng thái đăng nhập trong localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    const role = localStorage.getItem("role");
    // Nếu không có thông tin đăng nhập, chuyển hướng về trang chủ
    if (!loggedInUser||role==='User') {
        alert("Only use for Admin");
        window.location.href = 'home-page.html';
    }
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
              <i class="bi bi-person-circle"> </i>
              
              <span style="margin-left :5px">  ${customer.name}</span>
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
              <span>Tài khoản</span>
          `;
  
      menuItems.innerHTML = `
              <li><a href="pages-login.html">Đăng nhập</a></li>
              <li><a href="pages-register.html">Đăng ký</a></li>
          `;
    }
  });