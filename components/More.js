import React, { useState } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar, Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    Button
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default ({ navigation }) => {

    const store = useSelector(state => state.data);

    const btn_membership = () => {
        navigation.navigate('Membership');
    }

    const btn_setting = () => {
        navigation.navigate('Setting');
    }

    const btn_logout = () => {
        console.log('TAG: btn_logout()');
        AsyncStorage.setItem('access_token', '')
            .then(() => { return AsyncStorage.setItem('refresh_token', '') })
            .then(() => AsyncStorage.setItem('pin', ''))
            .then(() => navigation.replace('MainScreen'))
            .catch(error => alert(error));
    }
    
    const styles = StyleSheet.create({
        wrap : {padding : 20},
        selfCenter : {alignSelf : "center"},
        moreTxt : { fontSize : 16, paddingBottom : 20, paddingLeft : 20},
        moreItemWrap : {backgroundColor : "#fff", marginBottom : 2, flexDirection : 'row', padding: 10},
        moreItemTxt : {lineHeight : 24, marginLeft : 10}
    })

    return (
        <>
        <View style={styles.wrap}>
        <View>
            <Text style={styles.moreTxt}>내계정</Text>
        </View>
        <View>
            {
                Platform.OS === 'ios' ? null :
                <TouchableOpacity style={styles.moreItemWrap} onPress={() => btn_membership()}>
                    <View style={styles.moreItemLeft}>
                        <Icon name="star-outline" size={24} />
                    </View>
                    <View style={styles.moreItemRight}>
                        <Text style={styles.moreItemTxt}>맴버십</Text>
                    </View>
                </TouchableOpacity>
            }
            <TouchableOpacity style={styles.moreItemWrap} onPress={() => btn_setting()}>
                <View style={styles.moreItemLeft}>
                    <Icon name="settings" size={24} />
                </View>
                <View style={styles.moreItemRight}>
                    <Text style={styles.moreItemTxt}>회원정보</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreItemWrap} onPress={() => btn_logout()}>
                <View style={styles.moreItemLeft}>
                    <Icon name="logout" size={24} />
                </View>
                <View style={styles.moreItemRight}>
                    <Text style={styles.moreItemTxt}>로그아웃</Text>
                </View>
            </TouchableOpacity>
        </View>
        </View>
        </>
    )
}