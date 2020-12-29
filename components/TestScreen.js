import React, { useState } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key,
    get_basecode
} from '../lib/Function';
import {
    View,
    Text,
    Header,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Title,
    Content,
    Button
} from 'native-base';
import { $Header } from './$Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from "react-native-video";
import VideoPlayer from 'react-native-video-controls';
// import playerData from './data/player.json';

export default ({ navigation }) => {

    const loadingHTML = `<div style="color:white;padding:10;"></div>`
    const store = useSelector(state => state.data);
    const [content, setContent] = useState(loadingHTML);
   
    get_basecode( {sid:store.sid,gubun:store.cid,url:store.url,name:'info_home'} )
    .then( result => {
        setContent(result[0].result);
    })
    .catch((error)=>console.log(error));

    const btn_login_press = () => {
        navigation.navigate('LoginScreen');   // 로그인
    }

    const btn_start = () => {
        navigation.replace('ContentNavigator');   // content
    }
  
    const { height } = Dimensions.get("window");

    const styles = StyleSheet.create({
        wrap : {padding : 20, height : height},
        mt10 : {marginTop : 10},
        header : {display : "flex"},
        selfCenter : {alignSelf : "center"},
        button : {width : "100%", borderRadius : 50, height : 50, justifyContent: "center", alignSelf: "stretch", textAlignVertical: "center"},
        logo : {width : 220, height : 65, resizeMode : "contain", marginTop : "45%", marginBottom : 15},
        titleTxt : {color : "#fff", fontSize : 12},
        button1 : {backgroundColor : "#fff"},
        button2 : {backgroundColor : "transparent", borderColor : "#fff", borderWidth : 1},
        buttonWrap : {position : "absolute", left: 50, right : 50, bottom : "15%", alignItems : "stretch"},
        button1Txt : {color : "#000"},
        backgroundVideo : {
            position: "absolute",
            top: 0,
            left: 0,
            alignItems: "stretch",
            bottom: 0,
            right: 0,
            backgroundColor : "#111"
        },
        rightSection : {
            position : "absolute",
            top : 50,
            right : 0,
            zIndex : 99
        },
        rightScroll : { height : 240},
        itemWrap :{
            flex : 1,
            flexDirection : 'row',
            height : 60,
            padding : 10,
            marginBottom : 1,
            backgroundColor : "#00000050"
        },
        itemImage : { width : 40, height : 40, resizeMode : "cover", borderRadius : 50},
        iconImage : { marginTop : 13},
        lineHeight : {lineHeight : 40},
        nameTxt : {color : "#fff", paddingRight : 5, paddingLeft : 5},
        pointTxt : {color : "#fff000", paddingRight : 5, paddingLeft : 2},
        calTxt : {color : "#fff"},
        calNum : {color : "#fff", fontWeight : "700"}    
    })

    return (

        <>
        {/* <Video
          source={{uri : "http://karfe1.cache.iwinv.net/159608498351396.mp4"}}
          style={styles.backgroundVideo}
          resizeMode={"contain"}
          rate={1.0}
        /> */}
        <VideoPlayer
            key="*required*"
            source={{ uri: "http://karfe1.cache.iwinv.net/159608498351396.mp4" }}
            paused={true}
            // poster={poster}
            disableFullscreen={true}
            // disableBack={true}
            // disableVolume={true}
            style={styles.backgroundVideo}
            title={"10분 클라임 라이드"}
        />
        <StatusBar backgroundColor="#111111" barStyle={"light-content"} />
        <View stlye={styles.leftSection}>

        </View>
        <View style={styles.rightSection}>
            <ScrollView style={styles.rightScroll}>
            {
                playerData.map((item, index) => {
                    return(
                    <View style={styles.itemWrap} key={index}>
                        <View stlye={styles.element}>
                            <Image source={{uri : item.image}} style={styles.itemImage} />
                        </View>
                        <View style={styles.element}>
                            <Text style={[styles.nameTxt, styles.lineHeight]}>{item.name}</Text>
                        </View>
                        <View style={styles.element}>
                            <Text style={styles.iconImage}><Image source={require("./images/icon_point.png")} /></Text>
                        </View>
                        <View style={styles.element}>
                            <Text style={[styles.pointTxt, styles.lineHeight]}>{item.point}</Text>
                        </View>
                        <View style={styles.element}>
                            <Text style={[styles.calTxt, styles.lineHeight]}><Text style={styles.calNum}>{item.cal}</Text>kcal</Text>
                        </View>
                    </View>
                    )
                })
            }
            </ScrollView>
        </View>
        </>
    )
}