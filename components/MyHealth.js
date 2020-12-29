import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    getIsLogin
} from '../lib/Function';
import {
    View,
    Text
} from 'native-base';
import CategoryStatistics from './CategoryStatistics';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment';

LocaleConfig.locales['ko'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
    dayNamesShort: ['일', '월','화','수','목','금','토'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'ko';

const ArrowLeft = () => {
    return (
        <View>
            <Text>
                <Icon name="arrow-left" style={{ fontSize: 30, color: "gray" }}></Icon>
            </Text>
        </View>
    )
}

const ArrowRight = () => {
    return (
        <View>
            <Text>
                <Icon name="arrow-right" style={{ fontSize: 30, color: "gray" }}></Icon>
            </Text>
        </View>
    )
}

let access_token = '';
const profile_sample = "https://api.smartg.kr/upload/images/profile_sample.jpg";
let profileImage = profile_sample;
let isToken = false;

export default ({ navigation }) => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState('');
    const [listItem, setListItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩
    const [markedDays, setMarkedDays] = useState([]);
    const [myInfo, setMyInfo] = useState([]);
    const today = moment().format('YYYY-MM-DD');

    let mark = {};

    markedDays.forEach(day => {
        mark[day['tdate']] = {marked: true, dotColor: '#802ceb', activeOpacity: 0}
    })
    mark[today] = {selected: true, selectedColor : '#802ceb', dotColor: '#802ceb'};

    const loadData = (props) => {
        const { url, sid } = props.store;
        const data = {
            url: url,
            sid: sid,
            access_token : access_token
        }

        Axios.post(url + '/slim/dolive/get_calender', data)
            .then(result => {
                setMarkedDays(result.data);
            })
            .catch(error => console.log(error));

            Axios.post(url + '/slim/dolive/get_my_info', data)
            .then(result => {
                if(result.data[0].photo){
                    profileImage = result.data[0].photo;
                }
                setMyInfo(result.data[0]);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        profileImage = profile_sample;
        getIsLogin(store.url, store.sid)
            .then(result => {
                setIsLogin(result);
                return get_access_token();
            })
            .then(result => {
                access_token = result;
                isToken = true;
                return loadData({ store: store });
            })
            .catch(error => alert(error));
    }, []);

    useEffect(() => {
        const refresh = navigation.addListener('focus', () => {
            if(isToken){
                loadData({ store: store });
            }
        });
        return refresh;
    }, [navigation]);

  

    const styles = StyleSheet.create({
        wrap : {padding : 20},
        selfCenter : {alignSelf : "center"},
        btn : {width : "100%", justifyContent: "center", alignSelf: "stretch", textAlignVertical: "center"},
        profileImage : {width : 85, height : 85, resizeMode : "cover", alignSelf: "center", borderRadius : 100, marginBottom : 15},
        profileWrap : {padding : 30},
        calendarWrap : {backgroundColor : "white", paddingTop : 30, paddingBottom : 30 },
        calendarTitle : {color : "#878787"},
        calendarTitleWrap : {},
    })

    return (

        <>
        <ScrollView>
        <View style={styles.profileWrap}>
            <Image source={{uri : profileImage}} style={styles.profileImage} />
            {/* <Text style={styles.selfCenter}>{listItem.nick}</Text> */}
            <Text style={styles.selfCenter}>{myInfo.nick}</Text>
        </View>
        <View style={styles.calendarWrap}>
        <View style={styles.calendarTitleWrap}>
            <Text style={[styles.selfCenter, styles.calendarTitle]}>이달의 운동</Text>
        </View>
        <Calendar
        // Initially visible month. Default = Date()
        // current={'2020-11-19'}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        // minDate={'2020-09-01'}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        // maxDate={'2020-11-20'}
        // Handler which gets executed on day press. Default = undefined
        // onDayPress={(day) => {console.log('selected day', day)}}
        // Handler which gets executed on day long press. Default = undefined
        // onDayLongPress={(day) => {console.log('selected day', day)}}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy년 MM월'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        // onMonthChange={(month) => {console.log('month changed', month)}}
        // Hide month navigation arrows. Default = false
        // hideArrows={true}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        renderArrow={(direction) => direction === 'left' ? <ArrowLeft /> : <ArrowRight />}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange={true}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        // firstDay={1}
        // Hide day names. Default = false
        hideDayNames={false}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        // onPressArrowLeft={substractMonth => substractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        // onPressArrowRight={addMonth => addMonth()}
        // Disable left arrow. Default = false
        // disableArrowLeft={true}
        // Disable right arrow. Default = false
        // disableArrowRight={true}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={true}
        /** Replace default month and year title with custom one. the function receive a date as parameter. */
        //renderHeader={(date) => {/*Return JSX*/}}
        // markedDates={{
        //     // '2020-11-01': {selected: true, marked: true, selectedColor: 'blue'},
        //     '2020-11-08': {marked: true, dotColor: '#802ceb', activeOpacity: 0},
        //     '2020-11-24': {marked: true, dotColor: '#802ceb', activeOpacity: 0},
        //     [today]: {selected: true, selectedColor : '#802ceb'},
        //   }}
        markedDates = {mark}
        />
        </View>
        <View>
            <CategoryStatistics />
        </View>
        </ScrollView>
        </>
    )
}