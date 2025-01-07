import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Edit2, User, Mail, Phone } from "lucide-react-native";

// Mock account API (replace with your actual API)
const account = {
  get: async () => ({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
  }),
  updateName: async (name: string) => {},
  updateEmail: async (email: string, password: string) => {},
  updatePhone: async (phone: string, password: string) => {},
  getPrefs: async () => ({ useAsPassengerInfo: false }),
  updatePrefs: async (prefs: any) => {},
};

const PersonalInformation = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingInfo, setEditingInfo] = useState<any>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [useAsPassengerInfo, setUseAsPassengerInfo] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const PERSONAL_INFO = [
    {
      label: "Name",
      value: user?.name || "Not provided",
      action: user?.name ? "Edit" : "Add",
      update: async (newValue: string) => {
        await account.updateName(newValue);
      },
      icon: <User size={24} color="#1a237e" strokeWidth={1.5} />,
    },
    {
      label: "Email Address",
      value: user?.email || "Not provided",
      action: user?.email ? "Edit" : "Add",
      update: async (newValue: string, password: string) => {
        await account.updateEmail(newValue, password);
      },
      icon: <Mail size={24} color="#1a237e" strokeWidth={1.5} />,
    },
    {
      label: "Phone Number",
      value: user?.phone || "Add a number so the operators can get in touch.",
      action: user?.phone ? "Edit" : "Add",
      update: async (newValue: string, password: string) => {
        await account.updatePhone(newValue, password);
      },
      icon: <Phone size={24} color="#1a237e" strokeWidth={1.5} />,
    },
  ];

  const fetchUser = async () => {
    try {
      const user = await account.get();
      setUser(user);
      const prefs = await account.getPrefs();
      setUseAsPassengerInfo(prefs.useAsPassengerInfo);
      setIsLoading(false);
    } catch (error) {
      setUser(null);
      setIsLoading(false);
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSaveChanges = async () => {
    if (editingInfo) {
      try {
        await editingInfo.update(editedValue, password);
        fetchUser();
        setPassword("");
        setEditingInfo(null);
        setModalVisible(false);
        // You can add a toast message here
      } catch (error: any) {
        console.log({ error });
        setError(error?.message || "An error occurred");
      }
    }
  };

  const handleUseAsPassengerInfoChange = async (value: boolean) => {
    try {
      const prevPrefs = await account.getPrefs();
      await account.updatePrefs({ ...prevPrefs, useAsPassengerInfo: value });
      setUseAsPassengerInfo(value);
      // You can add a toast message here
    } catch (error) {
      console.log({ error });
      // You can add an error toast message here
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#f9fafb" }}
        contentContainerStyle={{ padding: 16 }}
      >
        <View style={{ gap: 16 }}>
          <Text className="text-gray-600 mb-6">
            Please provide personal details as they appear on your passport.
            This ensures accuracy for official bookings.
          </Text>
          {PERSONAL_INFO.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e7eb",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                {item.icon}
                <View>
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                  <Text style={{ color: "#6b7280", fontSize: 14 }}>
                    {isLoading ? "Loading..." : item.value}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                }}
                onPress={() => {
                  setEditingInfo(item);
                  setEditedValue(item.value);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: "#1a237e" }}>{item.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
        >
          <Switch
            value={useAsPassengerInfo}
            onValueChange={handleUseAsPassengerInfoChange}
            trackColor={{ false: "#767577", true: "#1a237e" }}
            thumbColor={useAsPassengerInfo ? "#ffffff" : "#f4f3f4"}
          />
          <Text style={{ marginLeft: 8 }}>
            Use these details as primary passenger
          </Text>
        </View>

        {/* <Modal>
          <View
            style={{
              backgroundColor: "white",
              padding: 22,
              borderRadius: 4,
              gap: 16,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Edit {editingInfo?.label}
            </Text>
            <TextInput
              value={editedValue}
              onChangeText={setEditedValue}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 4,
                padding: 8,
              }}
            />
            {editingInfo?.label !== "Name" && (
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 4,
                  padding: 8,
                }}
              />
            )}
            {error && <Text style={{ color: "red" }}>{error}</Text>}
            <TouchableOpacity
              style={{
                backgroundColor: "#1a237e",
                padding: 12,
                borderRadius: 4,
                alignItems: "center",
              }}
              onPress={handleSaveChanges}
            >
              <Text style={{ color: "white" }}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </Modal> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PersonalInformation;
