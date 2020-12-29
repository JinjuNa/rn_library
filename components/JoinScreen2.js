import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Alert,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  CheckBox,
  Input,
  Item,
  Content,
  Header,
  Footer,
  Button,
  Left,
  Right,
  Body,
  Text,
  Form,
  Label
} from 'native-base';
import styled from 'styled-components/native';
import cfg from './data/cfg.json';
import { useSelector, useDispatch } from 'react-redux';
import TitleContainer from './Title';
import { $Header } from './$Header';

const BottomContainer = styled.View`
  height:60px;
  flex-direction:row;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #d9e136;
`;

const $Content = styled(Content)`
  flex : 1;
  width:80%;
  margin:0 auto;
  max-width: 350px;
  margin-top : 20px;
`

const $Input = styled(Input)`
  font-size:16px;  
  color : #fff;
`;

const LabelTitleStyle = styled(Label)` 
    padding-top:4px;
    padding-bottom:2px;
    font-size:14px;   
    font-weight : 700;
    width : 30%;
    color : #fff;
`;

const FooterStyle = styled(Footer)`
    background-color : #000;
`;

let url = "";

export default function JoinScreen2({ navigation }) {

  const [BtnAgreeDisabled, SetBtnAgreeDisabled] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [nick, setNick] = useState('');
  const store = useSelector(state => state.data);

  const btn_ok = () => {

    url = store.url + '/slim/join2';

    const data = {
      sid: cfg.sid,
      cid: cfg.cid,
      phone: phone,
      name: name,
      pass: pass,
      passConfirm: passConfirm,
      nick: nick,
    }

    axios.post(url, data)
      .then(result => {

        const { ret, msg } = result.data;

        if (ret == 'Y') {
          Alert.alert(
            '안내',
            '회원가입이 완료되었습니다.',
            [{ text: 'ok', onPress: () => console.log('OK pressed') }],
            {
              cancelable: false,
            }
          );
          navigation.navigate('MainScreen');
        }
        else {
          Alert.alert(
            '입력오류',
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

  const btn_close = () => {
    navigation.pop();
  }

  const onChangePhone = (text) => {
    console.log(text);
  }

  const titleData = {
    mode: 'dark',
    mainText: '회원가입',
    subText: '회원정보를 입력하세요.'
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container style={{ backgroundColor : '#111'}}>
      <$Header iosBarStyle={"light-content"}>
        <StatusBar backgroundColor="#111" />
        <Left style={{ flex: 1 }}>
          <Button transparent onPress={() => btn_close()}>
            <Icon name="keyboard-arrow-left" style={{ fontSize: 30, color: "#aaaaaa" }}></Icon>
          </Button>
        </Left>
        <Body style={{ flex: 1, justifyContent: "center" }}>
        </Body>
        <Right style={{ flex: 1 }}></Right>
      </$Header>
      <TitleContainer data={titleData} />
      <$Content>
        <Item>
          <LabelTitleStyle>휴대폰</LabelTitleStyle>
          <$Input placeholder="- 없이 입력"
            keyboardType="numeric"
            onChange={e => setPhone(e.nativeEvent.text)}
            placeholderTextColor='#666666'
          />
        </Item>
        <Item>
          <LabelTitleStyle>이름</LabelTitleStyle>
          <$Input placeholder="실명"
            onChange={(e) => setName(e.nativeEvent.text)}
            placeholderTextColor='#666666' />
        </Item>
        <Item>
          <LabelTitleStyle>닉네임</LabelTitleStyle>
          <$Input placeholder="앱 내에서 사용할 닉네임"
            onChange={(e) => setNick(e.nativeEvent.text)}
            placeholderTextColor='#666666' />
        </Item>
        <Item>
          <LabelTitleStyle>비밀번호</LabelTitleStyle>
          <$Input placeholder="4-12 자리 영문/숫자 조합" secureTextEntry={true} onChange={(e) => setPass(e.nativeEvent.text)} placeholderTextColor='#666666' />
        </Item>
        <Item>
          <LabelTitleStyle>비밀번호 확인</LabelTitleStyle>
          <$Input placeholder="비밀번호 확인" secureTextEntry={true} onChange={(e) => setPassConfirm(e.nativeEvent.text)} placeholderTextColor='#666666' />
        </Item>
      </$Content>
      <FooterStyle>
        <ButtonAgree full onPress={() => btn_ok()} activeOpacity={0.8} underlayColor="#ffffff00"><Text style={{ fontSize: 18 }}>다음</Text></ButtonAgree>
      </FooterStyle>
    </Container>
    </TouchableWithoutFeedback>
  );

};