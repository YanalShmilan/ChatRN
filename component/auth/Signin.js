import React, { useState } from "react";
import { useDispatch } from "react-redux";

import PhoneInput from "react-native-phone-number-input";
import instance from "../../store/actions/instance";
import CodeInput from "react-native-code-input";
import { signin } from "../../store/actions/authActions";
import { View, Text, Button } from "react-native-ui-lib";

const Signin = () => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [page, setPage] = useState("login");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (code) => {
    if (page === "login") {
      console.log(phoneNumber);
      const res = await instance.post(`/api/v1/users/`, { phoneNumber });
      console.log(res.data);
      setPage(res.data);
    } else {
      dispatch(signin(phoneNumber, code, setError));
    }
  };
  return (
    <View flex paddingH-25 paddingT-120>
      {page === "login" ? (
        <>
          <PhoneInput
            defaultCode="JO"
            layout="first"
            onChangeFormattedText={(text) => {
              setPhoneNumber(text.substr(1));
            }}
            withDarkTheme
            withShadow
            autoFocus
          />
          <View marginT-50 center>
            <Button
              onPress={handleSubmit}
              text70
              white
              background-orange30
              label="Login"
              marginT-30
            />
          </View>
        </>
      ) : (
        <>
          <CodeInput
            secureTextEntry
            activeColor="rgba(26, 35, 126, 1)"
            inactiveColor="rgba(26, 35, 126, 1)"
            autoFocus={true}
            inputPosition="center"
            borderType={"underline"}
            codeLength={6}
            size={50}
            onFulfill={(code) => handleSubmit(code)}
            containerStyle={{ marginTop: 250 }}
          />
          <Text>your code is {page}</Text>
        </>
      )}
    </View>
  );
};
export default Signin;
