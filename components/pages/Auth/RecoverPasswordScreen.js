import React, { useState } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { globalStyles, theme, textStyles } from '../../ui/Theme';
import Loader from '../../ui/Loader';
import QPButton from '../../ui/QPButton';
import { qvaPayClient } from '../../../utils/QvaPayClient';
import * as Sentry from '@sentry/react-native';

export default function RecoverPasswordScreen() {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errortext, setErrortext] = useState('');
    const [success, setSuccess] = useState(false);

    // Handle Recover Password
    const handleRecoverPassword = async () => {

        setErrortext('');
        if (!email) {
            alert('Por favor, ingrese su correo, username o teléfono');
            return;
        }

        setLoading(true);

        try {
            // Send the email to the server
            const response = await qvaPayClient.post("/auth/recover", { email, password });
            if (response.data && response.status === 201) {
                setSuccess(true);
                setLoading(false);
                return response.data;
            } else {
                throw new Error("No se pudo iniciar sesión correctamente");
            }
        } catch (error) {
            Sentry.captureException(error);
        }

    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[globalStyles.container, { justifyContent: 'flex-start' }]}>

            <Loader loading={loading} />

            {
                success ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Image source={require('../../../assets/images/undraw_forgot_password_gi2d.png')} style={{ width: 300, height: 300 }} /> */}
                        <Text style={[textStyles.h1, { textAlign: 'center' }]}>¡Listo!</Text>
                        <Text style={[textStyles.h3, { textAlign: 'center' }]}>Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.</Text>
                    </View>
                ) : (
                    <>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                                <Text style={textStyles.h1}>Recuperar contraseña:</Text>
                            </View>

                            <View style={{ flex: 1 }}>

                                <QPInput
                                    prefixIconName="at"
                                    placeholder="Correo, username o teléfono"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    onChangeText={(email) => setEmail(email)}
                                />

                                <Text style={styles.forgotTextStyle} onPress={() => navigation.navigate('RecoverPasswordScreen')}>¿Olvidaste tu contraseña?</Text>

                                {errortext != '' ? (
                                    <Text style={styles.errorTextStyle}>
                                        {errortext}
                                    </Text>
                                ) : null}

                                <QPButton title="Enviar código de recuperación" onPress={handleRecoverPassword} />

                            </View>

                        </ScrollView>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.registerTextStyle}>¿No tienes cuenta aún?</Text>
                            <Text style={[styles.registerTextStyle, { color: theme.darkColors.primary, marginLeft: 5 }]} onPress={() => navigation.navigate('RegisterScreen')}>Regístrate</Text>
                        </View>
                    </>
                )
            }

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    registerTextStyle: {
        fontSize: 14,
        color: 'white',
        paddingVertical: 10,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: "Rubik-Regular",
    },
})