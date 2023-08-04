import { StatusBar } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

function SafeScreen(props: SafeAreaViewProps) {
  return (
    <>
      <StatusBar /> 
      <SafeAreaView {...props} />
    </>
  );
}

export default SafeScreen;
