import React, {useState, useEffect} from "react";
import { TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key,
    get_basecode,
    getIsLogin
} from '../lib/Function';
import {
    View,
    Text
} from 'native-base';
import categoryData from "./data/category.json";
import Axios from 'axios';

let access_token = '';

export default () => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState('');
    const [listItem, setListItem] = useState([]);
    const [count, setCount] = useState('');
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
        const { url, sid, cid } = props.store;
        const data = {
            sid: sid,
            cid: cid,
            access_token : access_token
        }

        Axios.post(url + '/slim/dolive/get_category_statistics', data)
            .then(result => {
                setListItem(result.data);
            })
            .catch(error => console.log(error));

        Axios.post(url + '/slim/dolive/get_statistics_count', data)
            .then(result => {
                setCount(result.data[0].cnt);
            })
            .catch(error => console.log(error));
    }

    const styles = StyleSheet.create({
        mt50 : {marginTop : 50},
        header : {display : "flex"},
        selfCenter : {alignSelf : "center"},
        button : {width : 200, alignItems : "center"},
        title : {fontWeight : "bold", fontSize : 18, padding : 10},
        categoryWrap : { marginRight : "auto", marginLeft : "auto"},
        categoryItem : {padding : 7, textAlign : "center"},
        categoryImage : {width : 55, height : 55, resizeMode : "contain"},
        categoryTxt : {fontSize : 10, alignSelf : "center", marginTop : 5},
        activeTxt : {color : "#802ceb"},
        num : {color : "#802ceb", fontSize : 15},
        statisticsTxt : {color : "#878787", padding : 20 },
        statisticsNum : {fontWeight : "700"}
    })


    return (
        <>
        <Text style={[styles.statisticsTxt, styles.selfCenter]}>운동통계 <Text style={styles.statisticsNum}>{count}</Text></Text>
        <View style={styles.wrap}>
        <View style={styles.categoryWrap}>
            <ScrollView 
                style={{ marginBottom: 20 }}
                horizontal
                bounces={false}
            >
            {listItem.map((item, index)=> {
                let temp_category = categoryData[index];
                return (
                    <View key={index}>
                        <View style={styles.categoryItem}>
                            <Image source={{uri : temp_category.menuImage}} style={styles.categoryImage}/>
                            <Text style={styles.categoryTxt}>
                                {temp_category.name}
                            </Text>
                            <Text style={[styles.num, styles.selfCenter]}>
                                {item.num ? item.num : 0}
                            </Text>
                        </View>
                    </View>
                )
            })}
            </ScrollView> 
        </View>
        </View>
        </>
    )
}