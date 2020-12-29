import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
// import { WebView } from 'react-native-webview';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryBar from './CategoryBar';
import Axios from 'axios';
import bookData from "./data/book.json";

let storage = {
    categoryNum : ''
}

export default ({ navigation }) => {

    const [category, setCategory] = useState([]);
    const [listItem, setListItem] = useState([]);
    const [fileterItem, setFilterItem] = useState([]);

    const handleSelectedCategory = ( num ) => {
        setFilterItem([]);
        setCategory(num);
        storage.categoryNum = num;
        setFilterItem(listItem.filter(function (x) { return x.cid == storage.categoryNum }));
    }

    const btn_book_detail = (id) => {
        navigation.navigate('BookDetail', {id : id});   // 로그인
    }

    useEffect(()=>{
        navigation.setOptions({title : "독서리스트"})
        storage.categoryNum = '1';
        loadData();
    },[]);

    const loadData = () => {
        const url = "http://localhost:3000";
        console.log("Screen1 loadData");
        Axios.get(url + '/toy/categoryBook/1')
            .then(result => {
                setListItem(result.data);
                setFilterItem(result.data.filter(function (x) { return x.cid == storage.categoryNum  }));
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
        scheduleContainer : {backgroundColor : '#fff', flex : 1, flexDirection : 'row', marginBottom : 1, padding : 15},
        scheduleContainerLeft : {flex : 8 },
        scheduleContainerRight : {flex : 1, justifyContent : "center"},
        categoryItem : {padding : 30},
        dateTxt : {fontSize : 10},
        timeTxt : {fontSize : 14, fontWeight : "700"},
        titleTxt : {fontSize : 14, fontWeight : "700"},
        teacherTxt : {fontSize : 10},
        authorTxt : {fontSize : 12, color : "#999"},
        star : {alignSelf : "center", color : "#ffd400"},
        bottomView : {height : 20}
    })

    return (
        <>
        <StatusBar backgroundColor="#111111" barStyle={"light-content"} />
        <CategoryBar 
            selectedCategory = {handleSelectedCategory}
            initialCategory = {"1"}
        />
        <ScrollView style={styles.wrap}>
        {bookData.map((item, index) => {
            const { id, title, author, star, publisher } = item;
            return (
                <TouchableOpacity style={styles.scheduleContainer} key={index} activeOpacity={0.8} onPress={()=>btn_book_detail(id)}>
                    <View style={styles.scheduleContainerLeft}>
                        <Text style={styles.titleTxt}>{title}</Text>
                        <Text style={styles.authorTxt}>{author} / {publisher}</Text>
                    </View>
                    <View style={styles.scheduleContainerRight}>
                        {
                            star == "Y" ?
                            <Icon type="MaterialCommunityIcons" name="star" size={20} style={styles.star}/>
                            : null
                        }
                    </View>
                </TouchableOpacity>
            )
        })}
        <View style={styles.bottomView}></View>
        </ScrollView>
        <View style={styles.bottomView}></View>
        </>
    )
}