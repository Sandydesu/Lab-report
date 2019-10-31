import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text, Button } from 'native-base';
import NavigationService from '../services/NavigationService';
import { selectedReportEdit } from '../store/actions/report';

class ReportComponent extends Component {

    static navigationOptions = {
        title: 'Report',
        headerRight: (
            <Button onPress={() => NavigationService.navigate('New')}>
                <Text>New</Text>
            </Button>
        )
    };

    constructor() {
        super();
    }

    displayReport = (value) => {
        this.props.selectedReport(value);
        this.props.navigation.navigate('New');
    }

    render() {
        const rows = this.props.reports.map((value, index) => {
            return (
                <Button block key={`button-list-${index}`} style={{ margin: 10 }} onPress={() => this.displayReport(value)}>
                    <Text>{value.reportName}</Text>
                </Button>
            )
        });
        return (
            <Content>
                {rows}
            </Content>
        )
    }
}

const mapStateToProps = (state) => {
    return { reports: state.Report.reportsList }
}

const mapDispatchToProps = (dispatch) => {
    return { selectedReport: (item) => dispatch(selectedReportEdit(item)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportComponent)
