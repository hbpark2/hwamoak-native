import React, { Component } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

const { setItem } = useAsyncStorage("df1f628d3df3987b6d672ee8cd1167a9");

const SocialWebview = ({ source }) => {
  const INJECTED_JAVASCRIPT =
    '(function() {if(window.document.getElementsByTagName("pre").length>0){window.ReactNativeWebView.postMessage((window.document.getElementsByTagName("pre")[0].innerHTML));}})();';

  function LogInProgress(data) {
    console.log(data);
    // access code는 url에 붙어 장황하게 날아온다.
    // substringd으로 url에서 code=뒤를 substring하면 된다.
    const exp = "code=";
    var condition = target.indexOf(exp);
    if (condition != -1) {
      var request_code = target.substring(condition + exp.length);
      console.log("access code :: " + request_code);
    }
  }

  const handleMessage = async (event) => {
    // console.log("aa");
    // console.log(JSON.parse(event.nativeEvent.data));
    // let result = JSON.parse(event.nativeEvent.data);
    // let success = result.message;
    // if (success) {
    //   let userToken = result.Authorization;

    //   console.log(result);
    //   console.log("####");
    //   console.log(success);

    //   try {
    //     await setItem(userToken);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    closeSocialModal();
  };

  return (
    <WebView
      //ref={this._refWebView}
      originWhitelist={["*"]}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      source={source}
      javaScriptEnabled={true}
      // onMessage={handleMessage}
      onMessage={(event) => {
        LogInProgress(event.nativeEvent["url"]);
      }}
      // onMessage ... :: webview에서 온 데이터를 event handler로 잡아서 logInProgress로 전달
    />
  );
};

export default SocialWebview;
