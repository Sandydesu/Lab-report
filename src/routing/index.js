import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainComponent from '../pages/MainComponent';
import ReportComponent from '../pages/ReportComponent';
import ListComponent from '../pages/ListComponent';
import NewReportComponent from '../pages/NewReportComponent';
const RootStack = createStackNavigator(
    {
        LandingPage: { screen: MainComponent },
        Report: { screen: ReportComponent },
        List: { screen: ListComponent },
        New: { screen: NewReportComponent }
    },
    {
        initialRouteName: 'LandingPage',
        defaultNavigationOptions: {
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    }
);

const RootContainer = createAppContainer(RootStack);
export default RootContainer;