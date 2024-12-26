document.addEventListener('DOMContentLoaded', () => {
    const customerData = localStorage.getItem('customer');

    if (customerData) {
        const customer = JSON.parse(customerData);
        fetch(`http://localhost:9090/getCartId/${customer.customer_id}`)
            .then(response => response.json())
            .then(data => {
                const cartItems = data; // Dữ liệu giỏ hàng từ API
                const cartItemsContainer = document.getElementById('cartItems');
                let totalAmount = 0;

                if (!cartItemsContainer) {
                    console.error('Error: cartItems container not found.');
                    return;
                }

                cartItems.forEach(item => {
                    // Fetch thông tin sản phẩm từ API sản phẩm
                    fetch(`http://localhost:9090/getProduct/${item.product_id}`)
                        .then(response => response.json())
                        .then(product => {
                            if (!product || !cartItemsContainer) {
                                console.error('Error: Product or cartItemsContainer not found.');
                                return;
                            }

                            const itemTotal = item.total_price; // Sử dụng giá trị tổng tiền từ API
                            totalAmount += itemTotal; // Cộng dồn tổng tiền của tất cả sản phẩm
                            
                            const row = document.createElement('tr');
                            row.setAttribute('data-product-id', item.product_id);
                            row.innerHTML = `
                                <td><img src="${product.imgFileName}" alt="${product.name}" width="80"></td>
                                <td>${product.name}</td>
                                <td>${product.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td class="quantity">
                                    <div class="quantity-controls">
                                        <button class="decrease" data-id="${item.cd_id}">-</button>
                                        <input type="number" value="${item.quantity}" min="1" data-id="${item.cd_id}" readonly>
                                        <button class="increase" data-id="${item.cd_id}">+</button>
                                    </div>
                                </td>
                                <td class="item-total">${item.total_price.toLocaleString('vi-VN')} VNĐ</td>
                                <td><button class="btn btn-danger" onclick="removeItem(${item.cd_id})">X</button></td>
                            `;
                            cartItemsContainer.appendChild(row);

                            // Cập nhật tổng tiền sau khi thêm từng sản phẩm
                            document.getElementById('totalAmount').innerText = `${totalAmount.toLocaleString('vi-VN')} VNĐ`;
                        })
                        .catch(error => {
                            console.error('Error fetching product:', error);
                        });
                });

                // Thêm sự kiện lắng nghe cho các nút tăng và giảm
                cartItemsContainer.addEventListener('click', (event) => {
                    if (event.target.classList.contains('decrease') || event.target.classList.contains('increase')) {
                        const input = event.target.parentNode.querySelector('input');
                        const itemId = input.getAttribute('data-id');
                        let newQuantity = parseInt(input.value);

                        if (event.target.classList.contains('decrease') && newQuantity > 0) {
                            newQuantity--;
                        } else if (event.target.classList.contains('increase')) {
                            newQuantity++;
                        }

                        if(newQuantity==0){
                            removeItem(itemId);
                        }else{
                            input.value = newQuantity;
                            updateQuantity(itemId, newQuantity);
                        }
                    }
                });

                // Loại bỏ sự kiện lắng nghe khi người dùng thay đổi trực tiếp số lượng
                cartItemsContainer.addEventListener('input', (event) => {
                    if (event.target.tagName === 'INPUT' && event.target.type === 'number') {
                        event.preventDefault(); // Ngăn chặn thay đổi trực tiếp số lượng
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                alert('Failed to load cart. Please try again later.');
            });
    } else {
        console.log('No customer data found in localStorage.');
        
    }
});

async function updateQuantity(cd_id, newQuantity) {
    try {
        const response = await fetch(`http://localhost:9090/updateCart/${cd_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: newQuantity
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('Số lượng cập nhật thành công');

        // Lấy thông tin giá sản phẩm từ hàng hiện tại để tính lại tổng tiền
        const quantityInput = document.querySelector(`.quantity-controls input[data-id='${cd_id}']`);
        const row = quantityInput.closest('tr');
        const priceText = row.querySelector('td:nth-child(3)').innerText.replace(/\D/g, '');
        const price = parseInt(priceText);

        if (!isNaN(price)) {
            const itemTotal = newQuantity * price;
            const itemTotalElement = row.querySelector('.item-total');
            itemTotalElement.innerText = `${itemTotal.toLocaleString('vi-VN')} VNĐ`;

            // Cập nhật tổng tiền của tất cả sản phẩm
            updateTotalAmount();
        } else {
            console.error('Giá sản phẩm không hợp lệ');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi cập nhật số lượng.');
    }
}

function updateTotalAmount() {
    const cartItemsContainer = document.getElementById('cartItems');
    let totalAmount = 0; 
    // Lặp qua các phần tử có lớp item-total và tính tổng tiền
    cartItemsContainer.querySelectorAll('.item-total').forEach(item => {
        const itemTotalText = item.innerText.replace(/\D/g, ''); // Loại bỏ các ký tự không phải số
        const itemTotal = parseInt(itemTotalText);
        if (!isNaN(itemTotal)) {
            totalAmount += itemTotal;
        }
    });
    document.getElementById('totalAmount').innerText = `${totalAmount.toLocaleString('vi-VN')} VNĐ`;
}

async function removeItem(cartId) {
    try {
        const response = await fetch(`http://localhost:9090/deleleCartById/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('Item removed successfully');
        window.location.reload();

        // Xóa phần tử khỏi DOM
        const itemRow = document.querySelector(`button[onclick="removeItem(${cartId})"]`).closest('tr');
        itemRow.remove();

        // Cập nhật lại tổng tiền của giỏ hàng
        updateTotalAmount();


    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.');
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

async function buy() {

    if (checkCartEmpty()) {
        return;
    }
    
    const customerData = localStorage.getItem('customer');
    const totalAmountElement = document.getElementById('totalAmount');
    const cartItemsContainer = document.getElementById('cartItems');
    

    if (!customerData) {
        alert('Không tìm thấy thông tin khách hàng trong localStorage');
        return;
    }

    if (!totalAmountElement) {
        alert('Không tìm thấy tổng tiền');
        return;
    }

    const customer = JSON.parse(customerData);
    const customer_id = customer.customer_id;
    const totalMoneyText = totalAmountElement.innerText.replace(/\D/g, ''); // Loại bỏ các ký tự không phải số
    const totalMoney = parseInt(totalMoneyText);

    if (isNaN(totalMoney)) {
        alert('Tổng tiền không hợp lệ');
        return;
    }

    const orderData = {
        status: 'Pending',
        customer_id: customer_id,
        totalMoney: totalMoney
    };

    try {
        // Tạo đơn hàng
        const orderResponse = await fetch('http://localhost:9090/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!orderResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const orderResult = await orderResponse.json();
        const order_id = orderResult.order_id;

        // Tạo OrderDetails cho từng sản phẩm trong giỏ hàng
        const cartItems = cartItemsContainer.querySelectorAll('tr');

        for (const item of cartItems) {
            const product_id = parseInt(item.getAttribute('data-product-id')); // Lấy product_id từ thẻ dữ liệu
            const quantity = parseInt(item.querySelector('.quantity-controls input').value);
            const priceText = item.querySelector('td:nth-child(3)').innerText.replace(/\D/g, ''); // Lấy giá sản phẩm
            const price = parseInt(priceText);
            const total = quantity * price;

            
            const orderDetailData = {
                order_id: order_id,
                product_id: product_id,
                quantity: quantity,
                total: total
            };

            console.log(orderDetailData);


            const orderDetailResponse = await fetch('http://localhost:9090/createOrderDetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetailData)
            });

            if (!orderDetailResponse.ok) {
                throw new Error('Failed to create order detail');
            }

            const orderDetailResult = await orderDetailResponse.json();
            console.log('Order detail created successfully:', orderDetailResult);
        }
        
        const deletePromises = [];
        for (const item of cartItems) {
            const cartId = parseInt(item.querySelector('.quantity-controls input').getAttribute('data-id')); // Lấy cartId từ thẻ dữ liệu

            if (cartId) { // Kiểm tra nếu cartId không null
                const deletePromise = fetch(`http://localhost:9090/deleleCartById/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete cart item with ID: ' + cartId);
                    }
                    console.log('Deleted cart item with ID:', cartId);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                
                deletePromises.push(deletePromise);
            } else {
                console.error('Cart ID is null, cannot remove item');
            }
        }

        // Chờ tất cả các lời gọi API xóa hoàn tất
        await Promise.all(deletePromises);
        
        // Hiển thị thông báo thành công
        alert('Đặt hàng thành công!');
        window.location.reload();

        // Sau khi đặt hàng thành công, bạn có thể muốn làm sạch giỏ hàng hoặc chuyển hướng người dùng
        // window.location.href = 'orderConfirmation.html'; // Ví dụ chuyển hướng đến trang xác nhận đơn hàng

    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi đặt hàng.');
    }
}


function checkCartEmpty() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartItems = cartItemsContainer.querySelectorAll('tr');
    if (cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống.Hãy chọn sản phẩm yêu thích nhé');
        window.location.href = 'list_product.html'; // Thay 'products.html' bằng trang sản phẩm của bạn
        return true;
    }
    return false;
}




