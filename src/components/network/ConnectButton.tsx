import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type State = 'Connect' | 'Requested' | 'Connected' | 'Follow';

interface Props { initial?: State }

const ConnectButton: React.FC<Props> = ({ initial = 'Connect' }) => {
  const { colors } = useTheme();
  const [state, setState] = useState<State>(initial);
  const disabled = state === 'Requested' || state === 'Connected';

  const onPress = () => {
    if (state === 'Connect') setState('Requested');
    else if (state === 'Follow') setState('Connected');
  };

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.btn, { backgroundColor: disabled ? colors.card : colors.primary, borderColor: colors.border }]}> 
      <Text style={{ color: disabled ? colors.text : '#fff', fontWeight: '600' }}>{state}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({ btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 } });

export default ConnectButton;
