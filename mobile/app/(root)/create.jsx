import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { API_URL } from "../../constants/api";
import { styles } from "@/assets/styles/create.style.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const CATEGORIES = [
  {
    id: "food",
    name: "Food & Drinks",
    icon: "fast-food",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "cart",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "car",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "film",
  },
  {
    id: "bills",
    name: "Bills",
    icon: "receipt",
  },
  {
    id: "income",
    name: "Income",
    icon: "cash",
  },
  {
    id: "other",
    name: "Other",
    icon: "ellipsis-horizontal",
  },
];

export default function CreateScreen() {
  const { user } = useUser();

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateTransaction() {
    if (!title.trim())
      return Alert.alert("Error", "please enter a transaction title");

    if (!amount.trim() || +amount <= 0)
      return Alert.alert("Error", "Please enter a valid transaction amount");

    if (!selectedCategory)
      return Alert.alert("Error", "Please select a category");

    setIsLoading(true);

    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to create transaction");
      }

      Alert.alert("success", "Transaction created successfully.");

      router.back();
    } catch (error) {
      console.error(error);

      Alert.alert("Error", error.message || "Failed to create transaction.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Start of the header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              pointerEvents: isLoading ? "none" : "auto",
            },
          ]}
          disabled={isLoading}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Transaction</Text>

        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreateTransaction}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>

          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
      {/* End of the header */}

      <View style={styles.card}>
        <View style={styles.typeSelector}>
          {/* Start of the expense selector */}
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              stye={styles.typeIcon}
            />

            <Text
              style={[
                styles.typeButtonText,
                isExpense && styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          {/* End of the expense selector */}

          {/* Start of the income selector */}
          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              stye={styles.typeIcon}
            />

            <Text
              style={[
                styles.typeButtonText,
                !isExpense && styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
          {/* End of the income selector */}
        </View>

        {/* Start of the amount container */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>

          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            disabled={isLoading}
          />
        </View>
        {/* End of the amount container */}

        {/* Start of the title input */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
            disabled={isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Transaction title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
            disabled={isLoading}
          />
        </View>
        {/* End of the title input */}

        {/* Start of the categories */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            marginBottom: 15,
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />

          <Text style={styles.sectionTitle}>Category</Text>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                category.name === selectedCategory &&
                  styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={
                  selectedCategory === category.name
                    ? COLORS.white
                    : COLORS.text
                }
              />

              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* End of the categories */}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}
