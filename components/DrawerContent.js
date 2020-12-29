import { HeaderBackground } from '@react-navigation/stack';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f4f4f2"
    },
    header: {
        backgroundColor: "#1aea8c",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 50
    },
    odd: {
        backgroundColor: "#e6e6e6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15
    },
    even: {
        backgroundColor: "#f4f4f2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15
    },
    content: {
        width: "85%",
    },
    menu_font: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600"
    },
    item_font: {
        color: "#000000",
        fontSize: 16
    },
    border: {
        borderColor: "gray",
        borderWidth: 1
    },
    border_bottom: {
        borderBottomColor: "#d5d5d3",
        borderBottomWidth: 1
    }
})

export default ({ navigation, route }) => {

    const { name } = useSelector(state => state.data);
    const open_center_info = () => {
        navigation.navigate('InfoNavigator');
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <View style={styles.content}>
                        <Text style={styles.menu_font}>{name}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={()=>open_center_info()}>
                    <View style={[styles.odd, styles.border_bottom]}>
                        <View style={styles.content}>
                            <Text style={styles.item_font}>센터소개</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                    {/* <View style={[styles.even, styles.border_bottom]}>
                        <View style={styles.content}>
                            <Text style={styles.item_font}>센터소개</Text>
                        </View>
                    </View> */}
                </View>
            </View>
        </View>
    );
}
