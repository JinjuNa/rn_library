import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';
import data from './data/agreement.json';
import { Container, Content, Header, Left, Footer, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { $Header } from './$Header';

const CloseButtonView = styled.View`
`

const TextTitle = styled.Text`
  font-size:17px;
  font-weight: bold;
  margin-bottom: 10px;
  color : #fff;
`;

const TextItem = styled.Text`
  font-size:16px;
  margin-bottom: 8px;
  color : #fff;
`;

const ButtonContainer = styled.View`
  flex-direction:row;
  height: 60px;
`;

const $Button = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  /* background: ${props => (props.Agree ? '#7f8c8d' : '#2980b9')}; */
  background-color : #d9e136;
  height : 55px;
`;

const ButtonText = styled.Text`
  /* color:#fff; */
  font-size : 18px;
`;

const FooterStyle = styled(Footer)`
    background-color : #000;
`;

export default function AgreeScreen({ navigation, route }) {

  const no = route.params.no;
  let title = "";
  let body = Array();
  data.map(function (item) {
    if (item.no == no) {
      title = item.title;
      body = item.body;
    }
  });

  const BtnNotAgree = (flag) => {
    navigation.pop();
  }

  const BtnAgree = () => {
    navigation.navigate('JoinScreen1',{no:no});
  }

  return (
    <Container style={{backgroundColor : "#111"}}>
      <$Header>
        <StatusBar backgroundColor="#111" barStyle="light-content" />
        <Left style={{ flex: 1 }}>
          <Button transparent onPress={() => BtnNotAgree()}>
            <Icon name="keyboard-arrow-left" style={{ fontSize: 30, color: "#aaaaaa" }}></Icon>
          </Button>
        </Left>
      </$Header>
      <Content contentContainerStyle={styles.container}>
          <SafeAreaView>
            <View style={styles.content}>
            <TextTitle>{title}</TextTitle>   
            { body.map((item, key)=><TextItem key={key}>{item}</TextItem> )}    
            </View>   
          </SafeAreaView>
        </Content>
        <FooterStyle>
          <$Button notAgree onPress={()=>BtnAgree()} activeOpacity={0.8} underlayColor="#ffffff00"><ButtonText>동의</ButtonText></$Button>          
        </FooterStyle>      
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  content: {
    width: "90%",
  }
});