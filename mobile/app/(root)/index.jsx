import { useUser } from "@clerk/clerk-expo";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useTransactions from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.style";
import HeaderImage from "@/assets/images/logo.png";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LogoutButton from "../../components/LogoutButton";
import BalanceCard from "../../components/BalanceCard";
import TransactionItem from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { user } = useUser();

  const { isLoading, loadData, summary, transactions, deleteTransaction } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const router = useRouter();

  function handleDelete(id) {
    Alert.alert(
      "Delete Transaction",
      "Are you sure, you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  }

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);

    await loadData();

    setRefreshing(false);
  }

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Start of the header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={HeaderImage}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>

              <Text style={styles.usernameText}>
                {user?.emailAddresses?.[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />

              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>

            <LogoutButton />
          </View>
        </View>
        {/* End of the header */}

        <BalanceCard summary={summary} />
      </View>

      {/* Start of all of the transactions */}
      <FlatList
        data={transactions.data}
        style={styles.transactionsList}
        contentContainerStyle={[
          styles.transactionsListContent,
          {
            flexGrow: 1,
          },
        ]}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            title="Pull to refresh"
            titleColor={COLORS.primary}
          />
        }
      />
      {/* End of all of the transactions */}
    </View>
  );
}
