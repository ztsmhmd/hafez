
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  style?: any;
  color?: string;
}

export default function Icon({ name, size = 24, style, color }: IconProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons 
        name={name} 
        size={size} 
        color={color || style?.color || colors.text} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
