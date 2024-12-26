
  const apiUrl = "http://localhost:9090/getProducts"; // Thay bằng URL API thực tế
  const itemsPerPage = 12; // Số sản phẩm mỗi trang
  let currentPage = 1;
  let products = []; // Lưu toàn bộ sản phẩm

  const productGrid = document.getElementById('productGrid');
  const pagination = document.getElementById('pagination');

  // Hàm tải dữ liệu sản phẩm từ API
  async function fetchProducts() {
    try {
      const response = await fetch(apiUrl); // Gửi yêu cầu tới API
      const data = await response.json();
      products = data; // Lưu toàn bộ sản phẩm
      renderProducts();
      renderPagination();
    } catch (error) {
      console.error("Error fetching products:", error);
      productGrid.innerHTML = "<p class='text-danger'>Failed to load products.</p>";
    }
  }

  // Hàm hiển thị sản phẩm cho một trang cụ thể
  function renderProducts() {
    productGrid.innerHTML = ""; // Xóa nội dung cũ

    // Tính toán sản phẩm hiển thị cho trang hiện tại
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentProducts = products.slice(start, end);

    currentProducts.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'col-md-3 mb-4';
      productDiv.innerHTML = `
        <div class="product-card">
        
    					<a style="text-decoration: none;" href="detail.html?id=${product.id}" class="img-prod"><img class="img-fluid" src="${product.imgFileName}" alt="Colorlib Template">
    						<div class="overlay"></div>
    					</a>

          <a style="text-decoration: none; color:black;" href="detail.html?id=${product.id}"> ${product.name} d</a>  
          <p>${product.price.toLocaleString()} VND</p>
        </div>
      `;
      productGrid.appendChild(productDiv);
    });
  }
  // Hàm hiển thị phân trang
  function renderPagination() {
    pagination.innerHTML = ""; // Xóa nội dung cũ
  
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const maxVisiblePages = 5; // Hiển thị tối đa 5 trang
  
    // Nút "Trước"
    const prevButton = document.createElement('li');
    prevButton.className = currentPage === 1 ? 'disabled' : '';
    prevButton.innerHTML = `<a href="#" data-page="${currentPage - 1}">&lt;</a>`;
    pagination.appendChild(prevButton);
  
    // Hiển thị các nút phân trang
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2); // Bắt đầu từ trang thứ 2 hoặc gần currentPage
    const endPage = Math.min(totalPages - 1, currentPage + 2); // Kết thúc trước trang cuối cùng
  
    // Luôn hiển thị trang đầu tiên
    pageNumbers.push(1);
  
    // Thêm "..." nếu có khoảng cách lớn giữa trang 1 và startPage
    if (startPage > 2) {
      pageNumbers.push("...");
    }
  
    // Thêm các trang xung quanh trang hiện tại
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    // Thêm "..." nếu có khoảng cách lớn giữa endPage và trang cuối cùng
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }
  
    // Luôn hiển thị trang cuối cùng
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  
    // Tạo các nút phân trang
    pageNumbers.forEach(page => {
      const pageItem = document.createElement('li');
      if (page === "...") {
        pageItem.className = "disabled";
        pageItem.innerHTML = `<a href="#">...</a>`;
      } else {
        pageItem.className = page === currentPage ? "active" : "";
        pageItem.innerHTML = `<a href="#" data-page="${page}">${page}</a>`;
      }
      pagination.appendChild(pageItem);
    });
  
    // Nút "Tiếp"
    const nextButton = document.createElement('li');
    nextButton.className = currentPage === totalPages ? 'disabled' : '';
    nextButton.innerHTML = `<a href="#" data-page="${currentPage + 1}">&gt;</a>`;
    pagination.appendChild(nextButton);
  
    // Gắn sự kiện click vào các nút
    const pageLinks = pagination.querySelectorAll('a');
    pageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(link.getAttribute('data-page'));
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          currentPage = page;
          renderProducts();
          renderPagination();
        }
      });
    });
  }
  

  // Gọi hàm để tải dữ liệu khi trang load
  document.addEventListener('DOMContentLoaded', fetchProducts);

  async function addToCart() {
    // Lấy thông tin product_id và quantity từ trang chi tiết sản phẩm
    console.log(2);
    const pr_id=parseInt(productId);
    const quantity = 1;

    // Lấy thông tin customer từ localStorage
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
        alert('Vui lòng đăng nhập để thực hiện');
        window.location.href='pages-login.html';
        return;
    }

    const customer = JSON.parse(customerData);
    const customers_id = customer.customer_id;
    
    console.log(customers_id,pr_id,quantity);

    try {
        const response = await fetch('http://localhost:9090/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: quantity,
                product_id: pr_id,
                customers_id: customers_id
            })
        });

        if (!response.ok) {
            throw new Error('Yêu cầu mạng không thành công');
        }

        // Hiển thị thông báo thêm thành công
        alert('Đã thêm vào giỏ hàng thành công!');

    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi khi thêm vào giỏ hàng.');
    }
}

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


//Hiện thị sản phẩm lọc theo giá

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const responseMessage = document.getElementById('response-message');

  searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    // Lấy giá trị từ input
    const minPriceInput = document.getElementById('minPrice').value;
    const maxPriceInput = document.getElementById('maxPrice').value;

    // Nếu không nhập, đặt giá trị mặc định
    const minPrice = minPriceInput ? parseFloat(minPriceInput) : null;
    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : null;

    // Kiểm tra tính hợp lệ (minPrice phải <= maxPrice nếu cả hai đều tồn tại)
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      responseMessage.textContent = 'Giá thấp nhất không được lớn hơn giá cao nhất!';
      responseMessage.className = 'text-danger';
      return;
    }

    // Xây dựng URL API với minPrice và maxPrice có hoặc không có
    let apiUrl = 'http://localhost:9090/productPrice';
    const params = [];
    if (minPrice !== null) params.push(`minPrice=${minPrice}`);
    if (maxPrice !== null) params.push(`maxPrice=${maxPrice}`);
    if (params.length > 0) apiUrl += `?${params.join('&')}`;

    console.log("API URL:", apiUrl); // In ra URL để kiểm tra

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Không thể kết nối đến API.');
      }

      const data = await response.json();
      products = data; // Cập nhật biến products toàn cục
      currentPage = 1; // Reset về trang đầu tiên sau khi lọc
      renderProducts(); // Hiển thị sản phẩm
      renderPagination(); // Hiển thị phân trang

      if (products.length > 0) {
        responseMessage.textContent = `${products.length} sản phẩm được tìm thấy.`;
        responseMessage.className = 'text-success';
      } else {
        responseMessage.textContent = 'Không tìm thấy sản phẩm nào phù hợp.';
        responseMessage.className = 'text-warning';
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      responseMessage.textContent = 'Có lỗi xảy ra khi tìm kiếm sản phẩm.';
      responseMessage.className = 'text-danger';
    }
  });
});
//Kết thúc hiện thị lọc sản phẩm theo giá



  // Gọi hàm để tải dữ liệu khi trang load
  document.addEventListener('DOMContentLoaded', fetchProducts);