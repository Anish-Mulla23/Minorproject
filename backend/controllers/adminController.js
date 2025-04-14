// Make a user admin
export const makeUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isAdmin = true;
    await user.save();
    res.json({ message: "User promoted to admin" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
