
import { User } from "../model/user.model.js"
import {
  catchResponse,
  errorResponse,
  generateAccessToken,
  successResponse,
  validatePassword,
} from "../utils/functions.js"
import {
  loginValidationSchema,
  userRegisterSchema,
} from "../utils/userValidationSchema.js"

export const registerUser = async (req, res) => {
  try {
    const { error, value } = userRegisterSchema.validate(req.body, {
      abortEarly: false,
    })
    if (error) {
      const validationErrors = error.details.map((err) => err.message)
      return errorResponse(res, 400, "Validation Error", validationErrors)
    }

    const { username, email, password } = value
    const existingEmail = await User.findOne({ email })
    if (existingEmail)
      return errorResponse(
        res,
        400,
        "Email already exists",
        "The email is already registered."
      )

    const token = generateAccessToken({ username, email })
    if (!token)
      return errorResponse(
        res,
        401,
        "token not generated",
        "An error occurred while generating the token."
      )
    const newUser = await User.create({ username, email, password, token })
    if (!newUser)
      return errorResponse(
        res,
        400,
        "User not created",
        "An error occurred while creating the user."
      )

    return successResponse({ res, message: "User registered successfully", data: { newUser } })
  } catch (err) {
    console.log(err.message)
    return catchResponse(res, "Internal Server Error", err.message)
  }
}

export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginValidationSchema.validate(req.body, {
      abortEarly: false,
    })
    if (error) {
      const validationErrors = error.details.map((err) => err.message)
      return errorResponse(res, 400, "Validation Error", validationErrors)
    }

    const { email, password } = value

    const user = await User.findOne({ email })
    if (!user)
      return errorResponse(
        res,
        404,
        "User not found",
        "The username provided does not exist."
      )

    const validPassword = await validatePassword(password, user.password)
    if (validPassword === false) return errorResponse(res, "Incorrect password");
    const username = user.username
    if (validPassword === true) {
        const token = generateAccessToken({ username, email })

        const newUser = await User.findOneAndUpdate(
            { email },
            { token },
            { new: true }
        ).select("-password");
        if (!newUser) return errorResponse(res, "Token not updated");
        return successResponse({ res, message: "User login successfully", data: newUser });
    }

    return successResponse({ res, message: "User logged in successfully", data: { user } })
  } catch (err) {
    return catchResponse(res, "Internal Server Error", err.message)
  }
}

export const logoutUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ email: req.user.email }, { token: "" })
    if (!user) return errorResponse(res, "User not updated");
    return successResponse({ res, message: "User logged out successfully", data: {} });
  } catch (err) {
    return catchResponse(res, "Internal Server Error", err.message)
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return errorResponse(res, "User not found.")
    }

    const userResponse = user.toObject()
    delete userResponse.password

    return successResponse({ res, message: "User found successfully", data: userResponse })
  } catch (error) {
    return catchResponse(res, "Error occurred in fetching current user", error.message)
  }
}
