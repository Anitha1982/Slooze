async function setupDashboard() {
  const sessionRes = await fetch('https://slooze-dhia.onrender.com/auth/session', { credentials: 'include' });
  if (!sessionRes.ok) return (window.location.href = '/index.html');

  const user = await sessionRes.json();
  document.getElementById('userEmail').textContent = user.email;

  // Hide admin-only sections for non-admins
  if (user.role !== 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }

  // Prevent store keeper from accessing dashboard
  if (user.role === 'storekeeper') {
    alert('Access Denied! Store Keeper cannot access the dashboard.');
    window.location.href = '/products.html'; // redirect to products page
    return;
  }
}

setupDashboard();

async function checkSession() {
  const res = await fetch('https://slooze-dhia.onrender.com/auth/session', {
    credentials: 'include'
  });

  if (!res.ok) {
    window.location.href = '/index.html'; // redirect to login
    return;
  }

  const user = await res.json();

  // Role-based access control
  if (user.role === 'storekeeper') {
    alert('Access Denied! Store Keeper cannot access the dashboard.');
    window.location.href = '/products.html';
    return;
  }

  document.getElementById('userInfo').textContent =
    `Logged in as: ${user.email} (${user.role})`;

  // Fetch dashboard data
  const dataRes = await fetch('https://slooze-dhia.onrender.com/dashboard/data', {
    credentials: 'include'
  });
  const data = await dataRes.json();

  document.getElementById('stats').innerHTML =
    `<h3>Statistics:</h3><pre>${JSON.stringify(data.stats, null, 2)}</pre>`;
  document.getElementById('insights').textContent = data.insights;
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('https://slooze-dhia.onrender.com/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  window.location.href = '/index.html';
});

checkSession();
