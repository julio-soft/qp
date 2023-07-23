import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function FeaturedCard({ product, showLead = true }) {

    const navigation = useNavigation();

    const { uuid, name, lead, color, price, tax, desc, meta, category, logo_url, cover_url } = product;
    const [circlePos, setCirclePos] = useState({
        circle1: { top: 0, left: 0 },
        circle2: { bottom: 0, right: 0 },
        circle3: { bottom: 0, right: 0 },
    });

    useEffect(() => {
        setCirclePos({
            circle1: { top: `${Math.random() * 40 - 30}%`, left: `${Math.random() * 40 - 30}%` },
            circle2: { bottom: `${Math.random() * 40 - 20}%`, right: `${Math.random() * 40 - 20}%` },
            circle3: { bottom: `${Math.random() * 60 - 40}%`, right: `${Math.random() * 60 - 40}%` },
        });
    }, []);

    // navigate to ShopStack with params ShopScreen
    const handlePress = () => {
        navigation.navigate('ShopStack', {
            screen: 'ShopItemScreen',
            params: { uuid: uuid }
        });
    };

    return (
        <Pressable style={styles.cardContainer} onPress={handlePress}>
            <View style={[styles.featuredCard, { backgroundColor: color }]}>

                <FastImage
                    style={styles.logo}
                    source={{ uri: `${logo_url}` }}
                    resizeMode={FastImage.resizeMode.contain}
                />

                <View style={[styles.circle1, circlePos.circle1]} />
                <View style={[styles.circle2, circlePos.circle2]} />
                <View style={[styles.circle3, circlePos.circle3]} />


                <View style={{ flex: 1 }} />

                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={[styles.bottomInfo, showLead ? { justifyContent: 'space-between' } : { justifyContent: 'center' }]}>
                    <Text style={styles.bottomNameText}>{name}</Text>
                    {
                        showLead && <Text style={styles.bottomPriceText}>{lead}</Text>
                    }
                </LinearGradient>

            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        height: 150,
        borderRadius: 10,
        marginHorizontal: 5,
        overflow: 'hidden',
    },
    featuredCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: '50%',
        height: '90%',
        position: 'absolute',
        zIndex: 4,
    },
    patternOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.5,
    },
    pattern: {
        width: '100%',
        height: '100%',
    },
    bottomInfo: {
        width: '100%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomNameText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Rubik-Regular',
    },
    bottomPriceText: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Rubik-Bold'
    },
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'white',
        opacity: 0.06,
        left: '-30%',
        top: '-30%',
        zIndex: 3,
    },
    circle2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'white',
        opacity: 0.07,
        right: '-20%',
        bottom: '-20%',
        zIndex: 2,
    },
    circle3: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'white',
        opacity: 0.08,
        right: '-40%',
        bottom: '-40%',
        zIndex: 1,
    },
});