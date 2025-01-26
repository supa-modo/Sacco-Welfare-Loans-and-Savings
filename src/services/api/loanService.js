const getMemberMonthlyBalances = async (memberId) => {
  try {
    const response = await api.get(
      `/loans/member/${memberId}/monthly-balances`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loanService = {
  getMemberMonthlyBalances,
};
