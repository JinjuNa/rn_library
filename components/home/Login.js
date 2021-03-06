import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Button, Text, Footer } from 'native-base';
import styled from 'styled-components/native';
import cfg from "../data/cfg.json";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import TitleContainer from "../Title";
import { $Header } from '../$Header';

const window = Dimensions.get('window');

const TitleView = styled.View`
  width : 75%;
  margin : 0 auto;
  margin-top: 20px;
  margin-bottom : 20px;
  flex : 3;
`;

const LogoImage = styled.Image`
  width : 80px;
  resize-mode : contain;
  margin-bottom : 10px;
`

const MainText = styled.Text`
  font-size:20px;  
  color : #111111;
  font-weight : 700;
  /* text-align:center; */
`

const SubText = styled.Text`
  font-size : 14px;
  color : #747474;
`

const Logo = styled.Image`
  width: 100px;
  height: 30px;
`;

const $Content = styled.View`
  flex : 3;
  justify-content : space-between;
`

const InputContainer = styled.View`  
  margin-top: 30px;
  margin-bottom : 30px;
  width: 100%;
  align-items:center;
  flex : 2;
`;

const LoginInput = styled.TextInput`
  border-bottom-width : 1px;
  border-bottom-color : #e8e6e7;
  font-size: 15px;
  width: 80%;
  max-width: 300px;
  padding:10px; 
`;

const PassInput = styled.TextInput`
  margin-top: 5px;
  border-bottom-width : 1px;
  border-bottom-color : #e8e6e7;
  font-size: 15px;  
  width: 80%;
  max-width: 300px;
  padding:10px;
`;

const SubContainer = styled.View`
  flex-direction : row;
  align-self : center;
  flex : 1;
`

const PassText = styled.Text`
  font-size : 12px;
`

const JoinText = styled.Text`
  font-size : 12px;
`

const SectionText = styled.Text`
  margin : 0 20px;
  font-size : 12px;
`

const ButtonContainer = styled.View`
  flex :2;
`;

const LoginButton = styled(Button)`  
  /* margin-top: 20px; */
  background-color : #4c6eec;
  height : 55px;
`;


const CompanyTextItem = styled.Text`
  font-size: 10px;
  color : #747474;
  text-align : center;
`;

const CompanyTextContainer = styled.View`
  /* align-self : center; */
  align-items:center; 
  flex : 3;
`;

let result = '';

function Login({ navigation, route }) {

  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');

  const store = useSelector(state => state.data);

  useEffect(() => {
  }, []);

  const btn_join_press = () => {
    navigation.navigate('JoinScreen1');   // 약관동의 
    // navigation.navigate('JoinScreen2'); // 가입
  }

  const btn_find_pass = () => {
    navigation.navigate('FindPassScreen'); // Input
  }

  const btn_login_press = () => {
    console.log('btn_login_press()');
    create_refresh_token();
  }

  const get_deivce = () => {
    return DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel();
  }

  const create_refresh_token = () => {

    console.log('create_refresh_token()');

    const device = get_deivce();
    const url = store.url + '/slim/token/createRefreshToken';
    const data = {
      sid: store.sid,
      cid: store.cid,
      phone: phone,
      pass: pass,
      device: device
    }

    axios.post(url, data, { timeout: 3000 })
      .then(result => {
        const { ret, msg, refresh_token } = result.data;

        if (ret == 'Y') {
          console.log('TAG: 로그인 성공!!!');

          AsyncStorage.setItem('refresh_token', refresh_token)
            .then(navigation.replace('HomeScreen'))
            .catch(error => alert(error));

        }
        else {
          Alert.alert(
            '오류',
            msg,
            [{ text: 'ok', onPress: () => console.log('OK pressed') }],
            {
              cancelable: false,
            }
          );
        }

      })
      .catch(error => alert(error));
  }

  const titleData = {
    mode: 'light',
    mainText: '안녕하세요. \n' + store.name + '입니다.',
    subText: '스마트짐을 이용해주셔서 감사합니다.'
  }

  return (
    <>
      <$Header style={{ height: 10 }} >
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      </$Header>
      <View style={{ height: window.height - 35 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', flexDirection: 'column', flex: 1, height: window.height * 0.7 }} keyboardShouldPersistTaps="handled">
            <View style={{ flex: 0.2 }}></View>
            <TitleContainer data={titleData} />
            <$Content>
              <InputContainer>
                <LoginInput placeholder="휴대폰번호 - 없이 입력"
                  onChange={(e) => setPhone(e.nativeEvent.text)}
                  keyboardType={'numeric'}></LoginInput>
                <PassInput placeholder="비밀번호" onChange={(e) => setPass(e.nativeEvent.text)}
                  secureTextEntry={true}
                ></PassInput>
              </InputContainer>
              <SubContainer>
                <PassText onPress={() => btn_find_pass()}>비밀번호 찾기</PassText>
                <SectionText>|</SectionText>
                <JoinText onPress={() => btn_join_press()}>회원가입</JoinText>
              </SubContainer>
            </$Content>
          </View>

        </ScrollView>
        <View style={{ minHeight: 150, height: window.height * 0.25, display: 'flex' }}>
          <ButtonContainer>
            <LoginButton full onPress={btn_login_press}><Text style={{ fontSize: 18 }}>로그인하기</Text></LoginButton>
          </ButtonContainer>
          <CompanyText></CompanyText>
        </View>
      </View>
    </>
  );
}

function CompanyText() {
  return (
    <CompanyTextContainer>
      <CompanyTextItem>{cfg.company}</CompanyTextItem>
      <CompanyTextItem>{cfg.charge}</CompanyTextItem>
      <CompanyTextItem>{cfg.address}</CompanyTextItem>
      <CompanyTextItem>{cfg.phone}</CompanyTextItem>
      <CompanyTextItem>{cfg.resp}</CompanyTextItem>
      <CompanyTextItem>{cfg.service}</CompanyTextItem>
    </CompanyTextContainer>
  )
}

export default Login;