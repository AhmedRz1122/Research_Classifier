
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CameraCaptureScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Camera Capture Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CameraCaptureScreen;
