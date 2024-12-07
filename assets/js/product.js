
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
          <img src="${product.imgFileName}" alt="${product.name}" class="img-fluid">
          <h6>${product.name}</h6>
          <p>${product.price.toLocaleString()} VND</p>
          <div class="action-buttons">
            <button class="btn btn-primary btn-sm">
              <i class="bi bi-bag-fill"></i> Mua ngay
            </button>
            <button class="btn btn-secondary btn-sm">
              <i class="bi bi-cart-plus"></i> Thêm vào giỏ
            </button>
          </div>
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
