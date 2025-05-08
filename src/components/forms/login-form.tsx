/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@ui/form-elements/input";
import Checkbox from "@ui/form-elements/checkbox";
import FeedbackText from "@ui/form-elements/feedback";
import Button from "@ui/button";
import { hasKey } from "@utils/methods";
import { STRAPI } from "lib/strapi";
import axios from "axios";
import { useUser } from "@contexts/user-context";
import Spinner from "@components/ui/spinner";

interface IFormValues {
    email: string;
    password: string;
}

const LoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverState, setServerState] = useState("");
    const { setLogin } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${STRAPI}/api/auth/local`, {
                password: data.password,
                identifier: data.email
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
            setServerState("Email or password is incorrect");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tw-bg-white tw-shadow-2xs tw-shadow-heading/10 tw-max-w-[470px] tw-pt-7.5 tw-pb-[50px] tw-px-[50px]">
            <h3 className="tw-text-h2 tw-mb-5">Login</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="email"
                        className="tw-text-heading tw-text-md"
                    >
                        Email *
                    </label>
                    <Input
                        id="email"
                        placeholder="Username"
                        bg="light"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "email") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        type="email"
                        {...register("email", {
                            required: "Username is required",
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="password"
                        className="tw-text-heading tw-text-md"
                    >
                        Password *
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.password?.message}
                        state={hasKey(errors, "password") ? "error" : "success"}
                        showState={!!hasKey(errors, "password")}
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                </div>
                <Checkbox name="remember" id="remember" label="Remember me" />
                <Button type="submit" fullwidth className="tw-mt-7.5">
                    Log In
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

export default LoginForm;
