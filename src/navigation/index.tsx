import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ColorSchemeName } from "react-native";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions } from "@react-navigation/drawer";
//import BarcodeScreen from "../screens/BarcodeScreen";
import { RootStackParamList, MainStackParamList, LoginStackParamList, DrawerStackParamList } from "../types";
import { createStackNavigator } from "@react-navigation/stack";
type InitialRouteNames = "Logout" | "Login";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import MainScreen from "../screens/MainScreen";
import Sidebar from "../components/Sidebar";
import TempsDetailsScreen from "../screens/TempsDetailsScreen";
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
    colorScheme,
    initialRouteName,
}: {
    colorScheme: ColorSchemeName;
    initialRouteName: InitialRouteNames;
}) {
    return (
        <NavigationContainer>
            <RootNavigator initialRouteName={initialRouteName} />
        </NavigationContainer>
    );
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainNavigator() {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"Main"}>
            <MainStack.Screen name="Main" component={MainScreen} />
            <MainStack.Screen name="TempsDetails" component={TempsDetailsScreen} />
        </MainStack.Navigator>
    );
}
const DrawerStack = createDrawerNavigator<DrawerStackParamList>();

function DrawerNavigator() {
    return (
        <DrawerStack.Navigator
            screenOptions={{ headerShown: false }}
            drawerContent={(props: DrawerContentComponentProps<DrawerContentOptions>) => <Sidebar {...props} />}
        >
            <DrawerStack.Screen name="MainDrawer" component={MainNavigator} />
        </DrawerStack.Navigator>
    );
}

const LoginStack = createStackNavigator<LoginStackParamList>();
function LoginNavigator() {
    return (
        <LoginStack.Navigator screenOptions={{ headerShown: false }} mode="modal">
            <LoginStack.Screen name="Welcome" component={WelcomeScreen} />
            <LoginStack.Screen name="WelcomeForm" component={LoginScreen} />
        </LoginStack.Navigator>
    );
}
// Read more here: https://reactnavigation.org/docs/modaDrawerNavigator
const RootStack = createStackNavigator<RootStackParamList>();

function RootNavigator({ initialRouteName }: { initialRouteName: InitialRouteNames }) {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
            <RootStack.Screen options={{ animationEnabled: false }} name="Logout" component={LoginNavigator} />
            <RootStack.Screen options={{ animationEnabled: false }} name="Login" component={MainNavigator} />
        </RootStack.Navigator>
    );
}
