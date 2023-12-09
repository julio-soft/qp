import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Image, Alert, ScrollView, Linking } from 'react-native'
import QPButton from '../../ui/QPButton'
import { AppContext } from '../../../AppContext'
import DeviceInfo from 'react-native-device-info'
import { OneSignal } from 'react-native-onesignal'
import { globalStyles, theme } from '../../ui/Theme'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ProfilePictureSection from '../../ui/ProfilePictureSection'

const SettingsMenu = () => {

    const navigation = useNavigation();
    const { me } = useContext(AppContext);
    const version = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();

    // default me data
    const {
        uuid = "",
        email = "",
        bio = "",
        kyc = 0,
        name = "",
        phone = "",
        lastname = "",
        username = "",
        golden_check = 0,
        phone_verified = 0,
        average_rating = "0.0",
        profile_photo_url = 'https://qvapay.com/android-chrome-192x192.png',
    } = me;

    useEffect(() => {
        getNotificationsState();
    }, []);

    const getNotificationsState = async () => {
        try {
            // const deviceState = await OneSignal.getDeviceState();
            // const { hasNotificationPermission, isSubscribed } = deviceState;
        } catch (error) {
            console.error('Error al obtener el estado de las notificaciones:', error);
        }
    };

    // Logout APP
    const logout = async () => {

        const accessToken = await EncryptedStorage.getItem("accessToken");
        const twofaRequired = await EncryptedStorage.getItem("2faRequired");

        if (accessToken) {
            await EncryptedStorage.removeItem('accessToken');
        }

        if (twofaRequired) {
            await EncryptedStorage.removeItem('2faRequired');
        }

        // Logout the user from OneSignal
        OneSignal.logout();

        navigation.replace('SplashScreen');
    };

    const confirmLogout = () =>
        Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
            {
                text: 'Cancelar',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'Sí',
                onPress: logout,
            },
        ]);

    // Settings Items as an object of multiple dimensions:
    const settings = {
        general: {
            title: 'GENERAL',
            options: [
                {
                    title: 'Tema',
                    screen: 'ThemeScreen',
                    enabled: true,
                    notifications: 0,
                },
            ],
        },
        account: {
            title: 'CUENTA',
            options: [
                {
                    title: 'Datos personales',
                    screen: 'UserdataScreen',
                    enabled: true,
                    notifications: 0,
                },
                {
                    title: 'Verificar Celular',
                    screen: 'PhoneScreen',
                    enabled: true,
                    notifications: me.phone_verified ? 0 : 1
                },
            ],
        },
        security: {
            title: 'SEGURIDAD',
            options: [
                {
                    title: 'Cambiar contraseña',
                    screen: 'PasswordScreen',
                    enabled: true,
                    notifications: 0,
                },
                {
                    title: 'Autenticación de dos factores',
                    screen: 'TwoFactorSettingsScreen',
                    enabled: true,
                    notifications: 0,
                },
                {
                    title: 'PIN de seguridad',
                    screen: 'TransferPinScreen',
                    enabled: true,
                    notifications: 0,
                },
                {
                    title: 'Verificación de identidad',
                    screen: 'KYCStack',
                    enabled: true,
                    notifications: me.kyc ? 0 : 1
                },
                {
                    title: 'Eliminar cuenta',
                    screen: 'DeleteAccountScreen',
                    enabled: true,
                    notifications: 0
                },
            ],
        },
        notifications: {
            title: 'NOTIFICACIONES',
            options: [
                {
                    title: 'Configuración de notificaciones',
                    screen: 'NotificationScreen',
                    enabled: true,
                    notifications: 0,
                },
            ],
        },
        payment_methods: {
            title: 'AJUSTES DE PAGO',
            options: [
                {
                    title: 'Métodos de pago',
                    screen: 'PaymewntMethodsScreen',
                    enabled: true,
                    notifications: 0,
                },
                {
                    title: 'Contactos favoritos',
                    screen: 'FavoriteContactsScreen',
                    enabled: true,
                    notifications: 0,
                },
            ],
        }
    }

    const SettingsItemSection = ({ section }) => {
        return (
            <View style={styles.box}>
                <Text style={{ fontFamily: 'Rubik-Bold', color: 'white', fontSize: 18, marginBottom: 10 }}>{section.title}</Text>
                {section.options.map((option, index) => (
                    <SettingsItemSectionItem
                        key={index}
                        title={option.title}
                        notifications={option.notifications}
                        onPress={option.enabled ? () => navigation.navigate(option.screen) : () => { }}
                    />
                ))}
            </View>
        );
    };

    const SettingsItemSectionItem = ({ title, notifications, onPress }) => {
        return (
            <Pressable onPress={onPress} style={styles.item}>
                <Text style={{ flex: 1, fontFamily: 'Rubik-Regular', color: 'white', fontSize: 18 }}>{title}</Text>
                {
                    notifications > 0 ? <Text style={{ marginRight: 10, borderColor: theme.darkColors.primary }}>1</Text> : null
                }
                <FontAwesome5 name="angle-right" size={16} style={{ color: 'white' }} />
            </Pressable>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center' }} >

            <View style={[styles.box, { paddingBottom: 10, marginTop: 0 }]}>

                <View style={{ marginBottom: 10 }}>
                    <ProfilePictureSection user={me} size={120} />
                    <Text style={globalStyles.bio}>{bio}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <QPButton title="Editar Perfil" onPress={() => navigation.navigate('UserdataScreen')} style={{ flex: 1 }} />
                    <View style={{ width: 10 }}></View>
                    <QPButton title="Ver Perfil" onPress={() => navigation.navigate('ProfileScreen')} style={{ flex: 1 }} />
                </View>
            </View>

            {/* GoldenCheck Card */}
            <Pressable
                style={[styles.box, { flexDirection: 'row', alignContent: 'center', alignItems: 'center', overflow: 'hidden' }]}
                onPress={() => navigation.navigate('GoldCheck')}
            >
                <View style={{ marginRight: 100 }}>
                    <Image source={require('../../../assets/images/gold-badge.png')} style={{ width: 130, height: 130, position: 'absolute', top: -65, left: -50 }} />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Rubik-Bold', color: 'white', fontSize: 16 }}>GOLD CHECK</Text>
                    {
                        golden_check == 1
                            ? <Text style={{ fontFamily: 'Rubik-Regular', color: 'white', fontSize: 14 }}>Ver mi suscripción</Text>
                            : <Text style={{ fontFamily: 'Rubik-Regular', color: 'white', fontSize: 14 }}>Comprar GOLD Check</Text>
                    }
                </View>
            </Pressable>

            {/* Referal invitation Card */}
            <Pressable
                style={[styles.box, { flexDirection: 'row', alignContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('ReferalInvitation')}
            >
                <View style={{ marginRight: 20 }}>
                    <FontAwesome5 name="gift" size={24} style={{ color: 'white' }} />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Rubik-Bold', color: 'white', fontSize: 16 }}>INVITAR AMIGOS</Text>
                    <Text style={{ fontFamily: 'Rubik-Regular', color: 'white', fontSize: 14 }}>Invita a tus amigos y gana dinero</Text>
                </View>
            </Pressable>

            {Object.values(settings).map((section, index) => (
                <SettingsItemSection key={index} section={section} />
            ))}

            <QPButton title={'Cerrar sesión'} onPress={confirmLogout} danger={true} />

            {/* Github, Twitter and Instagram accounts */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20 }}>
                <Pressable onPress={() => Linking.openURL('https://github.com/qvapay/qp')}>
                    <FontAwesome5 name="github" size={24} style={{ color: 'white' }} />
                </Pressable>

                <Pressable onPress={() => Linking.openURL('https://twitter.com/qvapay')}>
                    <FontAwesome5 name="twitter" size={24} style={{ color: 'white' }} />
                </Pressable>

                <Pressable onPress={() => Linking.openURL('https://instagram.com/qvapay')}>
                    <FontAwesome5 name="instagram" size={24} style={{ color: 'white' }} />
                </Pressable>

                <Pressable onPress={() => Linking.openURL('https://qvapay.raiseaticket.com')}>
                    <FontAwesome5 name="headset" size={24} style={{ color: 'white' }} />
                </Pressable>
            </View>

            <Text style={styles.copyBottom}>
                {`QvaPay © 2023 \n`}
                {`v ${version} build ${buildNumber}\n`}
                {`Todos los derechos reservados \n`}
            </Text>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: theme.darkColors.background
    },
    box: {
        padding: 20,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: theme.darkColors.elevation,
    },
    item: {
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    copyBottom: {
        marginTop: 10,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        fontFamily: 'Rubik-Regular',
    }
})

export default SettingsMenu;