import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
} from 'native-base';
import CategoryBar from './CategoryBar';
import categoryData from "./data/category.json";
import Axios from 'axios';
import { format } from 'date-fns';
import moment from 'moment';

let access_token = '';
let storage = {
    categoryNum : ''
}

export default ({ navigation }) => {

    const store = useSelector(state => state.data);
    const [category, setCategory] = useState([]);
    const [listItem, setListItem] = useState([]);
    const [fileterItem, setFilterItem] = useState([]);

    const handleSelectedCategory = ( num ) => {
        setFilterItem([]);
        setCategory(num);
        storage.categoryNum = num;
        let temp_category = categoryData.find(findCategoryName);
        setFilterItem(listItem.filter(function (x) { return x.category == temp_category.name }));
    }

    const findCategoryName = (element) => {
        if(element.no == storage.categoryNum){
            return true;
        }
    }

    useEffect(()=>{
        storage.categoryNum = '1';
        loadData({ store: store });
    },[]);

    const loadData = (props) => {
        const { url, sid, cid } = props.store;
        const data = {
            sid: sid,
            cid: cid,
            access_token: access_token
        }

        Axios.post(url + '/slim/dolive/get_schedule_list', data)
            .then(result => {
                if (result.data.ret !== undefined) {
                    alert(result.data.msg);
                    return;
                }
                else {
                    setListItem(result.data);
                    let temp_category = categoryData.find(findCategoryName);
                    setFilterItem(result.data.filter(function (x) { return x.category == temp_category.name }));
                }
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
        scheduleContainer : {backgroundColor : '#fff', flex : 1, flexDirection : 'row', marginBottom : 1, paddingTop : 15, paddingBottom : 15},
        scheduleContainerLeft : {flex : 7 },
        scheduleContainerRight : {flex : 12},
        categoryItem : {padding : 30},
        dateTxt : {fontSize : 10},
        timeTxt : {fontSize : 14, fontWeight : "700"},
        titleTxt : {fontSize : 14, fontWeight : "700"},
        teacherTxt : {fontSize : 10}
    })

    return (

        <>
        <CategoryBar 
            selectedCategory = {handleSelectedCategory}
            initialCategory = {"1"}
        />
        <ScrollView style={styles.wrap}>
        {fileterItem.map((item, index) => {
            const { title, teacher, sdate } = item;
            var formatDate = moment(sdate).format('YYYY/MM/DD');
            var formatTime = moment(sdate).format('hh:mma');

            return (
                <View style={styles.scheduleContainer} key={index}>
                    <View style={styles.scheduleContainerLeft}>
                        <Text style={[styles.dateTxt, styles.selfCenter]}>{formatDate}</Text>
                        <Text style={[styles.timeTxt, styles.selfCenter]}>{formatTime}</Text>
                    </View>
                    <View style={styles.scheduleContainerRight}>
                        <Text style={styles.titleTxt}>{title}</Text>
                        <Text style={styles.teacherTxt}>{teacher+ " 트레이너"}</Text>
                    </View>
                </View>
            )
        })}
        </ScrollView>
        </>
    )
}