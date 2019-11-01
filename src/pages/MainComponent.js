import React, { Component } from 'react';
import { StyleSheet, Modal, Keyboard, ToastAndroid } from 'react-native';
import { Content, Header, Left, Body, Right, Card, CardItem, Text, Title, Form, Item, Label, Input, Button } from 'native-base';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getList, addNewItem } from '../store/actions/list';
import { getReports } from '../store/actions/report';
import { ADDING_NEW_ITEM } from '../store/constants';

class MainComponent extends Component {
    static navigationOptions = {
        title: 'WELCOME',
    };

    constructor() {
        super();
        this.state = {
            modalVisible: false,
            item: {
                itemName: '',
                itemDefault: null,
                itemRange: null
            }
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.getList();
        }, 3000);
        setTimeout(() => {
            this.props.getReports();
        }, 5000);
    }

    update = (text, field) => {
        this.setState({ item: { ...this.state.item, [field]: text } });
    }

    submit = () => {
        Keyboard.dismiss();
        const { count } = this.props;
        if (this.state.item.itemName) {
            this.props.addNewItem({ ...this.state.item, itemId: count });
        } else {
            ToastAndroid.showWithGravity(
                'Please fill fields',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    }

    render() {
        const { isNewRecord } = this.props;
        if (isNewRecord) {
            this.props.sucessMessage();
            this.setState({
                item: {
                    itemName: '',
                    itemDefault: '',
                    itemRange: ''
                },
                modalVisible: false
            });
        }
        return (
            <>
                <Content padder>
                    <Card>
                        <CardItem button onPress={() => this.props.navigation.navigate('Report')} style={styles.displayItems}>
                            <Text>Reports</Text>
                            <Icon name="file-o" size={30} />
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem button onPress={() => this.setState({ modalVisible: true })} style={styles.displayItems}>
                            <Text>New Item</Text>
                            <Icon name="pencil" size={30} />
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem button onPress={() => this.props.navigation.navigate('List')} style={styles.displayItems}>
                            <Text>List</Text>
                            <Icon name="list" size={30} />
                        </CardItem>
                    </Card>
                </Content>
                <Modal
                    animationType="fade"
                    transparent={false}
                    presentationStyle="formSheet"
                    visible={this.state.modalVisible}>
                    <>
                        <Content>
                            <Header>
                                <Left />
                                <Body>
                                    <Title>New Item</Title>
                                </Body>
                                <Right />
                            </Header>
                            <Form style={styles.formView}>
                                <Item floatingLabel>
                                    <Label>Field name</Label>
                                    <Input onChangeText={(text) => this.update(text, 'itemName')} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Default Value</Label>
                                    <Input onChangeText={(text) => this.update(text, 'itemDefault')} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Range(ex: 0 - 2 ml)</Label>
                                    <Input onChangeText={(text) => this.update(text, 'itemRange')} />
                                </Item>
                            </Form>
                        </Content>
                        <Button block onPress={this.submit}>
                            <Text>ADD</Text>
                        </Button>
                        <Button block warning onPress={() => this.setState({ modalVisible: false })}>
                            <Text>Cancel</Text>
                        </Button>
                    </>
                </Modal>
            </>
        )
    }
}

const styles = StyleSheet.create({
    displayItems: {
        justifyContent: "space-between"
    }
});

const mapStateToProps = (state) => {
    return {
        list: state.List.itemList,
        count: state.List.count,
        isNewRecord: state.List.isNewRecord
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getList: () => dispatch(getList()),
        getReports: () => dispatch(getReports()),
        addNewItem: (item) => dispatch(addNewItem(item)),
        sucessMessage: () => dispatch({ type: ADDING_NEW_ITEM })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)

