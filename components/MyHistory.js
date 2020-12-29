import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    getIsLogin
} from '../lib/Function';
import {
    View,
    Text
} from 'native-base';
import Axios from 'axios';
import moment from 'moment';

// let totalCount = 0;

export default ({ navigation }) => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState('');
    const [listItem, setListItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩

    useEffect(() => {
        getIsLogin(store.url, store.sid)
            .then(result => {
                setIsLogin(result);
                return get_access_token();
            })
            .then(result => {
                access_token = result;
                return loadData({ store: store });
            })
            .catch(error => alert(error));
    }, []);

    const loadData = (props) => {
        const { url, sid } = props.store;
        const data = {
            url: url,
            sid: sid,
            access_token : access_token
        }

        Axios.post(url + '/slim/dolive/get_history', data)
            .then(result => {
                // totalCount = result.data.length;
                setListItem(result.data);
            })
            .catch(error => console.log(error));
    }

    const styles = StyleSheet.create({
        wrap : {padding : 20},
        selfCenter : {alignSelf : "center"},
        historyTxt : { fontSize : 16, paddingBottom : 20, paddingLeft : 20},
        historyItemWrap : {backgroundColor : "#fff", marginBottom : 2, flexDirection : 'row'},
        historyItemLeft : {width : 125, padding : 10},
        historyItemRight : {padding : 15},
        historyItemImage : {width : 53, height : 53, borderRadius : 100, resizeMode : "cover", alignSelf : "center", backgroundColor : "#efefef"},
        historyTitleTxt : {fontSize : 12, fontWeight : "700"},
        historyTeacherTxt : {fontSize : 10, paddingTop : 3, paddingBottom : 3},
        historyDateTxt : {fontSize : 10, color : "#a5a5a5" },
        bottomView : {height : 20}
    })

    return (
        <>
        <View style={styles.wrap}>
        <View>
            <Text style={styles.historyTxt}>히스토리</Text>
        </View>
        <ScrollView>
            {
                listItem.map((item, index) => {
                    const {title, teacher, regdate, image } = item;
                    var formatRegdate = moment(regdate).format('YYYY/MM/DD hh:mma');
                    
                    return (
                    <View style={styles.historyItemWrap} key={index}>
                        <View style={styles.historyItemLeft}>
                            {
                                image ? <Image source={{uri : image}} style={styles.historyItemImage} />
                                : <View style={styles.historyItemImage}/>
                            }
                        </View>
                        <View style={styles.historyItemRight}>
                            <Text style={styles.historyTitleTxt}>{title}</Text>
                            <Text style={styles.historyTeacherTxt}>{teacher + " 트레이너"}</Text>
                            <Text style={styles.historyDateTxt}>{formatRegdate}</Text>
                        </View>
                    </View>
                    )
                })
            }
            <View style={styles.bottomView}></View>
        </ScrollView>
        </View>
        </>
    )
}