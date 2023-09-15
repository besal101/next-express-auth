import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const Register: NextPage = (props) => {
  const [registerError, setRegisterError] = useState(null);
  const router = useRouter();

  const createUserSchema = object({
    name: string().nonempty({
      message: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "Password too short - should be 6 chars minimum")
      .nonempty({
        message: "Password is required",
      }),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }).nonempty({
      message: "passwordConfirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    })
      .email("Not a valid email")
      .nonempty({
        message: "Email is required",
      }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

  type CreateUserInput = TypeOf<typeof createUserSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (values: CreateUserInput) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values
      );
      router.push("/auth/login");
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Bishal"
            {...register("name")}
          />
          <p>{errors.name?.message as string}</p>
        </div>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <p>{errors.email?.message as string}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p>{errors.password?.message as string}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="Confirm Password"
            {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message as string}</p>
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Register;
