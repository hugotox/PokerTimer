import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

const buttonColor = "#bdc3c7";

class Controls extends Component {
  static propTypes = {
    running: PropTypes.bool,
    onBackward: PropTypes.func,
    pauseTimer: PropTypes.func,
    startTimer: PropTypes.func,
    onForward: PropTypes.func
  };

  render() {
    const {
      running,
      onBackward,
      pauseTimer,
      startTimer,
      onForward
    } = this.props;
    return (
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onBackward} style={styles.button}>
          <Icon name="step-backward" size={20} color={buttonColor} />
        </TouchableOpacity>
        {running ? (
          <TouchableOpacity onPress={pauseTimer} style={styles.button}>
            <Icon name="pause" size={25} color={buttonColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startTimer} style={styles.button}>
            <Icon name="play" size={25} color={buttonColor} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onForward} style={styles.button}>
          <Icon name="step-forward" size={20} color={buttonColor} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    marginBottom: 20
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  }
});

export default Controls;
