import React, { useState } from "react";
import {
  Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, TextInput, ImageBackground, KeyboardAvoidingView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  Button
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import uuid from 'uuid';

const window = Dimensions.get('window');
const bgHeight = window.height;

export default ({ navigation, route }) => {

  const store = useSelector(state => state.data);
  const [isLogin, setIsLogin] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');

  const loginBgImage = { uri: "https://api.smartg.kr/upload/images/bg_login2.jpg" }

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
            .then(
              route.params ?
              () => {
                navigation.pop()
                navigation.replace('ContentNavigator')
              }
              :
              navigation.navigate('ContentNavigator', {
                screen : 'Class',
                params : {refresh : uuid.v4()}
              })
            )
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

  const btn_find_pass = () => {
    navigation.navigate('FindPassScreen'); // Input
  }

  const btn_join_press = () => {
    navigation.navigate('JoinScreen1');   // 약관동의 
  }

  const styles = StyleSheet.create({
    bg: { height: bgHeight, resizeMode: "cover", justifyContent: "center"},
    wrap: { paddingRight: 25, paddingLeft: 25},
    mt5: { marginTop: 5 },
    header: { display: "flex" },
    headerImg: { alignSelf: "center", width: 130, resizeMode: "contain" },
    input: { backgroundColor: '#fff', height: 42, paddingLeft: 20 },
    btn: { width: "100%", justifyContent: "center", alignSelf: "stretch", textAlignVertical: "center", backgroundColor: "#d9e134", color: "black", borderRadius: 15, marginBottom: 15 },
    f12: { fontSize: 12, textAlign: "center" },
    bold: { fontWeight: "bold" },
    white: { color: "#fff" },
    black: { color: 'black' },
    topTxt: { marginTop: 0, marginBottom: 75 },
    pwView: { marginTop: 5, marginBottom: 25 },
    btnTouch: { padding: 5 }
  })

  return (

    <>
      <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
      >
      <ScrollView
        bounces = {false}
      >
      <ImageBackground source={loginBgImage} style={styles.bg} >
        <View style={styles.wrap} bounces={false}>
          <View style={styles.header}>
            <Image style={styles.headerImg} source={require('./images/logo_login.png')} />
          </View>
          <View style={styles.topTxt}>
            <Text style={[styles.f12, styles.white]}>간편하게 로그인하고</Text>
            <Text style={[styles.f12, styles.white]}>다양한 서비스를 이용해보세요.</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="휴대폰번호 - 없이 입력"
              onChange={(e) => setPhone(e.nativeEvent.text)}
              keyboardType={'numeric'}
            ></TextInput>
            <TextInput
              style={[styles.mt5, styles.input]}
              placeholder="비밀번호"
              onChange={(e) => setPass(e.nativeEvent.text)}
              secureTextEntry={true}
            ></TextInput>
          </View>
          <View style={styles.pwView}>
            <TouchableOpacity style={styles.btnTouch} onPress={() => btn_find_pass()}>
              <Text style={[styles.f12, styles.white]}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex : 1 }} />
          <Button style={styles.btn} onPress={() => btn_login_press()}><Text style={styles.black}>로그인</Text></Button>
          <Text style={[styles.f12, styles.white]}>두써킷 라이브가 처음이신가요?</Text>
          <TouchableOpacity style={styles.btnTouch} onPress={() => btn_join_press()}>
            <Text style={[styles.f12, styles.white, styles.bold]}>지금 가입하기</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}