import { Keyboard, TouchableWithoutFeedback } from "react-native";

const DismissKeyboard = ({ children }: any) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
