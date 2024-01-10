import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import QPInput from '../../ui/QPInput'
import QPButton from '../../ui/QPButton'
import { SvgUri } from 'react-native-svg'
import QPCoinRow from '../../ui/QPCoinRow'
import LottieView from "lottie-react-native"
import { AppContext } from '../../../AppContext'
import SwapContainer from '../../ui/swap/SwapContainer'
import { useNavigation } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { globalStyles, textStyles, theme } from '../../ui/Theme'
import { p2pTypeText, filterCoins } from '../../../utils/Helpers'
import { apiRequest, getCoins } from '../../../utils/QvaPayClient'

export default function P2PCreate() {

    const navigation = useNavigation()
    const { me } = useContext(AppContext)
    const [step, setStep] = useState(1)
    const [operation, setOperation] = useState(null)
    const [amount, setAmount] = useState(null)
    const [desiredAmount, setDesiredAmount] = useState(null)
    const [sellOperations, setSellOperations] = useState(0)
    const [buyOperations, setBuyOperations] = useState(0)
    const [eWallets, setEWallets] = useState([]);
    const [banks, setBanks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cryptoCurrencies, setCryptoCurrencies] = useState([])
    const [selectedCoin, setSelectedCoin] = useState(0)
    const categories = [
        { title: 'Cripto:', data: cryptoCurrencies },
        { title: 'Bancos:', data: banks },
        { title: 'Monederos:', data: eWallets },
    ];
    const [privateOffer, setPrivateOffer] = useState(false)
    const [onlyKYC, setOnlyKYC] = useState(false)
    const [onlyVIP, setOnlyVIP] = useState(false)
    const [offerDetails, setOfferDetails] = useState([])
    const [p2p, setP2P] = useState(null)

    // useEffect to get the total amount of buy and sell operations
    useEffect(() => {
        getOperations()
        getPaymentMethods()
    }, [])

    // Api Call to get the total amount of buy and sell operations
    const getOperations = async () => {
        const url = '/p2p/get_total_operations'
        const response = await apiRequest(url, { method: 'GET' }, navigation)
        if (response.sell && response.buy) {
            setSellOperations(response.sell)
            setBuyOperations(response.buy)
        } else {
            setSellOperations(0)
            setBuyOperations(0)
        }
    }

    // Api Call to get the payment methods
    const getPaymentMethods = async () => {
        const coins = await getCoins(navigation)
        const filteredCoins = filterCoins({ coins, in_out_p2p: "P2P" })
        setBanks(filteredCoins.banks)
        setEWallets(filteredCoins.eWallets)
        setCryptoCurrencies(filteredCoins.cryptoCurrencies)
    };

    // Step 3 validator for the QPButton, must have a selectedCoin, amount and desiredAmount
    const stepThreeValidator = () => {
        if (selectedCoin && amount && desiredAmount && amount != "0.00" && desiredAmount != "0.00") {
            return false
        }
        return true
    }

    // get Coin data by ID
    const getCoinById = (id) => {
        const coin = banks.find(coin => coin.id == id)
        if (coin) {
            return coin
        }
        const coin2 = eWallets.find(coin => coin.id == id)
        if (coin2) {
            return coin2
        }
        const coin3 = cryptoCurrencies.find(coin => coin.id == id)
        if (coin3) {
            return coin3
        }
        return null
    }

    // Handle the Operation selection
    const handleOperation = (operation) => {
        setOperation(operation)
        setStep(2)
    }

    // Handle the selectedCoin
    const handleSelectedCoin = async (id) => {
        setAmount("0.00")
        setSelectedCoin(id)
        setDesiredAmount("0.00")

        // Get the details of the coin to fill the offerDetails
        const parsedDetails = await JSON.parse(getCoinById(id).working_data)
        setOfferDetails(parsedDetails)

        setStep(3)
    }

    // Review the data and confirm the operation
    const reviewP2P = () => {
        if (stepThreeValidator()) {
            return
        }
        setStep(4)
    }

    // Send info via API
    const publishP2P = async () => {
        setStep(5)
        try {
            const parsedDetails = JSON.stringify(offerDetails)
            const data = {
                type: operation,
                coin: selectedCoin,
                amount,
                receive: desiredAmount,
                details: parsedDetails,
                only_kyc: onlyKYC,
                private: privateOffer,
            }
            const url = '/p2p/create'
            const response = await apiRequest(url, { method: 'POST', data }, navigation)
            if (response && response.msg == "Succesfull created" && response.p2p) {
                const p2p = response.p2p
                setP2P(p2p)
                viewOffer(p2p)
            } else {
                console.log(response)
            }

        } catch (error) {
            console.log(error)
        }
    }

    // Go to the P2PView using the p2p uuid
    const viewOffer = (p2p) => {
        navigation.pop()
        navigation.navigate('P2PStack', {
            screen: 'P2PShow',
            params: { uuid: p2p.uuid },
        })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[globalStyles.container, { justifyContent: 'flex-start', paddingBottom: 20 }]}>

                {
                    step < 5 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                            <Pressable onPress={() => setStep(1)} style={{ flex: 1, height: step >= 1 ? 7 : 5, backgroundColor: step >= 1 ? theme.darkColors.primary : "#6759EF60", marginRight: 4, borderRadius: 2 }} />
                            <Pressable onPress={() => setStep(2)} style={{ flex: 1, height: step >= 2 ? 7 : 5, backgroundColor: step >= 2 ? theme.darkColors.primary : "#6759EF60", marginRight: 4, borderRadius: 2 }} />
                            <Pressable onPress={() => setStep(3)} style={{ flex: 1, height: step >= 3 ? 7 : 5, backgroundColor: step >= 3 ? theme.darkColors.primary : "#6759EF60", marginRight: 4, borderRadius: 2 }} />
                            <Pressable onPress={() => setStep(4)} style={{ flex: 1, height: step >= 4 ? 7 : 5, backgroundColor: step >= 4 ? theme.darkColors.primary : "#6759EF60", borderRadius: 2 }} />
                        </View>
                    )
                }

                <View style={{ flex: 1 }}>

                    {
                        step == 1 && (
                            <>
                                <Text style={textStyles.h1}>Crear oferta P2P:</Text>

                                <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={[styles.optionCard, { backgroundColor: "#7BFFB160" }]}>
                                        <View style={{ flex: 1, justifyContent: "center" }}>
                                            <Text style={[textStyles.h4, { textAlign: 'center' }]}>Selecciona esta opción si deseas comprar USD.</Text>
                                            <Text style={[textStyles.h2, { textAlign: 'center' }]}>{sellOperations} operaciones</Text>
                                        </View>
                                        <QPButton title='Comprar' onPress={() => handleOperation('buy')} success />
                                    </View>

                                    <View style={[styles.optionCard, { backgroundColor: "#DB253E60" }]}>
                                        <View style={{ flex: 1, justifyContent: "center" }}>
                                            <Text style={[textStyles.h4, { textAlign: 'center' }]}>Selecciona esta opción si deseas vender USD.</Text>
                                            <Text style={[textStyles.h2, { textAlign: 'center' }]}>{buyOperations} operaciones</Text>
                                        </View>
                                        <QPButton title='Vender' onPress={() => handleOperation('sell')} danger disabled={me.balance == 0 ? true : false} />
                                    </View>
                                </View>
                            </>
                        )
                    }

                    {
                        step == 2 && (
                            <ScrollView style={{ marginTop: 10 }}>
                                <Text style={[textStyles.h3, { textAlign: 'center', marginBottom: 10 }]}>Selecciona la moneda a {operation == "buy" ? "enviar" : "recibir"} por USD:</Text>
                                {
                                    categories.map((category, index) => (
                                        <View key={index}>
                                            <FlatList
                                                data={category.data.filter(item => searchQuery === '' || item.name.includes(searchQuery))}
                                                renderItem={({ item }) => <QPCoinRow item={item} selectedCoin={selectedCoin} setSelectedCoin={handleSelectedCoin} in_out_p2p="P2P" />}
                                                keyExtractor={item => item.id}
                                            />
                                        </View>
                                    ))
                                }
                            </ScrollView>
                        )
                    }

                    {
                        step == 3 && (
                            <View style={{ flex: 1, marginVertical: 10 }}>
                                <Text style={[textStyles.h3, { textAlign: 'center' }]}>Selecciona la cantidad a {operation == "buy" ? "comprar" : "vender"} en USD:</Text>

                                <View style={{ flex: 1 }}>
                                    <SwapContainer
                                        editable={true}
                                        operation={operation}
                                        amount={amount}
                                        desiredAmount={desiredAmount}
                                        setAmount={setAmount}
                                        setDesiredAmount={setDesiredAmount}
                                        coin={getCoinById(selectedCoin)}
                                        setStep={setStep}
                                    />
                                </View>

                                <QPButton onPress={reviewP2P} title={`Agregar detalles`} disabled={!stepThreeValidator} />

                            </View>
                        )
                    }

                    {
                        step == 4 && (
                            <View style={{ flex: 1, marginVertical: 10 }}>
                                <ScrollView style={{ flex: 1, marginTop: 20 }}>

                                    <Text style={[textStyles.h2, { textAlign: 'center' }]}>Detalles de tu oferta P2P:</Text>

                                    <View style={{ flex: 1, padding: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>Tipo de oferta:</Text>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>{p2pTypeText(operation)}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>Moneda:</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <SvgUri width="22" height="22" uri={`https://qvapay.com/img/coins/${getCoinById(selectedCoin)?.logo}.svg`} style={{ marginRight: 5 }} />
                                                <Text style={[textStyles.h3, { textAlign: 'center' }]}>{getCoinById(selectedCoin)?.name}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>A {operation == "buy" ? "comprar" : "enviar"}:</Text>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>${amount}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>A {operation == "buy" ? "pagar" : "recibir"}:</Text>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>${desiredAmount}</Text>
                                        </View>

                                        {/** Cycle here for every offerDetails as label QPInput fields */}
                                        {
                                            offerDetails.map((detail, index) => (
                                                <View style={{ marginVertical: 10 }}>
                                                    <Text style={[textStyles.h3]}>{detail.name}:</Text>
                                                    <QPInput
                                                        key={detail.name}
                                                        prefixIconName="info"
                                                        label={detail.name}
                                                        value={offerDetails[index]?.value}
                                                        onChangeText={(value) => {
                                                            const newDetails = [...offerDetails]
                                                            newDetails[index].value = value
                                                            setOfferDetails(newDetails)
                                                        }}
                                                    />
                                                </View>
                                            ))
                                        }

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>Oferta Privada:</Text>

                                            <BouncyCheckbox
                                                size={20}
                                                fillColor={theme.darkColors.primary}
                                                unfillColor={theme.darkColors.background}
                                                iconStyle={{ borderColor: theme.darkColors.primary, marginRight: -15 }}
                                                innerIconStyle={{ borderWidth: 1 }}
                                                textStyle={{ fontFamily: "Rubik-Regular", textDecorationLine: 'none' }}
                                                onPress={(isChecked) => { setPrivateOffer(isChecked) }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>Oferta solo para KYC:</Text>

                                            <BouncyCheckbox
                                                size={20}
                                                fillColor={theme.darkColors.primary}
                                                unfillColor={theme.darkColors.background}
                                                iconStyle={{ borderColor: theme.darkColors.primary, marginRight: -15 }}
                                                innerIconStyle={{ borderWidth: 1 }}
                                                textStyle={{ fontFamily: "Rubik-Regular", textDecorationLine: 'none' }}
                                                onPress={(isChecked) => { setOnlyKYC(isChecked) }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={[textStyles.h3, { textAlign: 'center' }]}>Oferta solo para VIPs:</Text>

                                            <BouncyCheckbox
                                                size={20}
                                                fillColor={theme.darkColors.primary}
                                                unfillColor={theme.darkColors.background}
                                                iconStyle={{ borderColor: theme.darkColors.primary, marginRight: -15 }}
                                                innerIconStyle={{ borderWidth: 1 }}
                                                textStyle={{ fontFamily: "Rubik-Regular", textDecorationLine: 'none' }}
                                                onPress={(isChecked) => { setOnlyVIP(isChecked) }}
                                            />
                                        </View>

                                    </View>

                                </ScrollView>

                                <QPButton onPress={publishP2P} title={`Publicar oferta`} />
                            </View>
                        )
                    }

                    {
                        step == 5 && (
                            <View style={{ flex: 1, marginTop: 20, justifyContent: 'center' }}>
                                <View style={{ marginHorizontal: 40 }}>
                                    <LottieView source={require('../../../assets/lotties/uploading.json')} autoPlay style={styles.lottie} />
                                </View>
                                <Text style={[textStyles.h3, { textAlign: 'center' }]}>Publicando oferta P2P</Text>
                            </View>
                        )
                    }

                </View>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    optionCard: {
        flex: 1,
        borderRadius: 10,
        marginVertical: 5,
        paddingTop: 10,
        paddingHorizontal: 10,
        backgroundColor: "#7BFFB160",
    },
    lottie: {
        width: 180,
        height: 180,
        alignSelf: 'center',
    },
})