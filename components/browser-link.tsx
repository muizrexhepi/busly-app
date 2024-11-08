import { openBrowserAsync } from "expo-web-browser";
import { TouchableOpacity } from "react-native";

type BrowserLinkProps = {
  url: string;
  children: React.ReactNode;
};

const BrowserLink = ({ url, children }: BrowserLinkProps) => {
  return (
    <TouchableOpacity
      className="bg-primary rounded-lg p-3 items-center mt-4 flex-1"
      onPress={() => {
        openBrowserAsync(url);
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default BrowserLink;
