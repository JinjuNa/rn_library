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
import VideoPlayer from 'react-native-video-controls';

export default ({ navigation }) => {

    const loadingHTML = `<div style="color:white;padding:10;"></div>`
    const store = useSelector(state => state.data);
    const [content, setContent] = useState(loadingHTML);
   
    get_basecode( {sid:store.sid,gubun:store.cid,url:store.url,name:'info_home'} )
    .then( result => {
        setContent(result[0].result);
    })
    .catch((error)=>console.log(error));    

//       const content = `
// <div style="display:flex;align-items:center;paddingTop:20">    
// <div style="width:90%; paddingTop:30">
// <video poster="http://smartfit.cache.iwinv.net/Image/smartgym_poster.jpg" src="http://karfe1.cache.iwinv.net/157233889169637.mp4" width="320" height="200"></video>
// <div style="font-size:18px; color:#ffffff;">스마트짐 <span style="color:#15ff94">구서점</span></div>
// <div style="font-size:14px; color:#b0b0b0;">영업시간 : 08:00-22:00</div> 
// <div style="font-size:14px; color:#b0b0b0;">이용문의 : 051-583-9645</div>                
// <div style="font-size:13px; color:#bcbcbc;text-align:left;paddingBottom:30; paddingTop:30">
// 스마트핏 구서점(본점)은 2011년 최초로 설립 되었습니다.
// 진정한 건강이란 무엇인가를 고민하고 연구하여 고객분들께 좋은 서비스를 제공하고자 노력하고 있습니다.
// 사람은 누구나 건강과 아름다움을 동시에 추구하기를 원합니다.<BR>
// 하지만 현대사회를 살아가는 우리의 모습은 겉으로 보여 지는 아름다움에 많이 집착하고 있는 것 같습니다.
// 그것이 나쁘다고만 말하기는 어렵지만 분명한 것은 외형적인 아름다움도 건강이 뒷받침되지 않는다면 그 아름다움도 그리 아름답게만 보이지는 않을 것입니다.
// 2011년도 대한민국 연예계의 핫 이슈 중 하나가 바로 겉으로 화려한 스타들이 이름 모를 건강악화로 고생하고 있다는 뉴스였습니다.<BR>
// 화려한 그들의 모습에 우리는 열광하지만 정작 그들은 많은 정신적 스트레스와 무리한 스케쥴, 몸짱 배우들의 이면에 있었던 내과적 질환 등으로 고통 받고 있었으며 화려한 빛 뒤의 짙은 그림자를 잘 보여주었던 이슈였습니다.<BR>
// 이처럼 아름다움과 건강은 인간이 행복한 삶을 위해 항상 같이 공유해야 할 필요충분조건으로 공유되어야 할 것으로 생각됩니다. 
// 진정한 케어와 삶의 질의 향상을 목표로 달려가는 저희 스마트핏 구서점은 고객님의 건강을 책임지겠습니다.
// </div>
// </div>
//     `;
  

    const styles = StyleSheet.create({
    })

    return (

        <>
            <ScrollView style={styles.container}>
                <HTMLView
                    html={content}
                    renderers={{
                        video: ({ src, width, height, poster }) => {
                            return (<VideoPlayer
                                key="*required*"
                                source={{ uri: src }}
                                paused={true}
                                poster={poster}
                                disableFullscreen={true}
                                disableBack={true}
                                disableVolume={true}
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