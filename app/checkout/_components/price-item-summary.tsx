import { cn } from "@/lib/utils";
import { View, Text } from "react-native";

interface PriceSummaryItemProps {
  label: string;
  amount: number;
  quantity?: number;
  className?: string;
}

const PriceSummaryItem = ({
  label,
  amount,
  quantity,
  className,
}: PriceSummaryItemProps) => (
  <View className={cn("flex flex-row items-center justify-between", className)}>
    <Text className="text-black text-sm">
      {quantity ? `${quantity} x ${label}` : label}
    </Text>
    <Text className="text-black text-sm">{amount.toFixed(2)}€</Text>
  </View>
);

export default PriceSummaryItem;
