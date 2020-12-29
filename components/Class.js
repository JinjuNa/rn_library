import React, { useState, useEffect } from "react";
import {
    Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
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
import categoryData from "./data/category.json";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import moment from 'moment';
import styled from 'styled-components/native';
import Orientation from 'react-native-orientation-locker';

const window = Dimensions.get('window');
let slideWidth = 414;

var initial = Orientation.getInitialOrientation();
if (initial === 'PORTRAIT') {
    slideWidth = window.width;
} else {
    slideWidth = window.height;
}

const LiveList = styled.ScrollView`
    width : ${slideWidth - 40 + 'px'};    
`;

const ListItemLeft = styled.View`
    padding:10px;
`;

const LiveItem = styled.View`
    height:180px;
    width : ${slideWidth - 40 + 'px'};    
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
`

export default ({ navigation, route }) => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState('');
    const [listItem, setListItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩

    const btn_class_component = (num) => {
        navigation.navigate('ClassNavigator', { category: num });   // 클래스 네비게이터
    }

    const btn_live_play = (vseq, sdate, edate) => {
        let now = new Date()
        let formatNow = moment(now).format('YYYY-MM-DD HH:mm:ss');
        if (isLogin === 'Y') {
            if(formatNow > sdate && formatNow < edate){
                navigation.navigate('Player', { vseq: vseq });
            }else if(formatNow > edate){
                loadData({ store: store }); // live class
            }else{
                alert('라이브 방송 시간이 아닙니다.')
            }
            // navigation.navigate('Player', { vseq: vseq });
        } else {
            login_alert();
        }
    }

    const login_alert = () => {
        Alert.alert(
            "로그인 확인",
            "로그인 후 이용가능합니다.",
            [
                { text: '로그인 하기', onPress: () => navigation.navigate('LoginScreen') },
                { text: '취소' }
            ]
        )
    }

    useEffect(() => {
        console.log('Class.js');
        getIsLogin(store.url, store.sid)
            .then(result => {
                setIsLogin((state) => {
                    setIsLoading(false);
                    loadData({ store: store }); // live class
                    return result;
                });
            })
            .catch(error => alert(error));
    }, [route.params]);

    const loadData = (props) => {
        const { url, sid, cid } = props.store;
        const data = {
            sid: sid,
            cid: cid
        }

        Axios.post(url + '/slim/dolive/get_live_list', data)
            .then(result => {
                setListItem(result.data);
            })
            .catch(error => console.log(error));
    }

    const styles = StyleSheet.create({
        wrap: { paddingRight: 20, paddingLeft: 20 },
        mt50: { marginTop: 50 },
        header: { display: "flex" },
        selfCenter: { alignSelf: "center" },
        button: { width: 200, alignItems: "center" },
        title: { fontWeight: "bold", fontSize: 18, padding: 15 },
        liveContainerLeft: { flex: 6, width: 180, padding: 10 },
        liveContainerRight: { flex: 4, width: 140, resizeMode: "cover", justifyContent: "center", backgroundColor : "#a1a1a1" },
        classContainer: { backgroundColor: '#fff', flex: 1, flexDirection: 'row', height: 150, marginBottom: 10 },
        classContainerRight: { alignSelf: 'flex-end', marginRight: 30 },
        image: { flex: 1, resizeMode: "cover", justifyContent: "center" },
        btn: { width: 80, height: 23, borderRadius: 20, backgroundColor: "#802ceb", marginTop: 40, justifyContent: "center", textAlignVertical: "center" },
        btnTxt: { fontSize: 12 },
        dateTimeTxt: { fontSize: 12, color: "#802ceb", marginTop: 30 },
        titleTxt: { fontSize: 16 },
        teacherTxt: { fontSize: 12 }
    })

    return (

        <>
            <StatusBar backgroundColor="#fff" barStyle={"dark-content"} />
            <ScrollView style={styles.wrap}>
                <View>
                    <Text style={styles.title}>LIVE</Text>
                </View>
                <LiveList horizontal={true} showsHorizontalScrollIndicator={true} pagingEnabled
                >
                    {listItem.map((item, index) => {
                        const { vseq, sdate, edate, title, teacher, image } = item;
                        var formatSdate = moment(sdate).format('YYYY/MM/DD hh:mma');

                        return (
                            <LiveItem key={index}>
                                <ListItemLeft>
                                    <Text style={styles.dateTimeTxt}>{formatSdate}</Text>
                                    <Text style={styles.titleTxt}>{title}</Text>
                                    <Text style={styles.teacherTxt}>{teacher + " 트레이너"}</Text>
                                    <Button style={styles.btn} onPress={() => btn_live_play(vseq, sdate, edate)}>
                                        <Text style={styles.btnTxt}><Icon name="play" color="white" size={12} />PLAY</Text>
                                    </Button>
                                </ListItemLeft>
                                <View>
                                    { image ? 
                                    <ImageBackground source={{ uri: image }} style={{ height:180, width:140 }} /> : null }
                                </View>
                            </LiveItem>
                        )
                    })
                    }
                </LiveList>

                <View>
                    <Text style={styles.title}>수업 다시보기</Text>
                </View>

                {categoryData.map((item, index) => {
                    return (
                        <TouchableOpacity style={styles.classContainer} onPress={() => btn_class_component(item.no)} key={index}>
                            <ImageBackground source={{ uri: item.uri }} style={styles.image}>
                                <View style={styles.classContainerRight}>
                                    <Text>{item.name}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </>
    )
}