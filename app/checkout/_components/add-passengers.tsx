import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { UserPlus, User } from "lucide-react-native";
import useSearchStore from "@/store";

const AddPassenger = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { passengers, setPassengers } = useSearchStore();

  const addPassenger = (type: "adults" | "children") => {
    setPassengers({
      ...passengers,
      [type]: passengers[type] + 1,
    });
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center bg-gray-100 p-2 rounded-lg"
        onPress={() => setModalVisible(true)}
      >
        <UserPlus color="#000" size={20} className="mr-2" />
        <Text className="text-base">Add Passenger</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-2xl p-6 w-4/5 items-center">
            <TouchableOpacity
              className="flex-row items-center w-full p-3 mb-2"
              onPress={() => addPassenger("adults")}
            >
              <User color="#000" size={20} className="mr-2" />
              <Text className="text-base">Adult</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center w-full p-3 mb-4"
              onPress={() => addPassenger("children")}
            >
              <User color="#000" size={20} className="mr-2" />
              <Text className="text-base">Child</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 rounded-full py-2 px-4"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddPassenger;
