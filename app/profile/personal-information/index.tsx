import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { User, Mail, Phone, Info } from "lucide-react-native";
import { useAuth } from "@/contexts/auth-provider";
import { openBrowserAsync } from "expo-web-browser";
import { SecondaryButton } from "@/components/secondary-button";
import { environment } from "@/environment";

const PersonalInformation = () => {
  const { user, loading, updateUserInfo } = useAuth();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const updateName = async (newName: string) => {
    try {
      const response = await fetch(
        `${environment.apiurl}/auth/name/edit/${user!._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ name: newName }),
        }
      );
      console.log({ response });

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      const data = await response.json();
      updateUserInfo({ name: newName });
      return data;
    } catch (error: any) {
      console.error("Error updating name:", error);
      throw new Error(error.message || "Failed to update name");
    }
  };

  const updatePhone = async (newPhone: string) => {
    try {
      const response = await fetch(
        `${environment.apiurl}/auth/phone/edit/${user!._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ phone: newPhone }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update phone number");
      }

      const data = await response.json();
      updateUserInfo({ phone: newPhone });
      return data;
    } catch (error: any) {
      console.error("Error updating phone:", error);
      throw new Error(error.message || "Failed to update phone number");
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (editingField === "Name") {
        await updateName(editedValue);
      } else if (editingField === "Phone Number") {
        await updatePhone(editedValue);
      }
      setModalVisible(false);
      setEditingField(null);
      setError(undefined);
      Alert.alert("Success", "Your changes have been saved.");
    } catch (error: any) {
      setError(
        error.message || "An error occurred while updating your information."
      );
    }
  };

  const showTooltip = (message: string) => {
    Alert.alert("", message);
  };

  const renderInfoItem = (
    label: string,
    value: string,
    editable: boolean,
    icon: React.ReactNode,
    tooltip?: string
  ) => (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
      <View className="flex-row items-center gap-3 flex-1">
        {icon}
        <View>
          <View className="flex-row items-center">
            <Text className="text-sm font-medium text-gray-500">{label}</Text>
            {tooltip && (
              <TouchableOpacity
                onPress={() => showTooltip(tooltip)}
                className="ml-2"
              >
                <Info size={16} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-base text-gray-900 mt-1">
            {loading ? (
              <ActivityIndicator size="small" color="#1a237e" />
            ) : (
              value
            )}
          </Text>
        </View>
      </View>
      {editable ? (
        <TouchableOpacity
          className="px-3 py-1.5 border border-gray-300 rounded"
          onPress={() => {
            setEditingField(label);
            setEditedValue(
              value === "Not provided" ||
                value === "Add a number so the operators can get in touch."
                ? ""
                : value
            );
            setModalVisible(true);
          }}
        >
          <Text className="text-indigo-900 font-medium">Edit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="px-3 py-1.5 border border-gray-300 rounded opacity-50"
          disabled={true}
        >
          <Text className="text-gray-500 font-medium">Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4">
        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-lg font-medium text-gray-900">
              Main Passenger
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Add your details as they appear on your ID.
            </Text>
          </View>

          <View className="bg-blue-50 border border-blue-800 rounded-lg p-3 flex-row items-center gap-2 my-3">
            <Info size={20} color="#1e40af" />
            <Text className="text-sm font-medium text-blue-800">
              Please ensure your name matches your ID.
            </Text>
          </View>

          <View className="space-y-4">
            {renderInfoItem(
              "Name",
              user?.name || "Not provided",
              true,
              <User size={24} color="#1a237e" strokeWidth={1.5} />
            )}
            {renderInfoItem(
              "Email Address",
              user?.email || "Not provided",
              false,
              <Mail size={24} color="#1a237e" strokeWidth={1.5} />,
              "Email cannot be changed. Please contact support if you need to update your email address."
            )}
            {renderInfoItem(
              "Phone Number",
              user?.phone || "Add a number so the operators can get in touch.",
              true,
              <Phone size={24} color="#1a237e" strokeWidth={1.5} />
            )}
          </View>
        </View>

        <View className="mt-6 space-y-2">
          <Text className="text-lg font-medium text-gray-900">
            Delete Account
          </Text>
          <Text className="text-sm text-gray-500">
            To delete your account, please contact our support team.
          </Text>
          <Text className="text-sm text-gray-900">
            Visit our contact page{" "}
            <Text
              className="text-indigo-900 underline"
              onPress={() => openBrowserAsync("https://gobusly.com/help")}
            >
              gobusly.com/help
            </Text>
          </Text>
        </View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          onRequestClose={() => {
            setModalVisible(false);
            setEditingField(null);
            setError(undefined);
          }}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-white rounded-lg p-5 w-full max-w-md">
              <Text className="text-lg font-semibold text-gray-900">
                Edit {editingField}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Make changes to your {editingField?.toLowerCase()}.
              </Text>

              <View className="my-4">
                <Text className="text-sm font-medium text-gray-700 mb-1.5">
                  {editingField}
                </Text>
                <TextInput
                  value={editedValue}
                  onChangeText={setEditedValue}
                  className="flex-row items-center h-14 bg-gray-100 rounded-xl px-4"
                  autoCapitalize="none"
                  autoComplete="off"
                />
              </View>

              {error && (
                <View className="bg-red-100 rounded p-2.5 mb-4">
                  <Text className="text-red-700 text-sm">{error}</Text>
                </View>
              )}

              <View className="flex-row justify-end gap-3">
                <SecondaryButton
                  onPress={() => {
                    setModalVisible(false);
                    setEditingField(null);
                    setError(undefined);
                  }}
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </SecondaryButton>

                <SecondaryButton
                  onPress={handleSaveChanges}
                  className="bg-primary"
                >
                  <Text className="text-white font-medium">Save Changes</Text>
                </SecondaryButton>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PersonalInformation;
