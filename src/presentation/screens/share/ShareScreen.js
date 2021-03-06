import React, { Component } from 'react'
import ShareConnect from './ShareConnect';
import renderContent from './ShareRenderer';
import { ShareStatus } from '../../redux/Share';

import { confirm, alert } from '../../alerts/Alerts'

class ShareScreen extends Component {
    static KEY = 'ShareScreen'

    componentDidMount = () => {
        if (this.props.status == ShareStatus.NOT_READY) {
            this.props.fetch()
        } else if (this.props.status == ShareStatus.READY) {
            this.startSession()
        }
    }

    componentDidUpdate = () => {
        if (this.props.status == ShareStatus.READY) {
            this.startSession()
        }

        if (this.props.status == ShareStatus.PROGRESS_UPDATED) {
            this.props.updateContact(this.props.user.uid, {
                ...this.getContact(),
                currentStepIndex: this.props.progress.index,
                currentStepDesc: this.props.progress.step.desc
            })
        }
    }

    componentWillUnmount = () => {
        this.props.reset()
    }

    render = () => renderContent({
        shareStatus: this.props.status,
        progress: this.props.progress,
        onTipPressed: this.onTipPressed,
        onBackPressed: this.onBackPressed,
        onForwardPressed: this.onForwardPressed,
        onExitShare: this.onExitShare
    })

    startSession = () => {
        this.props.start(this.props.navigation.getParam('contact', null))
        const isFirstConvo = this.props.navigation.getParam('isFirstConvo', false)

        if(isFirstConvo) {
            this.props.incrementConvos(this.props.user.uid, this.props.account.data.ministryId)
        }
    }

    onTipPressed = (tipContent) => {
        alert('Tip', tipContent)
    }

    onBackPressed = () => {
        if (this.props.progress.canGoBack) {
            this.props.goBack()
        } else {
            this.props.navigation.goBack()
        }
    }

    onForwardPressed = () => {
        if (this.props.progress.canGoForward) {
            this.props.goForward()
        } else {
            this.endSession()
        }
    }

    endSession = () => {
        const contact = this.props.progress.contact
        const goHome = this.props.navigation.goBack

        confirm('Complete', `Did ${contact.name} accept Christ?`, () => {
            // Yes
            goHome()

            /**
             * YAY!!!!
             */
            this.props.incrementConversions(this.props.user.uid, this.props.account.data.ministryId)
        }, () => {
            // No
            goHome()
        }, () => {
            // Cancel
        })
    }

    onExitShare = () => {
        // TODO - report metrics, ask why? etc.
        this.props.navigation.goBack()
    }

    getContact = () => this.props.progress.contact
}

export default ShareConnect.connect(ShareScreen)