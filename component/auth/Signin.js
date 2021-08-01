import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Text } from 'native-base';
import PhoneInput from 'react-native-phone-number-input';
import instance from '../../store/actions/instance';
import CodeInput from 'react-native-code-input';
import { signin } from '../../store/actions/authActions';

const Signin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [page, setPage] = useState('login');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (code) => {
    if (page === 'login') {
      console.log(phoneNumber);
      const res = await instance.post(`/api/v1/users/`, { phoneNumber });
      console.log(res.data);
      setPage(res.data);
    } else {
      dispatch(signin(phoneNumber, code, setError));
    }
  };
  return (
    <>
      {page === 'login' ? (
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
          <Text></Text>
          <Text></Text>
          <Button onPress={handleSubmit}>BUTTON</Button>
        </>
      ) : (
        <>
          <CodeInput
            secureTextEntry
            activeColor="rgba(26, 35, 126, 1)"
            inactiveColor="rgba(26, 35, 126, 1)"
            autoFocus={true}
            inputPosition="center"
            borderType={'underline'}
            codeLength={6}
            size={50}
            onFulfill={(code) => handleSubmit(code)}
            containerStyle={{ marginTop: 250 }}
          />
          <Text>your code is {page}</Text>
        </>
      )}
    </>
  );
};
export default Signin;
