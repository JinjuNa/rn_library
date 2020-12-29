import React, { useState, useEffect, useCallback } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar, ImageBackground
} from 'react-native';
import {
    View,
    Text,
    Button
} from 'native-base';
import Axios from 'axios';
import bookData from "./data/book.json";

export default ({ route, navigation }) => {

    const [listItem, setListItem] = useState([]);
    let id = route.params.id;

    const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);

    const loadData = (props) => {
        const url = "http://localhost:3000";

        Axios.get(url + '/toy/book/'+id)
            .then(result => {
                setListItem(result.data);
            })
            .catch(error => console.log(error));
    }

    useEffect(()=>{
        navigation.setOptions({title : "상세정보"})
        // loadData();
    },[]);
  

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
        titleTxt : {fontSize : 24, color : "#111", fontWeight : "700"},
        teacherTxt : {fontSize : 12, color : "#fff"},
        dateTimeTxt : {fontSize : 10, color : "#fff", marginTop : 8},
        detailTopWrap : {flexDirection : 'row', justifyContent : "center", padding : 20},
        detailContent : {width : 90, padding : 5 },
        detailTitleTxt : {alignSelf : "center", marginBottom : 20, fontSize : 12},
        contentTxt : {fontSize : 18, color : "#999"},
        borderRight : { borderRightWidth : 1, borderRightColor : "#a9a9a9" },
        imageContainer : { justifyContent : "center", alignItems : "center" },
        txtContainer : {marginTop : 20}
    })

    let idx = id-1;
    let bookItem = bookData[idx];
    let url = "http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788956054612&orderClick=LAG&Kc=";

    return (
        <>
        <View>

        </View>
        <ScrollView style={styles.wrap}>
            <View>
                <View style={styles.imageContainer}>
                    <Image source={require('./images/bookimg.jpg')} />
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.titleTxt}>{bookItem.title}</Text>
                    <Text style={styles.contentTxt}>{"저자 : "+bookItem.author}</Text>
                    <Text style={styles.contentTxt}>{"출판사 : "+bookItem.publisher}</Text>
                    <Text style={styles.contentTxt}>{"메모 : "+bookItem.memo}</Text>
                </View>
            </View>
        </ScrollView>
        <Button style={styles.btn} onPress={() => handlePress(url)}><Text>교보문고 이동하기</Text></Button>
        </>
    )
}