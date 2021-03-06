import React, { Component } from 'react'

import { Header as NBHeader, Left, Body, Right, Title, Button } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'

import { PlatformIcons } from '../style/Icons'

import OptionsMenu from "react-native-options-menu";

export default class Header extends Component {
    static defaultProps = {
        title: '',

        // Whether to show up/back button
        // If non-null, the "caret" will appear in upper left
        goBackFunction: null,

        // Whether to show an X instead of a back arrow
        exitInsteadOfBack: false,

        // Should be an array of objects
        // Each object should have "name" property, and "action" property
        options: null,

        // Will override options if used
        // I.e. if you want a tip button in upper right
        customRightContent: null
    }

    render = () => {
        const { title, goBackFunction, exitInsteadOfBack, options, customRightContent } = this.props

        return (
            <NBHeader>
                <Left>
                    {this.renderLeftContent(goBackFunction, exitInsteadOfBack)}
                </Left>
                <Body style={{ flex: 5 }}>
                    <Title>{title}</Title>
                </Body>
                <Right>
                    {this.renderRightContent(options, customRightContent)}
                </Right>
            </NBHeader>
        )
    }

    renderLeftContent = (goBackFunction, exitInsteadOfBack) => {
        if (goBackFunction) {
            return this.renderUpButton(goBackFunction, exitInsteadOfBack)
        }

        return null
    }

    renderRightContent = (options, customRightContent) => {
        if (customRightContent) {
            return customRightContent
        }

        if (!options || !options.length || options.length < 1) {
            return null
        }

        const optionsLabels = options.map(option => option.name)
        const optionsActions = options.map(option => option.action)

        return (
            <OptionsMenu
                customButton={<Icon name={PlatformIcons.name('more')} size={25} color='white' style={{ marginRight: 20 }} />}
                options={optionsLabels}
                actions={optionsActions} />
        )
    }

    renderUpButton = (onPress, exitInsteadOfBack) => {
        let iconName
        if (exitInsteadOfBack) {
            iconName = PlatformIcons.name('close')
        } else {
            iconName = PlatformIcons.name('arrow-back')
        }

        return (
            <Button
                iconLeft
                light
                transparent
                onPress={onPress}>
                <Icon
                    name={iconName}
                    color='white'
                    size={35}
                    style={{ marginLeft: 10, paddingRight: 10 }}
                />
            </Button>
        )
    }
}