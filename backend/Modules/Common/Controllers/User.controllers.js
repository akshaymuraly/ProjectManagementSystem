const AsyncHandler = require("../../../Utils/AsyncHandler");
const { CustomError } = require("../../../Utils/CustomError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User.model");

const SignIn = AsyncHandler(async (req, res, next) => {
  const { Password, Email } = req.body;
  if (!Email || !Password || Password === "" || Email === "") {
    throw new CustomError("Allfields are required", 400);
  }
  const user = await User.findOne({ Email });
  if (!user) {
    throw new CustomError("No account found!", 401);
  }
  const comparePassword = await bcrypt.compare(Password, user.Password);
  if (!comparePassword) {
    throw new CustomError("Invalid email or password !", 400);
  }
  const token = await jwt.sign(
    { id: user._id, role: user.Role },
    process.env.JWT_TOKEN_KEY,
    {
      expiresIn: "1d",
    }
  );
  await res.cookie("authtoken", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60), //60 mins
    sameSite: "lax",
    httpOnly: true,
    secure: false,
  });
  return res.json({
    message: "Logged in successfully",
    status: true,
    role: user.Role,
  });
});

const userSignup = AsyncHandler(async (req, res, next) => {
  const { Email, Password, Role } = req.body;
  if (
    !Email ||
    !Password ||
    !Role ||
    Email === "" ||
    Password === "" ||
    Role === ""
  ) {
    throw new CustomError("All fields are required!", 400);
  }
  const duplicateUser = await User.findOne({
    Email,
  });
  if (duplicateUser) {
    throw new CustomError("Already registered, please login!");
  }
  const salt = await bcrypt.genSalt(16);
  const CryptedPassword = await bcrypt.hash(Password, salt);
  const newUser = User({
    Email,
    Password: CryptedPassword,
    Role,
  });
  await newUser.save();
  return res.status(200).json({ message: "User registered!", status: true });
});

const cookieValidation = (toCheck) =>
  AsyncHandler(async (req, res, next) => {
    const cookie = req?.headers?.cookie;
    if (!cookie) {
      throw new CustomError("No cookie has found!", 401);
    }
    const token = cookie.split("authtoken=")[1];
    if (!token) {
      throw new CustomError("No valid token has found!", 401);
    }
    const { id, role } = await jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if (role !== "ProjectManager") {
      if (!toCheck.includes(role)) {
        throw new CustomError("Unauthorized access!", 400);
      }
    }
    req.id = id;
    next();
  });

const getTeamMembers = AsyncHandler(async (req, res, next) => {
  const teamMembers = await User.find({ Role: "TeamMember" });
  if (!teamMembers || teamMembers.length === 0) {
    throw new CustomError("No team members found!", 404);
  }
  return res.status(200).json({
    message: "Team members retrieved successfully",
    status: true,
    data: teamMembers,
  });
});

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-Password");
  if (!users.length) {
    throw new CustomError("No users found!", 404);
  }
  return res
    .status(200)
    .json({ status: true, users, message: "Users fetched!" });
};

const editUserEmail = async (req, res) => {
  const { userId, newEmail } = req.body;

  if (!userId || !newEmail) {
    throw new CustomError("User ID and new email are required!", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { Email: newEmail },
    { new: true, runValidators: true } // Return updated document and validate new email
  );

  if (!user) {
    throw new CustomError("User not found!", 404);
  }

  return res.status(200).json({
    status: true,
    user,
    message: "User email updated successfully!",
  });
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new CustomError("User ID is required!", 400);
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new CustomError("User not found!", 404);
  }

  return res.status(200).json({
    status: true,
    message: "User deleted successfully!",
  });
};

module.exports = {
  SignIn,
  userSignup,
  cookieValidation,
  getTeamMembers,
  getAllUsers,
  editUserEmail,
  deleteUser,
};
