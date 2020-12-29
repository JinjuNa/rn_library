import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar,
    ImageBackground
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
} from 'native-base';
import CategoryBar from './CategoryBar';
import categoryData from "./data/category.json";
import Axios from 'axios';
import moment from 'moment';

let storage = {
    categoryNum : ''
}
var totalCount = 0; //총 강의수

export default ({ route, navigation }) => {
    
    const store = useSelector(state => state.data);
    const [category, setCategory] = useState(route.params.category);
    const [listItem, setListItem] = useState([]);

    const btn_class_detail = (vseq) => {
        navigation.navigate('ClassDetail', {vseq : vseq});   // 클래스 네비게이터
    }

    const handleSelectedCategory = ( num ) => {
        setListItem([]);
        setCategory(num);
        storage.categoryNum = num;
        loadData({ store: store });
    }

    const findCategoryName = (element) => {
        if(element.no == storage.categoryNum){
            return true;
        }
    }

    useEffect(()=>{
        storage.categoryNum = route.params.category;
        loadData({ store: store });
    },[]);

    const loadData = (props) => {
        const { url, sid, cid } = props.store;
        const temp_category = categoryData.find(findCategoryName);
        const data = {
            sid: sid,
            cid: cid,
            category : temp_category.name
        }

        Axios.post(url + '/slim/dolive/get_vod_list', data)
            .then(result => {
                totalCount = result.data.length;
                setListItem(result.data);
            })
            .catch(error => console.log(error));
    }
    
    const styles = StyleSheet.create({
        wrap : {padding : 20},
        mt50 : {marginTop : 50},
        header : {display : "flex"},
        selfCenter : {alignSelf : "center"},
        button : {width : 200, alignItems : "center"},
        title : {fontWeight : "bold", fontSize : 18, paddingLeft : 20, paddingBottom : 35},
        classContainer : {flex : 1, height : 180, backgroundColor : "#00000080"},
        classBg : {resizeMode: "cover", justifyContent: "center", marginBottom : 15},
        classView : {padding : 10, color : "#fff", flex: 1, justifyContent : "flex-end"},
        titleTxt : {fontSize : 17, color : "#fff"},
        teacherTxt : {fontSize : 12, color : "#fff"},
        dateTimeTxt : {fontSize : 10, color : "#fff", marginTop : 8},
        bottomView : {height : 20}
    })

    return (
        <>
        <CategoryBar 
            selectedCategory = {handleSelectedCategory}
            initialCategory = {category}
        />
        <ScrollView style={styles.wrap}>
            {
                (totalCount == 0) && <Text>강의정보가 존재하지 않습니다.</Text>

            }
            {listItem.map((item, index) => {
                const { vseq, title, teacher, sdate, image } = item;
                var formatSdate = moment(sdate).format('YYYY/MM/DD hh:mma');
                return (
                <ImageBackground source={{uri : image}} style={styles.classBg} key={index}>
                <TouchableOpacity style={styles.classContainer} onPress={() => btn_class_detail(vseq)}>
                    <View style={styles.classView}>
                    <Text style={styles.titleTxt}>{title}</Text>
                    <Text style={styles.teacherTxt}>{teacher + " 트레이너"}</Text>
                    <Text style={styles.dateTimeTxt}>{formatSdate}</Text>
                    </View>
                </TouchableOpacity>
                </ImageBackground>
                )
            })
            }
            <View style={styles.bottomView}></View>
        </ScrollView>
        <View style={styles.bottomView}></View>
        </>
    )
}