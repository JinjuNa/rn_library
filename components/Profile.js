import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import {
    View,
    Text
} from 'native-base';
import profileData from './data/profile.json';

export default ({ navigation }) => {

    const btn_select = (index) => {
        navigation.navigate('Setting', { image_index : index });
    }

    useEffect(() => {
        navigation.setOptions({title : "이미지 선택"})
    }, []);
  
    const styles = StyleSheet.create({
        wrap : {padding : 20},
        container : {flexDirection : 'row', flexWrap : 'wrap', marginTop : 20, justifyContent : 'center'},
        imageWrap : {padding : 2},
        image : {width : 75, height : 75, resizeMode : 'cover'}
    })

    return (

        <>
        <View style={styles.wrap}>
            <Text>원하는 이미지를 선택해 주세요.</Text>
            <View style={styles.container}>
            {
                profileData.map((item, index) => 
                        <TouchableOpacity key={index} style={styles.imageWrap} onPress={()=>btn_select(index)}>
                            <Image style={styles.image} source={{uri : item.image}} />
                        </TouchableOpacity>
                )
            }
            </View>
        </View>
        </>
    )
}