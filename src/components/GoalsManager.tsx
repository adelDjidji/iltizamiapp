import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  TextInput,
  Dimensions,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useCallback, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Text from "./Text";
import Colors from "../constants/Colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../constants/Theme";

export type Goal = {
  id: string;
  title: string;
  done: boolean;
  date: Date;
};

// ── Goal card ────────────────────────────────────────────────────────
const GoalCard = memo(
  ({
    id,
    title,
    done,
    onToggleDone,
    onToggleDelete,
    onLongPress,
  }: {
    id: string;
    title: string;
    done: boolean;
    onToggleDone: (id: string) => void;
    onToggleDelete: (id: string) => void;
    onLongPress: (goal: { id: string; title: string; done: boolean }) => void;
  }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const handleDone = useCallback(() => onToggleDone(id), [id, onToggleDone]);
    const handleDelete = useCallback(() => onToggleDelete(id), [id, onToggleDelete]);
    const handleLongPress = useCallback(
      () => onLongPress({ id, title, done }),
      [id, title, done, onLongPress],
    );

    const cardBg = done
      ? theme.mode === "dark" ? "#1a3d1a" : "#e0f7e9"
      : theme.bgCard;

    const borderColor = done ? Colors.success : Colors.gold;

    return (
      <TouchableOpacity
        style={[styles.cardGoal, { backgroundColor: cardBg, borderColor }]}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        <Text
          style={{ lineHeight: 20, marginBottom: 4, fontSize: 13 }}
          color={theme.text}
          align="center"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title} {done ? "✅" : ""}
        </Text>
        {!done ? (
          <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
            <Text bold color={Colors.primary} size={11}>
              {t("goals.done")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleDelete} style={[styles.deleteButton, { backgroundColor: theme.mode === "dark" ? Colors.secondary : Colors.dark }]}>
            <Text bold color="white" size={11}>
              {t("goals.delete")}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  },
);

// ── Add / Edit modal ─────────────────────────────────────────────────
const GoalFormModal = memo(
  ({
    visible,
    onClose,
    onSubmit,
    initialValue = "",
    isEditing = false,
  }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
    initialValue?: string;
    isEditing?: boolean;
  }) => {
    const { t } = useTranslation();
    const { isRTL } = useRTL();
    const theme = useTheme();
    const [text, setText] = useState(initialValue);

    React.useEffect(() => {
      if (visible) setText(initialValue);
    }, [visible, initialValue]);

    const handleSubmit = useCallback(() => {
      if (text.trim()) {
        Keyboard.dismiss();
        onSubmit(text.trim());
        setText("");
      }
    }, [text, onSubmit]);

    const canSubmit = text.trim().length > 0;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.sheetWrapper}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.sheetBackdrop} onPress={onClose} />
          <View style={[styles.sheetContainer, { backgroundColor: theme.bgCard }]}>
            {/* Drag handle */}
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

            {/* Title */}
            <Text bold style={[styles.sheetTitle, { color: theme.text }]}>
              {isEditing ? t("goals.editGoal") : t("goals.newGoal")}
            </Text>

            {/* Input + char counter */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.inputText,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                onChangeText={setText}
                value={text}
                placeholder={t("goals.placeholder")}
                placeholderTextColor={theme.inputPlaceholder}
                multiline
                maxLength={50}
                returnKeyType="done"
                autoFocus
              />
              <Text style={[styles.charCount, { color: theme.textMuted }]}>
                {text.length}/50
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.sheetActions}>
              <Pressable style={styles.sheetBtnCancel} onPress={onClose}>
                <Text bold style={{ color: theme.textSub, fontSize: 15 }}>
                  {t("cancel")}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.sheetBtnConfirm, !canSubmit && styles.sheetBtnDisabled]}
                disabled={!canSubmit}
                onPress={handleSubmit}
              >
                <Text bold style={{ color: "white", fontSize: 15 }}>
                  {t("save")}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

// ── GoalsManager ─────────────────────────────────────────────────────
export default function GoalsManager() {
  const { t } = useTranslation();
  const { flexRow } = useRTL();
  const theme = useTheme();
  const { goals } = useSelector((state: any) => state.goals);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<{
    id: string;
    title: string;
    done: boolean;
  } | null>(null);
  const dispatch = useDispatch();

  const { filtredGoals, filtredGoalsDone } = useMemo(() => {
    const today = moment(new Date()).locale("en").format("YYYY-MM-DD");
    const filtered = (goals || []).filter(
      (i: Goal) => !!i && moment(i.date).locale("en").format("YYYY-MM-DD") === today,
    );
    return {
      filtredGoals: filtered,
      filtredGoalsDone: filtered.filter((i: Goal) => i.done),
    };
  }, [goals]);

  const sortedGoals = useMemo(
    () => [...filtredGoals].sort((a, b) => (b.done === a.done ? 0 : b.done ? 1 : -1)),
    [filtredGoals],
  );

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const openEditModal = useCallback(
    (goal: { id: string; title: string; done: boolean }) => {
      setCurrentGoal(goal);
      setEditModalVisible(true);
    },
    [],
  );
  const closeEditModal = useCallback(() => {
    setEditModalVisible(false);
    setCurrentGoal(null);
  }, []);

  const handleAdd = useCallback(
    (title: string) => {
      dispatch({
        type: "ADD_GOAL",
        payload: { id: Date.now().toString(), title, done: false, date: new Date() },
      });
      setModalVisible(false);
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (title: string) => {
      if (currentGoal) {
        dispatch({ type: "EDIT_GOAL", payload: { id: currentGoal.id, title } });
        setEditModalVisible(false);
        setCurrentGoal(null);
      }
    },
    [dispatch, currentGoal],
  );

  const handleToggleDone = useCallback(
    (id: string) => dispatch({ type: "CHECK_GOAL", payload: id }),
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t("goals.deleteTitle"), t("goals.deleteMsg"), [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("goals.delete"),
          onPress: () => {
            dispatch({ type: "DELETE_GOAL", payload: id });
            setEditModalVisible(false);
            setCurrentGoal(null);
          },
          style: "destructive",
        },
      ]);
    },
    [dispatch, t],
  );

  // Semi-transparent card background matching the Dashboard cards style
  const containerBg = theme.mode === "dark" ? "rgba(1,19,35,0.82)" : theme.bgCard;

  return (
    <View style={styles.container}>
      <GoalFormModal visible={modalVisible} onClose={closeModal} onSubmit={handleAdd} />
      {currentGoal && (
        <GoalFormModal
          visible={editModalVisible}
          onClose={closeEditModal}
          onSubmit={handleEdit}
          initialValue={currentGoal.title}
          isEditing
        />
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: containerBg,
            borderColor: Colors.gold + "30",
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { flexDirection: flexRow }]}>
          <Text bold style={[styles.headerText, { color: theme.text }]}>
            {t("goals.myGoals")}
          </Text>
          <View style={[styles.progressBadge, { backgroundColor: Colors.gold + "22", borderColor: Colors.gold + "55" }]}>
            <Text bold color={Colors.gold} size={12}>
              {filtredGoalsDone.length}/{filtredGoals.length}
            </Text>
          </View>
        </View>

        {/* Content */}
        {sortedGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.textSub, fontSize: 14, textAlign: "center" }}>
              {t("goals.noGoals")}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: "center", marginTop: 4 }}>
              {t("goals.addHint")}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {sortedGoals.map((goal: Goal) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                done={goal.done}
                onToggleDone={handleToggleDone}
                onLongPress={openEditModal}
                onToggleDelete={handleDelete}
              />
            ))}
          </ScrollView>
        )}

        {/* Add button */}
        <TouchableOpacity style={styles.addButton} onPress={openModal} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={40} color={Colors.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  card: {
    margin: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 13,
  },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingRight: 70,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 10,
    zIndex: 10,
  },
  // ── Goal card
  cardGoal: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 6,
    width: 150,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  doneButton: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 2,
  },
  // ── Bottom sheet modal
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: 8,
  },
  textInput: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 14,
    minHeight: 56,
    fontFamily: "Cairo_400Regular",
  },
  charCount: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
    marginRight: 2,
  },
  sheetActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  sheetBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.3)",
  },
  sheetBtnConfirm: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: Colors.gold,
  },
  sheetBtnDisabled: {
    opacity: 0.4,
  },
});
