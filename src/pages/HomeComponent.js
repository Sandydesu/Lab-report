import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Container, Footer, FooterTab, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import RootContainer from '../routing';
import NavigationService from '../services/NavigationService';
import { createItemsReportTable } from '../store/actions/create';
class HomeComponent extends Component {

    componentDidMount() {
        this.props.createItemsReportTable();
    }
    render() {
        return (
            <Container style={styles.mainView}>
                <RootContainer ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                }} />
                <Footer>
                    <FooterTab>
                        <Button vertical onPress={() => NavigationService.navigate('LandingPage', {})}>
                            <Icon name="file-o" size={30} color="#fff" />
                            <Text>Home</Text>
                        </Button>
                        <Button vertical onPress={() => NavigationService.navigate('Report', {})}>
                            <Icon name="file-o" size={30} color="#fff" />
                            <Text>Report</Text>
                        </Button>
                        <Button vertical onPress={() => NavigationService.navigate('List', {})}>
                            <Icon active name="list" size={30} color="#fff" />
                            <Text>List</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        margin: 10
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        createItemsReportTable: () => dispatch(createItemsReportTable())
    }
}

export default connect(null, mapDispatchToProps)(HomeComponent);