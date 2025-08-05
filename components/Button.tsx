
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({ text, onPress, style, textStyle, disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, style, disabled && styles.buttonDisabled]} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle, disabled && styles.buttonTextDisabled]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    backgroundColor: colors.grey,
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Cairo_700Bold',
  },
  buttonTextDisabled: {
    color: colors.text,
  },
});
