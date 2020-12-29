import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    get_refresh_token,
    access_token_check,
} from '../lib/Function';
import {
    View,
    Text,
    Button
} from 'native-base';
import cfg from "./data/cfg.json";
import axios from 'axios';
import moment from 'moment';

export default ({ navigation }) => {

    const [PurchaseInfo, setPurchaseInfo] = useState([]);
    const store = useSelector(state => state.data);
    const [memState, setMemState] = useState('1');

    const btn_membership = () => {
        navigation.navigate('CardPayScreen');
    }

    const member_purchase = () => {

        console.log('TAG: member_purchase()');

        // 권한검사
        if (is_access_token === 'N') {
            login_alert();
            return;
        }

        // 회원정보 로딩
        const url = store.url + '/slim/member_purchase';
        const data = {
            sid: cfg.sid,
            cid: cfg.cid,
            access_token: access_token
        }
        axios.post(url, data, { timeout: 3000 })
            .then(result => {
                setPurchaseInfo(result.data)
                if(result.data.length === 0){
                    setMemState('1')
                }else{
                    setMemState('2')
                }
            })
            .catch(error => console.log(error));

    }

    const btn_close = () => {
        navigation.pop();
    }

    const error_close = () => {
        Alert.alert(
            '오류',
            '권한이 없거나 로그인 상태가 아닙니다.',
            [{ text: 'ok', onPress: () => console.log('OK pressed') }],
            {
                cancelable: false,
            }
        );
        navigation.pop();
    }

    const login_alert = () => {
        // Alert.alert(
        //     "로그인 확인",
        //     "로그인 후 이용가능합니다.",
        //     [
        //         { text: '로그인 하기', onPress: () => navigation.navigate('LoginScreen') },
        //         { text: '취소', onPress: () => navigation.pop() }
        //     ]
        // )
    }
  

    const styles = StyleSheet.create({
        wrap : {padding : 20, position : 'relative', height : '100%'},
        selfCenter : {alignSelf : "center"},
        container : {height : 280},
        itemWrap : {backgroundColor : "#ffffff50", marginBottom : 2, flexDirection : 'row', padding: 15, justifyContent : "space-between"},
        itemLeftTxt : {fontSize : 10, lineHeight : 20, color : "#9a9a9a"},
        itemRightTxt : {fontSize : 12, lineHeight : 20, color : "#9a9a9a", fontWeight : "500"},
        bottomWrap : {backgroundColor : "#fff", paddingBottom : 80, paddingTop : 80, position : 'absolute', bottom : 0, width : '100%', left : 20},
        btn : {width : "80%", alignSelf : "center", justifyContent: "center", borderRadius : 100, backgroundColor : "#802ceb"},
        bottomTxt : {alignSelf : "center"},
        highlightTxt : {fontWeight : "700", alignSelf : "center", marginBottom : 35}


    })

    useEffect(() => {

        get_access_token()
            .then(result => {
                access_token = result;
                return get_refresh_token();
            })
            .then(result => {
                refresh_token = result;
                return access_token_check(access_token, store.url, store.sid);
            })
            .then(result => {
                is_access_token = result;
                member_purchase();
            })
            .catch(error => alert(error));

    }, []);

    useEffect(() => {
        navigation.setOptions({title : "맴버십"})
    }, []);

    return (

        <>
        <View style={styles.wrap}>
        <ScrollView style={styles.container}>
            {
                PurchaseInfo.map((item, index) => {
                    var formatRegdate = moment(item.sdate).format('YYYY.MM.DD HH:mm');
                    var formatSdate = moment(item.sdate).format('YYYY.MM.DD');
                    var formatEdate = moment(item.sdate).format('YYYY.MM.DD');

                    return(
                        <View style={styles.itemWrap} key={index}>
                            <View style={styles.itemLeftWrap}>
                                <Text style={styles.itemLeftTxt}>{formatRegdate}</Text>
                            </View>
                            <View style={styles.itemRightWrap}>
                                <Text style={styles.itemRightTxt}>{formatSdate + " ~ " + formatEdate}</Text>
                            </View>
                        </View>
                    )
                    
                })
            }
        </ScrollView>
            { memState === '1' ? 
                <View style={styles.bottomWrap}>
                    <Text style={styles.bottomTxt}>가입된 맴버십 서비스가 없습니다.</Text>
                    <Text style={styles.highlightTxt}>맴버십 서비스를 가입하세요!</Text>
                    <Button style={styles.btn} onPress={() => btn_membership()}><Text>맴버십 가입하기</Text></Button>
                </View>
                :
                <View style={styles.bottomWrap}>
                    <Text style={styles.bottomTxt}>맴버십 만료까지 10일 남았습니다.</Text>
                    <Text style={styles.highlightTxt}>맴버십 서비스를 연장하세요!</Text>
                    <Button style={styles.btn} onPress={() => btn_membership()}><Text>맴버십 연장하기</Text></Button>
                </View>
            }
        </View>
        </>
    )
}