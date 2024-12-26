


// lay so luong san pham
async function fetchAndDisplayTotalQuantity() {
  try {
    const response = await fetch('http://localhost:9090/getQuantity');
    const data = await response.json();
    const totalQuantityElement = document.getElementById('Total');
    totalQuantityElement.innerText = data.totalQuantity;
  } catch (error) {
    console.error( error);
  }
}
fetchAndDisplayTotalQuantity();
// end lay so luong san pham





// ham them moi 
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('add-product-form');
  const responseMessage = document.getElementById('response-message');

  try {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      // Get form data
      const name = document.getElementById('name').value;
      const price = parseFloat(document.getElementById('price').value);
      const imgFileInput = document.getElementById('imgFile');
      const stock = parseInt(document.getElementById('stock').value);
  
  
      // Get the file name from the input
      const imgFileName = imgFileInput.files[0].name;
  
      // Create product object
      const product = {
        name: name,
        price: price,
        imgFileName: `//product.hstatic.net/200000783783/product/${imgFileName}`,
        stock: stock
      };
  
      try {
        // Send POST request to API
        const response = await fetch('http://localhost:9090/createProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });
  
        const result = await response.json();
  
        // Display response message
        if (response.ok) {
          responseMessage.textContent = 'Product added successfully!';
          responseMessage.className = 'text-success';
          form.reset(); // Reset the form
          setTimeout(() => {
            window.location.href = 'product.html';
          }, 1000);
  
        } else {
          responseMessage.textContent = `Error: ${result.message}`;
          responseMessage.className = 'text-danger';
        }
      } catch (error) {
        console.error('Error adding the product:', error);
        responseMessage.textContent = 'Error adding the product';
        responseMessage.className = 'text-danger';
      }
    });
  } catch (error) {
    console.log(error);
  }
});



//lay san pham moi trong thang
async function fetchNewProducts() {
  try {
  
    const response = await fetch('http://localhost:9090/getProductInMonth');
    const data = await response.json();

    const newProductElement = document.getElementById('newProduct');
    newProductElement.innerText = `${data.numberOfProducts}`;
  } catch (error) {
    console.error('Error fetching new products:', error);
  }
}
fetchNewProducts();




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
          const response = await fetch('http://localhost:9090/getProducts');
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
          cellId.textContent = product.id;
          row.appendChild(cellId);

          const cellImg = document.createElement('td');
          const img = document.createElement('img');
          img.src = product.imgFileName;
          img.alt = product.name;
          img.style.width = '80px'; // Đặt kích thước ảnh cho phù hợp
          cellImg.appendChild(img);
          row.appendChild(cellImg);

          const cellName = document.createElement('td');
          cellName.textContent = product.name;
          row.appendChild(cellName);

          const cellPrice = document.createElement('td');
          cellPrice.textContent = `${product.price} VND`;
          row.appendChild(cellPrice);

          const cellStock = document.createElement('td');
          cellStock.textContent = product.stock;
          row.appendChild(cellStock);

          // Thêm các nút "Chỉnh sửa" và "Xóa"
          const cellActions = document.createElement('td');
          const editButton = document.createElement('button');
          editButton.textContent = 'Chỉnh sửa';
          editButton.className = 'btn btn-warning btn-sm';
          editButton.addEventListener('click', function() {
              editProduct(product.id);
          });
          cellActions.appendChild(editButton);

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Xóa';
          deleteButton.className = 'btn btn-danger btn-sm';
          deleteButton.addEventListener('click', function() {
              deleteProduct(product.id);
          });
          cellActions.appendChild(deleteButton);

          row.appendChild(cellActions);
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
  function editProduct(productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
          currentEditProductId = productId;
          document.getElementById('editName').value = product.name;
          document.getElementById('editPrice').value = product.price;
          document.getElementById('editStock').value = product.stock;
          $('#editProductModal').modal('show'); // Hiển thị modal
      }
  }

  // Hàm để hủy chỉnh sửa
  function cancelEdit() {
      $('#editProductModal').modal('hide'); // Ẩn modal
      currentEditProductId = null;
  }

  // Hàm để cập nhật sản phẩm
  async function updateProduct(event) {
      event.preventDefault();
      const newName = document.getElementById('editName').value;
      const newPrice = document.getElementById('editPrice').value;
      const newStock = document.getElementById('editStock').value;
      if (newName && newPrice && newStock && currentEditProductId !== null) {
          try {
              const response = await fetch(`http://localhost:9090/updateProduct/${currentEditProductId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ name: newName, price: newPrice, stock: newStock })
              });
              if (response.ok) {
                  const product = products.find(p => p.id === currentEditProductId);
                  product.name = newName;
                  product.price = newPrice;
                  product.stock = newStock;
                  displayProducts();
                  cancelEdit(); // Ẩn modal sau khi cập nhật
              } else {
                  console.error('Failed to update product');
              }
          } catch (error) {
              console.error('Error updating product:', error);
          }
      }
  }

  // Hàm để xóa sản phẩm
  async function deleteProduct(productId) {
      const confirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
      if (confirmed) {
          try {
              const response = await fetch(`http://localhost:9090/deleteProduct/${productId}`, {
                  method: 'DELETE'
              });
              if (response.ok) {
                  products = products.filter(p => p.id !== productId);
                  displayProducts();
                  location.reload();
                  setupPagination();
              } else {
                  console.error('Failed to delete product');
              }
          } catch (error) {
              console.error('Error deleting product:', error);
          }
      }
  }

  // Gắn sự kiện submit cho form chỉnh sửa
  document.getElementById('edit-product-form').addEventListener('submit', updateProduct);
  // Gọi hàm để lấy dữ liệu từ API và hiển thị sản phẩm
  fetchProducts();
});


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











