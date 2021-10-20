/*
 * -- products
 * sebuah javascript array yang menyimpan data-data (koleksi/list)
 * dari product yang ingin kita tampilkan
 * pada aslinya ini bisa mengambil dari database / API
 *
 * -- product (elemen dari array `products`)
 * sebuah javascript object yang berisi informasi
 * mengenai sebuah product
 */

const products = [
  {
    id: 1,
    name: "Kemeja dots",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=688&q=80",
    amount: 0,
    price: 10,
  },
  {
    id: 2,
    name: "Kaos hitam",
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=715&q=80",
    amount: 0,
    price: 5,
  },
  {
    id: 3,
    name: "Kemeja polos",
    img: "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
    amount: 0,
    price: 12,
  },
  {
    id: 4,
    name: "Kemeja kotak-kotak",
    img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    amount: 0,
    price: 9,
  },
];

/*
 * -- cart
 * sebuah javascript object yang menyimpan
 * data cart yang berisi product yang ingin dibeli
 * memiliki structure:
 * {
 * productId: amount
 * }
 */

const cart = {};

/*
 * kita menunggu event `DOMContentLoaded` agar
 * script didalam function ini akan dieksekusi
 * ketika konten dari dom sudah ter-load
 * jika tidak ditunggu, maka semua elemen yang
 * kita panggil tidak akan ditemukan (null)
 */

window.addEventListener("DOMContentLoaded", function () {
  // ambil div dengan kelas `content` yang merupakan
  // anak/child dari elemen dengan id `catalog`
  const catalogEl = document.querySelector("#catalog .content");

  // iterasi array `products`
  // dan setiap elemen nya kita refer sebagai `product`
  // mirip seperti foreach
  for (let product of products) {
    const tempEl = document.createElement("div"); // buat elemen baru
    tempEl.classList.add("product-item"); // tambahkan kelas `product-item`
    tempEl.innerHTML = renderProductItem(product); // pangil fungsi
    catalogEl.appendChild(tempEl); // tambahkan elemen baru tadi ke elemen/variable `catalog`
  }
});

function addToCart(id) {
  // cek apa product id tsb sudah ada dalam cart
  if (cart[id]) cart[id] += 1;
  // jika ada tambahkan 1 ke amount nya
  else cart[id] = 1; // jika belum ada, buat properti objek baru dengan amount 1

  // function ini digunakan
  // untuk meng-update dom
  updateCart();
  updatePrice();
}

function removeFromCart(id) {
  // kebalikan dari addToCart
  if (cart[id] > 0) cart[id] -= 1;
  updateCart();
  updatePrice();
}

function updateCart() {
  console.log(cart);
  const cartEl = document.querySelector("#cart .content");

  for (let productId in cart) {
    // melakukan dom query dengan menggunakan data attribute
    const productInCartEl = cartEl.querySelector(`[data-id="${productId}"]`);

    // periksa apakah elemen dengan id productId ditemukan dalam dom
    if (productInCartEl) {
      const productAmountEl = productInCartEl.querySelector(".amount-value");

      // jika amount kurang dari 1, maka remove element
      if (cart[productId] < 1) productInCartEl.remove();
      // jika tidak, maka ubah innerText nya menjadi sesuai data di cart
      else productAmountEl.innerText = cart[productId];
    } else if (cart[productId] > 0) {
      // jika tidak ditemukan, maka buat element baru
      const tempEl = document.createElement("div");
      tempEl.dataset.id = productId; // masukan data attribute `data-id`
      tempEl.classList.add("cart-item");

      const currentProduct = findProductById(productId);
      // update properti `amount` dalam product
      currentProduct.amount = cart[productId];
      tempEl.innerHTML = renderCartItem(currentProduct);
      cartEl.appendChild(tempEl);
    }
  }
}

function updatePrice() {
  const totalPriceEl = document.querySelector("#cart .total-price span");
  const checkoutBtnEl = document.querySelector("#cart .checkout-btn");

  let sum = 0;
  for (let productId in cart) {
    const currentProduct = findProductById(productId);
    sum += cart[productId] * currentProduct.price;
  }

  if (sum != 0) {
    // jika total harga tidak bernilai 0, maka tampilkan tombol checkout
    checkoutBtnEl.style.display = "block";
    totalPriceEl.innerText = "Rp. " + sum;
  } else {
    // jika total harga bernilai 0, maka sembunyikan tombol checkout
    totalPriceEl.innerText = 0;
    checkoutBtnEl.style.display = "none";
  }
}

function checkout() {
  // confirm dialog
  if (confirm("Proceed to payment?")) {
    // reset
    for (let productId in cart) cart[productId] = 0;
    updateCart();
    updatePrice();
    alert("Dor");
  } else {
    alert("Canceled");
  }
}

function findProductById(productId) {
  return products.find((e) => e.id == productId);
}

function renderCartItem(product) {
  return `
    <img class="img" src="${product.img}"></img>
    <p class="name">${product.name}</p>
    <div class="price-container">
      <p class="price-value">${product.price}</p>
      <div class="amount-container">
        <p class="amount-value">${product.amount}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">+</button>
        <button class="remove-from-cart-btn" onclick="removeFromCart(${product.id})">-</button>
      </div>
    </div>
    `;
}

function renderProductItem(product) {
  return `
    <p class="name">${product.name}</p>
    <img src="${product.img}"></img>
    <div class="price-container">
      <p class="price-value">${product.price}</p>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to cart</button>
    </div>
    `;
}
