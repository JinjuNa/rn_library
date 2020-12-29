import React, { useState, useEffect } from "react";
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar, TextInput, KeyboardAvoidingView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    getIsLogin
} from '../lib/Function';
import {
    View,
    Text,
    Button,
    Input,
    Item,
    Content
} from 'native-base';
import Axios from 'axios';
import profileData from './data/profile.json';

let access_token = '';
const profile_sample = "https://api.smartg.kr/upload/images/profile_sample.jpg";
let profile = profile_sample;

export default ({ route, navigation }) => {

    const store = useSelector(state => state.data);
    const [isLogin, setIsLogin] = useState('');
    const [mode, setMode] = useState('view');
    const [myInfo, setMyInfo] = useState([]);
    const [profileImage, setProfileImage] = useState(profile_sample);
    const [nick, setNick] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [birthYear, setBirthYear] = useState('');

    const btn_profile = () => {
        navigation.navigate('Profile');
    }

    const btn_go_edit = () => {
        setMode('edit')
    }

    const btn_submit = (props) => {
        const { url, sid } = props.store;
        const data = {
            url: url,
            sid: sid,
            access_token : access_token,
            photo : profileImage,
            nick : nick,
            birth_year : birthYear,
            weight : weight,
            height : height
        }

        Axios.post(url + '/slim/dolive/edit_my_info', data)
            .then(result => {
                loadData({ store: store })
                alert('수정되었습니다.')
                setMode('view');
            })
            .catch(error => console.log(error));
        
    }
    
    useEffect(() => {
        getIsLogin(store.url, store.sid)
            .then(result => {
                setIsLogin(result);
                return get_access_token();
            })
            .then(result => {
                access_token = result;
                return loadData({ store: store });
            })
            .catch(error => alert(error));
    }, []);

    const loadData = (props) => {
        const { url, sid } = props.store;
        const data = {
            url: url,
            sid: sid,
            access_token : access_token
        }

        Axios.post(url + '/slim/dolive/get_my_info', data)
            .then(result => {
                setMyInfo(result.data[0]);
                if(result.data[0].photo){
                    setProfileImage(result.data[0].photo);
                    // profile = result.data[0].photo;
                }
                setNick(result.data[0].nick);
                setBirthYear(result.data[0].birth_year);
                setWeight(result.data[0].weight);
                setHeight(result.data[0].height);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        navigation.setOptions({title : "회원정보"})
    }, []);

    useEffect(() => {
        if(route.params){
            let image_index = route.params.image_index;
            setProfileImage(profileData[image_index].image)
        }
    }, [route.params]);

    const styles = StyleSheet.create({
        wrap : {padding : 20},
        selfCenter : {alignSelf : "center"},
        myInfoTxt : { fontSize : 16, paddingBottom : 20, paddingLeft : 20},
        myInfoImageWrap : {width : 85, height : 85, borderRadius : 100, overflow : "hidden", alignSelf : "center"},
        myInfoImage : {width : 85, height : 85, resizeMode : "cover"},
        editTxtWrap : {backgroundColor : "#00000050", height : 22, marginTop: -22, justifyContent: "center", alignSelf: "stretch", textAlignVertical: "center"},
        editTxt : { color : "#fff", alignSelf : "center", fontSize : 10},
        myInfoNameTxt : {alignSelf : "center", paddingTop : 10, paddingBottom : 20},
        myInfoItemWrap : {backgroundColor : "#fff", marginBottom : 2, flexDirection : 'row', padding: 15, justifyContent : "space-between"},
        input : { color : "#a5a5a5", height : 18, padding : 0, textAlign : 'right'},
        textInput : { color : "#000000", width : 100},
        btn : {width : "80%", alignSelf : "center", justifyContent: "center", textAlignVertical: "center", borderRadius : 100, marginBottom : 30, backgroundColor : "#802ceb"},
    })

    return (

        <>
        <KeyboardAvoidingView
                behavior={undefined}
                style={{ flex: 1 }}
        >
        <View style={styles.wrap}>
        <ScrollView bounces={false}>
        <View>
            <Text style={styles.myInfoTxt}>나의정보</Text>
        </View>
        <View>
            {
                mode === 'view' ?
                <View style={styles.myInfoImageWrap}>
                    <Image source={{uri : profileImage }} style={styles.myInfoImage}/>
                </View>
                :
                <TouchableOpacity style={styles.myInfoImageWrap} onPress={()=> btn_profile()}>
                    <Image source={{uri : profileImage }} style={styles.myInfoImage}/>
                    <View style={styles.editTxtWrap}>
                        <Text style={styles.editTxt}>편집</Text>
                    </View>
                </TouchableOpacity>
            }
            
            <View style={styles.myInfoNameWrap}>
                <Text style={styles.myInfoNameTxt}>{myInfo.name}</Text>
            </View>
        </View>
        <View>
        <View>
            <View style={styles.myInfoItemWrap}>
                <View>
                    <Text>닉네임</Text>
                </View>
                {
                    mode === 'view' ?
                    <Input style={styles.input} disabled={true}>{nick}</Input> :
                    <Input 
                        style={[styles.input, styles.textInput]}
                        onChange={(e) => setNick(e.nativeEvent.text)}
                        value={nick}
                        autoFocus={true}
                    ></Input>
                }
            </View>
        </View>
        <View>
            <View style={styles.myInfoItemWrap}>
                <View>
                    <Text>출생연도</Text>
                </View>
                {
                    mode === 'view' ?
                    <Input style={styles.input} disabled={true}>{birthYear + " 년"}</Input> :
                    <Input 
                        style={[styles.input, styles.textInput]}
                        onChange={(e) => setBirthYear(e.nativeEvent.text)}
                        value={birthYear}
                        keyboardType={'numeric'}
                        autoFocus={true}
                    ></Input>
                }
            </View>
        </View>
        <View>
            <View style={styles.myInfoItemWrap}>
                <View>
                    <Text>몸무게</Text>
                </View>
                {
                    mode === 'view' ?
                    <Input style={styles.input} disabled={true}>{weight + " kg"}</Input> :
                    <Input 
                        style={[styles.input, styles.textInput]}
                        onChange={(e) => setWeight(e.nativeEvent.text)}
                        value={weight}
                        keyboardType={'numeric'}
                        autoFocus={true}
                    ></Input>
                }
            </View>
        </View>
        <View>
            <View style={styles.myInfoItemWrap}>
                <View>
                    <Text>키</Text>
                </View>
                {
                    mode === 'view' ?
                    <Input style={styles.input} disabled={true}>{height + " cm"}</Input> :
                    <Input 
                        style={[styles.input, styles.textInput]}
                        onChange={(e) => setHeight(e.nativeEvent.text)}
                        value={height}
                        keyboardType={'numeric'}
                        autoFocus={true}
                    ></Input>
                }
            </View>
        </View>
        <View style={{ flex : 1 }} />
        </View>
        </ScrollView>
        </View>
        {
            mode === 'view' ?
            <Button style={styles.btn} onPress={() => btn_go_edit()}><Text>수정하기</Text></Button> :
            <Button style={styles.btn} onPress={() => btn_submit({ store: store })}><Text>완료</Text></Button>
        }
        </KeyboardAvoidingView>
        </>
    )
}