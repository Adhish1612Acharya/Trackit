import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import signUpFormSchema from "@/validations/forms/SignUpForm";
import {  signUpFormProps } from "./SignUpFormTypes";


const SignUpForm: FC<signUpFormProps> = ({ onSubmit, signUpLoad }) => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      contactNo: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        style={{ margin: "1rem 0" }}
      >
        {/* First Row */}
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Name"
                    {...field}
                    className="rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Box>

        {/* Second Row */}
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
          <FormField
            control={form.control}
            name="contactNo"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your contact number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Box>

        {/* Login Text */}
        <Typography>
          Already Have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </Typography>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={signUpLoad}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
