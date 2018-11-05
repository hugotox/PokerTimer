import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";
import Timer from "./src/Timer";
import Controls from "./src/Controls";
import Sound from "react-native-sound";

const ROUND_DURATION = 10;

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
    minutes: ROUND_DURATION,
    seconds: 0,
    running: false,
    paused: false,
    blink: false,
    alert: false
  };

  constructor() {
    super();
    Sound.setCategory("Playback");
    this.bell = new Sound("bell.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      // loaded successfully
      console.log(
        "duration in seconds: " +
          this.bell.getDuration() +
          "number of channels: " +
          this.bell.getNumberOfChannels()
      );
    });
  }

  showAlert = () => {
    Alert.alert(
      `Round #${this.state.currentLevel + 1} finished`,
      "",
      [
        {
          text: "Next round",
          onPress: this.handleOnForward
        },
        {
          text: `Repeat round #${this.state.currentLevel + 1}`,
          onPress: this.startTimer
        }
      ],
      { cancelable: false }
    );
    this.bell.play(success => {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
        // reset the player to its uninitialized state (android only)
        // this is the only option to recover after an error occured and use the player again
        this.bell.reset();
      }
    });
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
          if (minutes === 0 && seconds === 10) {
            this.setState({ alert: true });
          }
          if (seconds === 0 && minutes === 0) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.setState({
              running: false,
              minutes: ROUND_DURATION,
              seconds: 0,
              alert: false
            });
            this.showAlert();
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
      this.setState({
        currentLevel: this.state.currentLevel + 1,
        minutes: ROUND_DURATION,
        seconds: 0,
        alert: false
      });
    }
  };

  handleBackward = () => {
    if (this.state.currentLevel > 0) {
      this.setState({
        currentLevel: this.state.currentLevel - 1,
        minutes: ROUND_DURATION,
        seconds: 0,
        alert: false
      });
    }
  };

  render() {
    const {
      currentLevel,
      minutes,
      seconds,
      blink,
      running,
      alert
    } = this.state;
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
        <Timer
          minutes={minutes}
          seconds={seconds}
          blink={blink}
          alert={alert}
        />
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
