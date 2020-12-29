import React, { useState } from 'react';
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
    Button,
    Form,
    Item,
    Label,
    List,
    ListItem
} from 'native-base';
import {
    Image, Dimensions, RefreshControlBase,
    Alert,
    StyleSheet, StatusBar
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { useEffect } from 'react';
import cfg from "./data/cfg.json";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import {
    get_access_token,
    get_refresh_token,
    access_token_check,
} from '../lib/Function';
import { $Header } from './$Header';
import { $Footer } from './$Footer';
const MainText = styled.Text`
  font-size:20px;  
  font-weight : 700;
  color: #fff;
  width : 90%;
  margin : 20px auto 25px auto;
  background-color : #111;
`

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #4c6eec;
`;

var access_token = '';
var refresh_token = '';
var is_access_token = 'N';

function PurchaseScreen({ navigation, route }) {

    const [PurchaseInfo, setPurchaseInfo] = useState([]);
    const store = useSelector(state => state.data);

    const member_purchase = () => {

        console.log('TAG: member_purchase()');

        // 권한검사
        if (is_access_token === 'N') {
            error_close();
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


    return (
        <>
            <$Header style={{ backgroundColor: '#111111' }} iosBarStyle={"light-content"}>
                <StatusBar backgroundColor="#111" />
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => btn_close()}>
                        <Icon name="close" style={{ fontSize: 30, color: "white" }}></Icon>
                    </Button>
                </Left>
            </$Header>
            <View style={{ backgroundColor: '#111111' }}>
                <MainText>구매내역</MainText>
            </View>
            <Content contentContainerStyle={styles.container} scrollEnabled={true} style={{ backgroundColor: '#111111' }}>
                <View style={styles.content}>
                    <List>
                        {PurchaseInfo.map((item, index) => {
                            const { p_date, p_name, sdate, edate, price } = item;
                            var year1 = p_date.substring(0, 4);
                            var month1 = p_date.substring(4, 6);
                            var day1 = p_date.substring(6, 8);
                            var hour1 = p_date.substring(8, 10);
                            var min1 = p_date.substring(10, 12);
                            var formatPdate = year1 + '.' + month1 + "." + day1 + " " + hour1 + ":" + min1;

                            var year2 = sdate.substring(0, 4);
                            var month2 = sdate.substring(4, 6);
                            var day2 = sdate.substring(6, 8);
                            var formatSdate = year2 + '.' + month2 + "." + day2;

                            var year3 = edate.substring(0, 4);
                            var month3 = edate.substring(4, 6);
                            var day3 = edate.substring(6, 8);
                            var formatEdate = year3 + '.' + month3 + "." + day3;

                            var formatPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                            return (
                                <ListItem style={styles.listitem} key={index}>
                                    <Left style={styles.listLeft}>
                                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                            <Text style={{ color: '#999' }}>{formatPdate}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                            <Text style={{ color: 'white' }}>{p_name}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                            <Text style={{ color: 'white' }}>{formatSdate}~{formatEdate}</Text>
                                        </View>
                                    </Left>
                                    <Right style={{ flexDirection: 'column', flexBasis: 60 }}>
                                        <View style={{ alignSelf: 'flex-end' }}>
                                            <Text style={{ textAlign: "right", fontSize: 18, color: "white" }} numberOfLines={1}>{formatPrice}원</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                            )
                        }
                        )}
                    </List>
                </View>
            </Content>
            <$Footer style={{ backgroundColor: '#111111' }}>
                <ButtonAgree full onPress={() => btn_close()}><Text style={{ fontSize: 18, color: '#fff' }}>확인</Text></ButtonAgree>
            </$Footer>
        </>
    );
}

export default PurchaseScreen;


const styles = StyleSheet.create({
    listitem: {
        marginLeft: 0
    },
    listLeft: {
        flex: 1,
        flexDirection: 'column'
    },
    item01Text: {
        fontWeight: "bold",
        fontSize: 18
    },
    container: {
        alignItems: "center"
    },
    content: {
        width: "90%"
    },

}); 