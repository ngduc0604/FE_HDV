
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
	    					<div class="bottom-area d-flex px-3">
	    						<div class="m-auto d-flex">
	    							<a href="#" class="bi bi-cart d-flex justify-content-center align-items-center text-center">
	    								<span><i class="ion-ios-menu"></i></span>
	    							</a>
	    							<a href="#" class="bi bi-cash-coin d-flex justify-content-center align-items-center mx-1">
	    								<span><i class="ion-ios-cart"></i></span>
	    							</a>
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

    function addtocart(){
        
    }


