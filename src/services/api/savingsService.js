const getMemberMonthlyBalances = async (memberId) => {
  try {
    const response = await api.get(
      `/savings/member/${memberId}/monthly-balances`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const savingsService = {
  getMemberMonthlyBalances,
};
