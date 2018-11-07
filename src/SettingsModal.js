import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";

class SettingsModal extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    visible: PropTypes.bool
  };

  render() {
    return (
      <Modal animationType="slide" visible={this.props.visible}>
        <SafeAreaView style={styles.container}>
          <Text>Hola</Text>
          <TouchableOpacity onPress={this.props.onRequestClose}>
            <Text>Cerrar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#175328"
  }
});

export default SettingsModal;
