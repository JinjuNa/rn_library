import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
    View,
    Text
} from 'native-base';
import Axios from 'axios';
import categoryData from "./data/category.json";

export default ( {selectedCategory, initialCategory} ) => {

    // const [categoryData, setCategoryData] = useState([]);
    const [activeCategory, setActiveCategory] = useState(initialCategory);


    const btn_category = ( num ) => {
        if( num == activeCategory){
            return false;
        }else{
            selectedCategory(num);
            setActiveCategory(num);
        }
    }

    const loadData = () => {
        const url = "http://localhost:3000";

        Axios.get(url + '/toy/category')
            .then(result => {
                // setCategoryData(result.data);
                console.log("=====category======");
                console.log(result.data);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        // loadData();
    }, []);
    
    const styles = StyleSheet.create({
        wrap : {backgroundColor : "#fff"},
        categoryWrap : {backgroundColor : "#fff", marginRight : "auto", marginLeft : "auto", flexDirection : 'row', paddingTop : 10, paddingBottom : 10},
        categoryItem : {padding : 7, textAlign : "center"},
        categoryTxt : {fontSize : 12, alignSelf : "center", marginTop : 5},
        activeTxt : {color : "#802ceb"}
    })

    return (
        <>
        <View style={styles.wrap}>
        <View style={styles.categoryWrap}>
            {categoryData.map((item, index)=> {
                return (
                    <TouchableOpacity key={index} onPress={()=>btn_category(item.id)} activeOpacity={0.8} underlayColor="#ffffff00">
                        <View style={styles.categoryItem}>
                            <Text style={(activeCategory == item.id) ? [styles.categoryTxt, styles.activeTxt] : styles.categoryTxt }>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
        </View>
        </>
    )
}