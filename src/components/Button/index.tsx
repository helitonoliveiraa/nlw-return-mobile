import { 
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator 
} from "react-native";
import { theme } from "../../theme";

import { styles } from './styles';

type ButtonProps = TouchableOpacityProps & {
  isLoading: boolean;
}

export function Button({ isLoading, ...props }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.container} {...props}>
      {isLoading ? (
        <ActivityIndicator 
          color={theme.colors.text_on_brand_color}
        />
      ) : (
        <Text style={styles.title}>Enviar feedback</Text>
      )}
    </TouchableOpacity>
  )
}