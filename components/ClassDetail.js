import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar, ImageBackground
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
import CategoryBar from './CategoryBar';
import Axios from 'axios';
import moment from 'moment';

let vseq = '';

export default ({ route, navigation }) => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState('');
    const [listItem, setListItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩

    const btn_vod_play = () => {
        if(isLogin == 'Y'){
            navigation.navigate('Player', {vseq : vseq});
        }else{
            login_alert();
        }
    }

    const login_alert = () => {
        Alert.alert(
            "로그인 확인",
            "로그인 후 이용가능합니다.", 
            [
                {text : '로그인 하기', onPress : () => navigation.navigate('LoginScreen')},
                {text : '취소'}
            ]
        )
    }

    useEffect(() => {
        console.log('ClassDetail.js');
        getIsLogin(store.url, store.sid)
            .then(result => {
                setIsLogin((state) => {
                    setIsLoading(false);
                    vseq = route.params.vseq;
                    loadData({ store: store }); // live class
                    return result;
                });
            })
            .catch(error => alert(error));
    }, []);

    const loadData = (props) => {
        const { url, sid, cid } = props.store;
        const data = {
            sid: sid,
            cid: cid,
            vseq : vseq
        }

        Axios.post(url + '/slim/dolive/get_video_detail', data)
            .then(result => {
                var temp = result.data[0];
                var temp_sdate = moment(result.data[0].sdate).format('YYYY/MM/DD hh:mma');
                temp['formatSdate'] = temp_sdate;

                setListItem(temp);
            })
            .catch(error => console.log(error));
    }
  

    const styles = StyleSheet.create({
        wrap : {padding : 20},
        mt50 : {marginTop : 50},
        header : {display : "flex"},
        selfCenter : {alignSelf : "center"},
        button : {width : 200, alignItems : "center"},
        title : {fontWeight : "bold", fontSize : 18, padding : 10},
        btn : {width : "80%", alignSelf : "center", justifyContent: "center", borderRadius : 100, marginBottom : 30, backgroundColor : "#802ceb"},
        detailImage : {width : "100%", height : 200, resizeMode : "cover"},
        classView : {padding : 10, color : "#fff", flex: 1, justifyContent : "flex-end", backgroundColor : "#00000080"},
        titleTxt : {fontSize : 17, color : "#fff"},
        teacherTxt : {fontSize : 12, color : "#fff"},
        dateTimeTxt : {fontSize : 10, color : "#fff", marginTop : 8},
        detailTopWrap : {flexDirection : 'row', justifyContent : "center", padding : 20},
        detailContent : {width : 90, padding : 5 },
        detailTitleTxt : {alignSelf : "center", marginBottom : 20, fontSize : 12},
        contentTxt : {alignSelf : "center", fontWeight : "600", fontSize : 12},
        borderRight : { borderRightWidth : 1, borderRightColor : "#a9a9a9" }
    })

    return (
        <>
        <View>
            <ImageBackground source={{uri : listItem.image}} style={styles.detailImage}>
                <View style={styles.classView}>
                <Text style={styles.titleTxt}>{listItem.title}</Text>
                <Text style={styles.teacherTxt}>{listItem.teacher + " 트레이너"}</Text>
                <Text style={styles.dateTimeTxt}>{listItem.formatSdate}</Text>
                </View>
            </ImageBackground>
        </View>
        <ScrollView style={styles.wrap}>
            <View style={styles.detailTopWrap}>
                <View style={[styles.detailContent, styles.borderRight]}>
                    <Text style={styles.detailTitleTxt}>분류</Text>
                    <Text style={styles.contentTxt}>{listItem.category}</Text>
                </View>
                <View style={[styles.detailContent, styles.borderRight]}>
                    <Text style={styles.detailTitleTxt}>소요시간</Text>
                    <Text style={styles.contentTxt}>{listItem.runtime + "분"}</Text>
                </View>
                <View style={styles.detailContent}>
                    <Text style={styles.detailTitleTxt}>난의도</Text>
                    <Text style={styles.contentTxt}>{listItem.level}</Text>
                </View>
            </View>
            <View style={styles.detailBottomWrap}>
                <View>
                    <Text style={styles.detailTitleTxt}>상세정보</Text>
                    <Text style={styles.contentTxt}>{listItem.memo}</Text>
                </View>
            </View>
        </ScrollView>
        <Button style={styles.btn} onPress={() => btn_vod_play()}><Text>START</Text></Button>
        </>
    )
}