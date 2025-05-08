import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@ui/form-elements/input";
import Button from "@ui/button";
import { hasKey } from "@utils/methods";
import { STRAPI } from "lib/strapi";
import axios from "axios";
import { useUser } from "@contexts/user-context";
import { useState } from "react";
import FeedbackText from "@ui/form-elements/feedback";
import { useRouter } from "next/router";
import Spinner from "@components/ui/spinner";

interface IFormValues {
    reg_email: string;
    reg_username: string;
    reg_password: string;
    confirmPassword: string;
}

const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverState, setServerState] = useState("");
    const { setLogin } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IFormValues>();

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${STRAPI}/api/auth/local/register`, {
                password: data.reg_password,
                email: data.reg_email,
                username: data.reg_username
            });
            const _data = response.data;
            const jwt = _data.jwt;
            setLogin({
                username: _data.user.username,
                email: _data.user.email,
                token: jwt
            });
            if (window?.history?.length > 2) {
                router.back();
            } else {
                router.push("/profile");
            }
        } catch(err) {
            setServerState("Email already taken");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tw-px-[50px]">
            <h3 className="tw-text-h2 tw-mb-5">Register</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="reg_username"
                        className="tw-text-heading tw-text-md"
                    >
                        Full name *
                    </label>
                    <Input
                        id="reg_username"
                        placeholder="Full name"
                        bg="light"
                        feedbackText={errors?.reg_username?.message}
                        state={
                            hasKey(errors, "reg_username") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "reg_username")}
                        {...register("reg_username", {
                            required: "Full name is required",
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="email"
                        className="tw-text-heading tw-text-md"
                    >
                        Email *
                    </label>
                    <Input
                        id="email"
                        placeholder="email"
                        bg="light"
                        feedbackText={errors?.reg_email?.message}
                        state={hasKey(errors, "reg_email") ? "error" : "success"}
                        showState={!!hasKey(errors, "reg_email")}
                        type="email"
                        {...register("reg_email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "invalid email address",
                            },
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="reg_password"
                        className="tw-text-heading tw-text-md"
                    >
                        Password *
                    </label>
                    <Input
                        id="reg_password"
                        type="password"
                        placeholder="Password"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.reg_password?.message}
                        state={
                            hasKey(errors, "reg_password") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "reg_password")}
                        {...register("reg_password", {
                            required: "Password is required",
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="confirmPassword"
                        className="tw-text-heading tw-text-md"
                    >
                        Password *
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.confirmPassword?.message}
                        state={
                            hasKey(errors, "confirmPassword")
                                ? "error"
                                : "success"
                        }
                        showState={!!hasKey(errors, "confirmPassword")}
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === getValues("reg_password") ||
                                "The passwords do not match",
                        })}
                    />
                </div>

                <Button type="submit" fullwidth className="tw-mt-7.5">
                    Register
                </Button>
                {serverState && <FeedbackText>{serverState}</FeedbackText>}
            </form>
            {isLoading && (
                <div className="tw-fixed tw-bg-light-100/50 tw-top-0 tw-z-50 tw-w-screen tw-h-screen tw-flex tw-justify-center tw-items-center">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default RegisterForm;
