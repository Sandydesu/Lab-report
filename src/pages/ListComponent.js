import React, { Component } from 'react';
import { Modal, StyleSheet, ToastAndroid } from 'react-native';
import { Content, Header, Title, Left, Body, Right, Form, Item, Label, Input, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import ListItemComponent from '../utils/ListItem';
import { updateItem } from '../store/actions/list';
class ListComponent extends Component {
    static navigationOptions = {
        title: 'LIST',
    };

    constructor() {
        super();
        this.state = {
            modalVisible: false,
            selectedItem: {
                itemId: '',
                itemName: '',
                itemDefault: '',
                itemRange: ''
            }
        }
    }

    edit = (value) => {
        this.setState({ modalVisible: true, selectedItem: value })
    }

    update = (value, name) => {
        this.setState({
            selectedItem: { ...this.state.selectedItem, [name]: value }
        });
    }

    submit = () => {
        this.props.updateItem(this.state.selectedItem);
        this.setState({
            modalVisible: false, selectedItem: {
                itemId: '',
                itemName: '',
                itemDefault: '',
                itemRange: ''
            }
        });
        ToastAndroid.showWithGravity(
            'Success fully updated',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
        );
        this.props.navigation.navigate('LandingPage');
    }


    render() {
        const items = this.props.list.map((value, index) => {
            return (
                <ListItemComponent key={index} {...value} onEditPress={() => this.edit(value)} />
            )
        });
        return (
            <>
                <Content>
                    {items}
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
                                    <Input value={this.state.selectedItem.itemName} onChangeText={(text) => this.update(text, 'itemName')} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Default Value</Label>
                                    <Input value={this.state.selectedItem.itemDefault} onChangeText={(text) => this.update(text, 'itemDefault')} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Range(ex: 0 - 2 ml)</Label>
                                    <Input value={this.state.selectedItem.itemRange} onChangeText={(text) => this.update(text, 'itemRange')} />
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
    return { list: state.List.itemList }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateItem: (value) => dispatch(updateItem(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent)