import React, { useState } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key,
    get_basecode
} from '../lib/Function';
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
import { $Header } from './$Header';
import HTMLVideo from 'react-native-video'
import HTMLView from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils'

export default ({ navigation }) => {

    const loadingHTML = `<div style="color:white;padding:10;"></div>`
    const store = useSelector(state => state.data);
    const [content, setContent] = useState(loadingHTML);
    get_basecode( {sid:store.sid,gubun:store.cid,url:store.url,name:'info_trainer'} )
    .then( result => {
        setContent(result[0].result);
    })
    .catch((error)=>console.log(error));    

    const styles = StyleSheet.create({
        container:{backgroundColor:"#111111"}
    })

    return (
        <>
            <ScrollView style={styles.container}>
                <HTMLView
                    html={content}
                    renderers={{
                        video: ({ src, width, height, poster }) => {
                            return (<HTMLVideo
                                key="*required*"
                                source={{ uri: src }}
                                controls={true}
                                paused={true}
                                poster={poster}
                                style={{ width: parseInt(width), height: parseInt(height) }}
                            />)
                        }
                    }}
                    ignoredTags={IGNORED_TAGS.filter(tag => tag !== 'video')}
                />
            </ScrollView>
        </>
    )
}