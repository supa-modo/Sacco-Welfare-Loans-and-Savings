import api from "../utils/api";

export const memberService = {
  createMember: async (memberData) => {
    const response = await api.post("/members", memberData);
    return response.data;
  },
  getAllMembers: async () => {
    const response = await api.get("/members");
    return response.data;
  },
  getMember: async (memberId) => {
    const response = await api.get(`/members/${memberId}`);
    return response.data;
  },
};

export const savingsService = {
  getAllSavings: async () => {
    const response = await api.get("/savings");
    return response.data;
  },
  recordIndividualSavings: async (savingsData) => {
    const response = await api.post("/savings/deposit", savingsData);
    return response.data;
  },
  recordGroupSavings: async (groupSavingsData) => {
    const response = await api.post("/savings/group-deposit", {
      date: groupSavingsData.date,
      month: groupSavingsData.month,
      year: groupSavingsData.year,
      amount: groupSavingsData.amount,
      type: "Monthly Contribution",
      notes:
        groupSavingsData.notes ||
        `Monthly Contribution for ${groupSavingsData.month} ${groupSavingsData.year}`,
    });
    return response.data;
  },
  getMemberSavings: async (memberId) => {
    const response = await api.get(`/savings/member/${memberId}`);
    return response.data;
  },
  getSavingsStats: async () => {
    const response = await api.get("/savings/stats");
    return response.data;
  },
};

export const loanService = {
  createLoan: async (formData) => {
    const response = await api.post("/loans", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  uploadDocuments: async (files) => {
    const formData = new FormData();
    Object.keys(files).forEach((key) => {
      formData.append(key, files[key]);
    });
    const response = await api.post("/loans/upload-documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  recordRepayment: async (repaymentData) => {
    const response = await api.post("/loans/repayment", repaymentData);
    return response.data;
  },
  recordGroupRepayment: async (groupRepaymentData) => {
    const response = await api.post(
      "/loans/group-repayment",
      groupRepaymentData
    );
    return response.data;
  },
  getMemberLoans: async (memberId) => {
    const response = await api.get(`/loans/member/${memberId}`);
    return response.data;
  },
  getAllLoans: async () => {
    const response = await api.get("/loans");
    return response.data;
  },
  getLoan: async (loanId) => {
    const response = await api.get(`/loans/${loanId}`);
    return response.data;
  },
  approveLoan: async (loanId) => {
    const response = await api.put(`/loans/${loanId}/approve`);
    return response.data;
  },
};

export default api;
