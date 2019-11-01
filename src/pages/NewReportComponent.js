import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Modal, ToastAndroid, Keyboard, PermissionsAndroid } from 'react-native';
import { Content, Text, Header, Left, Right, Title, Item, Input, Button, ListItem, CheckBox, Body, Form, Label, Fab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addNewReport, updateReport } from '../store/actions/report';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

class NewReportComponent extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {
            templateTitle: 'New',
            isChangeDate: false,
            active: false,
            selectedItem: null,
            modalVisible: false,
            previewPopUp: false,
            searchText: '',
            file: null,
            reportSelectedItems: [],
            report: {
                reportName: '',
                patientName: '',
                doctorName: '',
                age: '',
                sex: '',
                chosenDate: new Date(),
                items: []
            }
        }
    }

    openFile = () => {
        FileViewer.open(this.state.file.filePath);
    }

    askPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Write Permission',
                    message:
                        'Hello Docktor will save the PDF file in your Device',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.createPDF();
            } else {
                alert('WRITE_EXTERNAL_STORAGE permission denied');
            }
        } catch (err) {
            alert('Write permission err', err);
        }
    }

    createPDF = async () => {
        let testItems = '';
        let isList = false;
        this.state.report.items.forEach((value, index) => {
            if (value.type === 'list') {
                if (!isList) {
                    testItems += `<table><tr><th>Test Name</th><th>Result</th><th>Biological Reference Interval</th></tr>`;
                    isList = true;
                }
                testItems += `<tr><td>${value.title}</td><td>${value.value}</td><td>${value.range}</td></tr>`;
            } else {
                if (isList) {
                    testItems += `</table>`;
                }
                isList = false;
                testItems += `<div class="header-tittle"><h3>${value.value.toUpperCase()}</h3></div>`;
            }
            if (index === this.state.report.items.length - 1 && isList) {
                isList = false;
                testItems += `</table>`;
            }
        });
        const template = `<style>
        * {
            margin: 0;
            padding: 0;
            line-height: 1.5;
        }
        .main {
            margin: 100px 40px 0px 30px;
        }
        .header-tittle {
            text-align: center;
        }
        .header-left {
            float: left;
            width: 50%;
        }
        .header-right {
            float: right;
            width: 50%;
            text-align: right;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th,
        td {
            padding: 15px;
            text-align: left;
        }
        td {
            width: 35%;
            vertical-align: bottom;
        }
    </style>
    <div class="main">
        <hr />
        <div class="header-left">
            <h4>Pt.Name : ${this.state.report.patientName}</h4>
            <h4>Ref By  : ${this.state.report.doctorName}</h4>
        </div>
        <div class="header-right">
            <h4>Age/Sex : ${this.state.report.age} Years / ${this.state.report.sex}</h4>
            <h4>Date : ${moment(this.state.report.chosenDate).format('DD MMM YY')}</h4>
        </div >
            <hr />
            <div class="header-tittle">
                <h3>${this.state.report.reportName.toUpperCase()}</h3>
            </div>
        ${ testItems}
    </div > `;
        let options = {
            html: template,
            fileName: this.state.report.patientName,
            directory: 'Documents',
            height: 841,
            width: 595
        };
        let file = await RNHTMLtoPDF.convert(options);
        this.setState({ file: file, previewPopUp: true });
    }

    componentDidMount() {
        const { selectedItem } = this.props;
        if (selectedItem) {
            this.setState({ report: selectedItem });
        }
    }

    setFieldValue = (index, text) => {
        const items = this.state.report.items;
        items[index].value = text;
        this.setState({ report: { ...this.state.report, items: items } });
    }

    filterList = (text) => {
        this.setState({ searchText: text })
    }

    setReportValues = (field, text) => {
        this.setState({ report: { ...this.state.report, [field]: text } })
    }

    createTitle = () => {
        const items = this.state.report.items;
        items.push({
            type: 'title',
            title: 'Heading',
            value: ''
        });
        this.setState({ active: !this.state.active, report: { ...this.state.report, items: items } });
    }

    addFields = () => {
        const items = this.state.report.items
        this.state.reportSelectedItems.forEach((item) => {
            items.push({
                type: 'list',
                title: item.itemName,
                value: item.itemDefault,
                range: item.itemRange
            });
        });
        this.setState({ modalVisible: false, reportSelectedItems: [], report: { ...this.state.report, items: items } });
    }

    getDynamicItems() {
        return this.state.report.items.map((item, index) => {
            return (
                <Item stackedLabel key={`title - ${index} `}>
                    <Label>{item.title}</Label>
                    <Input value={item.value} onChangeText={(text) => this.setFieldValue(index, text)} />
                </Item>
            )
        });
    }

    selectedItem(value) {
        const items = this.state.reportSelectedItems;
        if (items.length === 0 || items.indexOf(value) === -1) {
            items.push(value);
        } else {
            items.splice(items.indexOf(value), 1);
        }
        this.setState({ reportSelectedItems: items });
    }

    preview = () => {
        Keyboard.dismiss();
        if (this.state.report.reportName && this.state.report.patientName && this.state.report.doctorName && this.state.report.items.length) {
            this.askPermission();
        } else {
            ToastAndroid.showWithGravity(
                'Empty Report',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    }

    save = () => {
        if (this.props.actionType === 'edit') {
            this.props.updateReport({ ...this.state.report});
        } else {
            this.props.createNewReport({ ...this.state.report, reportId: this.props.count });
        }
        this.props.navigation.navigate('LandingPage');
    }


    getItems = () => {
        let { list } = this.props;
        list = list.filter((value) => value.itemName.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1);
        const rows = list.map((value, index) => {
            const isChecked = this.state.reportSelectedItems.indexOf(value) !== -1 ? true : false;
            return (
                <ListItem key={`items - ${index} `} onPress={() => this.selectedItem(value)}>
                    <CheckBox checked={isChecked} onPress={() => this.selectedItem(value)} />
                    <Body>
                        <Text>{value.itemName}</Text>
                    </Body>
                </ListItem>
            )
        });
        return rows;
    }

    setDate = (event, newDate) => {
        this.setState({ report: { ...this.state.report, chosenDate: newDate }, isChangeDate: false });
    }

    render() {
        return (
            <>
                <Content>
                    <Header>
                        <Body>
                            <Title>{this.state.templateTitle}</Title>
                        </Body>
                        <Right>
                            <Button hasText transparent onPress={this.preview}>
                                <Text>Preview</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Form>
                        <Item stackedLabel>
                            <Label>Report Name(ex: CBP)</Label>
                            <Input value={this.state.report.reportName} onChangeText={(text) => this.setReportValues('reportName', text)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Patient Name</Label>
                            <Input value={this.state.report.patientName} onChangeText={(text) => this.setReportValues('patientName', text)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Age</Label>
                            <Input value={this.state.report.age} onChangeText={(text) => this.setReportValues('age', text)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Sex</Label>
                            <Input value={this.state.report.sex} onChangeText={(text) => this.setReportValues('sex', text)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Doctor Name</Label>
                            <Input value={this.state.report.doctorName} onChangeText={(text) => this.setReportValues('doctorName', text)} />
                        </Item>
                        <ListItem icon>
                            <Left>
                                <Label>Date</Label>
                            </Left>
                            <Body>
                                <Text>{moment(this.state.report.chosenDate).format('DD MMM YY')}</Text>
                            </Body>
                            <Right>
                                <Button primary onPress={() => { Keyboard.dismiss(); this.setState({ isChangeDate: true }) }}><Text> Change </Text></Button>
                                {this.state.isChangeDate && <DateTimePicker value={this.state.report.chosenDate}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.setDate} />}
                            </Right>
                        </ListItem>
                        {this.getDynamicItems()}
                    </Form>

                </Content>
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => {
                        Keyboard.dismiss();
                        this.setState({ active: !this.state.active });
                    }}>
                    <Icon name="plus" />
                    <Button style={{ backgroundColor: '#34A34F' }} onPress={this.createTitle}>
                        <Icon name="text-width" size={25} color={'white'} />
                    </Button>
                    <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.setState({ active: !this.state.active, modalVisible: true })}>
                        <Icon name="list" size={25} color={'white'} />
                    </Button>
                </Fab>
                <Modal
                    animationType="fade"
                    transparent={false}
                    presentationStyle="formSheet"
                    visible={this.state.modalVisible}>
                    <>
                        <Content>
                            <Header searchBar rounded>
                                <Item>
                                    <Icon name="search" size={25} />
                                    <Input placeholder="Search" onChangeText={(text) => this.filterList(text)} value={this.state.searchText} />
                                </Item>
                                <Button transparent>
                                    <Text>Search</Text>
                                </Button>
                            </Header>
                            {this.getItems()}
                        </Content>
                        <Button block onPress={this.addFields}>
                            <Text>ADD</Text>
                        </Button>
                        <Button block warning onPress={() => this.setState({ modalVisible: false })}>
                            <Text>Cancel</Text>
                        </Button>
                    </>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={false}
                    presentationStyle="formSheet"
                    visible={this.state.previewPopUp}>
                    <>
                        <Content>
                            {this.state.file && this.state.file.filePath && <TouchableHighlight>
                                <Icon name="file-pdf-o" size={150} color={'red'} onPress={this.openFile} />
                            </TouchableHighlight>}
                        </Content>
                        <Button block onPress={this.save}>
                            <Text>Save</Text>
                        </Button>
                        <Button block warning onPress={() => this.setState({ previewPopUp: false })}>
                            <Text>Cancel</Text>
                        </Button>
                    </>
                </Modal>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        list: state.List.itemList,
        count: state.Report.count,
        actionType: state.Report.actionType,
        selectedItem: state.Report.selectedItem
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createNewReport: (value) => dispatch(addNewReport(value)),
        updateReport: (value) => dispatch(updateReport(value))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewReportComponent);

