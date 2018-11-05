import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

class Timer extends Component {
  static propTypes = {
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    blink: PropTypes.bool
  };

  padZero = number => (number < 10 ? `0${number}` : number);

  render() {
    const { minutes, seconds, blink } = this.props;
    return (
      <View style={styles.container}>
        <Text style={[styles.display, blink ? styles.blinking : null]}>
          {this.padZero(minutes)}:{this.padZero(seconds)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },

  display: {
    fontFamily: "Digital-7 Mono",
    fontSize: 140,
    opacity: 1,
    color: "#f1c40f"
  },
  blinking: {
    opacity: 0.8
  }
});

export default Timer;
