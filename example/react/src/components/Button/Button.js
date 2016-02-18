import React, { Component, PropTypes } from 'react'
import styles from './Button.css'

/**
 * Button
 *
 * This is a Button component
 *
 * Styleguide: components.button
 */
export default class Button extends Component {
    static propTypes = {
        /**
         * Button text
         */
        text : PropTypes.string,

        /**
         * Set the color of the button
         */
        color : PropTypes.oneOf(['red', 'blue']),

        /**
         * Set the size of the button
         */
        size : PropTypes.oneOf(['small', 'large'])
    };

    render() {
        const {
            size,
            color,
            text
        } = this.props

        const className = [
            styles.root,
            styles[size] || '',
            styles[color] || ''
        ].join(' ')

        return (
            <button className={className}>{text}</button>
        )
    }
}
