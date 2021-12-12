import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TextInput,
  StatusBar,
  TouchableHighlight,
  Alert,
} from "react-native";
// import responseSample from "./responseSample.json"
// import { Linking } from "react-native"
import * as Linking from "expo-linking";

import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";

const ALLOWED_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.youtu.be",
  "m.youtube.com",
  "www.m.youtube.com",
];

function isValidUrl(string) {
  const url = Linking.parse(string);

  if (!ALLOWED_HOSTS.includes(url.hostname)) return false;

  return url.scheme === "http" || url.scheme === "https";
}

const DowloadList = ({ audio, video, data }) => {
  const getSizeInMegaBytes = (format) => {
    console.log(format);
    if (!format) return "";
    return (format.filesize / 1024 / 1024).toFixed(2).toString() + " MB";
  };
  const audioSize = getSizeInMegaBytes(audio);
  const videoSize = getSizeInMegaBytes(video);
  return (
    <View style={styles.downloadListContainer}>
      <View style={{ marginBottom: 20 }}>
        <Button
          title={`Download Audio 4.03 MB${audioSize}`}
          type="outline"
          onPress={() => Linking.openURL(audio.url)}
        />
      </View>
      <View>
        <Button
          title={`Download Video 16.89 MB${videoSize}`}
          type="outline"
          onPress={() => Linking.openURL(video.url)}
        />
      </View>
    </View>
  );
};

export default function App() {
  const [url, setUrl] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [data, setData] = useState();
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState();
  const [isError, setIsError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const apiServer = "https://youtube-235.herokuapp.com/download?url=";
  const setAudioVideoDownloads = (formats) => {
    if (formats.length >= 4) {
      setAudio(formats[3]);
    }
    if (formats.length >= 17) {
      setVideo(formats[16]);
    }
    setLoading(false);
  };

  const alertUser = (title, message) =>
    Alert.alert(title, message, [{ text: "OK" }]);

  const fetchVideoInfo = () => {
    if (!isValidUrl(url))
      return alertUser("Invalid URL", "Please enter a valid URL");
    setLoading(true);
    if (url.length > 0) {
      return fetch(apiServer + url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setData(json.formats);
          setAudioVideoDownloads(json.formats);
          setIsComplete(true);
        })
        .catch(() => {
          setLoading(false);
          setIsComplete(true);
          setIsError(true);
        });
    }
  };

  const clearEverything = () => {
    setUrl("");
    setData(null);
    setAudio(null);
    setVideo(null);
    setLoading(false);
    setIsComplete(false);
  };

  return (
    <View style={styles.container}>
      <>
        <StatusBar animated={true} hidden={false} />
        <Icon name="cloud-download" size={100} color="#4671e0" />
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 4 }}>
            <TextInput
              style={styles.textInput}
              placeholder="Paste a Youtube link here"
              placeholderTextColor="#b5bcc9"
              color="#b5bcc9"
              padding={10}
              selectTextOnFocus
              autoFocus
              value={url}
              onChangeText={(text) => setUrl(text)}
            />
          </View>
          <View style={{ position: "absolute", right: 5 }}>
            <TouchableHighlight
              style={{ marginTop: 51 }}
              onPress={() => {
                isComplete ? clearEverything() : fetchVideoInfo();
              }}
              underlayColor="transparent"
            >
              <View>
                <Icon
                  name={isComplete ? "undo" : "search"}
                  size={35}
                  color="#4285F4"
                />
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View
          style={{
            paddingTop: 8,
            borderRadius: 4,
            marginHorizontal: "1%",
            marginBottom: 6,
            marginTop: 10,
            textAlign: "center",
          }}
        ></View>
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <>
              {data && isComplete && !isError && (
                <DowloadList audio={audio} video={video} data={data} />
              )}
              {isError &&
                alertUser(
                  "Error",
                  "Something went wrong. Try after sometime"
                ) &&
                clearEverything()}
            </>
          )}
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingTop: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#141212",
    padding: 25,
    alignItems: "center",
    // justifyContent: "center",
  },

  textInput: {
    height: 40,
    minWidth: 300,
    borderWidth: 1,
    marginTop: 50,
    borderColor: "#4285F4",
  },
  downloadListContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "column",
    // justifyContent: "center",
    padding: 30,
    // marginRight:30,
  },
});
