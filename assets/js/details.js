
async function fetchProducts() {
    try {
        let response = await fetch('http://localhost:9090/getTop5');
        let products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    const limitedProducts = products.slice(0, 4);
    limitedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-3';

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

    async function fetchProductDetail(productId) {
        try {
            let response = await fetch(`http://localhost:9090/getProduct/${productId}`); // Thay thế bằng URL API thực tế
            let product = await response.json();
            displayProductDetail(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    function displayProductDetail(product) {
        document.getElementById('name').textContent = product.name;
        document.getElementById('main-image').src = product.imgFileName;
        document.getElementById('price').textContent = product.price + 'VND';

    }

    // Lấy ID sản phẩm từ tham số URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Gọi hàm fetchProductDetail để lấy và hiển thị thông tin chi tiết sản phẩm
    fetchProductDetail(productId);

    // Tăng số lượng
    function increaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }

    // Giảm số lượng
    function decreaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }

    async function addToCart() {
        // Lấy thông tin product_id và quantity từ trang chi tiết sản phẩm
        const quantityElement = document.getElementById('quantity');
        
        const pr_id=parseInt(productId);
        const quantity = parseInt(quantityElement.value);
    
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

    async function buy() {
        const customerData = localStorage.getItem('customer');
        if (!customerData) {
            alert('Vui lòng đăng nhập để thực hiện');
            window.location.href='pages-login.html';
            return;
        }else{

        const quantityElement = document.getElementById('quantity');
        const pr_id=parseInt(productId);
        const quantity = parseInt(quantityElement.value);
    
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
    
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi khi thêm vào giỏ hàng.');
        }
            window.location.href = `cart.html`;
        }
    }


    

    

