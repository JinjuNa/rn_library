import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View,
    ScrollView,
    SafeAreaView,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    Dimensions,
    Platform,
    NativeModules,
    NativeEventEmitter,
    PermissionsAndroid
} from 'react-native';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key,
    get_basecode,
    getIsLogin,
    decode_access_token,
    get_member_one
} from '../lib/Function';
import Axios from 'axios';
import styled from 'styled-components/native';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BleManager from 'react-native-ble-manager';
import { NodePlayerView } from 'react-native-nodemediaclient';
import KeepAwake from 'react-native-keep-awake';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import Timer from 'react-native-timer';
// import Video from "react-native-video";

const window = Dimensions.get('window');
let temp_height = window.height;
if(window.width < window.height){
    temp_height = window.width;
}
const height1 = Platform.OS === "ios" ? temp_height : temp_height - 22;
const profile_sample = "https://api.smartg.kr/upload/images/profile_sample.jpg";

const styles = StyleSheet.create({
    wrap: { padding: 20, height: height1 },
    mt10: { marginTop: 10 },
    header: { display: "flex" },
    selfCenter: { alignSelf: "center" },
    button: { width: "100%", borderRadius: 50, height: 50, justifyContent: "center", alignSelf: "stretch", textAlignVertical: "center" },
    logo: { width: 220, height: 65, resizeMode: "contain", marginTop: "45%", marginBottom: 15 },
    titleTxt: { color: "#fff", fontSize: 12 },
    button1: { backgroundColor: "#fff" },
    button2: { backgroundColor: "transparent", borderColor: "#fff", borderWidth: 1 },
    buttonWrap: { position: "absolute", left: 50, right: 50, bottom: "15%", alignItems: "stretch" },
    button1Txt: { color: "#000" },
    itemWrap: {
        padding: 5,
        backgroundColor: "#00000095",
        marginBottom: 1,
        flexDirection : 'row'
    },
    itemLeftWrap : {
        justifyContent : "space-between",
    },
    itemRightWrap : {
        justifyContent : "space-between"
    },
    itemRightTopWrap : {
        flexDirection : 'row',
        justifyContent : "space-between",
    },
    itemRightMiddleWrap : {

    },
    itemRightBottomWrap : {
        flexDirection : 'row',
        justifyContent : "space-between",
    },
    itemImage: { width: 30, height: 30, resizeMode: "cover", borderRadius: 50, margin: 5 },
    iconImage: { width: 10, height : 10, resizeMode: "contain"},
    lineHeight: { fontSize: 10, lineHeight : 20, alignSelf : 'center'},
    nameTxt: { color: "#fff", width : 42},
    pointTxt: { color: "#fff000", width : 14},
    calTxt: { color: "#fff", fontSize: 9 },
    calNum: { color: "#fff", fontWeight: "700", fontSize: 9 },
    pointWrap : {flexDirection : 'row'},
    myItem: { backgroundColor: '#7f791d95' },
    gradeTxt: { fontSize: 9, color: "#fff", alignSelf: "center", marginTop: -3 },
    heartBarWrap: { flexDirection: 'row' },
    heartBar: { width: 13, height: 5, marginRight: 1 },
    heartBar0: { backgroundColor: "gray" },
    heartBar1: { backgroundColor: "#4ec6bd" },
    heartBar2: { backgroundColor: "#adf71a" },
    heartBar3: { backgroundColor: "#d2da13" },
    heartBar4: { backgroundColor: "#daa413" },
    heartBar5: { backgroundColor: "#da2a13" },
    heartTxt: { color: "#fff", fontSize: 9 },
    leftSection: { width: 70, justifyContent: 'flex-end', alignItems: "center", marginTop: height1 / 2 - 20 },
    bandIconWrap: { width: 40, height: 40, backgroundColor: "#00000080", borderRadius: 100, justifyContent: "center" },
    bandPopupWrap: { position: "absolute", top: 80, left: "50%", width: 250, marginLeft: -125, padding: 15, shadowColor: "#000",shadowOffset: {width: 0,height: 4,},shadowOpacity: 0.30,shadowRadius: 4.65,elevation: 8,},
    bandPopupTopWrap: { flexDirection: 'row', justifyContent: "space-between" },
    bandScrollWrap: { height: 150 },
    bandItem: { flexDirection: 'row', justifyContent: "space-between", padding: 5 },
    btn: { width: 80, height: 23, borderRadius: 20, backgroundColor: "#802ceb", justifyContent: "center", },
    btnTxt: { fontSize: 12 },
    bandCloseIcon: { width: 30, height: 30 },
    video: {
        height: height1,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0,
        backgroundColor: "#111"
    }
});

const ConnectButton = styled.TouchableHighlight`
    width:77px;
    background-color:#802ceb;
    border-radius: 16px;
    height:25px;
    padding-bottom:2px;
    align-items:center;
    justify-content:center;
`;

const ConnectButtonText = styled.Text`
    font-size:12px;
    color:white;
`;

const RightSection = styled(View)`
    position : absolute;
    top : 0;
    right : 0;
    z-index : 1;
    height : ${height1 - 65 + 'px'};
`;

const RightScrollView = styled(ScrollView)`    
`;

const MeContainer = styled.View`      
    position: absolute;
    right:0;
    bottom:0;    
`;

const OthersContainer = styled.View`

`;

const BandPopupWarp = styled.View`
    z-index : 10;
    border-radius: 5px;
    background-color: #ffffff;
    /* background-color: #a1a1a195; */
`;

const BandItem = styled.View`
    align-items:center;
`

const VideoContainer = styled(NodePlayerView)`
    background:#000;
    height:100%;
    z-index:0;
`;

const HeartRange = (props) => {
    const heartRange = props.heartRange + '';
    if (heartRange === "1") {
        return <>
            <View style={[styles.heartBar, styles.heartBar1]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
        </>
    } else if (heartRange === "2") {
        return <>
            <View style={[styles.heartBar, styles.heartBar1]}></View>
            <View style={[styles.heartBar, styles.heartBar2]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
        </>
    } else if (heartRange === "3") {
        return <>
            <View style={[styles.heartBar, styles.heartBar1]}></View>
            <View style={[styles.heartBar, styles.heartBar2]}></View>
            <View style={[styles.heartBar, styles.heartBar3]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
        </>
    } else if (heartRange === "4") {
        return <>
            <View style={[styles.heartBar, styles.heartBar1]}></View>
            <View style={[styles.heartBar, styles.heartBar2]}></View>
            <View style={[styles.heartBar, styles.heartBar3]}></View>
            <View style={[styles.heartBar, styles.heartBar4]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
        </>
    } else if (heartRange === "5") {
        return <>
            <View style={[styles.heartBar, styles.heartBar1]}></View>
            <View style={[styles.heartBar, styles.heartBar2]}></View>
            <View style={[styles.heartBar, styles.heartBar3]}></View>
            <View style={[styles.heartBar, styles.heartBar4]}></View>
            <View style={[styles.heartBar, styles.heartBar5]}></View>
        </>
    } else {
        return <>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
            <View style={[styles.heartBar, styles.heartBar0]}></View>
        </>
    }
}

const LeftSection = styled.View`
    position: absolute;
    width:70px;
    align-items:center;
    margin-top:140px;
`

const bandIconWrap = styled.TouchableOpacity`
`;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class Player extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            peripheral: '',
            is_loading: true,
            player: {
                name: '',                
                h_range: '0',
                cal: '0',
                id: 'x',
                point: '0',
                photo: '',
                point_count: '0',
                hr:'0'
            },          
            player_point_count:0,
            players: [],
            room: '',
            video_url: '',
            modal_visible: false, // modal for find band
            is_ble_ready: false,
            player_rank:0,
        }

        // real-time data     
        this.players = [];
        this.player = {
            room: '',
            birth_year: '',
            weight: '0',
            h_range: '0',
            point: 0,
            point_count: 0,
            cal: 0,
            name: '',
            photo: '',
            socket_id:'',
            hr:0,
        }
        this.updating = false;

        this.vseq = this.props.route.params.vseq;
        this.v_category = '';
        this.v_title = '';
        this.v_tcd = '';
        this.v_teacher = '';
        this.v_type = '';
        this.v_runtime = '';
        this.v_live = '';
        this.v_vod = '';
        this.is_login = false;
        this.access_token = '';
        this.nick = '';
        this.gubun = '';
        this.p_name = '';
        this.height = '';
        this.photo = '';
        this.video_url = ''

        this.sid = 'smartgym';
        this.url = 'https://admin.smartg.kr';
        this.is_band_connected = false;
        this.connecting = 0;

        this.ws = {
            addr: 'http://49.247.197.171:2567',
            connected: false
        }
    }

    log_request() {

        const url = this.url;
        const sid = this.sid;
        const vseq = this.vseq;
        const vtype = this.v_type; 
        const category = this.v_category; 
        const mcd = this.player.mcd;
        const tcd = this.v_tcd;

        Axios.get(url + '/slim/dolive/log_request', { // Log
            params : {
                cid: '0000',
                sid: sid,
                url: url,
                vseq: vseq,
                vtype : vtype,
                category : category,
                mcd : mcd,
                tcd : tcd
            }
        }, { timeout: 3000 })
            .then(result => {
                console.log(result);                          
            })
            .catch(error => {
                alert('로그 실패', error);
            });
    }

    componentDidMount() {

        const url = this.url;
        const sid = this.sid;
        const vseq = this.vseq;

        Axios.post(url + '/slim/dolive/get_video_detail', { // Video
            cid: '0000',
            sid: sid,
            url: url,
            vseq: vseq,
        }, { timeout: 3000 })
            .then(result => {
                this.v_category = result.data[0].category;
                this.v_tcd = result.data[0].tcd;
                this.v_teacher = result.data[0].teacher;
                this.v_title = result.data[0].title;
                this.v_type = result.data[0].vtype;
                this.v_live = result.data[0].live_url;
                this.v_vod = result.data[0].video_url;
                this.v_runtime = result.data[0].runtime;

                if(this.v_type==='live') {
                    this.video_url = this.v_live;
                } else {                
                    this.video_url = this.v_vod;
                }         
                this.setState({
                    video_url: this.video_url
                });                                
            })
            .catch(error => {
                alert('강의정보 다운로드 실패', error);
            });

        getIsLogin(url, sid) // Player
            .then(result => {
                this.is_login = result;
                return get_access_token();
            })
            .then(result => {
                this.access_token = result;
                return get_member_one(url, sid, this.access_token);
            })
            .then(result => {
                console.log(result);
                this.player.mcd = result.mcd;
                this.player.weight = result.weight;
                this.gubun = result.gubun;
                this.height = result.height;
                this.birth_year = result.birth_year;
                this.sdate = result.sdate;
                this.edate = result.edate;
                this.player.name = result.nick;
                this.player.photo = result.photo;
                this.socket = SocketIOClient(this.ws.addr);
                this.socket.on('connect', () => {
                    console.log('socket connected.');
                    this.ws.connected = true;
                    this.player.socket_id = this.socket.id;
                });
                this.socket.on('disconnect', () => {
                    console.log('socket disconnected.');
                    this.ws.connected = false;
                });
                this.socket.on('res_players', (message) => {
                    this.players = message;
                });
                this.socket.on('res_player_hr', (message) => {
                    console.log('res_player_hr()');

                    const { point, cal, h_range, hr, socket_id } = message;
                    const players = this.players.filter(function (x) {
                        if (x.socket_id == socket_id) {
                            x.point = point;
                            x.cal = cal;
                            x.h_range = h_range;
                            x.hr = hr;
                        }
                        return x;
                    });
                    this.players = players;
                });
                this.socket.on('res_player_hello', (message) => {                                                         
                    console.log('res_player_hello()');

                    const { name, photo, socket_id, cal, hr, h_range, point, point_count } = message;
                    console.log(name + '님이 접속 하셨습니다.');

                    const player = {
                        name: name,
                        photo: photo,
                        socket_id: socket_id,
                        cal: 0,
                        hr: 0,
                        h_range: 0,
                        point: 0,
                        point_count: 0
                    }
                    this.players.push(player);                    
                });
                this.socket.on('res_player_leave', (message) => {
                    const { socket_id } = message;
                    this.setState((state) => {
                        const players = this.players.filter(function (x) { return (x.socket_id !== socket_id) })
                        this.players = players;
                    });
                });
                this.player.room = 'room' + this.vseq;                
                this.socket.emit('join', { room: this.player.room });
                this.socket.emit('req_player_hello', {
                    room: this.player.room,
                    name: this.player.name,
                    photo: this.player.photo
                });               
                this.socket.emit('req_players');
                setTimeout(() => {
                    this.log_request();
                },7000)

            })
            .catch(error => alert('회원정보를 로드하지 못했습니다.'));

        // const BleManagerModule = NativeModules.BleManager;
        // const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.bleHandleDiscoverPeripheral.bind(this));
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.bleHandleDidUpdateValueForCharacteristic.bind(this));
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.bleHandleDisconnectedPeripheral.bind(this));
        this.bleReady();

        setTimeout(() => {
            Orientation.lockToLandscape();
        }, 1000);

        KeepAwake.activate();
        Timer.setInterval('heartRefresh', this.heartRefresh.bind(this), 3000);
        Timer.setInterval('req_player_hr', this.req_player_hr.bind(this), 3000);
        setTimeout(()=>{
            this.heartRefresh();
        },3000);

    }

    // 화면 새로고침
    heartRefresh() {
        console.log('heartRefresh()');        

        this.players.sort((a,b)=>{ // 포인트별 소팅
            return a.point < b.point
        });
       
        this.players.map((x,i)=>{ // 나의 랭킹
            if(x.socket_id === this.player.socket_id) {
                this.setState({player_rank:i+1});
            }
        });        

        this.setState({
            player: this.player,
            players: this.players
        });
    }

    // 심박 업로드 (가끔식)
    req_player_hr() {
        console.log('req_player_hr()');
        if(this.ws.connected === true) {
            this.socket.emit('req_player_hr', {
            room: this.player.room,
            name: this.player.name,
            point: this.player.point,
            cal: this.player.cal,
            h_range: this.player.h_range,
            hr: this.player.hr
            });
        }
    }

    componentWillUnmount() {
        if (this.state.peripheral !== '' && this.is_band_connected === true) {
            BleManager.disconnect(this.state.peripheral);
            this.clearBandListener();
        }

        if (this.room !== undefined) {
            this.room.leave();
        }

        this.vp.stop();
        this.is_login = false;
        this.is_band_connected = false;

        if (this.ws.connected === true) {
            this.socket.disconnect();
        }

        KeepAwake.deactivate();
        Timer.clearInterval('heartRefresh');
        Timer.clearInterval('req_player_hr');

        setTimeout(() => {
            Orientation.lockToPortrait();
        }, 500);
    }

    clearBandListener() {
        bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic');
        bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    }

    show_val = () => {
        console.log('********** LIST VARS **********');
        console.log('vseq', '=', this.vseq);
        console.log('v_category', '=', this.v_category);
        console.log('v_title', '=', this.v_title);
        console.log('v_teacher', '=', this.v_teacher);
        console.log('v_tcd', '=', this.v_tcd);
        console.log('v_type', '=', this.v_type);
        console.log('v_live', '=', this.v_live);
        console.log('v_vod', '=', this.v_vod);
        console.log('v_runtime', '=', this.v_runtime);
        console.log('is_login', '=', this.is_login);
        console.log('is_loading', '=', this.state.is_loading);
        console.log('access_token', '=', this.access_token);
        console.log('mcd', '=', this.player.mcd);
        console.log('nick', '=', this.nick);
        console.log('gubun', '=', this.gubun);
        console.log('mb_name', '=', this.mb_name);
        console.log('weight', '=', this.weight);
        console.log('height', '=', this.height);
        console.log('photo', '=', this.photo);
        console.log('birth_year', '=', this.player.birth_year);
        console.log('sdate', '=', this.sdate);
        console.log('edate', '=', this.edate);
        console.log('p_name', '=', this.p_name);
    }

    render() {

        const { navigation, route } = this.props;
        return (
            <View style={{backgroundColor: "#000", flex : 1}}>
            { this.state.video_url !=='' ?
                <VideoContainer
                    ref={(vp) => { this.vp = vp }}
                    inputUrl={this.state.video_url}
                    // inputUrl={"rtmp://localhost/live"}
                    scaleMode={"ScaleAspectFit"}
                    bufferTime={300}
                    maxBufferTime={1000}
                    autoplay={true}
                />:<Text>Loading...</Text> }

                { (this.state.peripheral === '') ? (
                    <LeftSection>
                        <TouchableOpacity style={styles.bandIconWrap} onPress={() => this.btn_show_band()}>
                            <Icon name="heart-pulse" style={{ fontSize: 30, color: '#fff', alignSelf: "center" }}></Icon>
                        </TouchableOpacity>
                    </LeftSection>
                ) : null}

                <RightSection>
                    <RightScrollView bounces={false}>
                        {
                            this.state.players.map((item, key) => {

                                const rank = key + 1;
                                const { photo,
                                    cal,
                                    name,
                                    point,
                                    hr,
                                    h_range
                                } = item;

                                return (
                                    <OthersContainer style={styles.itemWrap} key={key}>
                                        <View style={styles.itemLeftWrap} >
                                            <View>
                                                {(photo !== '') ?
                                                    <Image source={{ uri: photo }} style={styles.itemImage} /> :
                                                    <Image source={{ uri: profile_sample }} style={styles.itemImage} />}
                                                <Text style={styles.gradeTxt}> {rank}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.itemRightWrap}>
                                            <View style={styles.itemRightTopWrap}>
                                                <View>
                                                    <Text style={[styles.nameTxt, styles.lineHeight]} numberOfLines={1}>{name}</Text>
                                                </View>
                                                <View style={styles.pointWrap}>
                                                    <View style={{justifyContent: 'center', marginRight : 2}}>
                                                    <Image source={require("./images/icon_point.png")} style={styles.iconImage} resizeMethod="resize"/>
                                                    </View>
                                                    <Text style={[styles.pointTxt, styles.lineHeight]}>{point}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.itemRightMiddleWrap}>
                                                <View style={styles.heartBarWrap}>
                                                    <HeartRange heartRange={h_range} />
                                                </View>
                                            </View>
                                            <View style={styles.itemRightBottomWrap}>
                                                <View>
                                                    <Text style={styles.heartTxt}>
                                                        <Icon name="heart" size={9} /> {hr}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.calTxt}><Text style={styles.calNum}>{parseFloat(cal).toFixed(1)}</Text>kcal</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </OthersContainer>
                                )
                            })
                        }
                    </RightScrollView>
                </RightSection>


                <MeContainer style={[styles.itemWrap, styles.myItem]}>
                    <View style={styles.itemLeftWrap} >
                        <View>
                            {(this.state.player.photo !== '') ?
                                <Image source={{ uri: this.state.player.photo }} style={styles.itemImage} /> : 
                                <Image source={{ uri: profile_sample }} style={styles.itemImage} />}
                            <Text style={styles.gradeTxt}>{this.state.player_rank}</Text>
                        </View>
                    </View>
                    <View style={styles.itemRightWrap}>
                        <View style={styles.itemRightTopWrap}>
                            <View>
                                <Text style={[styles.nameTxt, styles.lineHeight]} numberOfLines={1}>{this.state.player.name}</Text>
                            </View>
                            <View style={styles.pointWrap}>
                                <View style={{justifyContent: 'center', marginRight : 2}}>
                                <Image source={require("./images/icon_point.png")} style={styles.iconImage} resizeMethod="resize"/>
                                </View>
                                <Text style={[styles.pointTxt, styles.lineHeight]}>{this.state.player.point}</Text>
                            </View>
                        </View>
                        <View style={styles.itemRightMiddleWrap}>
                            <View style={styles.heartBarWrap}>
                                <HeartRange heartRange={this.state.player.h_range} />
                            </View>
                        </View>
                        <View style={styles.itemRightBottomWrap}>
                            <View>
                                <Text style={styles.heartTxt}>
                                    <Icon name="heart" size={9} /> {this.state.player.hr}  
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.calTxt}><Text style={styles.calNum}>{parseFloat(this.state.player.cal).toFixed(1)}</Text>kcal</Text>
                            </View>
                        </View>
                    </View>
                </MeContainer>

                { this.state.modal_visible ? (
                    <BandPopupWarp style={styles.bandPopupWrap}>
                        <View style={styles.bandPopupTopWrap}>
                            <Text>밴드 연결</Text>
                            <TouchableOpacity style={styles.bandCloseIcon} onPress={() => (this.btn_close_band())}>
                                <Text><Icon name="close" size={20}></Icon></Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.bandScrollWrap}>
                            {this.state.peripherals.map((item, key) => (
                                <BandItem style={styles.bandItem} key={key}>
                                    <Text>{item.name}</Text>
                                    <ConnectButton>
                                        <ConnectButtonText onPress={() => this.btn_connect_band({ id: item.id, name: item.name })}>연결</ConnectButtonText>
                                    </ConnectButton>
                                </BandItem>)
                            )}
                        </ScrollView>
                    </BandPopupWarp>) : null}
            </View>
        );
    }

    onAddMessage(message) {
        console.log('FN_onAddMessage', message)
    }

    // Handle SmartBand
    btn_show_band = () => {
        this.setState({
            modal_visible: true
        });
        this.setState((state) => {
            if (this.state.is_ble_ready == true) {
                BleManager.scan([], 20, true)
                    .then(() => {
                        console.log('[블루투스] ble scan started.');
                    }).catch(error => alert('블루투스 검색 오류'));
            }
            else {
                alert('블루투스 기능이 준비되지 않았습니다.');
            }
            return { peripherals: [] }
        });

    }

    btn_close_band = () => {
        this.setState({
            modal_visible: false
        });
    }

    btn_connect_band = (props) => {
        this.setState({
            modal_visible: false
        });

        if (this.connecting === 0) {
            this.bleStartHeart(props);
        }
        this.connecting = 1;
    }

    bleReady() {
        
        BleManager.start({ showAlert: false })
            .then(() => {
                console.log('[블루투스] 모듈 초기화 성공');

                // 안드로이드 블루투스가 off인경우 허용팝업 생성
                if (Platform.OS === 'android') {
                    BleManager.enableBluetooth()
                        .then(() => {


                            if (Platform.Version >= 29) {  
                                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                                .then(()=>{
                                    console.log('블루투스: ACCESS_FINE_LOCATION 권한 성공')
                                    this.setState({ is_ble_ready: true });
                                })
                                .catch(()=>console.log('블루투스: ACCESS_FINE_LOCATION 권한 실패'))
                            }    

                            if (Platform.Version >= 23) {
                                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                                    .then((result) => {
                                        if (result) {
                                            console.log('AND_BLE1');
                                            this.setState({ is_ble_ready: true });
                                        } else {
                                            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                                                .then((result) => {
                                                    if (result == 'granted') {
                                                        console.log('AND_BLE2');
                                                        this.setState({ is_ble_ready: true });
                                                    }
                                                    else {
                                                        alert('GPS 권한을 허용으로 변경하세요.');
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                console.log('ANT_BLE3');
                                this.setState({ is_ble_ready: true });
                            }
                        })
                        .catch((error) => {
                            alert('블루투스 설정 오류입니다. BLE_ERR_01');
                        });
                }
                else if (Platform.OS === 'ios') {
                    // 스캔 시작하기
                    console.log('IOS_BLE1');
                    //this.start_scan();
                    this.setState({ is_ble_ready: true });
                }
            })
            .catch(error => alert('블루투스 권한이 없습니다.'));
    }

    bleHandleDiscoverPeripheral(peripheral) {

        console.log('FN_bleHandleDiscoverPeripheral');
        const { name, id } = peripheral;
        const band_header = '두써킷밴드 '
        // Support Bands
        // CL831- 
        // HW702A-  

        let band_name = '';
        if (typeof (name) == 'string') {
            if (name.indexOf('CL831') !== -1) {
                band_name = band_header + name.slice('CL831'.length + 1, name.length);
            }
            if (name.indexOf('HW702A') !== -1) {
                band_name = band_header + name.slice('HW702A'.length + 1, name.length);
            }

            if (band_name !== '') {
                console.log('found band : ' + name);
                this.setState((state) => {
                    const item = {
                        id: id,
                        name: band_name
                    }

                    let dupe = false;
                    state.peripherals.map((i) => {
                        if (i.name === item.name) {
                            dupe = true;
                        }
                    });
                    if (dupe === true) {
                        return { peripherals: [...state.peripherals] }
                    }
                    else {
                        return { peripherals: [...state.peripherals, item] }
                    }
                });

            }
        }
    }

    bleHandleDisconnectedPeripheral(data) {
        console.log('Disconnected from ' + data.peripheral);
        alert('밴드 접속 끊어짐');
        this.clearBandListener();
        this.is_band_connected = false;
    }

    bleHandleDidUpdateValueForCharacteristic(data) {
        const { peripheral, characteristic, value } = data;
        const heartRate = value[1].toString();
        // console.log('Received data from ' + peripheral + ' characteristic ' + characteristic, heartRate);   
        console.log('HR', heartRate);
        console.log('point_count', this.player.point_count);
        const h_range = this.getHeartRange(heartRate);

        let cal = this.player.cal;
        const T = 1 / 60 / 60;
        const W = 60; //var W = this.player.weight;            
        const A = 35; //this.player.age;
        const HR = heartRate;
        const newCal = ((-55.0969 + (0.6309 * HR) + (0.1988 * W) + (0.2017 * A)) / 4.184) * 30 * T;

        if (newCal > 0) { // 칼로리 추가
            this.player.cal = this.player.cal + newCal;
        }

        if (h_range >= 4) { // 4-5 단계 구간에서 머무르면 1카운트 획득
            this.player.point_count++;
        }
        else {
            this.player.point_count = 0;
        }

        if (this.player.point_count >= 60) { // 60카운트마다 1포인트 획득
            this.player.point_count = 0;
            this.player.point = this.player.point + 1;
        }
        this.player.h_range = h_range;
        this.player.hr = heartRate;     
        
        this.setState({ // 포인트 카운드 표시
            player_point_count: this.player.point_count
        });

        
    }

    bleStartHeart(props) {

        const { id, name } = props;
        BleManager.connect(id)
            .then(() => {
                console.log('두써킷 밴드에 연결되었습니다.');

                this.setState({
                    peripheral: id
                });

                this.is_band_connected = true;

                BleManager.retrieveServices(id).then((peripheralInfo) => {
                    const heartRate = {
                        service: '180d',
                        measurement: '2a37'
                    };
                    BleManager.startNotification(id, heartRate.service, heartRate.measurement).then(() => {
                        console.log('[TAG] startNotification', id);
                    });
                });
            })
            .catch(error => alert('밴드연결 오류:', error));
    }

    getHeartRange(heartrate) {
        // console.log('fn_getHeartRange');
        heartrate = parseInt(heartrate);
        const age = '35'; // get age from birthday
        let heartrange = 0;
        let hrt_max = 207 - 0.7 * age;
        let hrt_per = parseInt((100 * heartrate) / hrt_max);
        if (hrt_per <= 60) {
            heartrange = 1;
        }
        if ((hrt_per > 60) & (hrt_per <= 70)) {
            heartrange = 2;
        }
        if ((hrt_per > 70) & (hrt_per <= 83)) {
            heartrange = 3;
        }
        if ((hrt_per > 83) & (hrt_per <= 91)) {
            heartrange = 4;
        }
        if (hrt_per > 91) {
            heartrange = 5;
        }
        return heartrange;
    }
}