import { memo } from 'react';
import { GestureResponderEvent, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Button } from './Button';
import { Card } from './Card';

type ConfirmDeleteModalProps = {
  visible: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const trashIcon = '\u{1F5D1}';

const ConfirmDeleteModalComponent = ({
  visible,
  title = 'Delete task?',
  description = 'This will remove the task from your list and local storage.',
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  const stopPropagation = (event: GestureResponderEvent) => {
    event.stopPropagation();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Card onPress={stopPropagation} radius="lg" padding="lg" style={styles.card}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>!</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.actions}>
            <Button
              title="Cancel"
              icon="x"
              variant="secondary"
              onPress={onCancel}
              style={styles.modalButton}
            />
            <Button
              title={confirmLabel}
              icon={trashIcon}
              variant="danger"
              onPress={onConfirm}
              style={styles.modalButton}
            />
          </View>
        </Card>
      </Pressable>
    </Modal>
  );
};

export const ConfirmDeleteModal = memo(ConfirmDeleteModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
  },
  icon: {
    color: colors.danger,
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
});
