import React, {useState} from "react";
import { TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import {
    View,
    Text
} from 'native-base';
import categoryData from "./data/category.json";

export default ( {selectedCategory, initialCategory} ) => {

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const btn_category = ( num ) => {
        if( num == activeCategory){
            return false;
        }else{
            selectedCategory(num);
            setActiveCategory(num);
        } 
    }
    
    const styles = StyleSheet.create({
        wrap : {backgroundColor : "#fff"},
        mt50 : {marginTop : 50},
        header : {display : "flex"},
        selfCenter : {alignSelf : "center"},
        button : {width : 200, alignItems : "center"},
        title : {fontWeight : "bold", fontSize : 18, padding : 10},
        categoryWrap : {backgroundColor : "#fff", marginRight : "auto", marginLeft : "auto"},
        categoryItem : {padding : 7, textAlign : "center"},
        categoryImage : {width : 55, height : 55, resizeMode : "contain"},
        categoryTxt : {fontSize : 10, alignSelf : "center", marginTop : 5},
        activeTxt : {color : "#802ceb"}
    })

    return (
        <>
        <View style={styles.wrap}>
        <View style={styles.categoryWrap}>
            <ScrollView 
                style={{ marginTop: 20, marginBottom : 20 }}
                horizontal
                bounces={false}
            >
            {categoryData.map((item, index)=> {
                return (
                    <TouchableOpacity key={index} onPress={()=>btn_category(item.no)} activeOpacity={0.8} underlayColor="#ffffff00">
                        <View style={styles.categoryItem}>
                            <Image source={{uri : (activeCategory == item.no)? item.menuImage : item.menuImageGray}} style={styles.categoryImage}/>
                            <Text style={(activeCategory == item.no) ? [styles.categoryTxt, styles.activeTxt] : styles.categoryTxt }>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
            </ScrollView> 
        </View>
        </View>
        </>
    )
}