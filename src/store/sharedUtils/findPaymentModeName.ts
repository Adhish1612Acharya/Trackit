import paymentTypes from "@/filterData/paymentFilters";

const findPaymentModeName = (id: string) => {
    return paymentTypes.filter((role) => {
      return String(role.id) === id;
    });
  };

  export default findPaymentModeName;