import * as yup from "yup";


export const registrationSchema = yup.object({
  name: yup.string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters"),
    
  email: yup.string()
    .email("Invalid email format")
    .required("Email address is required"),
    
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
    
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});



export const loginSchema = yup.object({
  email: yup.string()
    .email("Invalid email format")
    .required("Email address is required"),
    
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});



export const profileUpdateSchema = yup.object({
    name: yup.string()
        .min(3, "Name must be at least 3 characters")
        .nullable(), // Allows null or an updated string
        
    // Optionally add constraints for an old/new password change form
});
