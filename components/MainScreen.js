import React, { useEffect, useState } from "react";
import {
    Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar, ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    getIsLogin
} from '../lib/Function';
import {
    View,
    Text,
    Button
} from 'native-base';
import Video from "react-native-video";
import styled from 'styled-components/native';
import Loading from "./Loading";
import Orientation from 'react-native-orientation-locker';

const LoadingView = styled.View`
    align-items:center;
`;

export default ({ navigation }) => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState(false); // 로그인상태
    const [isLoading, setIsLoading] = useState(true); // 로딩메시지

    const btn_login_press = () => {
        navigation.navigate('LoginScreen', {screen : 'main'});   // 로그인
    }

    const btn_start = () => {
        navigation.replace('ContentNavigator');   // content
    }

    const { height } = Dimensions.get("window");

    const styles = StyleSheet.create({
        wrap: { padding: 20, height: height },
        mt10: { marginTop: 10 },
        header: { display: "flex" },
        selfCenter: { alignSelf: "center" },
        button: { width: "100%", borderRadius: 50, height: 50, justifyContent: "center", alignSelf: "stretch", textAlignVertical: "center" },
        logo: { width: 220, height: 65, resizeMode: "contain", marginTop: "45%", marginBottom: 15 },
        titleTxt: { color: "#fff", fontSize: 12 },
        button1: { backgroundColor: "#fff" },
        button2: { backgroundColor: "transparent", borderColor: "#fff", borderWidth: 1 },
        buttonWrap: { position: "absolute", left: 50, right: 50, bottom: "15%", alignItems: "stretch" },
        button1Txt: { color: "#000" },
        backgroundVideo: {
            height: height,
            position: "absolute",
            top: 0,
            left: 0,
            alignItems: "stretch",
            bottom: 0,
            right: 0,
            backgroundColor: "#111"
        }
    })

    useEffect(() => {
        Orientation.lockToPortrait();
        getIsLogin(store.url, store.sid)
            .then(result => {
                setIsLogin((state) => {
                    setIsLoading(false);
                    return result;
                });
            })
            .catch(error => alert(error));
    }, []);


    return (

        <>
            {/* <Video
          source={{uri : "http://karfe1.cache.iwinv.net/160499671897965.mp4"}}
          style={styles.backgroundVideo}
          muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.0}
          ignoreSilentSwitch={"obey"}
        /> */}
            <Video
                source={ require('../assets/video/intro.mp4') }
                style={styles.backgroundVideo}
                muted={true}
                repeat={true}
                resizeMode={"cover"}
                rate={1.0}
                ignoreSilentSwitch={"obey"}
            />
            <StatusBar backgroundColor="#111111" barStyle={"light-content"} />
            <View style={styles.wrap}>
                <View style={[styles.header]}>
                    <Image style={[styles.logo, styles.selfCenter]} source={require('./images/logo_main.png')} />
                </View>
                <View style={styles.selfCenter}>
                    <Text style={styles.titleTxt}>두써킷 라이브를 통하여 언제 어디서나</Text>
                </View>
                <View style={styles.selfCenter}>
                    <Text style={styles.titleTxt}>실시간 운동을 시작해보세요!</Text>
                </View>
                <View style={styles.buttonWrap}>
                    {isLoading === true ? (
                        <LoadingView>
                            <Text>Loading...</Text>
                        </LoadingView>) : null}
                    {isLoading === false ? (
                        <LoadingView>
                            <Button style={[styles.selfCenter, styles.button, styles.button1]} onPress={() => btn_start()}><Text style={styles.button1Txt}>시작하기</Text></Button>
                            {isLogin !== 'Y' ? (
                                <Button style={[styles.mt10, styles.selfCenter, styles.button, styles.button2]} onPress={() => btn_login_press()}><Text>로그인</Text></Button>
                            ) : null}
                        </LoadingView>
                    ) : null
                    }
                </View>
            </View>
        </>
    )
}