import React, { Component } from 'react';
import { Card, CardItem, Text, Body, Right, Button } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
export default class ListItemComponent extends Component {
    render() {
        return (
            <>
                <Card>
                    <CardItem header>
                        <Body>
                            <Text>Name : {this.props.itemName}</Text>
                        </Body>

                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                Default : {this.props.itemDefault}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Body>
                            <Text>Range : {this.props.itemRange}</Text>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.props.onEditPress}>
                                <Icon name="edit" size={30} color="#900" />
                            </Button>
                        </Right>
                    </CardItem>
                </Card>
            </>
        )
    }
}