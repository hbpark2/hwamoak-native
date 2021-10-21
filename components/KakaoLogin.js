import React, { useState } from "react";
import Login from "../screens/LogIn";
import * as AuthSession from "expo-auth-session";
import gql from "graphql-tag";

import { logUserIn, tokenVar } from "../apollo";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";

const KAKAO_APP_KEY = "1de9bf41da64cf9b92b2f51ff3a54724";
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

// #.카카오로그인
//
// 1. 카카오서버에서 email, nickname request
//
// 2. 같은 email이 존재하면 로그인
//
// 3. 같은 email이 존재하지 않지만 같은 username이
//    존재하면 회원가입창으로 이동후 회원가입 - 로그인 - 피드
//
// 4. 같은 email, 같은 username 둘 다 존재하지 않으면
//    해당페이지 내에서 회원가입 후 로그인 - 피드

const LoginContainer = () => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const navigation = useNavigation();

  //로그인
  const onCompleted = async (data) => {
    const {
      login: { ok, token, error },
    } = data;
    if (ok) {
      await logUserIn(token);
    } else {
      if (error === "일치하는 가입정보가 없습니다.") {
        CreateAccountMutation({
          variables: {
            firstName: "",
            lastName: "",
            username,
            email,
            password: "1234",
          },
        });
      }
    }
  };

  const onSignupCompleted = async (data) => {
    const {
      createAccount: { ok, error },
    } = data;

    if (ok) {
      if (username) {
        console.log("login");
        login({
          variables: {
            email,
            password: "1234",
          },
        });
      }
    } else {
      navigation.navigate("CreateAccount", {
        email,
        username,
      });
    }
  };

  const [CreateAccountMutation] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted: onSignupCompleted,
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const onKakaoLoginSuccess = async (response) => {
    setEmail(response.email);
    setUsername(response.profile.nickname);
    await login({
      variables: {
        email: response.email,
        password: "1234",
      },
    });
  };

  /** KAKAO LOGIN API Actions */
  const kakaoLogin = async () => {
    /* ↓ [1단계] authorization_code 수령해오기 */
    let redirectUrl = AuthSession.getRedirectUrl();
    let result = await AuthSession.startAsync({
      authUrl:
        `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_APP_KEY}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&response_type=code`,
    });
    if (result.type !== "success") {
      console.log(result.type);
    } else {
      /*
      ↓ [2단계] access_token 및 refresh_token 수령
      ※ V_2(async&await 만으로 fetch를 구현, V_1은 보류file/kakaoAPI.js 하단에 有)
      ※ log 찍히는 순서: 1 → 2 → 3
      */
      try {
        let body =
          `grant_type=authorization_code` +
          `&client_id=${KAKAO_APP_KEY}` +
          `&code=${result.params.code}` +
          `&redirect_uri=${encodeURIComponent(redirectUrl)}`;
        let response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            Accept: "application/json;charset=UTF-8",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: body,
        });
        // console.log(1);
        let json = await response.json();

        /* ↓ [3단계] 사용자 정보 요청(token 이용)
        ※ V_2(async&await 만으로 fetch를 구현, V_1은 보류file/kakaoAPI.js) */
        try {
          response = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${json.access_token}`,
            },
          });
          json = await response.json();
          try {
            /* [4단계] DB와 대조(kakaoID 이용) */
            /** ###############로그인################ */
            /** @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

            onKakaoLoginSuccess(json.kakao_account);

            /** @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
            /** ###############로그인################ */
          } catch (error) {
            console.log("error_kakaoLogin(4단계)");
          }
        } catch (error) {
          console.log("error_kakaoLogin(3단계)");
        }
        // console.log(2);
      } catch (error) {
        console.log("error_kakaoLogin(2단계)");
      }
      // console.log(3);
    }
  };

  return <Login kakaoLogIn={kakaoLogin} />;
};

export default LoginContainer;
