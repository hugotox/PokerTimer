import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar
} from "react-native";
import Timer from "./src/Timer";
import Controls from "./src/Controls";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const SMALL_BLINDS = [
  25,
  50,
  75,
  100,
  125,
  150,
  175,
  200,
  300,
  400,
  500,
  600,
  1000,
  1500,
  2000,
  2500,
  3000,
  3500,
  4000,
  5000
];

export default class App extends Component {
  state = {
    currentLevel: 0,
    minutes: 10,
    seconds: 0,
    running: false,
    paused: false,
    blink: false
  };

  startTimer = () => {
    this.setState({ running: true, paused: false, blink: false });
    clearInterval(this.pauseInterval);
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        let { minutes, seconds, paused } = this.state;
        if (!paused) {
          if (seconds === 0) {
            seconds = 59;
            minutes -= 1;
          } else {
            seconds -= 1;
          }
          this.setState({ minutes, seconds });
          if (seconds === 0 && minutes === 0) {
            clearInterval(this.timerInterval);
            this.setState({ running: false });
            console.log("done");
          }
        }
      }, 1000);
    }
  };

  pauseTimer = () => {
    this.setState({ running: false, paused: true });
    this.pauseInterval = setInterval(() => {
      this.setState({ blink: !this.state.blink });
    }, 250);
  };

  handleOnForward = () => {
    if (this.state.currentLevel + 1 < SMALL_BLINDS.length) {
      this.setState({ currentLevel: this.state.currentLevel + 1 });
    }
  };

  handleBackward = () => {
    if (this.state.currentLevel > 0) {
      this.setState({ currentLevel: this.state.currentLevel - 1 });
    }
  };

  render() {
    const { currentLevel, minutes, seconds, blink, running } = this.state;
    const smallBlind = SMALL_BLINDS[currentLevel];
    const bigBlind = smallBlind * 2;
    const nextSmallBlind =
      currentLevel + 1 < SMALL_BLINDS.length
        ? SMALL_BLINDS[currentLevel + 1]
        : null;
    const nextBigBlind = nextSmallBlind !== null ? nextSmallBlind * 2 : null;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.round}>
          Round {currentLevel + 1}
          {"\n"}
          {nextSmallBlind
            ? `Next Blinds: ${nextSmallBlind}/${nextBigBlind}`
            : " "}
        </Text>
        <Text style={styles.blinds}>
          Blinds:
          {"\n"}
          {smallBlind}/{bigBlind}
        </Text>
        <Timer minutes={minutes} seconds={seconds} blink={blink} />
        <Controls
          onBackward={this.handleBackward}
          onForward={this.handleOnForward}
          pauseTimer={this.pauseTimer}
          startTimer={this.startTimer}
          running={running}
        />
        <View />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#144623"
  },
  round: {
    color: "#bdc3c7",
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center"
    // height: 50
  },
  blinds: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: 40,
    textAlign: "center"
  },
  nextBlinds: {
    color: "#bdc3c7",
    fontSize: 25,
    marginBottom: 4
  }
});
