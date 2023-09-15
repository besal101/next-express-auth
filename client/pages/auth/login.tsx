import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

  const createSessionSchema = object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  });

  type createSessionInput = TypeOf<typeof createSessionSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<createSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  const onSubmit = async (values: createSessionInput) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  return (
    <>
      <p>{loginError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Login;
