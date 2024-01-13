app.get("/logout", (req, res) => {
  // Perform logout logic here, such as destroying the session

  res.redirect("/login"); // Redirect the user to the login page after logout
});
