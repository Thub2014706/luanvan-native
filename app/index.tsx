import { Redirect } from 'expo-router';
import { LogBox } from 'react-native';

const StartPage = () => {
    return <Redirect href={'/(screens)/'} />;
};
LogBox.ignoreAllLogs();

export default StartPage;
