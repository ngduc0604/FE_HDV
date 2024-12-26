
// //get revenue
// var revenueApi = 'http://localhost:9090/getRevenue';
// function start() {
//   getRevenue(function (revenue) {
//     //console.log(revenue);
//     try {
//       document.getElementById('revenue').innerText = revenue;
//     } catch (error) {
//       console.log(error);
//     }
//   });

// }
// start();
// function getRevenue(callback) {
//   fetch(revenueApi)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(callback);
// }
// // end revenue



// // get getTotalOrderInAMonth
// async function fetchAndDisplayTotalOrderInMonth() {
//   try {
//     const response = await fetch('http://localhost:9090/getTotalOrderInAMonth');
//     const data = await response.json();
//     const totalQuantityElement = document.getElementById('getTotalOrderInAMonth');
//     totalQuantityElement.innerText = `${data.totalOrder}`;
//   } catch (error) {
//     console.error(error);
//   }
// }
// fetchAndDisplayTotalOrderInMonth();

// //end getTotalOrderInAMonth



// // get getNumberOfCustomer
// async function fetchAndDisplayNumberOfCustomer() {
//   try {
//     const response = await fetch('http://localhost:9090/getNumberOfCustomer');
//     const data = await response.json();
//     const totalcuss = document.getElementById('NumberOfCustomer');
//     totalcuss.innerText = `${data.NumberOfCustomer}`;
//   } catch (error) {
//     console.error(error);
//   }
// }
// fetchAndDisplayNumberOfCustomer();
// //end
// // ham lay danh sach san pham ban chay
// async function fetchTop5Products() {
//   try {
//     const response = await fetch("http://localhost:9090/getTop5");
//     const products = await response.json();
//     displayProducts(products);
//   } catch (error) {
//     console.log(error);
//   }
// }

// function displayProducts(products) {
//   const tableBody = document.querySelector("#productsTable tbody");
//   tableBody.innerHTML = "";

//   products.forEach(product => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//                     <td> <img src=" ${product.imgFileName}" alt="${product.name}"></td>
//                     <td>${product.name}</td>
//                     <td>${product.price.toLocaleString()} VND</td>
//                     <td>${product.quantity}</td>
//                     <td>${product.total.toLocaleString()} VND</td>
//                 `;

//     tableBody.appendChild(row);
//   });
// }
// fetchTop5Products();
// //end san pham ban chay


// document.addEventListener('DOMContentLoaded', () => {
//   const loggedInUser = localStorage.getItem('loggedInUser');
//   const accountIcon = document.getElementById('accountIcon');
//   const dropdownMenu = document.getElementById('dropdownMenu');
//   const menuItems = document.getElementById('menuItems');

//   if (loggedInUser) {
//     const customerData = localStorage.getItem('customer');
//     const customer = JSON.parse(customerData);
//     accountIcon.innerHTML = `
//             <i class="bi bi-person-circle"> </i>
            
//             <span style="margin-left :5px">  ${customer.name}</span>
//         `;

//     menuItems.innerHTML = `
//             <li><a href="account-info.html">Thông tin tài khoản</a></li>
//             <li><a href="order-history.html">Đơn hàng</a></li>
//             <li><a href="home-page.html" id="logoutBtn">Đăng xuất</a></li>
//         `;

//     document.getElementById('logoutBtn').addEventListener('click', () => {
//       localStorage.removeItem('loggedInUser'); // Xóa thông tin đăng nhập
//       localStorage.removeItem('role');
//       localStorage.removeItem('customer');
//       window.location.href = 'home-page.html'; // Chuyển hướng về trang chủ
//     });

//   } else {
//     accountIcon.innerHTML = `
// 			<i class="bi bi-person-circle"></i>
//             <span>Tài khoản</span>
//         `;

//     menuItems.innerHTML = `
//             <li><a href="pages-login.html">Đăng nhập</a></li>
//             <li><a href="pages-register.html">Đăng ký</a></li>
//         `;
//   }
// });

async function displayCustomerInfo() {
    // Lấy customer_id từ localStorage
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
        alert('Không tìm thấy thông tin khách hàng trong localStorage');
        return;
    }
    const customer = JSON.parse(customerData);
    const customer_id = customer.customer_id;

    try {
        // Gọi API để lấy thông tin khách hàng
        const response = await fetch(`http://localhost:9090/getCustomer/${customer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const customerInfo = await response.json();

        // Hiển thị thông tin khách hàng lên khối div
        document.getElementById('viewname').innerText = customerInfo.name;
        document.getElementById('viewaddress').innerText = customerInfo.address;
        document.getElementById('viewphone').innerText = customerInfo.phone;
        document.getElementById('viewemail').innerText = customerInfo.email;

        console.log('Customer information displayed successfully:', customerInfo);

    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi lấy thông tin khách hàng: ' + error.message);
    }
}

// Gọi hàm displayCustomerInfo khi trang được tải
document.addEventListener('DOMContentLoaded', displayCustomerInfo);











