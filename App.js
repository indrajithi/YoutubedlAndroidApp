import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import { Linking } from "react-native";
// import responseSample from "./responseSample.json";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState('');
  const [isLoading, setLoading] = useState(false);
  const apiServer = "https://youtube-235.herokuapp.com/download?url="
  const fetchVideoInfo = () => {
    if (url.length > 0) {
      return fetch(apiServer + url)
        .then((response) => response.json())
        .then((json) => {
          setData(json.formats);
          setLoading(false);
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <NavigationContainer theme={ DarkTheme }>
      <View style={ styles.container }>
        <>
          <TextInput
            style={ {
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
            } }
            onChangeText={ (text) => setUrl(text) }
          />
          <Button
            title="Get download links"
            onPress={ () => fetchVideoInfo() }
          />
          { isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={ data }
              keyExtractor={ ({ format_id }) => format_id }
              renderItem={ ({ item }) => (
                <Text
                  style={ { color: "blue" } }
                  onPress={ () => Linking.openURL(item.url) }
                >
                  { item.format }
                </Text>
              ) }
            />
          ) }
        </>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
