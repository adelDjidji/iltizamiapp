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
} from "react-native";
import React, { useState, useCallback, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../constants/Classes";
import Text from "./Text";
import Colors from "../constants/Colors";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";

export type Goal = {
  id: string;
  title: string;
  done: boolean;
  date: Date;
};

// Memoized Goal Card component to prevent unnecessary re-renders
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

    const handleDone = useCallback(() => {
      onToggleDone(id);
    }, [id, onToggleDone]);

    const handleDelete = useCallback(() => {
      onToggleDelete(id);
    }, [id, onToggleDelete]);

    const handleLongPress = useCallback(() => {
      onLongPress({ id, title, done });
    }, [id, title, done, onLongPress]);

    return (
      <TouchableOpacity
        style={[
          styles.cardGoal,
          {
            borderColor: done ? Colors.success : Colors.gold,
            backgroundColor: done ? "#f0f8f0" : "#f6f6f6",
          },
        ]}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        <Text
          style={{ lineHeight: 20, marginBottom: 4 }}
          align="center"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title} {done ? "✅" : ""}
        </Text>
        {!done ? (
          <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
            <Text bold color="black" size={12}>
              {t("goals.done")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text bold color="white" size={12}>
              {t("goals.delete")}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  },
);

// Shared Modal component for both Add and Edit operations
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
    const { flexRow } = useRTL();
    const [text, setText] = useState(initialValue);

    // Reset the text input when the modal opens
    React.useEffect(() => {
      if (visible) {
        setText(initialValue);
      }
    }, [visible, initialValue]);

    const handleSubmit = useCallback(() => {
      if (text.trim()) {
        Keyboard.dismiss();
        onSubmit(text);
        setText("");
      }
    }, [text, onSubmit]);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View
            style={styles.centeredView}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
                {isEditing ? t("goals.editGoal") : t("goals.newGoal")}
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={setText}
                value={text}
                placeholder={t("goals.placeholder")}
                multiline={true}
                maxLength={50}
                returnKeyType="done"
                autoFocus={true}
              />
              <View
                style={[styles.buttonContainer, { flexDirection: flexRow }]}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonOpen,
                    !text.trim() && styles.buttonDisabled,
                  ]}
                  disabled={!text.trim()}
                  onPress={handleSubmit}
                >
                  <AntDesign name="check" size={20} color="white" />
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={onClose}
                >
                  <AntDesign name="close" size={20} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    );
  },
);

export default function GoalsManager() {
  const { t } = useTranslation();
  const { flexRow } = useRTL();
  const { goals } = useSelector((state: any) => state.goals);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<{
    id: string;
    title: string;
    done: boolean;
  } | null>(null);
  const dispatch = useDispatch();

  // Memoize filtered goals to prevent recalculation on every render
  const { filtredGoals, filtredGoalsDone } = useMemo(() => {
    const today = moment(new Date()).format("YYYY-MM-DD");
    const filtered = (goals || []).filter(
      (i: Goal) => !!i && moment(i.date).format("YYYY-MM-DD") === today,
    );
    return {
      filtredGoals: filtered,
      filtredGoalsDone: filtered.filter((i: Goal) => i.done),
    };
  }, [goals]);

  // Sort goals only once using useMemo
  const sortedGoals = useMemo(() => {
    return [...filtredGoals].sort((a, b) =>
      b.done === a.done ? 0 : b.done ? 1 : -1,
    );
  }, [filtredGoals]);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

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
        payload: {
          id: Date.now().toString(),
          title,
          done: false,
          date: new Date(),
        },
      });
      setModalVisible(false);
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (title: string) => {
      if (currentGoal) {
        dispatch({
          type: "EDIT_GOAL",
          payload: {
            id: currentGoal.id,
            title,
          },
        });
        setEditModalVisible(false);
        setCurrentGoal(null);
      }
    },
    [dispatch, currentGoal],
  );

  const handleToggleDone = useCallback(
    (id: string) => {
      dispatch({
        type: "CHECK_GOAL",
        payload: id,
      });
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t("goals.deleteTitle"), t("goals.deleteMsg"), [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("goals.delete"),
          onPress: () => {
            dispatch({
              type: "DELETE_GOAL",
              payload: id,
            });
            setEditModalVisible(false);
            setCurrentGoal(null);
          },
          style: "destructive",
        },
      ]);
    },
    [dispatch],
  );

  return (
    <View style={styles.container}>
      {/* Add Goal Modal */}
      <GoalFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={handleAdd}
        isEditing={false}
      />

      {/* Edit Goal Modal */}
      {currentGoal && (
        <GoalFormModal
          visible={editModalVisible}
          onClose={closeEditModal}
          onSubmit={handleEdit}
          initialValue={currentGoal.title}
          isEditing={true}
        />
      )}

      <View style={Classes.containerCard}>
        <View style={[styles.headerContainer, { flexDirection: flexRow }]}>
          <Text bold style={styles.headerText}>
            {t("goals.myGoals")}
          </Text>
          <View style={styles.progressContainer}>
            <Text bold color={Colors.goldDark}>
              {`${filtredGoalsDone?.length}/${filtredGoals?.length}`}
            </Text>
          </View>
        </View>

        {sortedGoals.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>{t("goals.noGoals")}</Text>
            <Text style={styles.emptyStateSubtext}>{t("goals.addHint")}</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
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

        <TouchableOpacity
          style={styles.addButton}
          onPress={openModal}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={52} color={Colors.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  cardGoal: {
    padding: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    marginHorizontal: 6,
    borderColor: Colors.gold,
    width: 150,
    height: 90,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    maxWidth: 340,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    padding: 16,
    marginVertical: 16,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    justifyContent: "space-around",
    width: "70%",
    marginTop: 16,
  },
  button: {
    borderRadius: 25,
    padding: 12,
    elevation: 2,
    minWidth: 60,
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: Colors.gold,
  },
  buttonClose: {
    backgroundColor: "grey",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerContainer: {
    marginBottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
  },
  progressContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollViewContent: {
    paddingVertical: 8,
    paddingRight: 70, // Space for the add button
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 10,
    zIndex: 10,
  },
  doneButton: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: Colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 2,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#aaa",
  },
  deleteButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
