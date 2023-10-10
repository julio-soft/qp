import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { theme } from './Theme';
import { SvgUri } from 'react-native-svg';
import { adjustNumber } from '../../utils/Helpers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PeerContainer from './PeerContainer';


export default function P2POffer({ offer, navigation }) {

    const { uuid, type, coin, amount, receive, coin_data, owner } = offer
    const coin_logo = 'https://qvapay.com/img/coins/' + coin_data.logo + '.svg'
    fixedAmount = parseFloat(amount).toFixed(2)
    fixedReceive = parseFloat(receive).toFixed(2)

    // Navigation function to ShowTransaction screen
    const navigateToP2P = () => {
        navigation.navigate('PeerToPeerStack', {
            screen: 'P2PShow',
            params: { uuid },
        })
    }

    return (
        <Pressable onPress={navigateToP2P} style={[styles.offerItem, { overflow: 'hidden' }]}>

            <View style={styles.coinLogo}>
                <SvgUri width="72" height="72" uri={coin_logo} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 55 }}>
                <View style={styles.offerDetails}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name='arrow-down' size={14} color={theme.darkColors.success} />
                        <Text style={styles.amount}>$ {fixedAmount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name='arrow-up' size={14} color={theme.darkColors.danger} />
                        <Text style={styles.amount}>$ {fixedReceive}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name='percent' size={10} color={theme.darkColors.almost_white} style={{ marginRight: 3, marginLeft: 1 }} />
                        <Text style={styles.amount}>{adjustNumber(fixedReceive / fixedAmount)}</Text>
                    </View>
                </View>
            </View>

            <PeerContainer peer={owner} orientation="left" />

        </Pressable>
    )
}

const styles = StyleSheet.create({
    offerItem: {
        flex: 1,
        borderRadius: 10,
        marginVertical: 4,
        paddingVertical: 5,
        marginHorizontal: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: theme.darkColors.elevation,
    },
    coinSection: {
        marginRight: 15,
    },
    offerDetails: {
        flexDirection: 'column',
    },
    offerRatio: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Rubik-Light',
    },
    offerAmountLabel: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Rubik-Light',
    },
    amount: {
        fontSize: 14,
        color: 'white',
        marginLeft: 5,
        fontFamily: 'Rubik-Bold',
    },
    coinLogo: {
        left: -16,
        width: 48,
        bottom: 18,
        height: 48,
        position: 'absolute',
    },
})