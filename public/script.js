document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Clear previous errors
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';
  document.getElementById('serverMessage').textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validation
  let hasError = false;

  if (!email) {
    document.getElementById('emailError').textContent = 'Email is required';
    hasError = true;
  } else if (!/\S+@\S+\.\S+/.test(email)) {  // ✅ fixed regex
    document.getElementById('emailError').textContent = 'Invalid email format';
    hasError = true;
  }

  if (!password) {
    document.getElementById('passwordError').textContent = 'Password is required';
    hasError = true;
  } else if (password.length < 8) {
    document.getElementById('passwordError').textContent = 'Password must be at least 8 characters';
    hasError = true;
  }

  if (hasError) return;

  // Send POST request to backend
  try {
    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // allows cookie to be set
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('serverMessage').style.color = 'green';
      document.getElementById('serverMessage').textContent = 'Login successful! Redirecting...';

      // Redirect to dashboard
      setTimeout(() => window.location.href = '/dashboard.html', 1500);
    } else {
      document.getElementById('serverMessage').style.color = 'red';
      document.getElementById('serverMessage').textContent = data.message || 'Login failed';
    }
  } catch (error) {
    document.getElementById('serverMessage').style.color = 'red';
    document.getElementById('serverMessage').textContent = 'Error connecting to server';
    console.error('Login Error:', error);
  }
});



   

