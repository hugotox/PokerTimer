import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Timer from "./src/Timer";
import Controls from "./src/Controls";
import Sound from "react-native-sound";
import { intComma } from "./src/utils";
import Icon from "react-native-vector-icons/FontAwesome";
import SettingsModal from "./src/SettingsModal";
import KeepAwake from "react-native-keep-awake";

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
    alert: false,
    modalVisible: false
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
    KeepAwake.activate();
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

  toggleMenu = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  reset = () => {
    this.setState({
      minutes: ROUND_DURATION,
      seconds: 0,
      alert: false
    });
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
        <View style={styles.round}>
          <Text style={styles.roundText}>Round {currentLevel + 1}</Text>
          <TouchableOpacity onPress={this.toggleMenu} style={styles.menu}>
            <Icon name="ellipsis-v" size={20} color={"#f1c40f"} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.blinds}>
            Blinds:
            {"\n"}
            {intComma(smallBlind)}/{intComma(bigBlind)}
          </Text>
          <Timer
            minutes={minutes}
            seconds={seconds}
            blink={blink}
            alert={alert}
            reset={this.reset}
          />
          <Text style={styles.nextBlinds}>
            {nextSmallBlind
              ? `Next Blinds: ${intComma(nextSmallBlind)}/${intComma(
                  nextBigBlind
                )}`
              : " "}
          </Text>
          <Controls
            onBackward={this.handleBackward}
            onForward={this.handleOnForward}
            pauseTimer={this.pauseTimer}
            startTimer={this.startTimer}
            running={running}
          />
        </View>
        <SettingsModal
          onRequestClose={this.toggleMenu}
          visible={this.state.modalVisible}
        />
      </SafeAreaView>
    );
  }
}

const green = "#175328";
const darkGreen = "#144623";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: darkGreen
  },
  content: {
    backgroundColor: green,
    width: Dimensions.get("window").width,
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between"
  },
  round: {
    textAlign: "center",
    backgroundColor: darkGreen,
    height: 50,
    width: Dimensions.get("window").width,
    paddingTop: 10,
    position: "relative"
  },
  blinds: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    marginTop: 20
  },
  nextBlinds: {
    marginTop: 20,
    color: "#bdc3c7",
    fontSize: 20,
    marginBottom: 4,
    textAlign: "center"
  },
  roundText: {
    color: "#f1c40f",
    fontSize: 22,
    textAlign: "center"
  },
  menu: {
    position: "absolute",
    top: 15,
    right: 10,
    width: 20,
    alignItems: "center"
  }
});
