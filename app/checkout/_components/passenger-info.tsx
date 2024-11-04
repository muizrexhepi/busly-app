import React, { useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { X } from "lucide-react-native";
import useSearchStore, { PassengerData, useCheckoutStore } from "@/store";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "numeric"
    | "number-pad"
    | "decimal-pad";
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
}) => (
  <View className="space-y-1 mb-2">
    <Text className="font-normal text-base text-black/70">{label}</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      className="font-normal rounded-lg border-gray-300 border px-4 h-16 bg-white placeholder:text-gray-600"
    />
  </View>
);

const PassengerInfo: React.FC = () => {
  const { passengers, setPassengers } = useCheckoutStore();

  const { passengers: passengersAmount, setPassengers: setPassengersAmount } =
    useSearchStore();

  const { adults, children } = {
    adults: passengersAmount.adults || 1,
    children: passengersAmount.children || 0,
  };

  useEffect(() => {
    if (passengers.length === adults + children) {
      return;
    }

    const initialPassengers: PassengerData[] = [
      ...Array(adults).fill({
        full_name: "",
        email: "",
        phone: "",
        birthdate: "",
        age: 33,
        price: 0,
      }),
      ...Array(children).fill({
        full_name: "",
        email: "",
        phone: "",
        birthdate: "",
        age: 0,
        price: 0,
      }),
    ];

    setPassengers(initialPassengers);
  }, [adults, children, setPassengers]);

  const updatePassenger = (
    index: number,
    field: keyof PassengerData,
    value: string
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };

    if (field === "birthdate") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      updatedPassengers[index].age = age;
    }

    setPassengers(updatedPassengers);
  };

  const renderPassengerInputs = (passengerIndex: number, isChild: boolean) => {
    const passenger = passengers[passengerIndex];

    const removePassenger = () => {
      if (isChild) {
        setPassengersAmount({ adults, children: children - 1 });
      } else {
        setPassengersAmount({ children, adults: adults - 1 });
      }
    };

    return (
      <View key={passengerIndex} className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-medium text-lg text-black">
            {isChild
              ? `Child ${passengerIndex - adults + 1}`
              : `Adult ${passengerIndex + 1}`}
          </Text>
          {passengerIndex !== 0 && (
            <TouchableOpacity
              onPress={removePassenger}
              className="bg-gray-100 p-1.5 rounded-full"
            >
              <X size={16} color="#525252" />
            </TouchableOpacity>
          )}
        </View>

        <View className="space-y-2">
          <InputField
            label={"First name"}
            placeholder={"John Doe"}
            value={passenger.full_name.split(" ")[0] || ""}
            onChangeText={(value) => {
              const lastName = passenger.full_name
                .split(" ")
                .slice(1)
                .join(" ");
              updatePassenger(
                passengerIndex,
                "full_name",
                `${value} ${lastName}`.trim()
              );
            }}
          />

          <InputField
            label="Last Name"
            placeholder="Doe"
            value={passenger.full_name.split(" ").slice(1).join(" ") || ""}
            onChangeText={(value) => {
              const firstName = passenger.full_name.split(" ")[0];
              updatePassenger(
                passengerIndex,
                "full_name",
                `${firstName} ${value}`.trim()
              );
            }}
          />

          {passengerIndex === 0 && (
            <>
              <InputField
                label="Email"
                placeholder="example@example.com"
                value={passenger.email}
                onChangeText={(value) =>
                  updatePassenger(passengerIndex, "email", value.toLowerCase())
                }
                keyboardType="email-address"
              />

              <View>
                <Text className="font-normal text-sm text-black/70">
                  Phone Number
                </Text>
                <PhoneInput
                  defaultValue={passenger.phone}
                  defaultCode="MK"
                  onChangeFormattedText={(text) =>
                    updatePassenger(passengerIndex, "phone", text)
                  }
                  containerStyle={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                  }}
                  textContainerStyle={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    paddingLeft: 0,
                  }}
                />
              </View>
            </>
          )}

          {isChild && (
            <InputField
              label="Birthdate"
              placeholder="YYYY-MM-DD"
              value={passenger.birthdate}
              onChangeText={(value) =>
                updatePassenger(passengerIndex, "birthdate", value)
              }
              keyboardType="numeric"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View className=" bg-white rounded-xl pt-4 px-4 mb-4">
      <View className="flex-row items-center gap-4 mb-2">
        {/* <View className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary rounded-xl">
          <Text className="text-primary font-semibold">1</Text>
        </View> */}
        <Text className="text-[#353535] font-medium text-2xl">
          Passenger Information
        </Text>
      </View>

      <Text className="text-base text-gray-600 mb-3">
        Please fill in the details for each passenger.
      </Text>

      <View className="space-y-3">
        {passengers.map((_, index) =>
          renderPassengerInputs(index, index >= adults)
        )}
      </View>
    </View>
  );
};

export default PassengerInfo;
