import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput
} from "react-native";
import PropTypes from "prop-types";

class SettingsModal extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    onChangeText: PropTypes.number
  };

  state = {
    roundDuration: this.props.roundDuration
  };

  updateRoundDuration = roundDuration => this.setState({ roundDuration });

  saveAndClose = () => {
    this.props.onSave({ roundDuration: this.state.roundDuration });
    this.props.onRequestClose();
  };

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
      >
        <SafeAreaView style={styles.container}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.label}>Round duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={String(this.state.roundDuration)}
              keyboardType="numeric"
              onChangeText={this.updateRoundDuration}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText} onPress={this.saveAndClose}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const yellow = "#f1c40f";
const darkGreen = "#144623";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#175328",
    justifyContent: "space-between"
  },
  title: {
    color: yellow,
    fontSize: 22,
    padding: 15
  },
  label: {
    color: yellow,
    padding: 15
  },
  input: {
    padding: 15,
    backgroundColor: darkGreen,
    color: "#bdc3c7"
  },
  saveButtonText: {
    fontSize: 20,
    color: yellow,
    textAlign: "center"
  },
  saveButton: {
    backgroundColor: darkGreen,
    padding: 15
  }
});

export default SettingsModal;
