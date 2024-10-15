import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './src/core/fontawesome';
import HomeScreen from './src/screens/HomeScreen';
import DonorLoginPage from './src/screens/DonorLoginPage';
import DeliveryStaffLoginPage from './src/screens/DeliveryStaffLoginPage';
import SignUpPage from './src/screens/SignUpPage';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import DonorDashboard from './src/screens/DonorScreens/DonorDashboard';
//import { ThemeProvider } from './src/screens/DonorScreens/ThemeContext';


const Stack = createStackNavigator();
function App()  {
  
  return (
   
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DonorLogin" component={DonorLoginPage} />
        <Stack.Screen name="DeliveryStaffLogin" component={DeliveryStaffLoginPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} options={{ headerShown: true }}/>
        <Stack.Screen name="DonorRegistration" component={SignUpPage} options={{ headerShown: true }} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="DonorDashboard" component={DonorDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
    
   
  );
}



export default App;
