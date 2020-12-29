import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key
} from '../lib/Function';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import styled from 'styled-components';

let access_token = '';
let refresh_token = '';
let is_access_token = 'N';
let mcd = '';
let rows = {}

const TitleStyle = styled.View`
    padding-top:10px;
    padding-bottom:10px;
`
const ContainerStyle = styled.View`    
    width:90%;
    max-width:340px;
    padding-top:20px;
`
const ContentStyle = styled.View`
    padding-top:10px;
    padding-bottom:10px;
`
const DataText = styled.Text`  
    color:#cdcbcb;
    text-align:center;
    font-size:15px;     
`
const DataTextLeft = styled(DataText)`  
    padding-left:5px;
    text-align:left;
`

export default () => {

    const store = useSelector(state => state.data);
    const [listItem, setListItem] = useState([]);

    useEffect(() => {
        get_access_token()
            .then(result => {
                access_token = result;
                return get_refresh_token();
            })
            .then(result => {
                refresh_token = result;
                return access_token_check(access_token, store.url, store.sid);
            })
            .then(result => {
                is_access_token = result;

                // 회원ID
                const data = {
                    sid: store.sid,
                    cid: store.cid,
                    access_token: access_token
                }
                const url = store.url + '/slim/token/decode'
                Axios.post(url, data, { timeout: 3000 })
                    .then(result => {
                        loadData({ store: store });
                    })
                    .catch(error => alert(error));

            })
            .catch(error => alert(error));
    }, []);


    const loadData = (props) => {
        const { url, sid, cid } = props.store;
        const data = {
            sid: sid,
            cid: cid,
            access_token: access_token
        }
        // console.log('========> data', data);

        Axios.post(url + '/slim/get_product_list', data, { timeout: 3000 })
            .then(result => {
                if (result.data.ret !== undefined) {
                    alert(result.data.msg);
                    return;
                }
                else {
                    setListItem(result.data);
                }
            })
            .catch(error => console.log(error));
    }


    const styles = StyleSheet.create({
        container: {
            backgroundColor: "#111111",
            color: "#ffffff",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            paddingTop: 10
        },
        table: {
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#111111",
            borderWidth: 1,
            borderColor: "#454545"
        },
        table_data: {
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#111111",
            borderColor: "#454545",
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
        },
        borderRight: {
            borderRightWidth: 1,
            borderRightColor: "#454545"
        },
        title: {
            width: '60%',
        },
        price: {
            width: '40%',
            textAlign: "center"
        },
        title_text: {
            color: "white",
            fontSize: 16,
            textAlign: "center"
        }
    });

    return (
        <View style={styles.container}>
            <ContainerStyle>
                <View style={styles.table}>
                    <TitleStyle style={[styles.title, styles.borderRight]}><Text style={styles.title_text}>이용기간</Text></TitleStyle>
                    <TitleStyle style={styles.price}><Text style={styles.title_text}>가격</Text></TitleStyle>
                </View>
                {listItem.map((item, index) =>
                    <View style={styles.table_data} key={index}>
                        <ContentStyle style={[styles.title, styles.borderRight]}>
                            <DataTextLeft>{item.pas1506} {item.pas1505}</DataTextLeft>
                        </ContentStyle>
                        <ContentStyle style={styles.price}>
                            <DataText>{item.pas1507_format} 원</DataText>
                        </ContentStyle>
                    </View>
                )}
            </ContainerStyle>
        </View>
    );
}