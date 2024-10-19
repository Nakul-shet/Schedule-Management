import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { AuthUser } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await AuthUser.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("AuthUser already Registered!", 400));
  }

  const user = await AuthUser.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "AuthUser Registered!", 200, res);
});

// Add New Admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, gender, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await AuthUser.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await AuthUser.create({
    firstName,
    lastName,
    email,
    phone,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

// Add New Doctor
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, gender, password } = req.body;

  if (!firstName || !lastName || !email || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await AuthUser.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }

  const doctor = await AuthUser.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    role: "Doctor",
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const addNewUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, gender, password } = req.body;

  if (!firstName || !lastName || !email || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await AuthUser.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("User With This Email Already Exists!", 400)
    );
  }

  const user = await AuthUser.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    role: "User",
  });

  res.status(200).json({
    success: true,
    message: "New user Registered",
    user,
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await AuthUser.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler(`${user.firstName} - Account is not of the type ${role}`, 400));
  }
  
  generateToken(user, "Login Successfully!", 201, res);
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});


export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await AuthUser.find({ role: "Doctor" });
  res.status(200).json(doctors);
});

export const getDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await AuthUser.findById({ _id: id });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (doctor.role !== "Doctor") {
    return next(new ErrorHandler("This user is not a doctor", 400));
  }
  res.status(200).json(doctor);
});

export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  const doctor = await AuthUser.findById({ _id: id });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (doctor.role !== "Doctor") {
    return next(new ErrorHandler("This user is not a doctor", 400));
  }

  doctor.firstName = firstName || doctor.firstName;
  doctor.lastName = lastName || doctor.lastName;
  doctor.email = email || doctor.email;

  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Doctor information updated successfully",
    doctor,
  });
});

export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await AuthUser.findOne({ _id: id });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (doctor.role !== "Doctor") {
    return next(new ErrorHandler("This user is not a doctor", 400));
  }

  await AuthUser.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});

export const getAuthUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
