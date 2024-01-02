import { createConnection } from "mongoose";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { cloudinaryUpload, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandeler(async (req, res) => {
  // analize the problem ,write steps to solve it
  // algo:
  // 1.get user details from the front end (done)
  // 2.validation-not empty(done)
  // 3.check if user already exist using email,username
  // 4.check for image,check for avatar,
  // 5.upload them to cloudnary ,avatar,
  // 6.create user object -create eantry in the db
  // 7.remove password and refresh token field from response
  // 8.check for user creation
  // 9.retrun res

  //   1.
  const { fullname, email, username, password } = req.body;
  console.log(fullname, email, username, password);
  //   2.
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //   3.
  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }
  //  note that multer gives us req.files
  //   4.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  //   5.
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  //   6.
  if (!avatar) {
    throw new ApiError(400, "Avatar not uploaded");
  }

  // 7.
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while creating the user");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createdUser));
});
// algo is done
export { registerUser };
