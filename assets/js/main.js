
//get revenue
var revenueApi = 'http://localhost:9090/getRevenue';
function start() {
  getRevenue(function (revenue) {
    //console.log(revenue);
    try {
      document.getElementById('revenue').innerText = revenue;
    } catch (error) {
      console.log(error);
    }
  });

}
start();
function getRevenue(callback) {
  fetch(revenueApi)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}
// end revenue



// get getTotalOrderInAMonth
async function fetchAndDisplayTotalOrderInMonth() {
  try {
    const response = await fetch('http://localhost:9090/getTotalOrderInAMonth');
    const data = await response.json();
    const totalQuantityElement = document.getElementById('getTotalOrderInAMonth');
    totalQuantityElement.innerText = `${data.totalOrder}`;
  } catch (error) {
    console.error( error);
  }
}
fetchAndDisplayTotalOrderInMonth();

//end getTotalOrderInAMonth



// get getNumberOfCustomer
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
//end
// ham lay danh sach san pham ban chay
async function fetchTop5Products() {
  try {
    const response = await fetch("http://localhost:9090/getTop5");
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.log(error);
  }
}

function displayProducts(products) {
  const tableBody = document.querySelector("#productsTable tbody");
  tableBody.innerHTML = "";

  products.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td> <img src=" ${product.imgFileName}" alt="${product.name}"></td>
                    <td>${product.name}</td>
                    <td>${product.price.toLocaleString()} VND</td>
                    <td>${product.quantity}</td>
                    <td>${product.total.toLocaleString()} VND</td>
                `;

    tableBody.appendChild(row);
  });
}
fetchTop5Products();
//end san pham ban chay

















