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
              padding: 10,
              minWidth: "70%",
            } }
            placeholder="Enter a youtube URL"
            autoFocus
            value={ url }
            onChangeText={ (text) => setUrl(text) }
          />
          <View
          style={ { 
            paddingTop: 8,
            borderRadius: 4,
            marginHorizontal: "1%",
            marginBottom: 6,
            marginTop: 10,
            textAlign: "center"}}>
          <Button
            title="Get download links"
            color="forestgreen"
            onPress={ () => fetchVideoInfo() }
          />
          </View>
          
          { isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={ { padding: 10 } }
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
  button: {
    paddingTop: 10,
  },

  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30%",
  },
});
