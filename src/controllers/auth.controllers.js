import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshTokens = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Tokens",
      [],
    );
  }
};

const registerUser = asyncHandler (async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "username, email, and password are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please Verify you email after regestration",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/user/verify-email?token=${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -isEmailVerified -_id",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating User");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully and verification email has been sent successfully",
      ),
    );
});

const login = asyncHandler (async(req, res)=> {
  const {email, password} = req.body;

  if(!email && !password){
    throw new ApiError(400, "Email and Password are required")
  }

  const user = await User.findOne({email});

  if(!user){
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401, "Invalid password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -isEmailVerified -_id"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: {
           loggedInUser,
           accessToken,
           refreshToken
          } },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshTokens: ""
      }
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User logged out successfully",
      ),
    );
})

export { registerUser, login, logoutUser };
