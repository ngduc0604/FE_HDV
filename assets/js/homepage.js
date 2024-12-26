
 async function fetchProducts() {
    try {
        let response = await fetch('http://localhost:9090/getTop5'); // Thay thế bằng URL API thực tế
        let products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    const limitedProducts = products.slice(0, 6);
    limitedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';

        productCard.innerHTML = `
    			<div class="col-md-6 col-lg-3 ftco-animate">
    				<div class="product">
    					<a style="text-decoration: none;" href="detail.html?id=${product.id}" class="img-prod"><img class="img-fluid" src="${product.imgFileName}" alt="Colorlib Template">
    						<div class="overlay"></div>
    					</a>
    					<div class="text py-3 pb-4 px-3 text-center">
    						<h3><a href="detail.html?id=${product.id}">${product.name}</a></h3>
    						<div class="d-flex">
    							<div class="pricing">
		    						<p class="price"><span class="price-sale">${product.price.toLocaleString()} VND</span></p>
		    					</div>
	    					</div>

    					</div>
    				</div>
    			</div>
        `;

        productList.appendChild(productCard);
    });
}

// Gọi hàm fetchProducts để lấy và hiển thị sản phẩm
fetchProducts();

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



