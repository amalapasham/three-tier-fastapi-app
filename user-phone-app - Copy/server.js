app.post("/add-user", (req, res) => {
  const { name, mobile } = req.body;
  // Name should contain only alphabets
  if (!/^[A-Za-z ]+$/.test(name)) {
    return res.status(400).json({ success: false, message: "Name must contain only alphabets." });
  }
  // Check if mobile is exactly 10 digits
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: "Mobile number must be exactly 10 digits." });
  }
  // Check for duplicate mobile number
  if (users.some(user => user.mobile === mobile)) {
    return res.status(409).json({ success: false, message: "Mobile number already exists." });
  }
  users.push({ name, mobile });
  res.json({ success: true });
});
