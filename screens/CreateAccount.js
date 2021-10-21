import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShare";
import styled from "styled-components/native";
import { logUserIn } from "../apollo";

const FormError = styled.Text`
  color: tomato;
  margin-bottom: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;
export default function CreateAccount({ navigation, route }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    setError,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      email: route?.params?.email ? route?.params?.email : null,
      username: route?.params?.username ? route?.params?.username : null,
      firstName: route?.params?.username ? "" : null,
      lastName: route?.params?.username ? "" : null,
      password: route?.params?.username ? "1234" : null,
    },
  });

  const goToFeed = () => {
    navigation.navigate("Tabs");
  };

  //로그인
  const onLoginCompleted = async (data) => {
    const {
      login: { ok, token, error },
    } = data;
    if (ok) {
      await logUserIn(token);
      navigation.navigate("Tabs");
    } else {
      console.log(error);
    }
  };

  const [login, { loginLoading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: onLoginCompleted,
  });

  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    const { email, password, lastName, firstName } = getValues();

    if (!ok) {
      console.log("aa");
      return setError("result", {
        message: error,
      });
    }

    if (ok) {
      if (password === "1234" && lastName === "" && firstName === "") {
        console.log("kakao login");
        login({
          variables: {
            email,
            password: "1234",
          },
        });
      } else {
        alert("회원가입이 완료되었습니다 :)");
        navigation.navigate("LogIn", {
          email,
          password,
        });
      }
    }
  };

  const [CreateAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );

  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const onValid = (data) => {
    if (loading) {
      return;
    }
    console.log(data);
    if (!loading) {
      CreateAccountMutation({
        variables: { ...data },
      });
    }
  };

  useEffect(() => {
    register("firstName", {
      required: false,
    });
    register("lastName", {
      required: false,
    });
    register("username", {
      required: true,
    });
    register("email", {
      required: true,
    });
    register("password", {
      required: true,
    });
  }, [register]);

  useEffect(() => {
    if (route?.params?.username) {
      if (route?.params?.username && route?.params?.email) {
        CreateAccountMutation({
          variables: {
            firstName: "",
            lastName: "",
            username: route?.params?.username,
            email: route?.params?.email,
            password: "1234",
          },
        });
      }
    }
  }, []);

  return (
    <AuthLayout>
      <TextInput
        disable={route?.params?.username}
        autoFocus
        placeholder="First Name"
        placeholderTextColor="gray"
        returnKeyType="next"
        onChangeText={(text) => setValue("firstName", text)}
        onSubmitEditing={() => onNext(lastNameRef)}
      />
      <TextInput
        disable={route?.params?.username}
        ref={lastNameRef}
        placeholder="Last Name"
        placeholderTextColor="gray"
        returnKeyType="next"
        onChangeText={(text) => setValue("lastName", text)}
        onSubmitEditing={() => onNext(emailRef)}
      />
      <TextInput
        value={watch("email")}
        ref={emailRef}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        returnKeyType="next"
        onChangeText={(text) => setValue("email", text)}
        onSubmitEditing={() => onNext(usernameRef)}
      />
      <TextInput
        value={watch("username")}
        ref={usernameRef}
        placeholder="User Name"
        autoCapitalize="none"
        placeholderTextColor="gray"
        returnKeyType="next"
        onChangeText={(text) => {
          setValue("username", text);
          clearErrors();
        }}
        onSubmitEditing={() => onNext(passwordRef)}
      />

      <TextInput
        value={watch("password")}
        disable={route?.params?.username}
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        onChangeText={(text) => setValue("password", text)}
        onSubmitEditing={handleSubmit(onValid)}
      />

      {errors && <FormError>{errors?.result?.message}</FormError>}
      <AuthButton
        text="Create Account"
        // loading
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
