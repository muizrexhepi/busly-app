import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";
import useSearchStore, { PassengerData, useCheckoutStore } from "@/store";
import { passengerSchema } from "@/schemas";
import { z } from "zod";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "numeric"
    | "number-pad"
    | "decimal-pad";
  secureTextEntry?: boolean;
  error?: string;
}

type ValidationErrors = {
  [key in keyof PassengerData]?: string;
};

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = "default",
  secureTextEntry = false,
  error,
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-2">
      <Text className="text-base text-gray-500 mb-1">{label} *</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        onFocus={() => setIsFocused(true)}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        className={`flex-row items-center h-14 bg-secondary/10 border rounded-xl px-4 text-black text-base
                    ${
                      isFocused
                        ? "border-[#55aac4]"
                        : error
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
        placeholderTextColor="#6B7280"
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}

const PassengerInfo: React.FC = () => {
  const { passengers, setPassengers } = useCheckoutStore();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors[]>(
    []
  );
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
    setValidationErrors(Array(adults + children).fill({}));
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

  const validatePassenger = (index: number, field: keyof PassengerData) => {
    const passengerData = passengers[index];
    const fieldSchema = passengerSchema.shape[field];

    try {
      fieldSchema.parse(passengerData[field]);
      setValidationErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = { ...newErrors[index], [field]: undefined };
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => {
          const newErrors = [...prev];
          newErrors[index] = {
            ...newErrors[index],
            [field]: error.errors[0]?.message || `Invalid ${field}`,
          };
          return newErrors;
        });
      }
    }
  };

  const renderPassengerInputs = (passengerIndex: number, isChild: boolean) => {
    const passenger = passengers[passengerIndex];
    const errors = validationErrors[passengerIndex] || {};

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
            label="Full Name"
            placeholder="John Doe"
            value={passenger.full_name}
            onChangeText={(value) =>
              updatePassenger(passengerIndex, "full_name", value)
            }
            onBlur={() => validatePassenger(passengerIndex, "full_name")}
            error={errors.full_name}
          />

          {passengerIndex === 0 && (
            <>
              <InputField
                label="Email"
                placeholder="example@example.com"
                value={passenger.email || ""}
                onChangeText={(value) =>
                  updatePassenger(passengerIndex, "email", value.toLowerCase())
                }
                onBlur={() => validatePassenger(passengerIndex, "email")}
                keyboardType="email-address"
                error={errors.email}
              />
              <InputField
                label="Phone Number"
                placeholder="+1 234 5678"
                value={passenger.phone || ""}
                onChangeText={(value) =>
                  updatePassenger(passengerIndex, "phone", value)
                }
                onBlur={() => validatePassenger(passengerIndex, "phone")}
                keyboardType="phone-pad"
                error={errors.phone}
              />
            </>
          )}

          {isChild && (
            <InputField
              label="Birthdate"
              placeholder="YYYY-MM-DD"
              value={passenger.birthdate || ""}
              onChangeText={(value) =>
                updatePassenger(passengerIndex, "birthdate", value)
              }
              onBlur={() => validatePassenger(passengerIndex, "birthdate")}
              keyboardType="numeric"
              error={errors.birthdate}
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
