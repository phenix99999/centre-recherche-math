import { inject } from "mobx-react";
import { Icon, Picker, Text, View } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";
import { Record } from "../stores/FMObjectTypes";
import Header from "./Header";

interface CustomPickerProps<Fields> {
    records: Record<Fields>[];
    valueKey: keyof Fields;
    getLabel: (record: Record<Fields>) => string;
    onChange: (itemValue: any) => void;
    selectedValue: number;
    placeholder: string;
}

export const CustomPicker = inject("timeStore")(<Fields,>(props: CustomPickerProps<Fields>) => {
    return (
        <Picker
            style={{ height: 40 }}
            selectedValue={props.selectedValue}
            onValueChange={(itemValue, itemIndex) => {
                props.onChange(itemValue);
            }}
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            headerBackButtonText={"Annuler"}
            placeholder={props.placeholder}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            itemTextStyle={{ flex: 1 }}
            renderHeader={(goBack: any) => (
                <Header.Header>
                    <Header.BackButton onPress={() => goBack()} />
                    <Header.TitleText title="Sélectionnez une valeur" />
                </Header.Header>
            )}
        >
            {props.records.map((record) => (
                <Picker.Item
                    label={props.getLabel(record)}
                    value={Number(record[props.valueKey])}
                    key={record.id}
                />
            ))}
        </Picker>
    );
});

export const CustomPickerRow = <Fields,>(props: CustomPickerProps<Fields>) => (
    <View style={styles.pickerRow}>
        <View style={{ width: 150 }}>
            <Text style={styles.pickerText}>{props.placeholder}:</Text>
        </View>
        <View style={{ flexGrow: 1, flex: 1, alignItems: "flex-end" }}>
            <CustomPicker {...props} />
        </View>
    </View>
);

interface DetachedCustomPickerProps {
    values: string[];
    onChange: (itemValue: string) => void;
    selectedValue: string;
    placeholder: string;
}
export const DetachedCustomPickerRow = (props: DetachedCustomPickerProps) => (
    <View style={styles.pickerRow}>
        <View style={{ width: 150 }}>
            <Text style={styles.pickerText}>{props.placeholder}:</Text>
        </View>
        <View style={{ flexGrow: 1, flex: 1, alignItems: "flex-end" }}>
            <Picker
                style={{ height: 40 }}
                selectedValue={props.selectedValue}
                onValueChange={(itemValue, itemIndex) => {
                    props.onChange(itemValue);
                }}
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                headerBackButtonText={"Annuler"}
                placeholder={props.placeholder}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                itemTextStyle={{ flex: 1 }}
                renderHeader={(goBack: any) => (
                    <Header.Header>
                        <Header.BackButton onPress={() => goBack()} />
                        <Header.TitleText title="Sélectionnez une valeur" />
                    </Header.Header>
                )}
            >
                {props.values.map((value) => (
                    <Picker.Item label={value} value={value} key={value} />
                ))}
            </Picker>
        </View>
    </View>
);

const styles = StyleSheet.create({
    pickerRow: {
        flexDirection: "row",
        padding: 0,
    },
    pickerText: {
        lineHeight: 40,
        flex: 1,
    },
});
