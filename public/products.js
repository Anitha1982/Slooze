

  async function setupProducts() {
  // Get session info (role + email)
  const sessionRes = await fetch('https://slooze-dhia.onrender.com/auth/session', { credentials: 'include' });
  if (!sessionRes.ok) return (window.location.href = '/index.html');
  const user = await sessionRes.json();

  const role = user.role;
  document.getElementById('userRole').textContent = `Logged in as: ${user.email} (${role})`;

  //  Allow both roles to edit
  const canEdit = (role === 'manager' || role === 'storekeeper');
  if (canEdit) {
    document.getElementById('adminPanel').style.display = 'block';
  }

  // Fetch products
  const res = await fetch('https://slooze-dhia.onrender.com/products', { credentials: 'include' });
  const products = await res.json();

  // Display products
  const list = document.getElementById('productList');
  list.innerHTML = '<h3>Product List</h3>';

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <strong>${p.name}</strong> - ₹${p.price} (${p.category})
      ${canEdit ? `<button onclick="editProduct(${p.id})">✏️ Edit</button>` : ''}
    `;
    list.appendChild(div);
  });
}

// Edit function
async function editProduct(id) {
  const res = await fetch('https://slooze-dhia.onrender.com/products', { credentials: 'include' });
  const products = await res.json();
  const product = products.find(p => p.id === id);

  if (product) {
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;

    // Change button text to “Update”
        document.querySelector('#productForm button[type="submit"]').textContent = 'Update Product';
  }
}

// Handle add/edit form
document.getElementById('productForm').addEventListener('submit', async e => {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value.trim();

  const method = id ? 'PUT' : 'POST';
  const url = id ? `https://slooze-dhia.onrender.com/products/${id}` : `https://slooze-dhia.onrender.com/products`;

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, price, category })
  });

  const data = await res.json();
  alert(data.message);
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';  // <-- important fix
  // After resetting form
document.querySelector('#productForm button[type="submit"]').textContent = 'Add Product';

  setupProducts();
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('https://slooze-dhia.onrender.com/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/index.html';
});

setupProducts();


  

  
